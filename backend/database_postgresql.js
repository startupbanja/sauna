const pg = require('pg');
// const fs = require('fs');
const bcrypt = require('bcrypt');
const params = require('./database_params.json');

function getClient() {
  return new pg.Client(params);
}

const UserTypes = {
  admin: 0,
  coach: 1,
  startup: 2,
};

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
function getComingTimeslots(callback) {
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

// Updates the profile of a given user
// Also calls updateCredentialsListEntries
function updateProfile(uid, userType, site, imgUrl, description, title, credentials, callback) {
  const client = getClient();
  const titleField = userType === 'Coach' ? ', title = $5' : '';
  const imgURL = imgUrl === '' ? null : imgUrl;
  const queryParams = userType === 'Coach' ? [site, imgURL, description, uid, title] : [site, imgUrl, description, uid];
  const query = {
    name: 'update-profile',
    text: `
    UPDATE Profiles SET website = $1, img_url = $2, description = $3${titleField} WHERE user_id = $4;`,
    values: queryParams,
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2) => {
        if (err2) callback(err2);
        else {
          updateCredentialsListEntries(uid, credentials, userType, callback);
        }
        client.end();
      });
    }
  });
}

// Verifies user's password using bcrypt
// Returns user's type and id
function verifyIdentity(email, password, callback) {
  const client = getClient();
  const query = {
    name: 'select-userData',
    text: 'SELECT id, type, password FROM Users WHERE email = $1;',
    values: [email],
  };
  client.connect((err) => {
    if (err) callback('error');
    else {
      client.query(query, (err2, res) => {
        if (err2) callback('error');
        else {
          const row = res.rows[0];
          if (!row) {
            callback('error');
            return;
          }
          bcrypt.compare(password, row.password, (error, same) => {
            if (error) callback('error');
            if (!same) callback('error');
            else {
              let type;
              let userId = false;
              switch (row.type) {
                case 0:
                  type = 'admin';
                  userId = row.id;
                  break;
                case 1:
                  type = 'coach';
                  userId = row.id;
                  break;
                case 2:
                  type = 'startup';
                  userId = row.id;
                  break;
                default:
                  type = 'error';
              }
              callback(type, userId);
            }
          });
        }
        client.end();
      });
    }
  });
}

// Sets email of a user
function changeEmail(uid, email, callback) {
  const client = getClient();
  const query = {
    name: 'set-email',
    text: 'UPDATE Users SET email = $1 WHERE id = $2;',
    values: [email, uid],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2) => {
        if (err2) callback(err2);
        else {
          callback(err2, { status: 'SUCCESS', message: 'Email changed successfully.' });
        }
        client.end();
      });
    }
  });
}

/**
 * Changes the given user's (UID) password if the request initiator is an admin.
 */
function changePasswordAdmin(uid, password, callback) {
  bcrypt.hash(password, 10, (err, hash) => {
    const client = getClient();
    const query = {
      name: 'set-email',
      text: 'UPDATE Users SET password = $1 WHERE id = $2;',
      values: [hash, uid],
    };
    client.connect((err1) => {
      if (err) callback(err1);
      else {
        client.query(query, (err2) => {
          if (err2) callback(err2);
          else {
            callback(err2, { status: 'SUCCESS', message: 'Password was successfully reset!' });
          }
          client.end();
        });
      }
    });
  });
}

/**
 * Changes the given user's (UID) password if possible
 * and calls callback with response message object.
 */
function changePassword(uid, oldPassword, newPassword, callback) {
  const client = getClient();
  const query = {
    name: 'get-password',
    text: 'SELECT password FROM Users WHERE id = $1;',
    values: [uid],
  };

  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          const oldPass = res.rows[0].password;
          bcrypt.compare(oldPassword, oldPass, (err3, same) => {
            if (err3) callback(err3);
            else if (!same) callback(err3, { status: 'ERROR', message: 'The current password was incorrect!' });
            else {
              changePasswordAdmin(uid, newPassword, (err4) => {
                if (err4) callback(err4);
                else {
                  callback(err4, { status: 'SUCCESS', message: 'Password was successfully changed!' });
                }
              });
            }
          });
        }
        client.end();
      });
    }
  });
}

// Returns split length on a MeetingDay
function getMeetingDuration(date, callback) {
  const client = getClient();
  const query = {
    name: 'get-meetingDuration',
    text: 'SELECT split FROM MeetingDays WHERE date = $1;',
    values: [date],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else if (!res.rows[0]) callback({ error: `Date ${date} not found in table MeetingDays in getMeetingDuration` });
        else {
          callback(err2, res.rows[0].split);
        }
        client.end();
      });
    }
  });
}

