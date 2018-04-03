import React, { Component } from 'react';
import pageContents from '../pageContent';
import Timeslot, { parseMinutes, parseTimeStamp } from './Timeslot';
import StatusMessage from '../StatusMessage';
import '../../styles/timeslot_style.css';

/*
  Component to handle availability data between backend and Timeslot
  and displaying all upcoming meeting days' timeslots
*/
class TimeslotView extends Component {
  constructor(props) {
    super(props);
    this.renderTimeslot = this.renderTimeslot.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.submitAvailability = this.submitAvailability.bind(this);
    this.state = {
      index: 0,
      // array of objects containing different meeting days and their submitted availabilities
      data: undefined,
      message: undefined,
    };
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
              // if no availability is submitted,
              // make the initial value to be the start of the whole day
              start: (day.time === null) ? start : parseMinutes(day.time),
              // if no availability is submitted,
              // make the initial value to be the start of the whole day
              // so the user is unavailable by default
              end: (day.duration === null) ? start : parseMinutes(day.time) + day.duration,
            },
          });
        });
        this.setState({ data: newData });
      });
  }

  submitAvailability(startAvail, endAvail, index) {
    const meetingDay = this.state.data[index];
    pageContents.fetchData('/insertAvailability', 'POST', {
      date: meetingDay.date.toISOString().substr(0, 10),
      start: parseTimeStamp(startAvail),
      end: parseTimeStamp(endAvail),
    }).then((result) => {
      // if submitting correctly update state
      if (result.status === 'success') {
        const oldData = this.state.data;
        oldData[index].available = {
          start: startAvail,
          end: endAvail,
        };
        this.setState({
          data: oldData,
          // show StatusMessage on success
          message: {
            text: 'Saved',
            type: 'success',
          },
        });
      } else {
        this.setState({
          // show StatusMessage on errro
          message: {
            text: 'Error when saving availability',
            type: 'error',
          },
        });
      }
    });
  }

  // navigate between different meeting days
  changeDate(diff) {
    this.setState({
      index: Math.min(this.state.data.length - 1, Math.max(0, this.state.index + diff)),
      message: undefined,
    });
  }

  // render the timeslot picker for the current date
  renderTimeslot() {
    if (!this.state.data) return null;
    if (this.state.data.length === 0) return <p className="empty-content-text">No upcoming days</p>;
    const day = this.state.data[this.state.index];
    return (
      <Timeslot
        key={day.date}
        start={day.start}
        end={day.end}
        split={day.split}
        available={day.available}
        date={day.date}
        onSubmit={(a, b) => this.submitAvailability(a, b, this.state.index)}
        onMoveToPrev={((this.state.index > 0) || undefined) && (() => this.changeDate(-1))}
        onMoveToNext={((this.state.index < this.state.data.length - 1) || undefined)
          && (() => this.changeDate(1))}
      />
    );
  }

  render() {
    return (
      <div className="timeslot-picker">
        <StatusMessage message={this.state.message} />
        {this.renderTimeslot()}
      </div>
    );
  }
}

export default TimeslotView;
