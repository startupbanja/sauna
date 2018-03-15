/* DATABASE CONNECTION */

const sqlite = require('sqlite3').verbose();
const fs = require('fs');
const bcrypt = require('bcrypt');
const testData = require('./db_test_data.js');

const db = new sqlite.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
  return null;
});

function closeDatabase(callback) {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Database connection closed.');
    return callback();
  });
}

function getUsers(type, batch, includeId, callback) {
  const users = {};
  const query = `
  SELECT Profiles.user_id, name, description, email, linkedin, Credentials.company, Credentials.title
  FROM Profiles
  LEFT OUTER JOIN Credentials ON Profiles.user_id = Credentials.user_id
  WHERE Profiles.user_id IN (
    SELECT id
    FROM USERS
    WHERE type = ? AND batch = ? AND active = 1
  );`;
  // (sql, params, callback for each row, callback on complete)
  db.each(query, [type, batch], (err, row) => {
    if (err) return callback(err);
    // if already read one line with the name
    if (users[row.name] !== undefined) {
      users[row.name].credentials.push([row.company, row.title]);
    } else {
      users[row.name] = {
        description: row.description,
        email: row.email,
        linkedin: row.linkedin,
        credentials: [[row.company, row.title]],
      };
      if (includeId) {
        users[row.name].id = row.user_id;
      }
    }
    return null;
  }, (err) => {
    if (err) {
      return callback(err);
    }
    return callback(err, users);
  });
}

// Returns id, name and active status for all coaches and startups in form
// {
// coaches: [{name, id, active}]
// startups: [{name, id, active}]
// }
function getActiveStatuses(callback) {
  const data = { coaches: [], startups: [] };
  const query = `SELECT user_id, name, type, active
                 FROM Users
                 LEFT OUTER JOIN Profiles ON Users.id = Profiles.user_id;`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return callback(err);
    }
    rows.forEach((row) => {
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
    return callback(null, data);
  });
}

function setActiveStatus(id, active, callback) {
  const query = `
  UPDATE Users
  SET active = ?
  WHERE id = ?;`;
  db.run(query, [active, id], (err) => {
    if (err) return callback(err);
    return callback(null, { status: 'success' });
  });
}


function getProfile(id, callback) {
  const info = {};
  const query = `SELECT name, img_url, description, Profiles.company AS currentCompany, email, linkedin, website, CredentialsListEntries.title, CredentialsListEntries.content
                 FROM Profiles
                 LEFT OUTER JOIN CredentialsListEntries ON Profiles.user_id = CredentialsListEntries.uid
                 WHERE Profiles.user_id = ?;`;

  db.all(query, [Number(id)], (err, rows) => {
    if (err) return callback(err);
    rows.forEach((row) => {
      if (info.name === undefined) {
        info.name = row.name;
        info.img_url = row.img_url;
        info.description = row.description;
        info.email = row.email;
        info.linkedIn = row.linkedin !== null ? row.linkedin : row.website;
        info.company = row.currentCompany;
        info.credentials = [{ company: row.title, position: row.content }];
      } else {
        info.credentials.push({ company: row.title, position: row.content });
      }
    });

    db.get('SELECT type FROM Users WHERE id = ?', [id], (error, row) => {
      if (err) return callback(error);
      info.type = row.type === 1 ? 'coach' : 'startup';
      return callback(err, info);
    });
    return '';
  });
}

function getFeedback(id, callback) {
  const feedbacks = [];
  const query = `
    SELECT date, time, id AS meetingId, user_id, name, description, rating, "/app/imgs/coach_placeholder.png" AS image_src
    FROM
      (SELECT date, time, id,
          CASE
            WHEN coach_id = ? THEN startup_id
            WHEN startup_id = ? THEN coach_id
          END user_id,
          CASE
            WHEN coach_id = ? THEN coach_rating
            WHEN startup_id = ? THEN startup_rating
          END rating
        FROM Meetings
        WHERE (coach_id = ? OR startup_id = ?) AND date =
          (SELECT MAX(date) FROM Meetings WHERE (coach_id = ? OR startup_id = ?) AND date < date("now")))
      NATURAL JOIN Profiles`;
  db.all(query, [id, id, id, id, id, id, id, id], (err, rows) => {
    if (err) return callback(err);
    return callback(err, rows);
  });
}

