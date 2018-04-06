const pg = require('pg');
const bcrypt = require('bcrypt');
const readline = require('readline');
const params = require('../credentials/database_params.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function saveAdmin(username, pwInput) {
  const client = new pg.Client(params);
  const email = username;
  const password = bcrypt.hashSync(pwInput, 10);
  client.connect((connErr) => {
    if (connErr) throw connErr;
    const query = {
      text: 'INSERT INTO Users(type, email, password, active) VALUES ($1, $2, $3, $4) ON CONFLICT ON CONSTRAINT users_email_key DO UPDATE SET password=($3);',
      values: [0, email, password, 1],
    };
    client.query(query, (queryError, result) => {
      if (queryError) throw queryError;
      if (result.rowCount !== 1) return console.error('error creating user');
      console.log('Created succesfully');
      return client.end();
    });
  });
}

// function dummy(a, b) {
//   console.log(a, b);
// }

console.log('Create a new admin user or enter an existing username to change password.');
rl.question('New username: ', (username) => {
  rl.question('New password: ', (password) => {
    rl.muted = false;
    saveAdmin(username, password);
    rl.close();
  });
  rl.muted = true;
});

rl._writeToOutput = function _writeToOutput(str) {
  if (rl.muted && str.trim()) {
    rl.output.write('*');
  } else {
    rl.output.write(str);
  }
};
