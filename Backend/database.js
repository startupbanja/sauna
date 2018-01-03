/* DATABASE CONNECTION */

const sqlite = require('sqlite3').verbose();
const fs = require('fs');

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
SELECT name, description, email, linkedin, company, title
FROM Profiles
LEFT OUTER JOIN Credentials ON Profiles.user_id = Credentials.user_id
WHERE user_id IN (
  SELECT id
  FROM USERS
  WHERE type = ? AND batch = ? AND active = true
);
`;
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
      return console.error(err.message);
    }
    callback(users);
    return null;
  });
}


fs.readFile('./db_creation.sql', 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }
  db.serialize(() => {
    db.run(data, [], (err2) => {
      if (err2) {
        // return console.error(err2.message);
        throw err2;
      }
      console.log('Data loaded');
      // closeDatabase();
      return null;
    });
  });
  return null;
});


module.exports = {
  closeDatabase,
  getUsers,
};
// exports.close = closeDatabase;
// exports.db = db;
// exports.getUsers = getUsers;
