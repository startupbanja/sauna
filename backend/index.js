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

  // Allow frontend to send cookies
  res.append('Access-Control-Allow-Origin', req.get('origin'));
  res.append('Access-Control-Allow-Credentials', 'true');

  // if user has not logged in, returns not authorized and ends the request
  if (!req.session.userID && req.path !== '/login') {
    res.sendStatus(401);
    return;
  }

  next();
});

// logs user in and sets for session:
// userID = user's personal id and type = one of 'coach', 'startup', 'admin'
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

// Use when admin is required to allow access
function requireAdmin(req, res) {
  if (req.session.userType !== 'admin') {
    res.sendStatus(401);
    res.end();
    return false;
  }
  return true;
}

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/api', (req, res, next) => {
  if (req.query.hasOwnProperty('q')) {
    res.json({ message: req.query.q });
  } else {
    database.getUsers(1, 0, false, (err, data) => {
      if (err) return next(err);
      res.json(data);
      return undefined;
    });
  }
});


/* gets the initial data from all the coaches or startups */
app.get('/users', (req, res, next) => {
  let type = req.query.type;
  const batch = 1;
  if (type === 'Startups') type = 2;
  else type = 1;

  database.getUsers(type, batch, true, (err, userList) => {
    if (err) return next(err);
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
    return undefined;
  });
});

/* gets a profile data for a defined user or
  for the requesting user if no requested id is provided */
app.get('/profile', (req, res, next) => {
  let id;
  if (typeof req.query.userId !== 'undefined') id = req.query.userId;
  else id = req.session.userID;

  database.getProfile(id, (err, result) => {
    if (err) return next(err);
    if (req.session.userID === id || req.session.userID === 82) {
      Object.assign(result, { canModify: true });
    }
    res.json(result);
    return undefined;
  });
});

// Returns id, name and active status for all coaches and startups in form
// {
// coaches: [{name, id, active}]
// startups: [{name, id, active}]
// }
app.get('/activeStatuses', (req, res, next) => {
  database.getActiveStatuses((err, data) => {
    if (err) return next(err);
    return res.json(data);
  });
});


