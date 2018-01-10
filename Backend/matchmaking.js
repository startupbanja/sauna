const childProcess = require('child_process');


function runMatchmaking() {
  const filename = 'test.py';
  const jsonData = { feedbacks: [], availabilities: [] };
  const newProcess = childProcess.spawn('python', [filename]);
  newProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  newProcess.stdin.write(JSON.stringify(jsonData));
}

module.exports = {
  run: runMatchmaking,
};
