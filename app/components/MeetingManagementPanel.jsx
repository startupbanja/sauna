import React from 'react';
import PropTypes from 'prop-types';
import pageContent from './pageContent';

export default class MeetingManagementPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
    this.runMatchmaking = this.runMatchmaking.bind(this);
  }

  runMatchmaking() {
    console.log('run');
  }
  /*
  {
    availabilities: [{coach: timeString}, {coach: null}, ...]
  }
  // timeString can be empty if answered but not available
  */
  fetchAvailabilities() {

  }
  /*
  {
    coaches: [{ name: true/false }, ...],
    startups: [{ name: true/false }, ...]
  }
  */
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