app.get('/timetable', (req, res, next) => {
  const allMeetings = [];
  database.getUserMap((err, keys) => {
    if (err) return next(err);
    database.getTimetable(req.query.date, (err2, meetings) => {
      if (err2) return next(err2);
      // if meetings not found, return empty response
      if (meetings.length === 0) {
        return res.json({ schedule: null });
      }
      database.getTimeslots(req.query.date, (err3, timeslots) => {
        if (err3) return next(err3);
        const dur = meetings[0].duration;
        for (const timeslot in timeslots) { // eslint-disable-line
          const id = timeslot;
          let remaining = timeslots[id].duration;
          const time = new Date('2000-10-10T' + timeslots[id].starttime);
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
        for (var i in meetings) { //eslint-disable-line
          const meeting = meetings[i];
          const index = allMeetings.findIndex(element => (element.coach === meeting.coach && element.time === meeting.time));
          if (index !== -1) {
            allMeetings[index] = {
              coach: meeting.coach,
              startup: meeting.startup,
              time: meeting.time,
              duration: meeting.duration,
            };
          } else {
            allMeetings.push({
              coach: meeting.coach,
              startup: meeting.startup,
              time: meeting.time,
              duration: meeting.duration,
            });
          }
        }
        for (var meeting in allMeetings) {
          allMeetings[meeting].coach = keys[allMeetings[meeting].coach];
        }
        res.json({ schedule: allMeetings });
        return undefined;
      });
      return undefined;
    });
    return undefined;
  });
});

app.post('/timetable', (req, res, next) => {
  const schedule = JSON.parse(req.body.schedule);
  database.updateTimetable(schedule, req.body.date, (err) => {
    if (err) return next(err);
    return undefined;
  });
});

app.get('/comingTimeslots', (req, res, next) => {
  const timeslots = {};
  // Result is in form [{name:"coachname",date:"dateString",time:"timestring",duration:null}]
  database.getComingTimeslots((err, result) => {
    if (err) return next(err);
    for (const index in result) { //eslint-disable-line
      const element = result[index];
      if (timeslots[element.date] === undefined) {
        timeslots[element.date] = {};
      }
      if (element.duration === null) {
        timeslots[element.date][element.name] = null;
      } else {
        const time = new Date('2000-01-01T' + element.time);
        time.setMinutes(time.getMinutes() + element.duration);
        timeslots[element.date][element.name] = element.time + '-' + ('0' + (time.getHours())).slice(-2) + ':' + ('0' + time.getMinutes()).slice(-2) + ':' + ('0' + time.getSeconds()).slice(-2);
      }
    }
    res.json(timeslots);
    return undefined;
  });
});

app.get('/numberOfTimeslots', (req, res, next) => {
  const timeslots = {};
  // Result is in form [{name:"coachname",date:"dateString",time:"timestring",duration:null}]
  database.getComingTimeslots((err, result) => {
    if (err) return next(err);
    for (const index in result) { //eslint-disable-line
      const element = result[index];
      if (timeslots[element.date] === undefined) {
        timeslots[element.date] = { total: 0, done: 0 };
      }
      if (element.duration !== null) {
        timeslots[element.date].done += 1;
      }
      timeslots[element.date].total += 1;
    }
    res.json(timeslots);
    return undefined;
  });
});

app.get('/givenFeedbacks/', (req, res, next) => {
  const givenFeedbacks = {
    startups: {},
    coaches: {},
    startupTotal: 0,
    startupDone: 0,
    coachTotal: 0,
    coachDone: 0,
    date: '',
  };
  // Result is in form
  // [{type: type, name: name, startup_rating: rating, coach_rating: rating, date}]
  // Type 1 => Coach, Type 2 => Startup
  // filter out feedbacks which are -1 which means not given
  database.getGivenFeedbacks((err, fbresult) => {
    if (err) return next(err);
    const { result } = fbresult;
    givenFeedbacks.date = fbresult.date;
    for (const index in result) { //eslint-disable-line
      const element = result[index];
      if (element.type === 1) {
        if (element.coach_rating !== -1) {
          givenFeedbacks.coaches[element.name] = true;
        } else if (givenFeedbacks.coaches[element.name] === undefined) {
          givenFeedbacks.coaches[element.name] = false;
        }
      } else if (element.startup_rating !== -1) {
        givenFeedbacks.startups[element.name] = true;
      } else if (givenFeedbacks.startups[element.name] === undefined) {
        givenFeedbacks.startups[element.name] = false;
      }
    }
    for (const index in givenFeedbacks.startups) {//eslint-disable-line
      givenFeedbacks.startupTotal += 1;
      if (givenFeedbacks.startups[index] === true) givenFeedbacks.startupDone += 1;
    }
    for (const index in givenFeedbacks.coaches) {//eslint-disable-line
      givenFeedbacks.coachTotal += 1;
      if (givenFeedbacks.coaches[index] === true) givenFeedbacks.coachDone += 1;
    }
    res.json(givenFeedbacks);
    return undefined;
  });
});

/* gets the pending feedbacks from last meeting for a specific user */
app.get('/feedback', (req, res, next) => {
  const id = req.session.userID;
  database.getFeedback(id, (err, result) => {
    if (err) return next(err);
    res.json({
      data: result,
      userType: req.session.userType,
    });
    return undefined;
  });
});

/* sets either coach_rating or startup_rating for a specific meeting */
app.post('/giveFeedback', (req, res, next) => {
  const userType = req.session.userType;
  const meetingId = req.body.meetingId;
  const rating = req.body.rating;

  database.giveFeedback(meetingId, rating, (userType === 'coach') ? 'coach_rating' : 'startup_rating', (err, result) => {
    if (err) return next(err);
    res.json({ status: result });
    return undefined;
  });
});

app.post('/setActiveStatus', (req, res, next) => {
  const id = req.body.id;
  const active = req.body.active;
  database.setActiveStatus(id, active, (err, result) => {
    if (err) return next(err);
    return res.json(result);
  });
});

/* adds a new meeting day */
app.post('/createMeetingDay', (req, res, next) => {
  if (!requireAdmin(req, res)) return;
  const date = req.body.date;
  const start = req.body.start;
  const end = req.body.end;
  const split = req.body.split;
  database.createMeetingDay(date, start, end, split, (err, result) => {
    if (err) return next(err);
    res.json(result);
    return undefined;
  });
});

// Run algorithm with given date and save to database and create a .csv file
// TODO these errors are a bit confusing... is this right?
// FIXME those return undefineds and the bracket pyramid...
// callback is called with either err or null as only argument
function runAlgorithm(date, callback, commit = true) {
  // Get coach timeslots/availabilities
  database.getTimeslots(date, (err, timeslots) => {
    if (err) return callback(err);
    // Get most recent feedback ratings from all coaches, startups
    database.getRatings((err2, ratings) => {
      if (err2) return callback(err2);
      // Get list of all startups
      database.getStartups((err3, startupdata) => {
        if (err3) return callback(err3);
        const data = {
          feedbacks: ratings,
          availabilities: timeslots,
          startups: startupdata,
        };
        if (!(ratings && timeslots && startupdata)) {
          callback(false);
        }
        const batch = 1;
        // This getMapping is only needed because we are converting the result
        // to .csv in python, TODO remove later
        database.getMapping(batch, (mapErr, mapping) => {
          if (mapErr) return callback(mapErr);
          console.log(mapping);
          const dataWithMapping = { data, mapping };
          matchmaking.run(dataWithMapping, (runErr, result) => {
            if (runErr) return callback(runErr);
            if (commit) {
              database.saveMatchmakingResult(result, date, (saveErr) => {
                if (saveErr) return callback(saveErr);
                return callback(null);
              });
              return undefined;
            }
            return callback(null);
          });
          return undefined;
        });
        return undefined;
      });
      return undefined;
    });
    return undefined;
  });
}

// TODO sanitize date;
app.post('/runMatchmaking', (req, res) => {
  if (req.body.date) {
    runAlgorithm(req.body.date, result => res.json({ success: result }));
  } else {
    res.json({ success: false });
  }
});
/* gets the still to come meeting days with given availabilities for a specific user */
app.get('/getComingMeetingDays', (req, res, next) => {
  database.getComingMeetingDays(req.session.userID, (err, result) => {
    if (err) return next(err);
    res.json(result);
    return undefined;
  });
});

/* Sets the users availability for a specific day */
app.post('/insertAvailability', (req, res, next) => {
  const userId = req.session.userID;
  const date = req.body.date;
  const startTime = req.body.start;
  let duration = (new Date(`${date}T${req.body.end}`).getTime() - new Date(`${date}T${startTime}`).getTime());
  duration = parseInt(duration / 60000, 10);
  database.insertAvailability(userId, date, startTime, duration, (err, result) => {
    if (err) return next(err);
    res.json(result);
    return undefined;
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'An error has occured!' });
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