// Returns all active startup IDs in an array
function getStartups(callback) {
  const client = getClient();
  const startups = [];
  const query = {
    name: 'get-startups',
    text: `
    SELECT id
    FROM USERS
    WHERE type = 2 AND active = TRUE;`,
    values: [],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          res.rows.forEach((row) => {
            startups.push(row.id.toString());
          });
          callback(err2, startups);
        }
        client.end();
      });
    }
  });
}

// Returns an array of ratings: [{
// coach: 'id',
// startup: 'id',
// coachfeedback: int,
// startupfeedback: int,
// }]
function getRatings(callback) {
  const client = getClient();
  const ratings = [];
  const query = {
    name: 'get-ratings',
    text: `
    SELECT coach_id, startup_id, coach_rating, startup_rating
    FROM Ratings
    INNER JOIN Users
    ON Ratings.startup_id=Users.id
    WHERE type = 2 AND active = TRUE;`,
    values: [],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          res.rows.forEach((row) => {
            ratings.push({
              coach: row.coach_id.toString(),
              startup: row.startup_id.toString(),
              coachfeedback: row.coach_rating,
              startupfeedback: row.startup_rating,
            });
          });
          callback(err2, ratings);
        }
        client.end();
      });
    }
  });
}

// Returns a map of {User_id: Name} and {Name: User_id}
// Used in deciphering and ciphering schedule from admin view
function getUserMap(callback) {
  const client = getClient();
  const keys = {};
  const query = {
    name: 'get-userMap',
    text: 'SELECT name, user_id FROM Profiles;',
    values: [],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          res.rows.forEach((row) => {
            keys[row.name] = row.user_id.toString();
            keys[row.user_id.toString()] = row.name;
          });
          callback(err2, keys);
        }
        client.end();
      });
    }
  });
}

// Returns given timeslots for a given date as a JSON: {
// userid: {
// starttime: '',
// duration: int,
// },
// }
function getTimeslots(date, callback) {
  const client = getClient();
  const timeslots = {};
  const query = {
    name: 'get-timeslots',
    text: `
    SELECT user_id, date, time, duration
    FROM Timeslots
    WHERE date = $1;`,
    values: [date],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          res.rows.forEach((row) => {
            timeslots[row.user_id] = {
              starttime: row.time,
              duration: row.duration,
            };
          });
          callback(err2, timeslots);
        }
        client.end();
      });
    }
  });
}

// Saves a schedule into database
// Schedule is given as [{
// startup: '',
// coach: '',
// time: '',
// duration: int,
// }]
function saveTimetable(schedule, dateString, callback) {
  const queryStart = `
  INSERT INTO Meetings(coach_id, startup_id, date, time, duration, coach_rating, startup_rating)
  VALUES
  `;
  // Filter out nulls
  const data = schedule.filter(obj => obj.startup !== null);
  const strings = data.map((row) => {
    const {
      coach, startup, duration, time,
    } = row;
    return `( ${coach}, ${startup}, '${dateString}', '${time}', ${duration}, -1, -1)`;
  });

  if (strings.length > 0) {
    const client = getClient();
    const query = {
      name: 'save-timetable',
      text: `${queryStart}${strings.join(',\n')};`,
      values: [],
    };
    client.connect((err) => {
      if (err) callback(err);
      else {
        client.query(query, (err2) => {
          callback(err2);
          client.end();
        });
      }
    });
  } else {
    callback({ error: 'No non-null meetings!' });
  }
}

/**
 Save the result of matchmaking algorithm
 @param {Object[]} schedule - schedule to be saveds
 @param {number} schedule.startup
 @param {number} schedule.coach
 @param {string} schedule.time
 @param {number} schedule.duration - duration in minutes
 @param {string} dateString
 @param {function} callback
 only save if the algorithm hasn't been previously saved for this date.
 afterwards set the saved flag in the database.
 the saving is wrapped in a transaction, so that if the flag is set, the data is guaranteed
 to have been saved
 */
