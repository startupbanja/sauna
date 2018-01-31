const childProcess = require('child_process');

/*
Run the matchmaking python script
Parameter jsonData should be in an object with the following format:
{
  feedbacks: [{'startupid', 'startupfeedback', 'coachid', 'coachfeedback'}, {...}]
  availabilities: {coachid: {'starttime', 'duration'}, ...}
  startups: [startupid, ...]
}
Calls the callback function when ready with the resulting data,
which is an array following format:
[{'coach', 'startup', 'time', 'duration'}, {...} ]
*/
function runMatchmaking(jsonData, callback) {
  const filename = './run_matchmaking.py';
  const newProcess = childProcess.spawn('python3', [filename]);
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
