import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import pageContent from '../pageContent';
import NewMeetingDayBlock from './NewMeetingDayBlock';
import '../../styles/meeting_days_style.css';
/* eslint-disable jsx-a11y/anchor-is-valid */ // disable complaining from Link

/* Component to display all upcoming meeting days
  and a more detailed info about the next meeting day
  also allows the possibility to create new days */
class MeetingDaysView extends Component {
  constructor(props) {
    super(props);
    this.fetchScheduledDays = this.fetchScheduledDays.bind(this);
    this.fetchAvailabilityStats = this.fetchAvailabilityStats.bind(this);
    this.fetchGivenFeedbacks = this.fetchGivenFeedbacks.bind(this);
    this.handleNewMeetingDaySubmit = this.handleNewMeetingDaySubmit.bind(this);
    this.removeDate = this.removeDate.bind(this);
    this.renderMeetingDay = this.renderMeetingDay.bind(this);
    this.state = {
      // list of all coming meeting days as a object containing the date as 'YYYY-MM-DD'
      days: null,
      // object mapping a date to given and total availabilities from coaches
      availabilities: null,
      // object of feedbacks given and total as { coachDone, coachTotal, startupDone, startupTotal }
      feedbacks: null,
      canRunMatchmaking: false,
    };
  }

  componentDidMount() {
    this.fetchScheduledDays();
    this.fetchAvailabilityStats();
    this.fetchGivenFeedbacks();
  }

  runMatchmaking(date) {
    this.setState({ canRunMatchmaking: false });
    pageContent.fetchData('/runMatchmaking', 'POST', { date })
      .then(() => undefined);
  }

  fetchScheduledDays() {
    pageContent.fetchData('/getComingMeetingDays', 'GET', {})
      .then((result) => {
        const arr = result;
        // sort by date
        arr.sort((a, b) => {
          if (a.date < b.date) return -1;
          if (a.date > b.date) return 1;
          return 0;
        });
        let canRun = false;
        if (arr.length > 0) {
          const first = arr[0];
          // convert to boolean
          canRun = first.matchmakingDone === 0;
        }
        this.setState({
          days: arr,
          canRunMatchmaking: canRun,
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
    // remove the transparent gray backround of modal
    const modal = $('#newMeetingDayModal');
    modal.removeClass('in');
    modal.addClass('out');
    $('.modal-backdrop').remove();

    this.fetchScheduledDays();
    this.fetchAvailabilityStats();
    this.fetchGivenFeedbacks();
  }

  removeDate(index) {
    if (confirm(`Are you sure you want to remove the date ${this.state.days[index].date}`)) { // eslint-disable-line
      pageContent.fetchData('/removeMeetingDay', 'POST', { date: this.state.days[index].date })
        .then(() => {
          this.fetchScheduledDays();
          this.fetchAvailabilityStats();
          this.fetchGivenFeedbacks();
        });
    }
  }

  // render relevant data about the meeting day
  // renders more info about the first day
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
            <p className="meeting-text">{`${done}/${total} Coaches' availabilities`}</p>}
          {// if the next upcoming date, render info about the feedbacks
            index === 0 && (
            <div>
              {((this.state.feedbacks.coachTotal &&
                 this.state.feedbacks.coachDone !== undefined)
                || undefined) &&
                <p className="meeting-text">{`${this.state.feedbacks.coachDone}/${this.state.feedbacks.coachTotal} Coaches' feedbacks`}</p>}
              {((this.state.feedbacks.startupTotal &&
                 this.state.feedbacks.startupDone !== undefined)
                || undefined) &&
                <p className="meeting-text">{`${this.state.feedbacks.startupDone}/${this.state.feedbacks.startupTotal} Startups' feedbacks`}</p>}
            </div>
          )}
          {/* link to details page, the first item has modified link */}
          <Link
            className="btn btn-minor meeting-button"
            to={`/meetings/${!index ? 'recent/' : ''}${this.state.days[index].date}/`}
          >
            View details
          </Link>
          <button className="btn btn-minor meeting-button" onClick={() => this.removeDate(index)}>
            Remove
          </button>

          {// if rendering the first upcoming day,
          // render buttons to run matchmaking and view admin timetable
            index === 0 && (
            <span className="matchmaking-buttons">
              <Link
                className="btn btn-minor meeting-button"
                to={`/timetable/${this.state.days[index].date}/`}
              >
                View timetable
              </Link>
              {this.state.canRunMatchmaking &&
                <button
                  className="btn btn-major meeting-button"
                  onClick={() => this.runMatchmaking(this.state.days[index].date)}
                > Run Matchmaking
                </button>
              }
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
        <div className="banner">
          <p><span className="number">{this.state.days.length}</span> upcoming meeting days</p>
          <div className="btn-container">
            <button
              type="button"
              className="btn btn-minor meeting-button"
              data-toggle="modal"
              data-target="#newMeetingDayModal"
            >Set more
            </button>
          </div>
          {/* modal for creating new meeting days */}
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
