const pg = require('pg');
const fs = require('fs');

const params = {
  host: 'sauna-matchmaking-db.cltaj2ngk5e5.eu-central-1.rds.amazonaws.com',
  port: 5432,
  user: 'master',
  database: 'sauna_production',
};

function loadPassword() {
  fs.readFile('./db_password.txt', 'utf8', (err, data) => {
    if (err) console.error(err);
    const pwdString = data.split('\n')[0];
    params.password = pwdString;
  });
}

loadPassword();

function getClient() {
  return new pg.Client(params);
}

// Returns JSON containing {name: {description: '', img_url: '', id: int}}
function getUsers(type, includeId, callback) {
  const client = getClient();
  const users = {};
  const query = {
    name: 'get-users',
    text: `
    SELECT id, name, description, img_url
    FROM Users
    LEFT OUTER JOIN Profiles ON Profiles.user_id = Users.id
    WHERE type = $1 AND active = TRUE;`,
    values: [type],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          res.rows.forEach((row) => {
            users[row.name] = {
              description: row.description,
              img_url: row.img_url,
            };
            if (includeId) users[row.name].id = row.user_id;
          });
          callback(err2, users);
        }
        client.end();
      });
    }
  });
}

// Returns id, name and active status for all coaches and startups in form
// {
// coaches: [{name: '', id: int, active: true/false}]
// startups: [{name: '', id: int, active: true/false}]
// }
function getActiveStatuses(callback) {
  const client = getClient();
  const data = { coaches: [], startups: [] };
  const query = {
    name: 'get-activeStatuses',
    text: `
    SELECT user_id, name, type, active
    FROM Users
    LEFT OUTER JOIN Profiles ON Users.id = Profiles.user_id;`,
    values: [],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          res.rows.forEach((row) => {
            if (row.type === 1) {
              data.coaches.push({
                id: row.user_id,
                name: row.name,
                active: row.active,
              });
            } else if (row.type === 2) {
              data.startups.push({
                id: row.user_id,
                name: row.name,
                active: row.active,
              });
            }
          });
          callback(err2, data);
        }
        client.end();
      });
    }
  });
}

// Changes active of user
function setActiveStatus(id, active, callback) {
  const client = getClient();
  const query = {
    name: 'set-activeStatus',
    text: `
    UPDATE Users
    SET active = $1
    WHERE id = $2;`,
    values: [active, id],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2) => {
        if (err2) callback(err2);
        else {
          callback(err2, { status: 'success' });
        }
        client.end();
      });
    }
  });
}

// Returns JSON containing profile information based on id:
// {
// type: 'startup'/'coach',
// name: '',
// img_url: '',
// description: '',
// email: '',
// linkedin: '',
// credentials: [{company: '', position: ''}],
// }
function getProfile(id, callback) {
  const client = getClient();
  const info = {};
  const query = {
    name: 'get-profile',
    text: `
    SELECT name, img_url, description, email, website, CredentialsListEntries.title, CredentialsListEntries.content
    FROM Users
    LEFT OUTER JOIN Profiles ON Users.id = Profiles.user_id
    LEFT OUTER JOIN CredentialsListEntries ON Users.id = CredentialsListEntries.user_id
    WHERE Users.id = $1;`,
    values: [id],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          res.rows.forEach((row) => {
            if (info.name === undefined) {
              info.type = row.type === 1 ? 'coach' : 'startup';
              info.name = row.name;
              info.img_url = row.img_url;
              info.description = row.description;
              info.email = row.email;
              info.linkedIn = row.website;
              info.credentials = [{ company: row.title, position: row.content }];
            } else {
              info.credentials.push({ company: row.title, position: row.content });
            }
          });
          callback(err2, info);
        }
        client.end();
      });
    }
  });
}

