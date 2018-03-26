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

// Returns JSON containing {name: {description: '', img_url: '', id: int}}
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

// Returns id, name and active status for all coaches and startups in form
// {
// coaches: [{name: '', id: int, active: true/false}]
// startups: [{name: '', id: int, active: true/false}]
// }
function getActiveStatuses(callback) {
  const client = getClient();
  const data = { coaches: [], startups: [] };
  const query = {
    name: 'get-activeStatuses',
    text: `
    SELECT user_id, name, type, active
    FROM Users
    LEFT OUTER JOIN Profiles ON Users.id = Profiles.user_id;`,
    values: [],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          res.rows.forEach((row) => {
            if (row.type === 1) {
              data.coaches.push({
                id: row.user_id,
                name: row.name,
                active: row.active,
              });
            } else if (row.type === 2) {
              data.startups.push({
                id: row.user_id,
                name: row.name,
                active: row.active,
              });
            }
          });
          callback(err2, data);
        }
        client.end();
      });
    }
  });
}

// Changes active of user
function setActiveStatus(id, active, callback) {
  const client = getClient();
  const query = {
    name: 'set-activeStatus',
    text: `
    UPDATE Users
    SET active = $1
    WHERE id = $2;`,
    values: [active, id],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2) => {
        if (err2) callback(err2);
        else {
          callback(err2, { status: 'success' });
        }
        client.end();
      });
    }
  });
}

// Returns JSON containing profile information based on id:
// {
// type: 'startup'/'coach',
// name: '',
// img_url: '',
// description: '',
// email: '',
// linkedin: '',
// credentials: [{company: '', position: ''}],
// }
function getProfile(id, callback) {
  const client = getClient();
  const info = {};
  const query = {
    name: 'get-profile',
    text: `
    SELECT name, img_url, description, email, website, CredentialsListEntries.title, CredentialsListEntries.content
    FROM Users
    LEFT OUTER JOIN Profiles ON Users.id = Profiles.user_id
    LEFT OUTER JOIN CredentialsListEntries ON Users.id = CredentialsListEntries.user_id
    WHERE Users.id = $1;`,
    values: [id],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          res.rows.forEach((row) => {
            if (info.name === undefined) {
              info.type = row.type === 1 ? 'coach' : 'startup';
              info.name = row.name;
              info.img_url = row.img_url;
              info.description = row.description;
              info.email = row.email;
              info.linkedIn = row.website;
              info.credentials = [{ company: row.title, position: row.content }];
            } else {
              info.credentials.push({ company: row.title, position: row.content });
            }
          });
          callback(err2, info);
        }
        client.end();
      });
    }
  });
}

// Returns an array of feedbacks:
// [{
// date: DATE,
// time: '',
// meetingid: int,
// user_id: int,
// name: '',
// description: '',
// rating: int,
// image_src: ''
// }]
function getFeedback(id, callback) {
  const client = getClient();
  const query = {
    name: 'get-feedback',
    text: `
      SELECT date, time, id AS meetingId, user_id, name, description, rating, img_url AS image_src
      FROM
        (SELECT date, time, id,
            CASE
              WHEN coach_id = $1 THEN startup_id
              WHEN startup_id = $1 THEN coach_id
            END user_id,
            CASE
              WHEN coach_id = $1 THEN coach_rating
              WHEN startup_id = $1 THEN startup_rating
            END rating
          FROM Meetings
          WHERE (coach_id = $1 OR startup_id = $1) AND date =
            (SELECT MAX(date) FROM Meetings WHERE (coach_id = $1 OR startup_id = $1) AND date < current_date))
          AS Subquery
        NATURAL JOIN Profiles;`,
    values: [id],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          callback(err2, res.rows);
        }
        client.end();
      });
    }
  });
}

// Sets feedback for a meeting and between a coach and a startup
function giveFeedback(meetingId, rating, field, callback) {
  // Sets the given rating into the meetings table
  function setMeetingRating(callback2) {
    const client = getClient();
    const query = {
      name: 'set-meetingRating',
      text: `
      UPDATE Meetings
      SET ${field} = $1
      WHERE id = $2;`,
      values: [rating, meetingId],
    };
    client.connect((err) => {
      if (err) callback(err);
      else {
        client.query(query, (err2) => {
          if (err2) callback(err2);
          else {
            callback2();
          }
          client.end();
        });
      }
    });
  }

  // Gets the IDs of the coach and startup
  function getIDs(callback2) {
    const client = getClient();
    const query = {
      name: 'get-IDs',
      text: `
      SELECT startup_id, coach_id
      FROM Meetings
      WHERE id = $1;`,
      values: [meetingId],
    };
    client.connect((err) => {
      if (err) callback(err);
      else {
        client.query(query, (err2, res) => {
          if (err2) callback(err2);
          else {
            callback2([res.rows[0].startup_id, res.rows[0].coach_id]);
          }
          client.end();
        });
      }
    });
  }

  // Creates a row into the ratings table if it doesn't exist
  function insertRating(startupID, coachID, callback2) {
    const client = getClient();
    const query = {
      name: 'insert-rating',
      text: `
      INSERT INTO Ratings (coach_id, startup_id, coach_rating, startup_rating)
      SELECT $1, $2, -1, -1
      WHERE NOT EXISTS (SELECT * FROM Ratings WHERE coach_id = $1 AND startup_id = $2);`,
      values: [coachID, startupID],
    };
    client.connect((err) => {
      if (err) callback(err);
      else {
        client.query(query, (err2) => {
          if (err2) callback(err2);
          else {
            callback2();
          }
          client.end();
        });
      }
    });
  }

  // Sets the given value into ratings table
  function updateRating(startupID, coachID, callback2) {
    const client = getClient();
    const query = {
      name: 'update-rating',
      text: `
      UPDATE Ratings
      SET ${field} = $1
      WHERE coach_id = $2 AND startup_id = $3;`,
      values: [rating, coachID, startupID],
    };
    client.connect((err) => {
      if (err) callback(err);
      else {
        client.query(query, (err2) => {
          if (err2) callback(err2);
          else {
            callback2();
          }
          client.end();
        });
      }
    });
  }

  // Calls the functions in the right order
  setMeetingRating(() => {
    getIDs(([startupID, coachID]) => {
      insertRating(startupID, coachID, () => {
        updateRating(startupID, coachID, () => {
          callback(null, { status: 'success' });
        });
      });
    });
  });
}

module.exports = {
  getUsers,
  getActiveStatuses,
  setActiveStatus,
  getProfile,
  getFeedback,
  giveFeedback,
};
