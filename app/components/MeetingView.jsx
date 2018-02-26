import React from 'react';
import PropTypes from 'prop-types';
import MeetingDetailView from './admin_manage/MeetingDetailView';
import MeetingListView from './MeetingListView';
import pageContent from './pageContent';

// Send a request to backend to run the matchmaking algorithm
function runMatchmaking(date) {
  pageContent.fetchData('/runMatchmaking', 'POST', { date })
    .then(res => console.log(res.success));
}

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
  get the feedbacks from the most recent passed meeting
*/
  fetchFeedbacks() {
    pageContent.fetchData('/givenFeedbacks', 'GET', { })
      .then((response) => {
        console.log(response);
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
        runMatchmaking={runMatchmaking}
      />);

    return (
      <div>
        {content}
      </div>
    );
  }
}
MeetingView.propTypes = {
  date: PropTypes.string, // only relevant for detail view
  detail: PropTypes.bool, // This determines if we show the detail view or list view
};

MeetingView.defaultProps = {
  date: '',
  detail: false,
};
