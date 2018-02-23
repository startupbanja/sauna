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
      <div>
        <button
          type="button"
          className="btn btn-red"
          data-toggle="modal"
          data-target="#newMeetingDayModal"
        >Set more
        </button>
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
        <p>Scheduled dates</p>
        {this.state.days.map(day => (
          <p key={day.date}>
            {`Date: ${day.date} Start: ${day.startTime} Meetings: ${day.split} min`}
          </p>))}
      </div>
    );
  }
}

export default MeetingDaysView;
