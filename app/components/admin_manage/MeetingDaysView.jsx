import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import pageContent from '../pageContent';
import NewMeetingDayBlock from './NewMeetingDayBlock';
/* eslint-disable jsx-a11y/anchor-is-valid */ // disable complaining from Link


function runMatchmaking(date) {
  pageContent.fetchData('/runMatchmaking', 'POST', { date })
    .then(res => console.log(res.success));
}

/* Component to display all upcoming meeting days */
class MeetingDaysView extends Component {
  constructor(props) {
    super(props);
    this.fetchScheduledDays = this.fetchScheduledDays.bind(this);
    this.fetchAvailabilityStats = this.fetchAvailabilityStats.bind(this);
    this.fetchGivenFeedbacks = this.fetchGivenFeedbacks.bind(this);
    this.handleNewMeetingDaySubmit = this.handleNewMeetingDaySubmit.bind(this);
    this.renderMeetingDay = this.renderMeetingDay.bind(this);
    this.state = {
      days: null,
      availabilities: null,
      feedbacks: null,
    };
  }

  componentDidMount() {
    this.fetchScheduledDays();
    this.fetchAvailabilityStats();
    this.fetchGivenFeedbacks();
  }

  fetchScheduledDays() {
    pageContent.fetchData('/getComingMeetingDays', 'GET', {})
      .then((result) => {
        const arr = result;
        arr.sort((a, b) => {
          if (a.date < b.date) return -1;
          if (a.date > b.date) return 1;
          return 0;
        });
        this.setState({
          days: arr,
        });
      });
  }
  fetchAvailabilityStats() {
    pageContent.fetchData('/numberOfTimeslots', 'GET', {})
      .then((result) => {
        this.setState({
          availabilities: result,
        });
      });
  }
  fetchGivenFeedbacks() {
    pageContent.fetchData('/givenFeedbacks', 'GET', {})
      .then((result) => {
        console.log(result);
        this.setState({
          feedbacks: {
            startupTotal: result.startupTotal,
            startupDone: result.startupDone,
            coachTotal: result.coachTotal,
            coachDone: result.coachDone,
          },
        });
      });
  }

  handleNewMeetingDaySubmit() {
    const modal = $('#newMeetingDayModal');
    modal.removeClass('in');
    modal.addClass('out');
    $('.modal-backdrop').remove();
    this.fetchScheduledDays();
    this.fetchAvailabilityStats();
    this.fetchGivenFeedbacks();
  }

  renderMeetingDay(index) {
    if (this.state.days.length > index) {
      const dateOptions = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      };
      const date = this.state.days[index].date; // eslint-disable-line
      const { total, done } = this.state.availabilities[date] || { total: null, done: null };
      return (
        <div className="meeting-day-container" key={index}>
          <p className="meeting-date">{new Date(date).toLocaleDateString('en-GB', dateOptions).replace(/\//g, '.')}</p>
          {(total !== null && done !== null) &&
            <p>{`${done}/${total} Coaches' availabilities`}</p>}
          {index === 0 && (
            <div>
              {((this.state.feedbacks.coachTotal &&
                 this.state.feedbacks.coachDone !== undefined)
                || undefined) &&
                <p>{`${this.state.feedbacks.coachDone}/${this.state.feedbacks.coachTotal} Coaches' feedbacks`}</p>}
              {((this.state.feedbacks.startupTotal &&
                 this.state.feedbacks.startupDone !== undefined)
                || undefined) &&
                <p>{`${this.state.feedbacks.startupDone}/${this.state.feedbacks.startupTotal} Startups' feedbacks`}</p>}
            </div>
          )}
          {/* link to details page, the first item has modified link */}
          <Link
            className="btn btn-minor"
            to={`/meetings/${!index ? 'recent/' : ''}${this.state.days[index].date}/`}
          >
            View details
          </Link>

          {index === 0 && (
            <span>
              <Link
                className="btn btn-minor"
                to={`/timetable/${this.state.days[index].date}/`}
              >
                View timetable
              </Link>
              {/* TODO ONLY ALLOW RUNNING ALGORITHM ONCE */}
              <button
                className="btn btn-major"
                onClick={() => runMatchmaking(this.state.days[index].date)}
              > Run Matchmaking
              </button>
            </span>
          )}

        </div>
      );
    }
    return undefined;
  }

  render() {
    if (!(this.state.days && this.state.feedbacks && this.state.availabilities)) {
      // TODO
      return (<h1> LOADING </h1>);
    }
    return (
      <div className="meeting-days-view container">
        <link rel="stylesheet" href="/app/styles/meeting_days_style.css" />
        <div className="banner">
          <p><span className="number">{this.state.days.length}</span> upcoming meeting days</p>
          <div className="btn-container">
            <button
              type="button"
              className="btn btn-minor"
              data-toggle="modal"
              data-target="#newMeetingDayModal"
            >Set more
            </button>
          </div>
          <div id="newMeetingDayModal" className="modal fade" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h4>New Meeting Day</h4>
                </div>
                <div className="modal-body">
                  <NewMeetingDayBlock onSubmit={this.handleNewMeetingDaySubmit} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="next-day-container">
          {this.renderMeetingDay(0)}

        </div>

        <hr />

        <div className="coming-days-container">
          {this.state.days.slice(1).map((day, index) => this.renderMeetingDay(index + 1))}
        </div>
      </div>
    );
  }
}

export default MeetingDaysView;
