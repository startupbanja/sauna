const pg = require('pg');
const fs = require('fs');

const params = {
  host: 'sauna-matchmaking-db.cltaj2ngk5e5.eu-central-1.rds.amazonaws.com',
  port: 5432,
  user: 'master',
  database: 'sauna_production',
};

function loadPassword() {
  fs.readFile('./db_password.txt', 'utf8', (err, data) => {
    const pwdString = data.split('\n')[0];
    params.password = pwdString;
  });
}

function getClient() {
  return pg.Client(params);
}

loadPassword();