function giveFeedback(meetingId, rating, field, callback) {
  const query = `
  UPDATE Meetings
  SET ${field} = ?
  WHERE id = ?;`;
  db.run(query, [rating, meetingId], (err) => {
    if (err) return callback(err);
    const query2 = `
    SELECT startup_id, coach_id
    FROM Meetings
    WHERE id = ?`;
    db.get(query2, [meetingId], (err2, row) => {
      if (err2) return callback(err2);
      const query3 = `
      UPDATE Ratings
      SET ${field} = ?
      WHERE startup_id = ? AND coach_id = ?`;
      db.run(query3, [rating, row.startup_id, row.coach_id], (err3) => {
        if (err3) return callback(err3);
        return callback(err3, 'success');
      });
      return undefined;
    });
    return undefined;
  });
}


function createMeetingDay(date, start, end, split, callback) {
  const query = `INSERT INTO MeetingDays(date, startTime, endTime, split, matchmakingDone)
    VALUES (?, ?, ?, ?, 0)`;
  db.run(query, [date, start, end, split], (err) => {
    if (err) return callback(err);
    return callback(err, { status: 'success' });
  });
}

// get all meetingdays in the future together with a flag indicating if matchmaking was run
// on them
function getComingMeetingDays(userId, callback) {
  const query = `SELECT MeetingDays.date, startTime, endTime, split, time, duration, matchmakingDone
    FROM Users
    LEFT OUTER JOIN MeetingDays
    LEFT OUTER JOIN Timeslots on Timeslots.date = MeetingDays.date AND Timeslots.user_id = Users.id
    WHERE Users.id = ? AND MeetingDays.date >= date("now")`;
  db.all(query, [userId], (err, result) => {
    if (err) return callback(err);
    return callback(err, result);
  });
}

function getComingDates(callback) {
  const dates = [];
  const query = `SELECT date
    FROM MeetingDays
    WHERE MeetingDays.date >= date("now")`;
  db.each(query, [], (err, row) => {
    if (err) return callback(err);
    dates.push(row.date);
    return null;
  }, (err) => {
    if (err) return callback(err);
    return callback(err, dates);
  });
}

// Returns coming availabilities of coaches and names of the coaches
function getComingTimeslots(callback) {
  const query = `SELECT CoachProfiles.name, MeetingDays.date, Timeslots.time, Timeslots.duration
    FROM Users
    LEFT OUTER JOIN CoachProfiles ON Users.id = CoachProfiles.user_id
    LEFT OUTER JOIN MeetingDays
    LEFT OUTER JOIN Timeslots ON MeetingDays.date = Timeslots.date AND Timeslots.user_id = Users.id
    WHERE MeetingDays.date >= date("now") AND Users.active = 1 AND Users.type = 1`;
  db.all(query, [], (err, result) => {
    if (err) return callback(err);
    return callback(err, result);
  });
}
// get the latest past meetingday
function getLastMeetingday(callback) {
  const q = 'SELECT MAX(Date) AS Date FROM MeetingDays WHERE Date < date("now");';
  db.get(q, [], (err, result) => {
    if (err) return callback(err);
    return callback(null, result.Date);
  });
}

// Get given feedbacks  from latest meeting using the closest date in the past
// Also returns the date
// return value: { date, result }
function getGivenFeedbacks(callback) {
  getLastMeetingday((err, date) => {
    if (err) return callback(err);
    const query = `SELECT Users.type, Profiles.name, Meetings.startup_rating, Meetings.coach_rating, Meetings.date
      FROM Users
      LEFT OUTER JOIN Profiles ON Users.id = Profiles.user_id
      LEFT OUTER JOIN Meetings ON Users.id = Meetings.coach_id OR Users.id = Meetings.startup_id
      WHERE Meetings.date = ?;`;
    db.all(query, date, (err2, result) => {
      if (err2) return callback(err2);
      return callback(err, { date, result });
    });
    return undefined;
  });
}

