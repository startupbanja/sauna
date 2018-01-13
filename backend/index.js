const express = require('express');
const readline = require('readline');
const bodyParser = require('body-parser');
const database = require('./database.js');
const bcrypt = require('bcrypt');

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

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
    // database.testApi((data) => {
    //   res.json(data);
    // });
  }
});

// app.get('/api', function(req, res) {
//     res.json({ message: req.query.q });
// });

app.post('/login', (req, res) => {
  const username = req.body.username;
  let password = req.body.password;

  res.append('Access-Control-Allow-Origin', ['*']);

  // bcrypt.hash(password, 10, (err, hash) => console.log(hash));
  database.verifyIdentity(username, password, (type) => {
    res.json({ status: type });
  });
});

app.get('/users', (req, res) => {
  let type = req.query.type;
  const batch = 1;
  if (type === 'Startups') type = 2;
  else type = 1;

  res.append('Access-Control-Allow-Origin', ['*']);

  database.getUsers(type, batch, (userList) => {
    const userArray = [];
    for (const user in userList) {
      const userData = userList[user];
      const userObj = { 
        name: user,
        description: userData.description,
        img: '../app/imgs/coach_placeholder.png',
      };
      userArray.push(userObj);
    }
    res.json({ users: userArray });
  });
});

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
  if (input === 'exit') {
    closeServer();
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
