const childProcess = require('child_process');


function runMatchmaking() {
  const filename = './test.py';
  // console.log('asd');
  const jsonData = { feedbacks: [], availabilities: [] };
  const newProcess = childProcess.spawn('python', [filename]);
  // console.log('dsa')
  newProcess.stdout.on('data', (data) => {
    console.log(data.toString());
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
