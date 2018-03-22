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
    if (err) console.error(err);
    const pwdString = data.split('\n')[0];
    params.password = pwdString;
  });
}

loadPassword();

function getClient() {
  return new pg.Client(params);
}

function getUsers(type, includeId, callback) {
  const client = getClient();
  const users = {};
  const query = {
    name: 'get-users',
    text: `
    SELECT id, name, description, img_url
    FROM Users
    LEFT OUTER JOIN Profiles ON Profiles.user_id = Users.id
    WHERE type = $1 AND active = TRUE;`,
    values: [type],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          res.rows.forEach((row) => {
            users[row.name] = {
              description: row.description,
              img_url: row.img_url,
            };
            if (includeId) users[row.name].id = row.user_id;
          });
          callback(err2, users);
        }
        client.end();
      });
    }
  });
}