function insertAvailability(userId, date, startTime, duration, callback) {
  const query = `INSERT INTO Timeslots(user_id, date, time, duration)
    VALUES (?, ?, ?, ?)`;
  db.run(query, [userId, date, startTime, duration], (err) => {
    if (err) return callback(err);
    return callback(err, { status: 'success' });
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
  const table = userType === 'Coach' ? 'Credentials' : 'TeamMembers';
  const columns = userType === 'Coach' ? ['user_id', 'company', 'title'] : ['startup_id', 'name', 'title'];
  const deleteSQL = `DELETE FROM ${table} WHERE ${columns[0]} = ? AND ${columns[1]} = ? AND ${columns[2]} = ?`;
  const insertSQL = `INSERT INTO ${table}(${columns[0]}, ${columns[1]}, ${columns[2]}) VALUES(?,?,?);`;

  // Fetches all credentials for the given uid and processes them.
  db.all('SELECT title, content FROM CredentialsListEntries WHERE uid = ?', [uid], (err, rows) => {
    if (!err) {
      // We are converting the objects into JSON format for easy comparison.
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
        db.run(deleteSQL, [uid, item.title, item.content], (error) => {
          if (error) {
            thrownError = error;
          }
        });
      });

      if (!thrownError) {
        // Inserts the new credentials.
        toBeInserted.forEach((item) => {
          db.run(insertSQL, [uid, item.title, item.content], (error) => {
            thrownError = error;
          });
        });
      }

      if (response.status === undefined) {
        response.status = 'SUCCESS';
        response.message = 'Profile was updated successfully!';
      }
      callback(thrownError, response);
    } else {
      return callback(err, null);
    }
  });
}

function updateProfile(uid, userType, site, imgUrl, description, title, credentials, callback) {
  const siteAttr = userType === 'Coach' ? 'linkedin' : 'website';
  const company = userType === 'Coach' ? ', company = ?' : '';
  const queryParams = userType === 'Coach' ? [site, imgUrl, description, title, uid] : [site, imgUrl, description, uid];
  const query = `UPDATE ${userType}Profiles SET ${siteAttr} = ?, img_url = ?, description = ?${company} WHERE user_id = ?`;
  db.run(query, queryParams, (err) => {
    if (!err) {
      updateCredentialsListEntries(uid, credentials, userType, callback);
      return undefined;
    }
    return callback(err);
  });
}

function verifyIdentity(username, password, callback) {
  const query = 'SELECT id, type, password FROM Users WHERE username = ?';
  db.get(query, [username], (err, row) => {
    if (err) {
      throw err;
    }
    if (!row) {
      callback('error');
      return;
    }
    bcrypt.compare(password, row.password, (error, same) => {
      if (error) throw error;
      if (!same) {
        callback('error');
        return;
      }
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
    });
  });
}

/**
 * Changes the given user's (UID) password if possible
 * and calls callback with response message object.
 */
function changePassword(uid, oldPassword, newPassword, callback) {
  const response = { status: 'ERROR', message: 'Password could not be changed due to technical problems.' };

  // Fetch the hash of the current password.
  db.get('SELECT password FROM Users WHERE id = ?', [uid], (err, row) => {
    if (!err) {
      const oldPass = row.password; // hashed version of the current password.
      const oldHash = bcrypt.hashSync(oldPassword, 10);

      bcrypt.compare(oldPassword, oldPass, (e, same) => {
        if (!e) {
          if (!same) {
            response.message = 'The current password was incorrect!';
            return callback(null, response);
          }

          const newHashed = bcrypt.hashSync(newPassword, 10);
          db.run('UPDATE Users SET password = ? WHERE id = ?', [newHashed, uid], (error) => {
            if (!error) {
              response.status = 'SUCCESS';
              response.message = 'Password was successfully changed!';
            }
            return callback(error, response);
          });
        } else {
          return callback(e, null);
        }
      });
    } else {
      return callback(err, null);
    }
  });
}

