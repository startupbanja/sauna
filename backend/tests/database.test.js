const database = require('../database_postgresql.js');


describe('trying saveMatchmakingResult', () => {
  const date = '2018-10-15';
  const data = [];
  beforeAll(() => {
    for (let i = 0; i < 5; i += 1) {
      data.push({
        coach: 1,
        startup: 2,
        time: `10:0${i}`,
        duration: 10,
      });
    }
  });
  test('expecting to not return error', (done) => {
    database.saveMatchmakingResult(data, date, (err) => {
      if (err) console.log(err);
      expect(err).toBeFalsy();
      done();
    });
  });
});
