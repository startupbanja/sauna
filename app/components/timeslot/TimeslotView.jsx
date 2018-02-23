import React, { Component } from 'react';
import pageContents from '../pageContent';
import Timeslot, { parseMinutes, parseTimeStamp } from './Timeslot';

/* Component to handle availability data between backend and Timeslot */
class TimeslotView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      data: [],
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
        const newData = [];
        result.forEach((day) => {
          const start = parseMinutes(new Date(`${day.date}T${day.startTime}`).toTimeString().substr(0, 5));
          const end = parseMinutes(new Date(`${day.date}T${day.endTime}`).toTimeString().substr(0, 5));
          newData.push({
            date: new Date(day.date),
            start,
            end,
            split: day.split,
            available: {
              start: (day.time === null) ? start : parseMinutes(day.time),
              end: (day.duration === null) ? end : parseMinutes(day.time) + day.duration,
            },
          });
        });
        this.setState({ data: newData });
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
    if (this.state.data.length > 0) {
      const day = this.state.data[this.state.index];
      return (
        <Timeslot
          key={day.date}
          start={day.start}
          end={day.end}
          split={day.split}
          available={day.available}
          date={day.date}
          onSubmit={this.submitAvailability}
        />
      );
    }
    return undefined;
  }

  render() {
    return (
      <div className="timeslot-picker">
        <link rel="stylesheet" type="text/css" href="app/styles/timeslot_style.css" />
        {this.renderTimeslot()}

      </div>
    );
  }
}

export default TimeslotView;
