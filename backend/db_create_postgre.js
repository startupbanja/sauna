const fs = require('fs');
const db = require('./postgre_adapter');

function initDB(callback) {
  fs.readFile('./db_creation.sql', 'utf8', (err, data) => {
    if (err) {
      return callback(err);
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
    });
    return null;
  });
}

initDB(msg => console.log(msg));
