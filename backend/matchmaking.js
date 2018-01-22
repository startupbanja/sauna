const childProcess = require('child_process');


function runMatchmaking(jsonData, callback) {
  const filename = './run_matchmaking.py';
  const newProcess = childProcess.spawn('python', [filename]);
  let storage = [];
  newProcess.stdout.on('data', (data) => {
    storage += data;
    // console.log(data.toString());
  });
  newProcess.stdout.on('end', () => {
    const parsed = JSON.parse(storage.toString());
    callback(parsed);
  });
  newProcess.stderr.on('data', (data) => {
    console.log(data.toString());
  });
  // console.log('aa');
  newProcess.stdin.write(JSON.stringify(jsonData));
  newProcess.stdin.end();
}

module.exports = {
  run: runMatchmaking,
};