function saveMatchmakingResult(schedule, dateString, callback) {
  const client = getClient();
  // set flag that matchmaking has been run
  function setFlag(cb) {
    const q = 'UPDATE MeetingDays SET matchmakingDone = 1 WHERE date = $1';
    client.query(q, [dateString], (err2) => {
      if (err2) return callback(err2);
      return cb();
    });
  }
  // first check if algorithm has already been run on this date
  function checkIfAlreadyDone(cb) {
    const checkQuery = 'SELECT matchmakingDone FROM MeetingDays WHERE date = $1';
    client.query(checkQuery, [dateString], (err, result) => {
      if (err) return callback(err);
      if (result.matchmakingDone) return callback({ error: 'matchmaking has already been run for this date' });
      return cb();
    });
  }

  function begin(cb) {
    client.query('BEGIN', (err) => {
      if (err) callback(err);
      return cb();
    });
  }
  function commit(cb) {
    client.query('COMMIT', (err) => {
      if (err) callback(err);
      return cb();
    });
  }

  client.connect((connectionError) => {
    if (connectionError) return callback(connectionError);
    return checkIfAlreadyDone(() => {
      begin(() => {
        saveTimetable(schedule, dateString, (saveErr) => {
          if (saveErr) {
            return callback(saveErr);
          }
          return setFlag(() => {
            commit(() => {
              callback();
              return client.end();
            });
          });
        });
      });
    });
  });
}


// Returns an array of meetings: [{
// coach: '',
// startup: '',
// time: '',
// duration: int,
// coach_id: int,
// startup_id: int,
// }]
function getTimetable(date, callback) {
  const client = getClient();
  const meetings = [];
  const query = {
    name: 'get-timetable',
    text: `
    SELECT CoachProfiles.name AS coach, StartupProfiles.name AS startup, time, duration, coach_id, startup_id
    FROM Meetings
    LEFT OUTER JOIN Profiles AS CoachProfiles ON CoachProfiles.user_id = coach_id
    LEFT OUTER JOIN Profiles AS StartupProfiles ON StartupProfiles.user_id = startup_id
    WHERE date = $1;`,
    values: [date],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          res.rows.forEach((row) => {
            const meeting = {
              coach: row.coach_id.toString(),
              startup: row.startup,
              time: row.time,
              duration: row.duration,
            };
            meetings.push(meeting);
          });
          callback(err2, meetings);
        }
        client.end();
      });
    }
  });
}

// Takes timetable in form [{
// coach: '',
// startup: '',
// time: '',
// duration: int
// }]
// Removes null meetings and saves the rest to the database
function updateTimetable(timetable, date, callback) {
  const meetings = [];
  getUserMap((err, keys) => {
    if (err) callback(err);
    else {
      for (let i = 0; i < timetable.length; i += 1) {
        const meeting = timetable[i];
        if (meeting.startup !== null) {
          meetings.push({
            coach: keys[meeting.coach],
            startup: keys[meeting.startup],
            time: meeting.time,
            duration: meeting.duration,
          });
        }
      }
      const client = getClient();
      const query = {
        name: 'save-timetable',
        text: 'DELETE FROM Meetings WHERE Date = $1;',
        values: [date],
      };
      client.connect((err2) => {
        if (err2) callback(err2);
        else {
          client.query(query, (err3) => {
            if (err3) callback(err3);
            else {
              saveTimetable(meetings, date, callback);
            }
            client.end();
          });
        }
      });
    }
  });
}

