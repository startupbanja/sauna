const pg = require('pg');
const fs = require('fs');
const params = require('../credentials/database_params.json');
/*
This script creates a new set of tables to the database specified by the params json file
The database should be empty and already exist (created with CREATE DATABASE)
*/

fs.readFile('./db_creation_postgre.sql', 'utf8', (readErr, data) => {
  if (readErr) throw readErr;
  // split data into statements
  const statements = data.split(';');
  const client = new pg.Client(params);
  // run the next statement and call itself recursively until all are done
  function doNextStatement(i, cb) {
    if (!(i < statements.length) || !statements[i].trim()) return cb();
    const statement = statements[i];
    return client.query(statement, (DBerr) => {
      if (DBerr) throw DBerr;
      doNextStatement(i + 1, cb);
    });
  }

  client.connect((connErr) => {
    if (connErr) throw connErr;
    client.query('BEGIN', (beginErr) => {
      if (beginErr) throw beginErr;
      doNextStatement(0, () => {
        client.query('COMMIT', (commitErr) => {
          if (commitErr) throw commitErr;
          console.log('Tables created succesfully.')
          client.end(() => process.exit());
        });
      });
    });
  });
});
