const express = require('express');
const readline = require('readline');
const bodyParser = require('body-parser');
const database = require('./database.js');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const matchmaking = require('./matchmaking.js');
const fs = require('fs');


const app = express();

database.createDatabase((err) => {
  if (err) throw err;
  database.initDB((err2) => {
    if (err2) throw err2;
    console.log('Data loaded');
  });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  cookie: {
    domain: '',
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
app.post('/login', (req, res, next) => {
  let username;
  try {
    // will throw exception if username is not a string
    username = req.body.username.toLowerCase();
  } catch (error) {
    return next(error);
  }
  const { password } = req.body;
  // bcrypt.hash(password, 10, (err, hash) => console.log(hash));
  return database.verifyIdentity(username, password, (type, userId) => {
    if (userId !== false) {
      req.session.userID = userId;
      req.session.userType = type;
    }
    res.json({ status: type });
  });
});


app.post('/changeEmail', (req, res, next) => {
  const userType = req.body.type;
  userType.replace(userType[0], userType[0].toUpperCase());
  let email;
  try {
    email = req.body.email.toLowerCase();
  } catch (error) {
    return next(error);
  }
  database.changeEmail(req.body.uid, userType, email, (err, response) => {
    if (err) {
      return next(err);
    }
    return res.json(response);
  });
});


// DEFAULT PASSWORD TO USE FOR ADMIN-INITIATED RESET.
const defaultPassword = 'abc123';

/**
 * Handles the requests to change password.
 */
app.post('/changePassword', (req, res, next) => {
  // If the initiating user is admin.
  if (req.session.userType === 'admin') {
    database.changePasswordAdmin(req.body.uid, defaultPassword, (err, result) => {
      if (!err) {
        res.json(result);
      } else {
        return next(err);
      }
    });
  } else {
    // If the initiating user is NOT admin.
    const JSONObject = JSON.parse(req.body.data);
    const currentPassword = JSONObject.currentPassword;
    const newPassword = JSONObject.newPassword;
    const repeatedPassword = JSONObject.repeatedPassword;

    if (newPassword === repeatedPassword) {
      database.changePassword(
        req.session.userID,
        currentPassword,
        newPassword,
        (err, response) => {
          if (!err) {
            res.json(response);
          } else return next(err);
        }
      );
    } else {
      res.json({
        status: 'ERROR',
        message: 'The new passwords did not match!',
      });
    }
  }
});

// Use when admin is required to allow access
function requireAdmin(req, res) {
  if (req.session.userType !== 'admin') {
    res.sendStatus(403);
    res.end();
    return false;
  }
  return true;
}

function isDate(string) {
  return !Number.isNaN(Date.parse(string));
}


/* gets the initial data from all the coaches or startups */
app.get('/users', (req, res, next) => {
  let { type } = req.query;
  if (type === 'Startups') type = 2;
  else type = 1;

  database.getUsers(type, true, (err, userList) => {
    if (err) return next(err);
    const userArray = [];
    for (const user in userList) {
      const userData = userList[user];
      const userObj = {
        id: userData.id,
        name: user,
        description: userData.description,
        img: userData.img_url,
      };
      userArray.push(userObj);
    }
    res.json({ users: userArray });
    return undefined;
  });
});

app.post('/create_user', (req, res, next) => {
  // Only admins can do this.
  if (requireAdmin(req, res)) {
    const userInfo = req.body;
    try {
      userInfo.email = userInfo.email.toLowerCase();
    } catch (error) {
      return next(error);
    }

    database.addUser(userInfo, (err, resp) => {
      if (!err) {
        return res.json(resp);
      }
      return next(err);
    });
  }
});


/* gets a profile data for a defined user or
  for the requesting user if no requested id is provided
  returns 404 on invalid query param id
  */
app.get('/profile', (req, res, next) => {
  let id;
  if (typeof req.query.userId !== 'undefined') id = req.query.userId;
  else id = req.session.userID;
  // make sure id is a number, which means it is possibly a valid id
  id = parseInt(id, 10);
  if (Number.isNaN(id)) {
    return res.sendStatus(400);
  }
  return database.getProfile(id, (err, result) => {
    if (err) return next(err);

    if (result === undefined) return res.sendStatus(400);
    // set canModify flag if user is admin or viewing own profile
    if (req.session.userID === id || req.session.userType === 'admin') {
      if (req.session.userType === 'admin') {
        Object.assign(result, { canResetPW: true });
      } else {
        Object.assign(result, { canResetPW: false });
      }
      Object.assign(result, { canModify: true });
    }
    return res.json(result);
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
  if (!isDate(req.query.date)) return res.sendStatus(400);
  const allMeetings = [];
  return database.getUserMap((err, keys) => {
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
          // fill all available slots with startup: null to get availability info to frontend
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
          const index = allMeetings.findIndex(element => (
            element.coach === meeting.coach && element.time === meeting.time));

          if (index !== -1) { // already exists..
            if (allMeetings[index].startup !== null) { // we have a split, add new
              allMeetings.push({
                coach: meeting.coach,
                startup: meeting.startup,
                time: meeting.time,
                duration: meeting.duration,
              });
            } else { // no split, just replace the startup: null
              allMeetings[index] = {
                coach: meeting.coach,
                startup: meeting.startup,
                time: meeting.time,
                duration: meeting.duration,
              };
            }
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
  if (!requireAdmin(req, res)) return undefined;
  const schedule = JSON.parse(req.body.schedule);
  if (!schedule) return res.status(404);
  database.updateTimetable(schedule, req.body.date, (err) => {
    if (err) {
      next(err);
      return res.json({ success: false });
    }
    return res.json({ success: true });
  });
});

app.get('/comingTimeslots', (req, res, next) => {
  const timeslots = {};
  // Result is in form {date: {name: [time/null, email]}
  database.getComingTimeslots((err, result) => {
    if (err) return next(err);
    for (const index in result) { //eslint-disable-line
      const element = result[index];
      if (timeslots[element.date] === undefined) {
        timeslots[element.date] = {};
      }
      if (element.duration === null) {
        timeslots[element.date][element.name] = [null, element.email];
      } else {
        const time = new Date('2000-01-01T' + element.time);
        time.setMinutes(time.getMinutes() + element.duration);
        timeslots[element.date][element.name] = [element.time + '-' + ('0' + (time.getHours())).slice(-2) + ':' + ('0' + time.getMinutes()).slice(-2) + ':' + ('0' + time.getSeconds()).slice(-2), null];
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
    missingCoachEmails: {},
    missingStartupEmails: {},
  };
  // Result is in form
  // [{type: type, name: name, email, startup_rating: rating, coach_rating: rating, date}]
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
          givenFeedbacks.missingCoachEmails[element.email] = false;
        } else if (givenFeedbacks.coaches[element.name] === undefined) {
          givenFeedbacks.coaches[element.name] = false;
          if (givenFeedbacks.missingCoachEmails[element.email] === undefined) {
            givenFeedbacks.missingCoachEmails[element.email] = true;
          }
        }
      } else if (element.startup_rating !== -1) {
        givenFeedbacks.startups[element.name] = true;
        givenFeedbacks.missingStartupEmails[element.email] = false;
      } else if (givenFeedbacks.startups[element.name] === undefined) {
        givenFeedbacks.startups[element.name] = false;
        if (givenFeedbacks.missingStartupEmails[element.email] === undefined) {
          givenFeedbacks.missingStartupEmails[element.email] = true;
        }
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

app.get('/userMeetings', (req, res, next) => {
  let meetingDate;
  const id = req.session.userID;
  const type = req.session.userType;
  database.getUserMeetings(id, type, (err, result) => {
    if (err) return next(err);
    const meetingArray = [];
    for (var row in result) { // eslint-disable-line
      row = result[row];
      meetingDate = row.date;
      const end = new Date('2000-01-01T' + row.time);
      end.setMinutes(end.getMinutes() + row.duration);
      meetingArray.push({
        name: row.name,
        startTime: row.time,
        endTime: ('0' + (end.getHours())).slice(-2) + ':' + ('0' + end.getMinutes()).slice(-2) + ':' + ('0' + end.getSeconds()).slice(-2),
        image: row.image_src,
      });
    }
    meetingArray.sort((a, b) => new Date('2000-01-01T' + a.startTime) - new Date('2000-01-01T' + b.startTime));
    res.json({
      date: meetingDate,
      meetings: meetingArray,
    });
    return undefined;
  });
});

/* sets either coach_rating or startup_rating for a specific meeting */
app.post('/giveFeedback', (req, res, next) => {
  const userType = req.session.userType;
  const meetingId = req.body.meetingId;
  const rating = req.body.rating;
  // TODO we are not checking if user is one of the attendants of the meeting
  database.giveFeedback(meetingId, rating, (userType === 'coach') ? 'coach_rating' : 'startup_rating', (err, result) => {
    if (err) return next(err);
    res.json({ status: result });
    return undefined;
  });
});

app.post('/setActiveStatus', (req, res, next) => {
  if (requireAdmin(req, res)) {
    const { id, active } = req.body;
    database.setActiveStatus(id, active, (err, result) => {
      if (err) return next(err);
      return res.json(result);
    });
  }
});

/* adds a new meeting day */
app.post('/createMeetingDay', (req, res, next) => {
  if (!requireAdmin(req, res)) return undefined;
  const date = req.body.date;
  const start = req.body.start;
  const end = req.body.end;
  const split = req.body.split;
  return database.createMeetingDay(date, start, end, split, (err, result) => {
    if (err) return next(err);
    return res.json(result);
  });
});

app.post('/removeMeetingDay', (req, res, next) => {
  if (!requireAdmin(req, res)) return undefined;
  const { date } = req.body;
  return database.removeMeetingDay(date, (err, result) => {
    if (err) return next(err);
    return res.json(result);
  });
});

// Run algorithm with given date and save to database
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
          return callback({ error: 'error fetching parameters for matchmaking algorithm' });
        }
        // get duration of one meeting
        database.getMeetingDuration(date, (durErr, duration) => {
          if (durErr) return callback(durErr);
          matchmaking.run(data, duration, (runErr, result) => {
            if (runErr) return callback(runErr);
            if (commit) {
              return database.saveMatchmakingResult(result, date, (saveErr) => {
                if (saveErr) return callback(saveErr);
                return callback(null, true);
              });
            }
            return callback(null, true);
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

app.post('/runMatchmaking', (req, res, next) => {
  if (!requireAdmin(req, res)) return undefined;
  if (!req.body.date || !isDate(req.body.date)) return res.json({ success: false });
  runAlgorithm(req.body.date, (err, result) => {
    if (err) return next(err);
    return res.json({ success: result });
  });
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
  if (!isDate(date)) return res.sendStatus(400);
  let duration = (new Date(`${date}T${req.body.end}`).getTime() - new Date(`${date}T${startTime}`).getTime());
  duration = parseInt(duration / 60000, 10);
  database.insertAvailability(userId, date, startTime, duration, (err, result) => {
    if (err) return next(err);
    res.json(result);
    return undefined;
  });
});

app.post('/updateProfile', (req, res, next) => {
  // Create a JSON object from request body.
  const JSONObject = JSON.parse(req.body.data);
  let userType = JSONObject.type;
  userType = userType.replace(userType[0], userType[0].toUpperCase());
  const uid = JSONObject.uid !== undefined ? JSONObject.uid : req.session.userID;

  if (parseInt(uid, 10) !== req.session.userID && req.session.userType !== 'admin') return res.sendStatus(403);

  const site = JSONObject.site;
  const imgURL = JSONObject.img_url;
  const description = JSONObject.description;
  const title = JSONObject.titles[0];
  const credentials = JSONObject.credentials;

  // Perform insertion to database using the information specified above.
  database.updateProfile(uid, userType, site, imgURL, description, title, credentials,
    (error, response) => {
      if (error) {
        return next(error);
      }
      return res.json(response);
    },
  );
});

// Error handling
app.use((err, req, res, next) => {
  if (err) {
    const date = new Date();
    const logFile = `../log/error_log_${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}.txt`;
    fs.appendFile(logFile, `${err}\n`, (error) => {
      if (error) console.error(err.stack);
      else console.log('Error saved');
    });
    res.status(500).send({ error: 'An error has occured!' });
  } else {
    next();
  }
});

// send 404 response if we get here for some reason
app.use((err, req, res, next) => {
  res.status(404).send('404 NOT FOUND');
  next();
});


const server = app.listen(port);
console.log(`Backend server listening on port ${port}`);

function closeServer() {
  database.closeDatabase(() => {
    console.log('Database closed')
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
