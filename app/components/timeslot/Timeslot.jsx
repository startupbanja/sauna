import React from 'react';
import PropTypes from 'prop-types';
import TimeslotDrag from './TimeslotDrag';
import TimeslotInput from './TimeslotInput';

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
        start: parseMinutes(this.props.start),
        end: parseMinutes(this.props.start),
      },
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(to, change) {
    let newStart = this.state.available.start;
    let newEnd = this.state.available.end;
    if (to === 'start') {
      newStart = Math.max(newStart + change, parseMinutes(this.props.start));
      newStart = Math.round(Math.min(newStart, newEnd));
    } else if (to === 'end') {
      newEnd = Math.min(newEnd + change, parseMinutes(this.props.end));
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
      year: '2-digit',
    };
    return (
      <div className="timeslot-picker">
        <link rel="stylesheet" type="text/css" href="app/styles/timeslot_style.css" />
        <p className="date">{this.props.date.toLocaleDateString('en-GB', dateOptions).replace(/\//g, '.')}</p>
        <TimeslotDrag
          start={parseMinutes(this.props.start)}
          end={parseMinutes(this.props.end)}
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

Timeslot.propTypes = {
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  date: PropTypes.objectOf(Date).isRequired,
};

export default Timeslot;
