import React from 'react';
import PropTypes from 'prop-types';

// React Component for the table in the admin schedule.
export default class AdminScheduleTable extends React.Component {
  // Creates a single row of the schedule table.
  static createRow(meeting) {
    const meetings = meeting.startUps.map(x => (
      <td key={x}>{x.startupName} {x.time}</td>
    ));
    return (
      <tr>
        <td>{meeting.coachName}</td>{meetings}
      </tr>
    );
  }

  // The traditional render method.
  render() {
    // Handles the case where schedules are not available.
    if (this.props.coachSchedules.length === 0) {
      return (
        <div>
          <h3>No schedules available for coaches. </h3>
        </div>);
    }
    // Handles the case where schedules are available.
    return (
      <table>
        <tr>
          <td>
            {this.props.coachSchedules.map(x => this.createRow(x))}
          </td>
        </tr>
      </table>);
  }
}

AdminScheduleTable.propTypes = {
  coachSchedules: PropTypes.arrayOf(PropTypes.shape({
    coachName: PropTypes.string.isRequired,
    startUps: PropTypes.arrayOf(PropTypes.shape({
      startupName: PropTypes.string,
      time: PropTypes.string,
    })),
  })).isRequired,
};
