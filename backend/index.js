const express = require('express');
const readline = require('readline');
const bodyParser = require('body-parser');
const database = require('./database.js');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: '12saUna45',
  resave: false,
  saveUninitialized: true,
  // TODO set store to some PostgreSQL session storage
}));

const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log('Something is happening.');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/api', (req, res) => {
  if (req.query.hasOwnProperty('q')) {
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
  const password = req.body.password;

  res.append('Access-Control-Allow-Origin', ['*']);

  // bcrypt.hash(password, 10, (err, hash) => console.log(hash));
  database.verifyIdentity(username, password, (type, userId) => {
    if (userId !== false) req.session.userId = userId;
    res.json({ status: type });
  });
});


const server = app.listen(port);
console.log(`Magic happens on port ${port}`);

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
