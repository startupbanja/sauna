import React from 'react';
import PropTypes from 'prop-types';

// translate the schedule from json to a jsx table
// firstColumn is either 'startup' or 'coach'
function translate(data, times, firstColumn) {
  // set cellType to be the other one thatn firstColumn
  const cellType = firstColumn === 'coach' ? 'startup' : 'coach';
  // transform the parameter data into an array of {'coach': [[startup, time], ...]}
  const result = {};
  data.forEach((obj) => {
    if (obj[firstColumn] === null) {
      return;
    }
    if (result[obj[firstColumn]]) {
      result[obj[firstColumn]].push({ name: obj[cellType], time: obj.time });
    } else {
      result[obj[firstColumn]] = [{ name: obj[cellType], time: obj.time }];
    }
  });
  // sort the rows by time
  Object.keys(result).forEach((key) => {
    result[key].sort((a, b) => a.time.localeCompare(b.time));
  });
  // pad with empty cells with null from left and right to align with header row
  // run this only if we have coach as first column
  if (firstColumn === 'coach') {
    Object.keys(result).forEach((key) => {
      const arr = result[key];
      const leftPad = times.indexOf(arr[0].time);
      const rightPad = times.length - 1 - times.indexOf(arr[arr.length - 1].time);
      result[key] = Array(leftPad).fill(null)
        .concat(arr)
        .concat(Array(rightPad).fill(null));
    });
  }
  // if firstColumn is startup, pad from left and right with {name: null} to indicate
  // slot that could still be filled
  // also pads in the middle if there are missing slots
  // TODO these could be done in one while loop?
  // TODO add time to objects in addition to name:null
  if (firstColumn === 'startup') {
    Object.keys(result).forEach((key) => {
      let arr = result[key];
      // pad left
      const leftPad = times.indexOf(arr[0].time);
      result[key] = Array(leftPad).fill({ name: null })
        .concat(arr);
      arr = result[key];
      // pad middle
      let i = 0;
      while (i < result[key].length) {
        if (times.indexOf(result[key][i].time) > i) {
          result[key].splice(i, 0, { name: null });
        }
        i += 1;
      }
      // pad right
      const rightPad = times.length - 1 - times.indexOf(arr[arr.length - 1].time);
      result[key] = arr.concat(Array(rightPad)
        .fill({ name: null }));
    });
  }

  let i = 0;
  const table = Object.keys(result).map((key) => {
    const meetings = result[key].map((x) => {
      i += 1;
      if (x === null) {
        return <td className="unavailable-cell" key={`${key}-unavailable-${i}`} />;
      }
      const name = x.name ? x.name : '-';
      const cn = x.name ? 'full-cell' : 'empty-cell';
      return <td className={cn} key={`${key}-${name}-${i}`}>{name}</td>;
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
          {translate(this.props.schedule, times, this.props.firstColumn)}
        </tbody>
      </table>);
  }
}

AdminScheduleTable.propTypes = {
  schedule: PropTypes.arrayOf(PropTypes.shape({
    coach: PropTypes.string,
    startup: PropTypes.string,
    time: PropTypes.string,
    duration: PropTypes.number,
  })).isRequired,
  firstColumn: PropTypes.oneOf(['startup', 'coach']).isRequired,
};