function getStartups(callback) {
  const startups = [];
  const query = `
  SELECT id
  FROM USERS
  WHERE type=2 AND batch IN (
  SELECT MAX(id)
  FROM Batches
  );`;
  // (sql, params, callback for each row, callback on complete)
  db.each(query, [], (err, row) => {
    if (err) {
      return callback(err);
    }
    startups.push(row.id.toString());
    return null;
  }, (err) => {
    if (err) {
      return callback(err);
    }
    return callback(err, startups);
  });
}

// return an array of {coach, startup, coachfeedback, startupfeedback}
// Currently uses newest batch number TODO
function getRatings(callback) {
  const ratings = [];
  const query = `
  SELECT coach_id, startup_id, coach_rating, startup_rating
  FROM Ratings
  INNER JOIN Users
  ON Ratings.startup_id=Users.id
  WHERE type=2 AND active=1 AND batch IN (
  SELECT MAX(id)
  FROM Batches
  );`;
  // (sql, params, callback for each row, callback on complete)
  db.each(query, [], (err, row) => {
    if (err) return callback(err);
    ratings.push({
      coach: row.coach_id.toString(),
      startup: row.startup_id.toString(),
      coachfeedback: row.coach_rating,
      startupfeedback: row.startup_rating,
    });
    return null;
  }, (err) => {
    if (err) {
      return callback(err);
    }
    return callback(err, ratings);
  });
}

// Used for getting a map of {User_id: Name} and {Name: User_id}
// Used in deciphering and ciphering schedule from admin view
function getUserMap(callback) {
  const q = `
            SELECT name, user_id
            FROM Profiles;`;
  const keys = {};
  // (sql, params, callback for each row, callback on complete)
  db.each(q, [], (err, row) => {
    if (err) return callback(err);
    keys[row.name] = row.user_id.toString();
    keys[row.user_id.toString()] = row.name;
    return null;
  }, (err) => {
    if (err) return callback(err);
    return callback(err, keys);
  });
}

// Get coach timeslot info for a given date
function getTimeslots(date, callback) {
  const q = `
  SELECT user_id, date, time, duration
  FROM Timeslots
  WHERE date = ? ;`;
  const timeslots = {};
  db.each(q, [date], (err, row) => {
    if (err) return callback(err);
    timeslots[row.user_id] = {
      starttime: row.time,
      duration: row.duration,
    };
    return null;
  }, (err) => {
    if (err) return callback(err);
    return callback(err, timeslots);
  });
}

// save a given schedule to database
function saveTimetable(schedule, dateString, callback) {
  const saveMatchmakingQuery = `
  INSERT INTO Meetings(coach_id, startup_id, date, time, duration, coach_rating, startup_rating)
  VALUES
  `;
  // filter nulls
  const data = schedule.filter(obj => obj.startup !== null);
  const strings = data.map((row) => {
    const {
      coach, startup, duration, time,
    } = row;
    console.log(row);
    return `( ${coach}, ${startup}, '${dateString}', '${time}', ${duration}, -1, -1)`;
  });
  const query = `${saveMatchmakingQuery}${strings.join(',\n')};`;
  db.run(query, (err) => {
    callback(err);
  });
}

// schedule is array of {startupid, coachid, date, duration}
// save the result of matchmaking algorithm
// only save if the algorithm hasn't been previously saved for this date.
// afterwards set the saved flag in the database.
function saveMatchmakingResult(schedule, dateString, callback) {
  function setFlag() {
    const q = 'UPDATE MeetingDays SET matchmakingDone = 1 WHERE date = ?';
    db.run(q, dateString, (err2) => {
      if (err2) return callback(err2);
      db.parallelize();
      return callback(null);
    });
  }

  db.serialize(); // serialize here to make into pseudo transaction, FIXME
  // first check if algorithm has already been run on this date
  const checkQuery = 'SELECT matchmakingDone FROM MeetingDays WHERE date = ?';
  db.get(checkQuery, dateString, (err, result) => {
    if (err) return callback(err);
    if (!result.matchmakingDone) {
      saveTimetable(schedule, dateString, (err2) => {
        if (err2) return callback(err2);
        return setFlag();
      });
    }
    return undefined;
  });
}

