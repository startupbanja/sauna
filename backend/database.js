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

function getFeedback(id, callback) {
  const feedbacks = [];
  const query = `
    SELECT id, user_id, name, description, rating, "/app/imgs/coach_placeholder.png" AS image_src
    FROM 
      (SELECT id, 
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
          (SELECT MAX(date) FROM Meetings WHERE coach_id = ? OR startup_id = ?))
      NATURAL JOIN Profiles`;
  db.all(query, [id, id, id, id, id, id, id, id], (err, rows) => {
    if (err) throw err;
    callback(rows);
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
            // return console.error(err2.message);
            throw err2;
          }
          // closeDatabase();
          return null;
        });
      }
    });
    console.log('Data loaded');
  });
  return null;
});

module.exports = {
  closeDatabase,
  getUsers,
  verifyIdentity,
  getProfile,
  getRatings,
  getTimeslots,
  getStartups,
  getFeedback,
};
