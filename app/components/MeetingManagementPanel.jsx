import React from 'react';
import PropTypes from 'prop-types';
import AdminScheduleTable from './AdminScheduleTable';
import pageContent from './pageContent';
// React Component for the schedule view for admins.
export default class MeetingManagementPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
    this.runMatchmaking = this.runMatchmaking.bind(this);
  }

  runMatchmaking() {
    console.log('run');
  }

  fetchAvailabilities() {

  }

  fetchFeedbacks() {

  }


  render() {
    return (
      <div>
        <h1>Meeting</h1>
        <h2>{this.props.date}</h2>

        <button>Run!</button>
      </div>
    );
  }
}

MeetingManagementPanel.propTypes = {
  date: PropTypes.string.isRequired,
};