function getTimetable(date, callback) {
  const query = `
    SELECT CoachProfiles.name AS coach, StartupProfiles.name AS startup, time, duration, coach_id, startup_id
    FROM Meetings
    LEFT OUTER JOIN CoachProfiles ON CoachProfiles.user_id = coach_id
    LEFT OUTER JOIN StartupProfiles ON StartupProfiles.user_id = startup_id
    WHERE date = ?;
    `;
  const meetings = [];
  db.each(query, date, (err, row) => {
    if (err) return callback(err);
    const meeting = {
      coach: row.coach_id.toString(),
      startup: row.startup,
      time: row.time,
      duration: row.duration,
    };
    meetings.push(meeting);
    return null;
  }, (err) => {
    if (err) return callback(err);
    return callback(err, meetings);
  });
}

// Gets timetable in form [{coach: coachName, startup: startupName, time: time, duration: duration}]
// Removes null meetings and saves the rest to the database
function updateTimetable(timetable, date, errCallback) {
  const meetings = [];
  getUserMap((err, keys) => {
    if (err) return errCallback(err);
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
    const query = `
    DELETE FROM Meetings WHERE Date = ?;`;
    db.run(query, [date], (err2) => {
      if (err2) return errCallback(err2);
      console.log(timetable);
      return saveTimetable(meetings, date, errCallback);
    //   if (meetings.length > 0) {
    //     let query2 = `
    //     INSERT INTO Meetings (coach_id, startup_id, date, time, duration)
    //     VALUES`;
    //     for (const element in meetings) { //eslint-disable-line
    //       const meeting = meetings[element];
    //       query2 = query2 + ' (' + meeting.coach + ', ' + meeting.startup + ', ' + date + ", '" + meeting.time + "'," + meeting.duration + '),';
    //     }
    //     query2 = query2.slice(0, -1) + ';';
    //     // console.log(query2);
    //     db.run(query2, [], (err3) => {
    //       if (err3) return errCallback(err3);
    //       return undefined;
    //     });
    //   }
    //   return undefined;
    });
    return undefined;
  });
}

// Returns next meetingday's schedule for a user
function getUserMeetings(userID, userType, callback) {
  let query;
  if (userType === 'coach') {
    query = `
    SELECT name, time, duration, date, "/app/imgs/coach_placeholder.png" AS image_src
    FROM Meetings
    LEFT OUTER JOIN Profiles ON Profiles.user_id = Meetings.startup_id
    WHERE Meetings.coach_id = ? AND date = (SELECT MAX(date) FROM Meetings);`;
  } else {
    query = `
    SELECT name, time, duration, date, "/app/imgs/coach_placeholder.png" AS image_src
    FROM Meetings
    LEFT OUTER JOIN Profiles ON Profiles.user_id = Meetings.coach_id
    WHERE Meetings.startup_id = ? AND date = (SELECT MAX(date) FROM Meetings);`;
  }
  db.all(query, [userID], (err, result) => {
    if (err) return callback(err);
    return callback(err, result);
  });
}

