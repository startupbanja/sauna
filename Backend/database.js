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

function closeDatabase() {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Database connection closed.');
    return null;
  });
}

fs.readFile('./db_creation.sql', 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }
  db.run(data, null, (err2) => {
    if (err) {
      return console.error(err2.message);
    }
    console.log('Data loaded');
    closeDatabase();
    return null;
  });
  return null;
});