// Returns an array of feedbacks:
// [{
// date: DATE,
// time: '',
// meetingid: int,
// user_id: int,
// name: '',
// description: '',
// rating: int,
// image_src: ''
// }]
function getFeedback(id, callback) {
  const client = getClient();
  const query = {
    name: 'get-feedback',
    text: `
      SELECT date, time, id AS meetingId, user_id, name, description, rating, img_url AS image_src
      FROM
        (SELECT date, time, id,
            CASE
              WHEN coach_id = $1 THEN startup_id
              WHEN startup_id = $1 THEN coach_id
            END user_id,
            CASE
              WHEN coach_id = $1 THEN coach_rating
              WHEN startup_id = $1 THEN startup_rating
            END rating
          FROM Meetings
          WHERE (coach_id = $1 OR startup_id = $1) AND date =
            (SELECT MAX(date) FROM Meetings WHERE (coach_id = $1 OR startup_id = $1) AND date <= current_date))
          AS Subquery
        NATURAL JOIN Profiles;`,
    values: [id],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          callback(err2, res.rows);
        }
        client.end();
      });
    }
  });
}

// Sets feedback for a meeting and between a coach and a startup
function giveFeedback(meetingId, rating, field, callback) {
  // Sets the given rating into the meetings table
  function setMeetingRating(callback2) {
    const client = getClient();
    const query = {
      name: 'set-meetingRating',
      text: `
      UPDATE Meetings
      SET ${field} = $1
      WHERE id = $2;`,
      values: [rating, meetingId],
    };
    client.connect((err) => {
      if (err) callback(err);
      else {
        client.query(query, (err2) => {
          if (err2) callback(err2);
          else {
            callback2();
          }
          client.end();
        });
      }
    });
  }

  // Gets the IDs of the coach and startup
  function getIDs(callback2) {
    const client = getClient();
    const query = {
      name: 'get-IDs',
      text: `
      SELECT startup_id, coach_id
      FROM Meetings
      WHERE id = $1;`,
      values: [meetingId],
    };
    client.connect((err) => {
      if (err) callback(err);
      else {
        client.query(query, (err2, res) => {
          if (err2) callback(err2);
          else {
            callback2([res.rows[0].startup_id, res.rows[0].coach_id]);
          }
          client.end();
        });
      }
    });
  }

  // Creates a row into the ratings table if it doesn't exist
  function insertRating(startupID, coachID, callback2) {
    const client = getClient();
    const query = {
      name: 'insert-rating',
      text: `
      INSERT INTO Ratings (coach_id, startup_id, coach_rating, startup_rating)
      SELECT $1, $2, -1, -1
      WHERE NOT EXISTS (SELECT * FROM Ratings WHERE coach_id = $1 AND startup_id = $2);`,
      values: [coachID, startupID],
    };
    client.connect((err) => {
      if (err) callback(err);
      else {
        client.query(query, (err2) => {
          if (err2) callback(err2);
          else {
            callback2();
          }
          client.end();
        });
      }
    });
  }

  // Sets the given value into ratings table
  function updateRating(startupID, coachID, callback2) {
    const client = getClient();
    const query = {
      name: 'update-rating',
      text: `
      UPDATE Ratings
      SET ${field} = $1
      WHERE coach_id = $2 AND startup_id = $3;`,
      values: [rating, coachID, startupID],
    };
    client.connect((err) => {
      if (err) callback(err);
      else {
        client.query(query, (err2) => {
          if (err2) callback(err2);
          else {
            callback2();
          }
          client.end();
        });
      }
    });
  }

  // Calls the functions in the right order
  setMeetingRating(() => {
    getIDs(([startupID, coachID]) => {
      insertRating(startupID, coachID, () => {
        updateRating(startupID, coachID, () => {
          callback(null, { status: 'success' });
        });
      });
    });
  });
}

// Creates a row into the MeetingDays table
function createMeetingDay(date, start, end, split, callback) {
  const client = getClient();
  const query = {
    name: 'insert-MeetingDay',
    text: `
    INSERT INTO MeetingDays(date, startTime, endTime, split, matchmakingDone)
    VALUES ($1, $2, $3, $4, 0);`,
    values: [date, start, end, split],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2) => {
        if (err2) callback(err2);
        else {
          callback(err2, { status: 'success' });
        }
        client.end();
      });
    }
  });
}

