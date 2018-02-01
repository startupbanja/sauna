/* DATABASE CONNECTION */

const sqlite = require('sqlite3').verbose();
const fs = require('fs');
const bcrypt = require('bcrypt');

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
const userQuery = `
SELECT Profiles.user_id, name, description, email, linkedin, Credentials.company, Credentials.title
FROM Profiles
LEFT OUTER JOIN Credentials ON Profiles.user_id = Credentials.user_id
WHERE Profiles.user_id IN (
  SELECT id
  FROM USERS
  WHERE type = ? AND batch = ? AND active = 1
);`;

const timeslotQuery = `
SELECT user_id, date, time, duration
FROM Timeslots
WHERE date IN (
SELECT MAX(date)
FROM Timeslots
);`;

const ratingQuery = `
SELECT coach_id, startup_id, coach_rating, startup_rating
FROM Ratings
INNER JOIN Users
ON Ratings.startup_id=Users.id
WHERE type=2 AND active=1 AND batch IN (
SELECT MAX(id)
FROM Batches
);`;

const startupQuery = `
SELECT id
FROM USERS
WHERE type=2 AND batch IN (
SELECT MAX(id)
FROM Batches
);`;

function getUsers(type, batch, includeId, callback) {
  const users = {};
  // (sql, params, callback for each row, callback on complete)
  db.each(userQuery, [type, batch], (err, row) => {
    if (err) {
      throw err;
    }
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
      // return console.error(err.message);
      throw err;
    }
    return callback(users);
  });
}


function getProfile(id, callback) {
  const info = {};
  const query = `SELECT name, description, Profiles.company AS currentCompany, email, linkedin, Credentials.company, Credentials.title
                 FROM Profiles
                 LEFT OUTER JOIN Credentials ON Profiles.user_id = Credentials.user_id
                 WHERE Profiles.user_id = ?;`;

  db.all(query, [Number(id)], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      if (info.name === undefined) {
        info.name = row.name;
        info.description = row.description;
        info.email = row.email;
        info.linkedIn = row.linkedin;
        info.company = row.currentCompany;
        info.credentials = [{ company: row.company, position: row.title }];
      } else {
        info.credentials.push({ company: row.company, position: row.title });
      }
    });
    callback(info);
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
        case 2:
          type = 'user';
          userId = row.id;
          break;
        default:
          type = 'error';
      }
      callback(type, userId);
    });
  });
}

function getStartups(callback) {
  const startups = [];
  // (sql, params, callback for each row, callback on complete)
  db.each(startupQuery, [], (err, row) => {
    if (err) {
      throw err;
    }
    startups.push(row.id.toString());
    return null;
  }, (err) => {
    if (err) {
      // return console.error(err.message);
      throw err;
    }
    return callback(startups);
  });
}

function getRatings(callback) {
  const ratings = [];
  // (sql, params, callback for each row, callback on complete)
  db.each(ratingQuery, [], (err, row) => {
    if (err) {
      throw err;
    }
    ratings.push({
      coach: row.coach_id.toString(),
      startup: row.startup_id.toString(),
      coachfeedback: row.coach_rating,
      startupfeedback: row.startup_rating,
    });
    return null;
  }, (err) => {
    if (err) {
      // return console.error(err.message);
      throw err;
    }
    return callback(ratings);
  });
}

function getTimeslots(callback) {
  const timeslots = {};
  db.each(timeslotQuery, [], (err, row) => {
    if (err) {
      throw err;
    }
    timeslots[row.user_id] = {
      starttime: row.time,
      duration: row.duration,
    };
    return null;
  }, (err) => {
    if (err) {
      // return console.error(err.message);
      throw err;
    }
    return callback(timeslots);
  });
}

// function check() {
//   db.all("SELECT * FROM Meetings WHERE date = '2018-01-01'", [], (err, rows) => {
//     if (err) console.log(err);
//     console.log('success?');
//     rows.forEach(row => console.log(row));
//   });
// }

const saveMatchmakingQuery = `
INSERT INTO Meetings(coach_id, startup_id, date, time, duration, coach_rating, startup_rating)
VALUES
`;
// jsonData is in array(parsed) form
function saveMatchmaking(jsonData, dateString, callback) {
  // filter nulls
  const data = jsonData.filter(obj => obj.startup !== null);

  const strings = data.map((row) => {
    const {
      coach, startup, duration, time,
    } = row;
    return `( ${coach}, ${startup}, '${dateString}', '${time}', ${duration}, -1, -1)`;
  });
  const query = `${saveMatchmakingQuery}${strings.join(',\n')};`;
  // console.log(query);
  db.run(query, () => callback());
}


fs.readFile('./db_creation_sqlite.sql', 'utf8', (err, data) => {
  if (err) {
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
    console.log('Data loaded');
  });
  return null;
});
// Get an object mapping all ids from startups and coaches of the current batch and map them to their names.
// Currently returns all coaches with any branch number
//Checks for active = 1 for all rows
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
    if (err) throw err;
    if (row.type === startupType) {
      result.startups[row.id] = row.name;
    } else if (row.type === coachType) {
      result.coaches[row.id] = row.name;
    }
  }, (err) => {
    if (err) throw err;
    callback(result);
  });
}


module.exports = {
  closeDatabase,
  getUsers,
  verifyIdentity,
  getProfile,
  getRatings,
  getTimeslots,
  getStartups,
  saveMatchmaking,
  getMapping,
};