// Returns next meetingday's schedule for a user
function getUserMeetings(userID, userType, callback) {
  let queryText;
  if (userType === 'coach') {
    queryText = `
    SELECT name, time, duration, date, img_url AS image_src
    FROM Meetings
    LEFT OUTER JOIN Profiles ON Profiles.user_id = Meetings.startup_id
    WHERE Meetings.coach_id = $1 AND date = (SELECT MAX(date) FROM Meetings);`;
  } else {
    queryText = `
    SELECT name, time, duration, date, img_url AS image_src
    FROM Meetings
    LEFT OUTER JOIN Profiles ON Profiles.user_id = Meetings.coach_id
    WHERE Meetings.startup_id = $1 AND date = (SELECT MAX(date) FROM Meetings);`;
  }
  const client = getClient();
  const query = {
    name: 'get-userMeetings',
    text: queryText,
    values: [userID],
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

/**
 * Get an object mapping all ids from startups and coaches and map them to their names.
 * @param {function} callback
 * return value given to callback:
 * { startups: { id: name }, coaches: {...} }
 */
function getMapping(callback) {
  const client = getClient();
  const coachType = 1;
  const startupType = 2;
  const mapping = {
    startups: {},
    coaches: {},
  };
  const qText = `SELECT Users.id AS id, Profiles.name AS name, Users.type AS type
    FROM Users
    INNER JOIN Profiles
    ON Users.id = Profiles.user_id
    WHERE active = true AND (Users.type = $1
    OR Users.type = $2);`;

  const query = {
    text: qText,
    values: [startupType, coachType],
  };

  client.connect((connErr) => {
    if (connErr) return callback(connErr);
    client.query(query, (err, result) => {
      if (err) return callback(err);
      result.rows.forEach((row) => {
        if (row.type === startupType) {
          mapping.startups[row.id] = row.name;
        } else if (row.type === coachType) {
          mapping.coaches[row.id] = row.name;
        }
      });
      callback(null, mapping);
      return client.end();
    });
  });
}

/**
 * Add a profile to the database. requires a user to already exist with the given id
 * @param {Object} userInfo
 * @param {string} userInfo.name
 * @param {string} userInfo.email
 * @param {string} userInfo.img_url
 * @param {string} userInfo.linkedin - if type === 'coach'
 * @param {string} userInfo.website - if type === 'startup'
 * @param {string} id
 */
function addProfile(userInfo, id, callback) {
  const client = getClient();
  const imgURL = userInfo.img_url || null;
  const website = userInfo.website || userInfo.linkedin;
  const qText = `INSERT INTO Profiles(user_id, name, img_url, description, website) VALUES
  ($1, $2, $3, $4, $5);`;
  const query = {
    text: qText,
    values: [id, userInfo.name, imgURL, userInfo.description, website],
  };

  client.connect((connErr) => {
    if (connErr) return callback(connErr);
    return client.query(query, (error) => {
      if (error) return callback(error);
      callback(error, { type: 'SUCCESS', message: 'User added successfully!' });
      return client.end();
    });
  });
}
/**
 * Add a user to the database, including an entry to the Profiles table
 * wraps the process in a transaction
 * @param {Object} userInfo
 * @param {string} userInfo.name
 * @param {string} userInfo.email
 * @param {string} userInfo.type
 * @param {string} userInfo.img_url
 * @param {string} userInfo.linkedin - if type === 'coach'
 * @param {string} userInfo.website - if type === 'startup'
 * @param {string} userInfo.password
 * return value given to callback: { type: 'ERROR'|'SUCCESS', message: string}
 */
function addUser(userInfo, callback) {
  if (!userInfo.password || userInfo.password.length < 6) {
    return callback(null, { type: 'ERROR', message: 'password too short' });
  }
  const client = getClient();
  // checks if there already exists a user with that email, returns an error msg in callback if so
  function check(cb) {
    const q = {
      text: 'SELECT * FROM Users where email = $1;',
      values: [userInfo.email],
    }
    client.query(q, (err, result) => {
      if (err) return cb(err);
      if (result.rowCount !== 0) return cb(null, { type: 'ERROR', message: 'A user with that email already exists!' });
      return cb(null, null);
    });
  }
  // hash password
  const password = bcrypt.hashSync(userInfo.password, 10);
  const type = UserTypes[userInfo.type];
  const query = {
    text: 'INSERT INTO Users(type, email, password, active) VALUES($1, $2, $3, $4) RETURNING id;',
    values: [type, userInfo.email, password, 0],
  };
  return client.connect((connErr) => {
    if (connErr) return callback(connErr);
    // check if email already in use
    return check((checkErr, checkResult) => {
      if (checkErr || checkResult) return callback(checkErr, checkResult);
      // insert into user table and return id
      return client.query(query, (error, result) => {
        if (error) return callback(error);
        if (result.rowCount !== 1) return callback({ error: 'Error inserting user' });
        // insert into profile table
        return addProfile(userInfo, result.rows[0].id, (profileError, resultMsg) => {
          if (profileError) return callback(profileError);
          callback(null, resultMsg);
          return client.end();
        });
      });
    });
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
  getComingTimeslots,
  getLastMeetingday,
  getGivenFeedbacks,
  insertAvailability,
  updateCredentialsListEntries,
  updateProfile,
  verifyIdentity,
  changeEmail,
  changePasswordAdmin,
  changePassword,
  getMeetingDuration,
  getStartups,
  getRatings,
  getUserMap,
  getTimeslots,
  saveTimetable,
  saveMatchmakingResult,
  getTimetable,
  updateTimetable,
  getUserMeetings,
  getMapping,
  addProfile,
  addUser,
};
