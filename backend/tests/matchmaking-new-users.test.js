const database = require('../database.js');
const matchmaking = require('../matchmaking.js');
// const index = require('./index.js');

function addUsers(amount, type, callback) {
  const info = {
    email: `email-${amount}@${type}`,
    password: 'asdasdasd',
    type,
    name: `${type}-${amount}`,
  };
  database.addUser(info, (e) => {
    if (e) throw e;
    if (amount <= 1) return callback();
    return addUsers(amount - 1, type, callback);
  });
}

function setAllActive(callback) {
  function set(ids, index, cb) {
    const cur = ids[index];
    database.setActiveStatus(cur, 1, () => {
      if (index < ids.length) return set(ids, index + 1, cb);
      return cb();
    });
  }
  database.getActiveStatuses((err, data) => {
    const coachIds = data.coaches.map(a => a.id);
    const startupIds = data.startups.map(a => a.id);
    set(coachIds, 0, () => set(startupIds, 0, () => callback()));
  });
}

function setAvails(callback) {
  function set(ids, index, cb) {
    const id = ids[index];
    database.insertAvailability(id, '2018-01-01', '10:00', 120, (e) => {
      if (e) throw e;
      if (index + 1 < ids.length) return set(ids, index + 1, cb);
      return cb();
    });
  }
  // get coaches
  database.getUsers(1, true, (err, data) => {
    const ids = Object.keys(data).map(k => data[k].id);
    set(ids, 0, () => callback());
  });
}


describe('running matchmaking with new users', () => {
  beforeAll((done) => {
    database.createDatabase((err) => {
      database.initDB(() => {
        if (err) throw err;
        addUsers(5, 'coach', () => {
          addUsers(5, 'startup', () => {
            setAllActive(() => {
              database.createMeetingDay('2018-01-01', '10:00', '13:00', 10, () => {
                setAvails(() => done());
              });
            });
          });
        });
      }, false);
    });
  });

  afterAll(done => database.closeDatabase(done));

  test('result should be non empty', (done) => {
    function callback(err) {
      console.log(err);
      throw err;
    }
    const date = '2018-01-01';
    const duration = 10;
    database.getTimeslots(date, (err, timeslots) => {
      if (err) return callback(err);
      database.getRatings((err2, ratings) => {
        if (err2) return callback(err2);
        database.getStartups((err3, startupdata) => {
          if (err3) return callback(err3);
          const data = {
            feedbacks: ratings,
            availabilities: timeslots,
            startups: startupdata,
          };
          matchmaking.run(data, duration, (runErr, result) => {
            if (runErr) return callback(runErr);
            expect(result.length > 0).toBe(true);
            return done();
          });
          return undefined;
        });
        return undefined;
      });
      return undefined;
    });
  });
});
