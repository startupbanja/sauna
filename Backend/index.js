var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
const database = require('./database.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

app.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/index.html");
});

app.get('/api', (req, res) => {
  if (req.query.hasOwnProperty("q")) {
    res.json({ message: req.query.q });
  } else {
    database.getUsers(1, 0, (data) => {
      res.json(data);
    });
  }
});

// app.get('/api', function(req, res) {
//     res.json({ message: req.query.q });
// });

const server = app.listen(port);
console.log('Magic happens on port ' + port);

function closeServer() {
  database.closeDatabase(() => {
    server.close(() => {
      console.log('HTTP Server closed.\nExiting...');
      process.exit();
    });
  });
}


// Should make process interrupting work on windows.. not tested
// requires a module "readline", not installed yet
// if (process.platform === 'win32') {
//   require('readline')
//     .createInterface({
//       input: process.stdin,
//       output: process.stdout
//     })
//     .on('SIGINT', function () {
//       process.emit('SIGINT');
//     });
// }


// Catch interrupt signal(CTRL+C)
// process is a node global variable
process.on('SIGINT', () => {
  console.log('\nCaught interrupt signal');
  closeServer();
});
