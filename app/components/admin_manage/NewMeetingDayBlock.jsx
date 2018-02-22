import React, { Component } from 'react';
import $ from 'jquery';
import pageContents from '../pageContent';

/* Makes sure that the meetings can be devided in full lenght
  and submits the data */
export function validateForm(e) {
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
    return true;
  }
  return false;
}

/* Conponen for displaying and submitting new meeting days */
class NewMeetingDayBlock extends Component {
  constructor(props) {
    super(props);
    this.fetchScheduledDays = this.fetchScheduledDays.bind(this);
    this.state = {
      days: [],
    };
  }

  componentDidMount() {
    this.fetchScheduledDays();
  }

  fetchScheduledDays() {
    pageContents.fetchData('/getComingMeetingDays', 'GET', {})
      .then((result) => {
        this.setState({
          days: [result],
        });
      });
  }

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
          <button className="btn btn-primary" type="submit">Create</button>
        </form>
        <div>
          {this.state.days.map(day => <p key={day.date}>{day.date}</p>)}
        </div>
      </div>
    );
    /* eslint-enable */
  }
}

export default NewMeetingDayBlock;
