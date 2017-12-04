/* DATABASE CONNECTION */

var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database(':memory:', test(err));



function test(err) {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
}

function test2(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
}

/* CLOSE THE CONNECTION */
db.close(test2(err));