const childProcess = require('child_process');

/*
Run the matchmaking python script
Parameter parameters should be in an object with the following format:
{
  feedbacks: [{'startupid', 'startupfeedback', 'coachid', 'coachfeedback'}, {...}]
  availabilities: {coachid: {'starttime', 'duration'}, ...}
  startups: [startupid, ...]
}
Calls the callback function when ready with the resulting data,
which is an array following format:
[{'coach', 'startup', 'time', 'duration'}, {...} ]
*/
function runMatchmaking(paramData, slotSize, callback) {
  const filename = './run_matchmaking.py';
  const newProcess = childProcess.spawn('python3', [filename]);
  let storage = [];
  newProcess.stdout.on('data', (data) => {
    storage += data;
  });
  newProcess.stdout.on('end', () => {
    try {
      const parsed = JSON.parse(storage.toString());
      callback(null, parsed);
    } catch (e) {
      callback(e);
    }
  });
  newProcess.stderr.on('data', (errorMsg) => {
    callback({ error: `Python error: ${errorMsg}` });
  });
  newProcess.stdin.write(JSON.stringify({ data: paramData, slotSize }));
  newProcess.stdin.end();
}

module.exports = {
  run: runMatchmaking,
};