// Removes the date from tables: Meetings, Timeslots, MeetingDays
// Uses a single transaction
function removeMeetingDay(date, callback) {
  const client = getClient();
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query('BEGIN', (err1) => {
        if (err1) callback(err1);
        else {
          client.query('DELETE FROM Meetings WHERE date = $1;', [date], (err2) => {
            if (err2) callback(err2);
            else {
              client.query('DELETE FROM Timeslots WHERE date = $1;', [date], (err3) => {
                if (err3) callback(err3);
                else {
                  client.query('DELETE FROM MeetingDays WHERE date = $1;', [date], (err4) => {
                    if (err4) callback(err4);
                    else {
                      client.query('COMMIT;', [], (err5) => {
                        if (err5) callback(err5);
                        else {
                          callback(err5, { status: 'success' });
                        }
                        client.end();
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}

// Gets all MeetingDays in the future together with a flag indicating if matchmaking was run
// Returns: [{
//  date: '',
//  starttime: '',
//  endtime: '',
//  split: int,
//  time: '',
//  duration: int,
//  matchmakingdone: int,
// }]
function getComingMeetingDays(userId, callback) {
  const client = getClient();
  const query = {
    name: 'get-MeetingDays',
    text: `
    SELECT MeetingDays.date, startTime, endTime, split, time, duration, matchmakingDone
    FROM Users
    NATURAL JOIN MeetingDays
    LEFT OUTER JOIN Timeslots ON Timeslots.date = MeetingDays.date AND Timeslots.user_id = Users.id
    WHERE Users.id = $1 AND MeetingDays.date >= current_date;`,
    values: [userId],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          callback(err2, res.rows);
        }
        client.end();
      });
    }
  });
}

// Returns an array of coming dates
function getComingDates(callback) {
  const dates = [];
  const client = getClient();
  const query = {
    name: 'get-comingMeetingDays',
    text: `
    SELECT date
    FROM MeetingDays
    WHERE MeetingDays.date >= current_date;`,
    values: [],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          res.rows.forEach((row) => {
            dates.push(row.date);
          });
          callback(err2, dates);
        }
        client.end();
      });
    }
  });
}

// Returns coming timeslot-data as array: [{
// name: '',
// email: '',
// date: '',
// time: '',
// duration: int,
// }]
function getComingTimeSlots(callback) {
  const client = getClient();
  const query = {
    name: 'get-comingTimeSlots',
    text: `
    SELECT name, email, MeetingDays.date, Timeslots.time, Timeslots.duration
    FROM Users
    LEFT OUTER JOIN Profiles ON Users.id = Profiles.user_id
    NATURAL JOIN MeetingDays
    LEFT OUTER JOIN Timeslots ON MeetingDays.date = Timeslots.date AND Timeslots.user_id = Users.id
    WHERE MeetingDays.date >= current_date AND Users.active = TRUE AND Users.type = 1;`,
    values: [],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          callback(err2, res.rows);
        }
        client.end();
      });
    }
  });
}

// Returns latest MeetingDay from the past
function getLastMeetingday(callback) {
  const client = getClient();
  const query = {
    name: 'get-lastMeetingDay',
    text: 'SELECT MAX(Date) AS date FROM MeetingDays WHERE Date < current_date;',
    values: [],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          callback(err2, res.rows[0].date);
        }
        client.end();
      });
    }
  });
}

// Gets given feedbacks for latest MeetingDay from the past
// Also returns the date:
// {
// date: '',
// rows: [{
// type: int,
// name: '',
// email: '',
// startup_rating: int,
// coach_rating: int,
// date: '',
// }],
// }
function getGivenFeedbacks(callback) {
  getLastMeetingday((err, date) => {
    if (err) callback(err);
    else {
      const client = getClient();
      const query = {
        name: 'get-givenFeedbacks',
        text: `
        SELECT type, name, email, startup_rating, coach_rating, date
        FROM Users
        LEFT OUTER JOIN Profiles ON Users.id = Profiles.user_id
        LEFT OUTER JOIN Meetings ON Users.id = Meetings.coach_id OR Users.id = Meetings.startup_id
        WHERE Meetings.date = $1 AND active = TRUE;`,
        values: [date],
      };
      client.connect((err2) => {
        if (err2) callback(err2);
        else {
          client.query(query, (err3, res) => {
            if (err3) callback(err3);
            else {
              callback(err3, { date, rows: res.rows });
            }
            client.end();
          });
        }
      });
    }
  });
}

