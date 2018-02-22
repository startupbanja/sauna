const express = require('express');
const readline = require('readline');
const bodyParser = require('body-parser');
const database = require('./database.js');
const bcrypt = require('bcrypt');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const matchmaking = require('./matchmaking.js');


const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  cookie: {
    domain: '127.0.0.1',
  },
  secret: '12saUna45',
  name: 'ssauna.sid',
  resave: true,
  saveUninitialized: true,
  store: new FileStore(),
  // TODO set store to some PostgreSQL session storage https://github.com/expressjs/session
}));

const port = process.env.PORT || 3000;


app.use((req, res, next) => {
  console.log('Something is happening.');

  // Allow frontend to send cookies
  res.append('Access-Control-Allow-Origin', req.get('origin'));
  res.append('Access-Control-Allow-Credentials', 'true');

  if (!req.session.userID && req.path !== '/login') {
    res.sendStatus(401);
    return;
  }

  next();
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/api', (req, res) => {
  if (req.query.hasOwnProperty('q')) {
    res.json({ message: req.query.q });
  } else {
    database.getUsers(1, 0, false, (data) => {
      res.json(data);
    });
  }
});

function runAlgorithm(callback) {
  database.getTimeslots((timeslots) => {
    database.getRatings((ratings) => {
      database.getStartups((startupdata) => {
        const data = {
          feedbacks: ratings,
          availabilities: timeslots,
          startups: startupdata,
        };
        const batch = 1
        database.getMapping(batch, (mapping) => {
          const dataWithMapping = { data, mapping };
          matchmaking.run(dataWithMapping, rdy => callback(rdy));
        })
      });
    });
  });
}

app.get('/timeslots', (req, res) => {
  runAlgorithm(result => res.json({ schedule: result }));
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // bcrypt.hash(password, 10, (err, hash) => console.log(hash));
  database.verifyIdentity(username, password, (type, userId) => {
    if (userId !== false) {
      req.session.userID = userId;
      req.session.userType = type;
    }
    res.json({ status: (type === 'coach' || type === 'startup') ? 'user' : type });
  });
});

app.get('/users', (req, res) => {
  let type = req.query.type;
  const batch = 1;
  if (type === 'Startups') type = 2;
  else type = 1;

  database.getUsers(type, batch, true, (userList) => {
    const userArray = [];
    for (const user in userList) {
      const userData = userList[user];
      const userObj = {
        id: userData.id,
        name: user,
        description: userData.description,
        img: '../app/imgs/coach_placeholder.png',
      };
      userArray.push(userObj);
    }
    res.json({ users: userArray });
  });
});

app.get('/profile', (req, res) => {
  let id;
  if (typeof req.query.userId !== 'undefined') id = req.query.userId;
  else id = req.session.userID;

  database.getProfile(id, (result) => {
    if (req.session.userID == id || req.session.userID === 82) {
      Object.assign(result, { canModify: true });
    }
    res.json(result);
  });
});

// TODO coach names
app.get('/meetings', (req, res) => {
  const allMeetings = [];
  database.getUserMap((keys) => {
    database.getTimetable((meetings) => {
      database.getTimeslots((timeslots) => {
        const dur = meetings[0].duration;
        for (const timeslot in timeslots) { // eslint-disable-line
          const id = timeslot;
          var remaining = timeslots[id].duration;
          const time = new Date('2000-01-01T' + timeslots[id].starttime);
          while (remaining > 0) {
            allMeetings.push({
              coach: id.toString(),
              startup: null,
              time: ('0' + (time.getHours())).slice(-2) + ':' + ('0' + time.getMinutes()).slice(-2) + ':' + ('0' + time.getSeconds()).slice(-2),
              duration: dur,
            });
            time.setMinutes(time.getMinutes() + dur);
            remaining -= dur;
          }
        }
        for (var meeting in meetings) { //eslint-disable-line
          meeting = meetings[meeting];
          const index = allMeetings.findIndex(element => (element.coach === meeting.coach && element.time === meeting.time));
          if (index !== -1) {
            allMeetings[index] = {
              coach: meeting.coach,
              startup: meeting.startup,
              time: meeting.time,
              duration: meeting.duration,
            };
          }
        }
        for (var meeting in allMeetings) {
          allMeetings[meeting].coach = keys[allMeetings[meeting].coach];
        }
        res.json({ schedule: allMeetings });
      });
    });
  });
});

app.get('/feedback', (req, res) => {
  const id = req.session.userID;
  database.getFeedback(id, (result) => {
    res.json({
      data: result,
      userType: req.session.userType,
    });
  });
});

app.post('/giveFeedback', (req, res) => {
  const userType = req.session.userType;
  const meetingId = req.body.meetingId;
  const rating = req.body.rating;

  database.giveFeedback(meetingId, rating, (userType === 'coach') ? 'coach_rating' : 'startup_rating', (result) => {
    res.json({ status: result });
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
  switch (input) {
    case ('exit'):
      closeServer();
      break;
    case ('run'):
      runAlgorithm(() => null);
      break;
    case ('run -s'):
      runAlgorithm((data) => { // TODO placeholder date
        database.saveMatchmaking(data, '2018-01-01', () => console.log('saved'));
      });
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
