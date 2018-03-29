import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeslotInputElement from './TimeslotInputElement';
/* eslint jsx-a11y/label-has-for: "warn"
*/

// component for displaying one start and end time set
class TimeslotInputSet extends Component {
  constructor(props) {
    super(props);
    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
    this.isUnavailable = this.isUnavailable.bind(this);
    this.markAsUnavailable = this.markAsUnavailable.bind(this);
    this.state = {
      errorIn: '',
    };
  }

  // figure out was the change for start or end
  handleStartChange(change) {
    this.props.onChange('start', change);
  }
  handleEndChange(change) {
    this.props.onChange('end', change);
  }

  isUnavailable() {
    return this.props.start === this.props.end;
  }
  // if the input type is incorrect chage the incorrect value to match the other
  // making the users' availability slot empty and unavailable
  markAsUnavailable(type) {
    if (type === 'start') {
      this.props.onChange('start', this.props.end - this.props.start);
      this.setState({ errorIn: 'start' });
    } else if (type === 'end') {
      this.props.onChange('end', this.props.start - this.props.end);
      this.setState({ errorIn: 'end' });
    }
  }

  render() {
    return (
      <div className="timeslot-input">
        <TimeslotInputElement
          id="start"
          time={this.props.start}
          onChange={this.handleStartChange}
          markAsUnavailable={() => this.markAsUnavailable('start')}
          unavailable={this.isUnavailable() && (this.state.errorIn === 'start')}
        />
        <p>-</p>
        <TimeslotInputElement
          time={this.props.end}
          onChange={this.handleEndChange}
          unavailable={this.isUnavailable() && (this.state.errorIn !== 'start')}
          markAsUnavailable={() => this.markAsUnavailable('end')}
        />
        <p className={`unavailable-text${(!this.isUnavailable()) ? ' invisible' : ''}`}>
          unavailable
        </p>
      </div>
    );
  }
}

TimeslotInputSet.propTypes = {
  onChange: PropTypes.func.isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
};

export default TimeslotInputSet;