// Adds availability for a user to Timeslots table
function insertAvailability(userId, date, startTime, duration, callback) {
  const client = getClient();
  const query = {
    name: 'insert-availability',
    text: `
    INSERT INTO Timeslots(user_id, date, time, duration)
    VALUES ($1, $2, $3, $4);`,
    values: [userId, date, startTime, duration],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2) => {
        if (err2) callback(err2);
        else {
          callback(err2, { status: 'success' });
        }
        client.end();
      });
    }
  });
}

/** Updates the credentials or team members for given user (based on UID)
 *  Parameters:
 *  uid - the id of the user (in DB)
 *  list - an array containing either the credentials or team members of given user
 *  userType - either Coach or Startup (does not throw error if something else if provided)
 *  callback - a function to call with the status message object as parameter.
 */
function updateCredentialsListEntries(uid, list, userType, callback) {
  const client = getClient();
  const table = userType === 'Coach' ? 'Credentials' : 'TeamMembers';
  const columns = userType === 'Coach' ? ['user_id', 'company', 'title'] : ['startup_id', 'name', 'title'];
  const deleteSQL = `DELETE FROM ${table} WHERE ${columns[0]} = $1 AND ${columns[1]} = $2 AND ${columns[2]} = $3;`;
  const insertSQL = `INSERT INTO ${table}(${columns[0]}, ${columns[1]}, ${columns[2]}) VALUES($1,$2,$3);`;

  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query('SELECT title, content FROM CredentialsListEntries WHERE user_id = $1;', [uid], (err2, res) => {
        if (err2) callback(err2);
        else {
          // We are converting the objects into JSON format for easy comparison.
          const { rows } = res;
          const rowsAsJSON = rows.map(x => JSON.stringify(x));
          const listAsJSON = list.map(x => JSON.stringify(x));
          const toBeInserted = []; // holds the credentials to be inserted into the db.
          const toBeRemoved = []; // holds the credentials that should be deleted.
          const response = {}; // object to be sent in the response.
          let thrownError;
          // If new credentials do not contain a row, add it to deleted creds.
          rowsAsJSON.forEach((row) => {
            if (!listAsJSON.includes(row)) {
              toBeRemoved.push(JSON.parse(row));
            }
          });

          // If new credentials contain an entry that is not yet present, add it.
          listAsJSON.forEach((item) => {
            if (!rowsAsJSON.includes(item)) {
              toBeInserted.push(JSON.parse(item));
            }
          });

          // Deletes the obsolete credentials.
          toBeRemoved.forEach((item) => {
            const subClient = getClient();
            subClient.connect((err3) => {
              if (err3) callback(err3);
              else {
                subClient.query(deleteSQL, [uid, item.title, item.content], (error) => {
                  if (error) {
                    thrownError = error;
                  }
                  subClient.end();
                });
              }
            });
          });

          if (!thrownError) {
            // Inserts the new credentials.
            toBeInserted.forEach((item) => {
              const subClient = getClient();
              subClient.connect((err3) => {
                if (err3) callback(err3);
                else {
                  subClient.query(insertSQL, [uid, item.title, item.content], (error) => {
                    if (error) {
                      thrownError = error;
                    }
                    subClient.end();
                  });
                }
              });
            });
          }

          if (response.status === undefined) {
            response.status = 'SUCCESS';
            response.message = 'Profile was updated successfully!';
          }
          callback(thrownError, response);
        }
        client.end();
      });
    }
  });
}

module.exports = {
  getUsers,
  getActiveStatuses,
  setActiveStatus,
  getProfile,
  getFeedback,
  giveFeedback,
  createMeetingDay,
  removeMeetingDay,
  getComingMeetingDays,
  getComingDates,
  getComingTimeSlots,
  getLastMeetingday,
  getGivenFeedbacks,
  insertAvailability,
  updateCredentialsListEntries,
};
