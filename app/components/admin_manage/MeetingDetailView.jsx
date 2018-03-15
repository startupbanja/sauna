import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import pageContent from '../pageContent';

/* eslint-disable jsx-a11y/anchor-is-valid */ // disable complaining from Link

// Component to view info about a meeting, including coach availability status
// and previous feedback status if applicable.
export default class MeetingDetailView extends React.Component {
  constructor(props) {
    super(props);
    // feedbacks is first either true or false, then when fetched, contains feedback data
    // if props.renferFeedbacks
    this.state = { availabilities: null, feedbacks: !this.props.renderFeedbacks };
    this.fetchTimeslots = this.fetchTimeslots.bind(this);
    this.fetchFeedbacks = this.fetchFeedbacks.bind(this);
  }

  componentDidMount() {
    this.fetchTimeslots();
    if (this.props.renderFeedbacks) this.fetchFeedbacks();
  }

  fetchTimeslots() {
    pageContent.fetchData('/comingTimeslots', 'GET', { })
      .then((response) => {
        this.setState({ availabilities: response });
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
  coachDone: int,
  date: string,
  missingCoachEmails: {},
  missingStartupEmails: {},
  }
  get the feedbacks from the most recent passed meeting
  */
  fetchFeedbacks() {
    pageContent.fetchData('/givenFeedbacks', 'GET', { })
      .then((response) => {
        this.setState({ feedbacks: response });
      });
  }

  render() {
    if (!(this.state.availabilities && this.state.feedbacks)) {
      // TODO
      return (<h1>LOADING</h1>);
    }

    // null check TODO is this needed?
    const list = this.state.availabilities[this.props.date] ?
      Object.entries(this.state.availabilities[this.props.date]) : [];

    // filter for filled feedbacks
    const availabilities = { given: [], notGiven: [] };
    list.forEach((arr) => {
      const name = arr[0];
      const filled = arr[1];
      if (filled) {
        availabilities.given.push(<li key={name}>{name}: {filled}</li>);
      } else {
        availabilities.notGiven.push(<li key={name}>{name}</li>);
      }
    });

    // make feedbacks list from state into renderable components if renderFeedbacks
    // is true
    const feedbacks = {
      coaches: { given: [], notGiven: [] },
      startups: { given: [], notGiven: [] },
    };

    const reminderMails = [];

    if (this.props.renderFeedbacks) {
      const keys = ['missingCoachEmails', 'missingStartupEmails'];
      keys.forEach((key) => {
        Object.entries(this.state.feedbacks[key]).forEach((arr) => {
          const email = arr[0];
          const missing = arr[1];
          if (missing) {
            reminderMails.push((
              <li key={`${email}-fb`}>
                {email}
              </li>));
          }
        });
      });
    }

    if (this.props.renderFeedbacks) {
      const keys = ['startups', 'coaches'];
      keys.forEach((key) => {
        Object.entries(this.state.feedbacks[key]).forEach((arr) => {
          const name = arr[0];
          const filled = arr[1];
          if (filled) {
            feedbacks[key].given.push((
              <li key={`${name}-fb`}>
                {name}: <span className="glyphicon glyphicon-ok" aria-hidden="true" />
              </li>));
          } else {
            feedbacks[key].notGiven.push((
              <li key={`${name}-fb`}>
                {name}: <span className="glyphicon glyphicon-remove" aria-hidden="true" />
              </li>));
          }
        });
      });
    }

    return (
      <div className="container full-viewport">
        <h1>Details {this.props.date}</h1>
        <Link
          className="btn btn-major"
          to={`/timetable/${this.props.date}/`}
        >
          View timetable
        </Link>
        <div className="row">
          <div className="col-md-6">
            <h3>Availabilities for this meeting:</h3>
            <button className="btn btn-major"> Send reminder</button>
          </div>
          {this.props.renderFeedbacks && (
            <div className="col-md-6 feedbacks-header">
              <h3>Feedbacks from last meeting:</h3>
              <button className="btn btn-major"> Show e-mails</button>
              {reminderMails}
            </div>)
          }
        </div>
        <div className="row">
          <div className="listDiv col-md-3">
            <ul>
              <h3>Given:</h3>
              <h3>{availabilities.given.length}</h3>
              {availabilities.given}
            </ul>
          </div>
          <div className="listDiv col-md-3">
            <ul>
              <h3>Not given:</h3>
              <h3>{availabilities.notGiven.length}</h3>
              {availabilities.notGiven}
            </ul>
          </div>
          {this.props.renderFeedbacks &&
            <div className="feedbackBlock">
              <div className="listDiv col-md-3">
                <ul>
                  <h3>Coaches:</h3>
                  {feedbacks.coaches.notGiven}
                  {feedbacks.coaches.given}
                </ul>
              </div>
              <div className="listDiv col-md-3">
                <ul>
                  <h3>Startups:</h3>
                  {feedbacks.startups.notGiven}
                  {feedbacks.startups.given}
                </ul>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

MeetingDetailView.propTypes = {
  date: PropTypes.string.isRequired,
  renderFeedbacks: PropTypes.bool.isRequired,
};
