const childProcess = require('child_process');


function runMatchmaking() {
  const filename = 'test.py';
  const newProcess = childProcess.spawn('python', [filename]);
  newProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });
}

module.exports = {
  run: runMatchmaking,
};
