import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeslotInputElement from './TimeslotInputElement';
/* eslint jsx-a11y/label-has-for: "warn"
*/

class TimeslotInputSet extends Component {
  constructor(props) {
    super(props);
    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
  }

  handleStartChange(change) {
    this.props.onChange('start', change);
  }
  handleEndChange(change) {
    this.props.onChange('end', change);
  }

  render() {
    return (
      <div className="timeslot-input">
        <TimeslotInputElement
          id="start"
          time={this.props.start}
          onChange={this.handleStartChange}
        />
        <p>-</p>
        <TimeslotInputElement
          time={this.props.end}
          onChange={this.handleEndChange}
        />
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
