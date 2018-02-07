import React from 'react';
import PropTypes from 'prop-types';

// translate the schedule from json to a jsx table
// firstColumn is either 'startup' or 'coach'
function translate(data, times, firstColumn) {
  const cellType = firstColumn === 'coach' ? 'startup' : 'coach';
  // transform the parameter data into an array of {'coach': [startup, time]}
  // pad the arrays with empty cells so that all times align
  const result = {};
  data.forEach((obj) => {
    if (result[obj[firstColumn]]) {
      result[obj[firstColumn]].push({ name: obj[cellType], time: obj.time });
    } else {
      const leftPad = times.indexOf(obj.time);
      result[obj[firstColumn]] = Array(leftPad).fill(null).concat([
        { name: obj.startup, time: obj.time },
      ]);
    }
  });

  // Object.keys(result).forEach((key) => {
  //   const leftPad = times.indexOf(result[key][0].time)
  //   while (leftPad > 0) {
  //     result[key].unshift()
  //   }
  // });

  let i = 0;
  const table = Object.keys(result).map((key) => {
    const meetings = result[key].map((x) => {
      i += 1;
      if (x === null) {
        return <td className="unavailable" key={`${key}-unavailable-${i}`} />;
      }
      const name = x.name ? x.name : 'Empty';
      return <td key={`${key}-${name}-${i}`}>{name}</td>;
    });
    return (
      <tr key={`row-${key}`}>
        <td className="firstColumnCell">{key}</td>{meetings}
      </tr>
    );
  });
  return table;
}

function getTimes(data) {
  const allTimes = data.map(x => x.time);
  return Array.from(new Set(allTimes)).sort();
}

// React Component for the table in the admin schedule.
export default class AdminScheduleTable extends React.Component {
  // The traditional render method.
  render() {
    // Handles the case where schedules are not available.
    if (!this.props.schedule) {
      return (
        <div>
          <h3>No schedules available for coaches. </h3>
        </div>);
    }
    // Handles the case where schedules are available.
    const times = getTimes(this.props.schedule);
    return (
      <table className="table" id="adminTable">
        <thead>
          <tr>
            <th />{times.map(time => <th key={time}>{time}</th>)}
          </tr>
        </thead>
        <tbody>
          {translate(this.props.schedule, times, 'coach')}
        </tbody>
      </table>);
  }
}

AdminScheduleTable.propTypes = {
  // coachSchedules: PropTypes.arrayOf(PropTypes.shape({
  //   coachName: PropTypes.string.isRequired,
  //   startUps: PropTypes.arrayOf(PropTypes.shape({
  //     startupName: PropTypes.string,
  //     time: PropTypes.string,
  //   })),
  // })).isRequired,
  schedule: PropTypes.arrayOf(PropTypes.shape({
    coach: PropTypes.string,
    startup: PropTypes.string,
    time: PropTypes.string,
    duration: PropTypes.number,
  })).isRequired,
};
