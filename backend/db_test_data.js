

function dateToString(date) {
  return date.toISOString().substr(0, 10);
}

function addMeetingDays(firstDate, amount, db, callback) {
  const query = 'INSERT INTO MeetingDays (date, startTime, endTime, split, matchmakingDone) VALUES';
  const date = new Date(firstDate.getTime());

  const rows = [];
  for (let i = 0; i < amount; i += 1) {
    const duration = 40;
    const startTime = '10:00:00';
    const endTime = '16:00:00';
    const rowQ = `('${dateToString(date)}', '${startTime}', '${endTime}', ${duration}, 0)`;
    date.setDate(date.getDate() + 7);
    rows.push(rowQ);
  }
  db.run(query.concat(rows.join(',')), [], callback);
}

function addTimeslots(date, db, callback) {
  const query = `INSERT INTO Timeslots (user_id, date, time, duration) VALUES
    (38, $date, '13:00:00', 240),
    (22, $date, '13:00:00', 240),
    (34, $date, '13:00:00', 160),
    (51, $date, '13:00:00', 160),
    (49, $date, '13:00:00', 160),
    (39, $date, '13:00:00', 240),
    (63, $date, '13:00:00', 240),
    (28, $date, '13:00:00', 200),
    (57, $date, '13:00:00', 240),
    (42, $date, '13:00:00', 120),
    (65, $date, '13:00:00', 240),
    (30, $date, '15:00:00', 120),
    (66, $date, '13:00:00', 120),
    (77, $date, '13:00:00', 160),
    (73, $date, '13:00:00', 240),
    (55, $date, '13:40:00', 120),
    (32, $date, '13:00:00', 160),
    (46, $date, '13:00:00', 200);`;
  db.run(query, { $date: dateToString(date) }, callback);
}

function insertData(db, days, callback) {
  const date = new Date(); //
  date.setDate(date.getDate() + 1);
  addMeetingDays(date, days, db, (err) => {
    if (err) return callback(err);
    return addTimeslots(date, db, (err2, data) => callback(err2));
  });
}

module.exports = { insertData };
