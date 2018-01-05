import React from 'react';
import PropTypes from 'prop-types';
import AdminScheduleTable from './AdminScheduleTable';

// React Component for the schedule view for admins.
export default class AdminSchedules extends React.Component {
  render() {
    return (
      <div>
        <div>
          <h1>Schedules</h1>
        </div>
        <AdminScheduleTable coachSchedules={this.props.coachSchedules} />
      </div>
    );
  }
}

AdminSchedules.propTypes = {
  coachSchedules: PropTypes.arrayOf(PropTypes.shape({
    coachName: PropTypes.string.isRequired,
    startUps: PropTypes.arrayOf(PropTypes.shape({
      startupName: PropTypes.string,
      time: PropTypes.string,
    })),
  })).isRequired,
};
