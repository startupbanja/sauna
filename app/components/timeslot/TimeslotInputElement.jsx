import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { parseTimeStamp, parseMinutes } from './Timeslot';

// trigger blur when pressing enter
function handleKeypress(event) {
  if (event.key === 'Enter') {
    event.target.blur();
  }
}

// component for changing time for either start or end
class TimeslotInputElement extends Component {
  constructor(props) {
    super(props);
    this.state = { editedValue: this.getValue() };
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.getValue = this.getValue.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // if availability has been changed elsewhere round the display time or set unavailable
    let value = parseTimeStamp(Math.round(nextProps.time / 5) * 5);
    if (nextProps.unavailable) value = '--:--';
    this.setState({ editedValue: value });
  }

  // figure out the value to be displayed (round and mark as unavailable)
  getValue() {
    let value = parseTimeStamp(Math.round(this.props.time / 5) * 5);
    if (this.props.unavailable) value = '--:--';
    return value;
  }

  handleChange(event) {
    this.setState({ editedValue: event.target.value });
  }
  handleBlur(event) {
    this.setState({ editedValue: this.getValue() });
    if (parseMinutes(event.target.value) !== false) {
      // if the input format is correct
      // calculate the desired change from previous value in minutes
      this.props.onChange(parseMinutes(event.target.value) - this.props.time);
    } else {
      // if the input is incorrect make the user unavailable
      this.props.markAsUnavailable();
    }
  }

  render() {
    let value = this.getValue();
    if (this.state.editedValue !== value) value = this.state.editedValue;
    return (
      <input
        onKeyPress={handleKeypress}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        value={value}
        type="text"
      />
    );
  }
}

TimeslotInputElement.propTypes = {
  onChange: PropTypes.func.isRequired,
  time: PropTypes.number.isRequired,
  unavailable: PropTypes.bool,
  markAsUnavailable: PropTypes.func.isRequired,
};

TimeslotInputElement.defaultProps = {
  unavailable: false,
};

export default TimeslotInputElement;
