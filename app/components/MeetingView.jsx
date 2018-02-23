import React from 'react';
import PropTypes from 'prop-types';
import MeetingDetailView from './MeetingDetailView';
import pageContent from './pageContent';
// React Component for the schedule view for admins.
export default class MeetingView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentDate: this.getClosestDate(), availabilities: {} };
    this.getNextDate = this.getNextDate.bind(this);
  }

  // getClosestDate() {
  //   return '2018-01-01';
  // }
  /*
  { dates: [dateString, dateString, ... ] }
  */
//   fetchDates() {
// // /meetingDates
  // }

  /*
  {
    availabilities: [{coach: timeString}, {coach: null}, ...]
  }
  // timeString can be empty if answered but not available
  */
  fetchTimeslots() {
    pageContent.fetchData('/comingTimeslots', 'GET', { })
      .then((response) => {
        this.setState({ availabilities: response });
      });
  }
  /*
  {
    coaches: [{ name: true/false }, ...],
    startups: [{ name: true/false }, ...]
  }
  */


  render() {
    return (
      <div>
        <h1>{this.state.current}</h1>
        <MeetingDetailView
          date={this.state.current}
          availabilities={this.state.availabilities[this.state.currentDate]}
        />
      </div>
    );
  }
}
