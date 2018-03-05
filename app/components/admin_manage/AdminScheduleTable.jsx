import React from 'react';
import PropTypes from 'prop-types';
import DropdownList from './DropdownList';
// translate the schedule from json to a jsx table
// firstColumn is either 'startup' or 'coach'
// params:
/* data: [{coach, startup, time, duration}, ...]
  time: [timestring, ...]
  firstColum: either 'coach' or 'startup'
  editable: boolean
  editfunc: function to be be called when a specific cell is edited
  allUsers: {startups: [...], coaches: [...]}
*/
function translate(data, times, firstColumn, editable, editfunc, allUsers) {
  // set cellType to be the other one thatn firstColumn
  const cellType = firstColumn === 'coach' ? 'startup' : 'coach';
  const coachList = allUsers.coaches;
  const startupList = allUsers.startups;
  // transform the parameter data into an array of {'coach': [{name: string, time: string}, ...]}
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
  // pad with empty cells with non-available rows from left and right to align with header row
  // run this only if we have coach as first column
  // name: undefined -> coach availability not given
  // TODO
  if (firstColumn === 'coach') {
    Object.keys(result).forEach((key) => {
      const arr = result[key];
      const leftPad = times.indexOf(arr[0].time);
      const rightPad = times.length - 1 - times.indexOf(arr[arr.length - 1].time);
      result[key] = Array(leftPad).fill(null)
        .map((val, i) => ({ name: undefined, time: times[i] }))
        .concat(arr)
        .concat(Array(rightPad).fill(null)
          .map((val, i) => ({ name: undefined, time: times[leftPad + arr.length + i] })));
    });
  }
  // if firstColumn is startup, pad from left and right with {name: null} to indicate
  // slot that could still be filled
  // also pads in the middle if there are missing slots
  // TODO these could be done in one while loop?
  if (firstColumn === 'startup') {
    Object.keys(result).forEach((key) => {
      let arr = result[key];
      // pad left
      const leftPad = times.indexOf(arr[0].time);
      // result[key] = Array(leftPad).fill({ name: null })
      //   .concat(arr);
      result[key] = Array(leftPad).fill(null)
        .map((val, index) => ({ name: null, time: times[index] }))
        .concat(arr);
      arr = result[key];
      // pad middle
      let i = 0;
      while (i < result[key].length) {
        if (times.indexOf(result[key][i].time) > i) {
          result[key].splice(i, 0, { name: null, time: times[i] });
        }
        i += 1;
      }
      // pad right
      const rightPad = times.length - 1 - times.indexOf(arr[arr.length - 1].time);
      // result[key] = arr.concat(Array(rightPad)
      //   .fill({ name: null }));
      result[key] = arr.concat(Array(rightPad).fill(null)
        .map((val, index) => ({ name: null, time: times[arr.length + index] })));
    });
  }
  // combine cells with same leftColumn key and time into one arr index
  // result is array of {coach: [{name, time}, ...]}
  const timesCombined = Object.keys(result).map((key) => {
    const oldArr = result[key];
    const newArr = [];
    for (let i = 0; i < oldArr.length; i += 1) {
      // if first element or last element doesn't have same time as this
      if (i === 0 || newArr[newArr.length - 1][0].time !== oldArr[i].time) {
        newArr.push([oldArr[i]]);
      } else {
        newArr[newArr.length - 1].push(oldArr[i]);
      }
    }
    return [key, newArr];
  });
  // console.log(timesCombined);
  /*
  timesCombined is of form:
  [
    [coach, [ [{name, time}, {name, time}], [{name, time}] ],
    [coach, [], ...]],
  ]
  This way meetings with same time, coach, startup can be shown in same cell
  */
  let i = 0;
  // key is either coach or startup, which one is on the leftmost column
  const table = timesCombined.map((arr, index) => {
    const key = arr[0];
    const meetings = timesCombined[index][1].map((row, idx) => {
      const combinedCell = row.map((x) => {
        i += 1;
        // if (x === null) {
        //   return <td className="unavailable-cell" key={`${key}-unavailable-${i}`} />;
        // }
        let name;
        let cn;
        if (x.name === undefined) { // coach not available
          name = '';
          cn = 'unavailable-cell';
        } else if (x.name === null) { // empty slot
          name = '-';
          cn = 'empty-cell';
        } else {
          name = x.name; // eslint-disable-line
          cn = 'full-cell';
        }
        const list = firstColumn === 'coach' ? startupList : coachList;
        const keys = { leftColumn: key, cellValue: name, time: x.time };
        return ( // This is the cell that is returned
          <div
            className={cn}
            key={`${key}-${name}-${i}`}
          >{name} {x.time}
            {editable &&
              <DropdownList
                onChoice={editfunc}
                choices={list}
                keys={keys}
              />}
          </div>);
      });
      return (<td key={`${key}-${times[idx]}-combined`}>{combinedCell}</td>);
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
  render() {
    // Handles the case where schedules are not available.
    if (!this.props.schedule) {
      return (
        <div>
          <h3>No schedules available. </h3>
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
          {translate(
            this.props.schedule,
            times,
            this.props.firstColumn,
            this.props.editable,
            this.props.onEdit,
            this.props.allUsers,
          )}
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
  allUsers: PropTypes.shape({
    startups: PropTypes.arrayOf(PropTypes.string),
    coaches: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  firstColumn: PropTypes.oneOf(['startup', 'coach']).isRequired,
  editable: PropTypes.bool,
  onEdit: PropTypes.func,
};

AdminScheduleTable.defaultProps = {
  editable: false,
  onEdit: () => undefined,
};
