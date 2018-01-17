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
SELECT name, description, email, linkedin, Credentials.company, Credentials.title
FROM Profiles
LEFT OUTER JOIN Credentials ON Profiles.user_id = Credentials.user_id
WHERE Profiles.user_id IN (
  SELECT id
  FROM USERS
  WHERE type = ? AND batch = ? AND active = 1
);`;

const testQ = `
SELECT *
FROM Users;
`;

// function testApi(callback) {
//   const res = {};
//   db.all(testQ, [], (err, rows) => {
//     if (err) {
//       throw err;
//     }
//     res.data = rows;
//     return callback(res);
//   })
// }

function getUsers(type, batch, callback) {
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
  // testApi,
};
// exports.close = closeDatabase;
// exports.db = db;
// exports.getUsers = getUsers;
