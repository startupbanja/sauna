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
  /*
    Pad the time rows with empty cells where times are missing.
    When the leftmost column is coaches,
    we already have blank "empty" cells with the data and we must pad with "unavailable" cells.
    When the leftmost column is startups, we need to pad with "empty" cells
    name: undefined -> unavailable cell
    name: null -> empty cell
  */
  const nameValue = firstColumn === 'coach' ? undefined : null;
  Object.keys(result).forEach((key) => {
    const arr = result[key];
    let i = 0; // index of times (header row)
    let j = 0; // index of arr
    // while (i < times.length) {
    //   if (i >= arr.length) {
    //     arr.push({ name: nameValue, time: times[i] });
    //   } else if (arr[i].time > times[i]) {
    //     arr.splice(i, 0, { name: nameValue, time: times[i] });
    //   }
    //   i += 1;
    // }
    let a = 0;
    while (i < times.length && a < 100) {
      const headerTime = times[i];
      if (j >= arr.length) {
        arr.push({ name: nameValue, time: headerTime });
        i += 1;
      } else if (arr[j].time > headerTime) {
        arr.splice(j, 0, { name: nameValue, time: headerTime });
        i += 1;
      } else if (arr[j].time < headerTime) {
        j += 1;
      } else {
        i += 1;
        j += 1;
      }
      a += 1;
    }
    if (a === 100) console.log('infinite loop');
  });

  // combine cells with same leftColumn key and time into one arr index
  // aka meetings where one coach/startup had 2 meetings at the same time.
  /*
    timesCombined is of form:
    [
    [coach, [ [{name, time}, {name, time}], [{name, time}] ],
    [coach, [], ...]],
    ]
    This way meetings with same time, coach, startup can be shown in same cell
  */
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
  let i = 0;
  // map the data into jsx elements
  const table = timesCombined.map((arr, index) => {
    // key is either coach or startup, which one is on the leftmost column
    const key = arr[0];
    const meetings = timesCombined[index][1].map((row, idx) => {
      const combinedCell = row.map((x) => {
        i += 1;
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
        const choiceList = firstColumn === 'coach' ? startupList : coachList;
        // keys is used to identify the cell when editing
        const keys = { leftColumn: key, cellValue: name, time: x.time };
        return ( // This is the cell that is returned
          <div
            className={cn}
            key={`${key}_${name}_${i}`}
          >{name} {x.time}
            {editable &&
              <div>
                <DropdownList
                  text="Edit"
                  onChoice={newValue => editfunc(newValue, keys, true)}
                  choices={choiceList}
                />
                <DropdownList
                  text="+"
                  onChoice={newValue => editfunc(newValue, keys, false)}
                  choices={choiceList}
                />
              </div>}
          </div>);
      });
      return (<td key={`${key}_${times[idx]}_combined`}>{combinedCell}</td>);
    });
    return (
      <tr key={`row_${key}`} className="body-row">
        <td className="firstColumnCell" key="first">{key}</td>{meetings}
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
    const times = getTimes(this.props.schedule);
    return (
      <table className="table" id="adminTable">
        <thead>
          <tr className="header-row">
            <th key="0" />{times.map(time => <th key={time}>{time}</th>)}
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
