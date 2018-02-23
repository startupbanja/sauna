import React from 'react';
import PropTypes from 'prop-types';
import MeetingDetailView from './MeetingDetailView';
import MeetingListView from './MeetingListView';
import pageContent from './pageContent';

// This component will be used to fetch data related to meetings and then
// render either a list or detail view of meetings
export default class MeetingView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { availabilities: {}, feedbacks: {}, nOfAvail: {} };
    // this.getNextDate = this.getNextDate.bind(this);
    this.fetchTimeslots();
    this.fetchFeedbacks();
  }


  componentWillUnmount() {
    console.log('UNMOUNTING');
  }

  // {
  //   availabilities: [{coach: timeString}, {coach: null}, ...]
  // }
  // timeString can be empty if answered but not available
  /*
  nOfAvail: {date: {total, done}}
  */
  fetchTimeslots() {
    pageContent.fetchData('/comingTimeslots', 'GET', { })
      .then((response) => {
        this.setState({ availabilities: response });
      });
    pageContent.fetchData('/numberOfTimeslots', 'GET', { })
      .then((response) => {
        this.setState({ nOfAvail: response });
      });
  }


  /*
  RESPONSE FORMAT:
  {
  startups: {startup_name: true/false},
  coaches: {coach_name: true/false},
  startupTotal: int,
  startupDone: int,
  coachTotal: int,
  coachDone: int
  }

*/
  fetchFeedbacks() {
    pageContent.fetchData('/givenFeedbacks', 'GET', { })
      .then((response) => {
        this.setState({ feedbacks: response });
      });
  }


  render() {
    const content = this.props.detail ?
      (<MeetingDetailView
        availabilities={this.state.availabilities}
        date={this.props.date}
      />)
      :
      (<MeetingListView
        feedbacks={this.state.feedbacks}
        nOfAvailabilities={this.state.nOfAvail}
      />);

    return (
      <div>
        {content}
      </div>
    );
  }
}
MeetingView.propTypes = {
  date: PropTypes.string,
  detail: PropTypes.bool,
};

MeetingView.defaultProps = {
  date: '',
  detail: false,
};