function initDB() {
  fs.readFile('./db_creation_sqlite.sql', 'utf8', (err, data) => {
    if (err) {
      //TODO do something here
      return console.log(err);
    }
    // split data into statements
    const arr = data.split(';');

    // ensure it is running in serialized mode
    db.serialize(() => {
      arr.forEach((statement) => {
        if (statement.trim()) {
          db.run(statement, [], (err2) => {
            if (err2) {
              throw err2;
            }
            return null;
          });
        }
      });
      testData.insertData(db, 4);
      console.log('Data loaded');
    });
    return null;
  });
}
initDB();
// Get an object mapping all ids from startups and coaches of the current batch and map them to their names.
// Currently returns all coaches with any branch number
// Checks for active = 1 for all rows
function getMapping(batch, callback) {
  const coachType = 1;
  const startupType = 2;
  // const coachBatch = 1;
  const result = {
    startups: {},
    coaches: {},
  };
  const q = `SELECT Users.id AS id, Profiles.name AS name, Users.type AS type
  FROM Users
  INNER JOIN Profiles
  ON Users.id = Profiles.user_id
  WHERE active = 1 AND ((Users.type = ? AND Users.batch = ?)
  OR Users.type = ?);`;
  db.each(q, [startupType, batch, coachType], (err, row) => {
    if (err) return callback(err);
    if (row.type === startupType) {
      result.startups[row.id] = row.name;
    } else if (row.type === coachType) {
      result.coaches[row.id] = row.name;
    }
    return null;
  }, (err) => {
    if (err) return callback(err);
    return callback(err, result);
  });
}


function addProfile(userInfo, callback) {
  let userType;
  let siteAttr; // linkedin or website
  let url; // the actual URL of the site

  switch (userInfo.type) {
    case 'coach':
      userType = 'Coach';
      siteAttr = 'linkedin';
      url = userInfo.linkedin;
      break;
    case 'startup':
      userType = 'Startup';
      siteAttr = 'website';
      url = userInfo.website;
      break;
    default:
  }

  const insertSQL = `INSERT INTO ${userType}Profiles(user_id, name, img_url, description, email, ${siteAttr}) VALUES(?, ?, ?, ?, ?, ?)`;
  db.get('SELECT id FROM Users WHERE username=?', [userInfo.email], (err, row) => {
    if (!err) {
      const uid = row.id;
      db.run(
        insertSQL,
        [uid, userInfo.name, userInfo.img_url, userInfo.description, userInfo.email, url],
        (error, row2) => {
          const response = {};
          if (!error) {
            response.type = 'SUCCESS';
            response.message = 'User added successfully!';
          } else {
            console.log(error);
            response.type = 'ERROR';
            response.message = 'User could not be created!';
          }
          callback(response);
        });
    } else {
      callback({ type: 'ERROR', message: 'User could not be created!' });
    }
  });
}

function addUser(userInfo, callback) {
  db.get('SELECT * FROM Users WHERE username=?', [userInfo.email], (err, row) => {
    if (row === undefined) {
      db.get('SELECT MAX(id) AS id FROM Batches;', [], (err2, row2) => {
        const batchId = row2.id;
        const password = bcrypt.hashSync(userInfo.password, 10);
        let type;
        switch (userInfo.type) {
          case 'coach':
            type = 1;
            break;
          case 'startup':
            type = 2;
            break;
          default:
        }

        const insertSQL = 'INSERT INTO Users(type, username, password, batch, active) VALUES(?, ?, ?, ?, ?);';

        db.run(insertSQL, [type, userInfo.email, password, batchId, 0], (e) => {
          if (!e) {
            addProfile(userInfo, callback);
          } else {
            callback({ type: 'ERROR', message: 'An error occured while attempting to create new user!' });
          }
        });
      });
    } else {
      callback({ type: 'ERROR', message: 'A user with that email already exists!' });
    }
  });
}

module.exports = {
  closeDatabase,
  addUser,
  getUsers,
  verifyIdentity,
  changePassword,
  getProfile,
  getRatings,
  getTimeslots,
  getStartups,
  getFeedback,
  giveFeedback,
  saveMatchmakingResult,
  getMapping,
  createMeetingDay,
  getComingMeetingDays,
  insertAvailability,
  getTimetable,
  getActiveStatuses,
  updateTimetable,
  getUserMap,
  getComingDates,
  getComingTimeslots,
  getGivenFeedbacks,
  setActiveStatus,
  getUserMeetings,
  db,
  updateProfile,
};
