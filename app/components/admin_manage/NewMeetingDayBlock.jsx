import React, { Component } from 'react';
import $ from 'jquery';
import pageContents from '../pageContent';

function validateForm(e) {
  e.preventDefault();
  const date = $('#dateInput').val();
  const start = new Date(`${date}T${$('#startTimeInput').val()}`);
  const end = new Date(`${date}T${$('#endTimeInput').val()}`);
  const diff = (end.getTime() - start.getTime()) / 60000;
  if (diff % parseInt($('#splitInput').val(), 10) === 0) {
    pageContents.fetchData('/createMeetingDay', 'POST', {
      date,
      start: start.toTimeString().substr(0, 8),
      end: end.toTimeString().substr(0, 8),
      split: parseInt($('#splitInput').val(), 10),
    });
  }
}

class NewMeetingDayBlock extends Component {
  render() {
    /* eslint-disable */
    return (
      <div>
        <h4>New Meeting Day</h4>
        <form className="form-horizontal" onSubmit={validateForm}>
          <div className="form-group">
            <label htmlFor="dateInput" className="control-label col-sm-2">Date</label>
            <div className="col-sm-10">
              <input className="form-control" type="date" id="dateInput" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="startTimeInput" className="control-label col-sm-2">Start</label>
            <div className="col-sm-10">
              <input className="form-control" type="time" id="startTimeInput" required />
            </div>
            <div className="clearfix visible-xs"></div>
            <label htmlFor="endTimeInput" className="control-label col-sm-2">End</label>
            <div className="col-sm-10">
              <input className="form-control" type="time" id="endTimeInput" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="splitInput" className="control-label col-sm-7">Time for each meeting</label>
            <div className="col-sm-4">
              <input className="form-control" type="number" id="splitInput" defaultValue="40" min="0" step="1" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="invitesText" className="control-label">Invites</label>
            <textarea className="form-control" id="invitesText" placeholder="coach1@mail.com;coach2@mail.com;..." />
          </div>
          <button className="btn btn-primary" type="submit">Create</button>
        </form>
      </div>
    );
    /* eslint-enable */
  }
}

export default NewMeetingDayBlock;
