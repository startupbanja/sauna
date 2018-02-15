import React from 'react';
import PropTypes from 'prop-types';
import TimeslotDrag from './TimeslotDrag';
import TimeslotInput from './TimeslotInput';
import pageContents from '../pageContent';

export function parseMinutes(timeString) {
  if (!timeString.match(/^([0-1]?\d|2[0-3]):[0-5]\d$/)) return false;
  const pieces = timeString.split(':');
  return (parseInt(pieces[0], 10) * 60) + parseInt(pieces[1], 10);
}
export function parseTimeStamp(minutes) {
  if (minutes < 0 || minutes >= 1440) return false;
  const hours = parseInt(minutes / 60, 10);
  let minutesOver = minutes % 60;
  if (minutesOver < 10) minutesOver = `0${minutesOver}`;
  return `${hours}:${minutesOver}`;
}

class Timeslot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      available: {
        start: 0,
        end: 0,
      },
      date: new Date(),
      start: 0,
      end: 0,
      split: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    pageContents.fetchData('/getComingMeetingDay', 'GET', {})
      .then((result) => {
        const start = parseMinutes(new Date(`${result.date}T${result.startTime}`).toTimeString().substr(0, 5));
        const end = parseMinutes(new Date(`${result.date}T${result.endTime}`).toTimeString().substr(0, 5));
        this.setState({
          date: new Date(result.date),
          start,
          end,
          split: result.split,
          available: {
            start,
            end,
          },
        });
      });
  }

  handleChange(to, change) {
    let newStart = this.state.available.start;
    let newEnd = this.state.available.end;
    if (to === 'start') {
      newStart = Math.max(newStart + change, this.state.start);
      newStart = Math.round(Math.min(newStart, newEnd));
    } else if (to === 'end') {
      newEnd = Math.min(newEnd + change, this.state.end);
      newEnd = Math.round(Math.max(newEnd, newStart));
    }
    const newObj = { available: { start: newStart, end: newEnd } };
    this.setState(newObj);
  }

  render() {
    const dateOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    return (
      <div className="timeslot-picker container">
        <link rel="stylesheet" type="text/css" href="app/styles/timeslot_style.css" />
        <p className="date">{this.state.date.toLocaleDateString('en-GB', dateOptions).replace(/\//g, '.')}</p>
        <TimeslotDrag
          start={this.state.start}
          end={this.state.end}
          available={this.state.available}
          onChange={this.handleChange}
        />
        <TimeslotInput
          available={this.state.available}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default Timeslot;
