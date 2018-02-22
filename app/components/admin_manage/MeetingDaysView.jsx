import React, { Component } from 'react';
import $ from 'jquery';
import pageContent from '../pageContent';
import NewMeetingDayBlock from './NewMeetingDayBlock';

/* Component to display all upcoming meeting days */
class MeetingDaysView extends Component {
  constructor(props) {
    super(props);
    this.fetchScheduledDays = this.fetchScheduledDays.bind(this);
    this.handleNewMeetingDaySubmit = this.handleNewMeetingDaySubmit.bind(this);
    this.state = {
      days: [],
    };
  }

  componentDidMount() {
    this.fetchScheduledDays();
  }

  fetchScheduledDays() {
    pageContent.fetchData('/getComingMeetingDays', 'GET', {})
      .then((result) => {
        this.setState({
          days: result,
        });
      });
  }

  handleNewMeetingDaySubmit() {
    const modal = $('#newMeetingDayModal');
    modal.removeClass('in');
    modal.addClass('out');
    $('.modal-backdrop').remove();
    this.fetchScheduledDays();
  }

  render() {
    return (
      <div className="meeting-days-view container">
        <link rel="stylesheet" href="/app/styles/meeting_days_style.css" />
        <div className="banner">
          <p><span className="number">{this.state.days.length}</span> upcoming meeting days</p>
          <div className="btn-container">
            <button
              type="button"
              className="btn btn-red"
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
          <p className="meeting-date">
            {(this.state.days.length > 0) && this.state.days[0].date}
          </p>
        </div>

        <hr />

        <div className="coming-days-container">
          {this.state.days.map(day => <p className="meeting-date" key={day.date}>{day.date}</p>)}
        </div>
      </div>
    );
  }
}

export default MeetingDaysView;
