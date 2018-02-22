import React, { Component } from 'react';
import pageContents from '../pageContent';
import Timeslot, { parseMinutes, parseTimeStamp } from './Timeslot';

/* Component to handle availability data between backend and Timeslot */
class TimeslotView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
    this.renderTimeslot = this.renderTimeslot.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.submitAvailability = this.submitAvailability.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    pageContents.fetchData('/getComingMeetingDays', 'GET', {})
      .then((result) => {
        const start = parseMinutes(new Date(`${result.date}T${result.startTime}`).toTimeString().substr(0, 5));
        const end = parseMinutes(new Date(`${result.date}T${result.endTime}`).toTimeString().substr(0, 5));
        this.setState({
          date: new Date(result.date),
          start,
          end,
          split: result.split,
          available: {
            start: (result.time === null) ? start : parseMinutes(result.time),
            end: (result.duration === null) ? end : parseMinutes(result.time) + result.duration,
          },
        });
      });
  }

  submitAvailability(startAvail, endAvail) {
    let startTime = Math.ceil((startAvail - this.state.start) / this.state.split);
    startTime = (startTime * this.state.split) + this.state.start;
    let endTime = Math.floor((endAvail - this.state.start) / this.state.split);
    endTime = (endTime * this.state.split) + this.state.start;
    pageContents.fetchData('/insertAvailability', 'POST', {
      date: this.state.date.toISOString().substr(0, 10),
      start: parseTimeStamp(startTime),
      end: parseTimeStamp(endTime),
    });
  }

  renderTimeslot() {
    if (this.state.start !== undefined) {
      return (
        <Timeslot
          start={this.state.start}
          end={this.state.end}
          split={this.state.split}
          available={this.state.available}
          onSubmit={this.submitAvailability}
        />
      );
    }
    return undefined;
  }

  render() {
    const dateOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    return (
      <div className="timeslot-picker">
        <link rel="stylesheet" type="text/css" href="app/styles/timeslot_style.css" />
        <p className="date">{this.state.date.toLocaleDateString('en-GB', dateOptions).replace(/\//g, '.')}</p>
        {this.renderTimeslot()}
      </div>
    );
  }
}

export default TimeslotView;
