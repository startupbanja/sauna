import React from 'react';
import PropTypes from 'prop-types';
import TimeslotDrag from './TimeslotDrag';
import TimeslotInput from './TimeslotInput';

export function parseMinutes(timeString) {
  if (!timeString.match(/^([0-1]?\d|2[0-3]):[0-5]\d(:|$)/)) return false;
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

/* Component for presenting and editing users availabilities */
class Timeslot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      available: {
        start: this.props.available.start,
        end: this.props.available.end,
      },
      start: this.props.start,
      end: this.props.end,
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitAvailability = this.submitAvailability.bind(this);
    this.askForMoreTime = this.askForMoreTime.bind(this);
  }

  handleChange(to, change) {
    let newStart = this.state.available.start;
    let newEnd = this.state.available.end;
    if (to === 'start') {
      newStart = Math.min(Math.max(newStart + change, this.state.start), this.state.end);
      // newStart = Math.round(Math.min(newStart, newEnd));
      newEnd = Math.max(newStart, this.state.available.end);
    } else if (to === 'end') {
      newEnd = Math.max(Math.min(newEnd + change, this.state.end), this.state.start);
      // newEnd = Math.round(Math.max(newEnd, newStart));
      newStart = Math.min(newEnd, this.state.available.start);
    }
    const newObj = { available: { start: newStart, end: newEnd } };
    this.setState(newObj);
  }

  submitAvailability() {
    let startAvail = Math.round(this.state.available.start / 5) * 5;
    let endAvail = Math.round(this.state.available.end / 5) * 5;
    startAvail = this.askForMoreTime('start', startAvail);
    endAvail = this.askForMoreTime('end', endAvail);
    this.props.onSubmit(startAvail, endAvail);
  }

  askForMoreTime(type, availability) {
    if (type === 'start') {
      let start = Math.floor((availability - this.state.start) / this.props.split);
      start = (start * this.props.split) + this.state.start;
      const cond1 = availability - start < this.props.split / 2;
      const cond2 = availability - start > 0;
      if (cond1 && cond2) {
        if (confirm(`Could you come ${availability - start} minutes earlier?`)) { // eslint-disable-line
          this.setState({
            available: {
              start,
              end: this.state.available.end,
            },
          });
          return start;
        }
      }
    } else if (type === 'end') {
      let endTime = Math.ceil((availability - this.state.start) / this.props.split);
      endTime = (endTime * this.props.split) + this.state.start;
      const cond1 = endTime - availability < this.props.split / 2;
      const cond2 = endTime - availability > 0;
      if (cond1 && cond2) {
        if (confirm(`Could you stay ${endTime - availability} minutes longer?`)) { // eslint-disable-line
          this.setState({
            available: {
              start: this.state.available.start,
              end: endTime,
            },
          });
          return endTime;
        }
      }
    }
    return availability;
  }

  render() {
    const dateOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    const moveToPrevClass = `glyphicon glyphicon-triangle-left${(this.props.onMoveToPrev === undefined) ? ' invisible' : ''}`;
    const moveToNextClass = `glyphicon glyphicon-triangle-right${(this.props.onMoveToNext === undefined) ? ' invisible' : ''}`;
    return (
      <div className="container timeslot-container">
        <p className="date">{this.props.date.toLocaleDateString('en-GB', dateOptions).replace(/\//g, '.')}</p>
        <p className="help-text help-text-center">
          Drag from the arrow to set your availability...
        </p>
        <TimeslotDrag
          start={this.state.start}
          end={this.state.end}
          available={this.state.available}
          onChange={this.handleChange}
          split={this.props.split}
        />
        <p className="help-text help-text-center">...or type in manually</p>
        <TimeslotInput
          available={this.state.available}
          onChange={this.handleChange}
        />
        <div className="navigation-container">
          <span
            className={moveToPrevClass}
            onClick={this.props.onMoveToPrev}
            role="button"
            tabIndex={0}
            onKeyDown={this.props.onMoveToPrev}
          />
          <button onClick={this.submitAvailability} className="btn btn-lg btn-major">Submit</button>
          <span
            className={moveToNextClass}
            onClick={this.props.onMoveToNext}
            role="button"
            tabIndex={0}
            onKeyDown={this.props.onMoveToNext}
          />
        </div>
      </div>
    );
  }
}

Timeslot.propTypes = {
  date: PropTypes.objectOf(Date).isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  available: PropTypes.shape({
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
  }).isRequired,
  split: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onMoveToPrev: PropTypes.func,
  onMoveToNext: PropTypes.func,
};

Timeslot.defaultProps = {
  onMoveToNext: undefined,
  onMoveToPrev: undefined,
};

export default Timeslot;
