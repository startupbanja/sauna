/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';
import AdminScheduleTable from './AdminScheduleTable';

// React Component for the schedule view for admins.
export default class AdminSchedules extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schedule: props.schedules,
    };
  }

  render() {
    return (
      <div>
        <div>
          <h1 className="adminViewHeader">Schedules</h1>
        </div>
        <div>
          <ul className="nav nav-tabs">
            <li className="active"><a href="#">Coaches</a></li>
            <li><a href="#">Startups</a></li>
          </ul>
        </div>
        <AdminScheduleTable schedules={this.state.schedule} />
      </div>
    );
  }
}

AdminSchedules.propTypes = {
  schedules: PropTypes.arrayOf(PropTypes.shape({
    coachName: PropTypes.string.isRequired,
    startUps: PropTypes.arrayOf(PropTypes.shape({
      startupName: PropTypes.string,
      time: PropTypes.string,
    })),
  })).isRequired,
};
