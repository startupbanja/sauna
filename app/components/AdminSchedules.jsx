import React from 'react';
// import PropTypes from 'prop-types';
import AdminScheduleTable from './AdminScheduleTable';
import pageContent from './pageContent';
// React Component for the schedule view for admins.
// fetchData('/timeslots', 'GET', null)
export default class AdminSchedules extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: 'TODO DATE', schedule: [] };
    this.getTimetable = this.getTimetable.bind(this);
    this.getTimetable();
  }

  getTimetable() {
    pageContent.fetchData('/timeslots', 'GET', {}).then((response) => {
      this.setState({ schedule: response });
    });
  }

  render() {
    return (
      <div>
        <div>
          <h1>Schedules</h1>
          <h2>{this.state.date}</h2>
        </div>
        <AdminScheduleTable schedule={this.state.schedule} />
      </div>
    );
  }
}

// AdminSchedules.propTypes = {
//   coachSchedules: PropTypes.arrayOf(PropTypes.shape({
//     coachName: PropTypes.string.isRequired,
//     startUps: PropTypes.arrayOf(PropTypes.shape({
//       startupName: PropTypes.string,
//       time: PropTypes.string,
//     })),
//   })).isRequired,
// };
