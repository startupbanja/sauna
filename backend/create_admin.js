const pg = require('pg');
const bcrypt = require('bcrypt');
const params = require('./database_params.json');

const client = new pg.Client(params);
const email = 'admin';
const pwInput = 'admin';
const password = bcrypt.hashSync(pwInput, 10);
client.connect((connErr) => {
  if (connErr) throw connErr;
  const query = {
    text: 'INSERT INTO Users(type, email, password, active) VALUES ($1, $2, $3, $4);',
    values: [0, email, password, 1],
  };
  client.query(query, (queryError, result) => {
    if (queryError) throw queryError;
    if (result.rowCount !== 1) return console.error('error creating user');
    console.log('Created succesfully');
    return client.end();
  });
})
