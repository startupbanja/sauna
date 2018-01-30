const express = require('express');
const readline = require('readline');
const bodyParser = require('body-parser');
const database = require('./database.js');
const matchmaking = require('./matchmaking.js');

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
});

app.get('/', (req, res) => {  res.sendFile(__dirname+"/index.html");
});

app.get('/api', (req, res) => {
  if (req.query.hasOwnProperty("q")) {
    res.json({ message: req.query.q });
  } else {
    database.getUsers(1, 0, (data) => {
      res.json(data);
    });
    // database.testApi((data) => {
    //   res.json(data);
    // });
  }
});

function runAlgorithm(callback, commit = false) {
  database.getTimeslots((timeslots) => {
    database.getRatings((ratings) => {
      database.getStartups((startupdata) => {
        const data = {
          feedbacks: ratings,
          availabilities: timeslots,
          startups: startupdata,
        };
        matchmaking.run(data, rdy => callback(rdy));
      });
    });
  });
}

//  muuta callback muotoon
app.get('/timeslots', (req, res) => {
  runAlgorithm(result => res.json(result));
  // database.getTimeslots((timeslots) => {
  //   database.getRatings((ratings) => {
  //     const data = {
  //       feedbacks: ratings,
  //       availabilities: timeslots,
  //     };
  //     matchmaking.run(data, rdy => res.json(rdy));
  //   });
  // });
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


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (input) => {
  switch (input) {
    case ('exit'):
      closeServer();
      break;
    case ('run'):
      runAlgorithm(() => null);
      break;
    default:
      break;
  }
});

// make SIGINT work on both windows and linux with the readline module
rl.on('SIGINT', () => {
  process.emit('SIGINT');
});

// Catch interrupt signal(CTRL+C)
// process is a node global variable
process.on('SIGINT', () => {
  console.log('\nCaught interrupt signal');
  closeServer();
});
