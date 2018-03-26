const { Client } = require('pg');
const connectionParams = require('./database_params.json');


// load parameters from environment variables
function getClient() {
  return new Client(connectionParams);
}

function query(queryString, params, callback) {
  const client = getClient();
  // TODO this might cause multiple calls to callback?
  client.on('error', (err) => {
    callback(err);
  });
  client.connect((connectionError) => {
    if (connectionError) return callback(connectionError);
    return client.query(queryString, params, (queryErr, result) => {
      if (queryErr) return callback(queryErr);
      callback(null, result);
      return client.end(() => undefined);
    });
  });
}

function serialize(cb) {
  cb();
}

function close(cb) {
  cb();
}

function run(queryString, params, callback) {
  query(queryString, params, err => callback(err));
}

function each(queryString, params, rowCallback, onComplete) {
  query(queryString, params, (err, result) => {
    if (err) return onComplete(err);
    return result.forEach((row) => {
      rowCallback(null, row);
    });
  });
}

function all(queryString, params, callback) {
  query(queryString, params, callback);
}

function get(queryString, params, callback) {
  query(queryString, params, callback);
}


module.exports = {
  run,
  each,
  all,
  get,
  serialize,
  close,
};
