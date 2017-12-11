import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { parseTimeStamp, parseMinutes } from './Timeslot';

function handleKeypress(event) {
  if (event.key === 'Enter') {
    event.target.blur();
  }
}

class TimeslotInputElement extends Component {
  constructor(props) {
    super(props);
    this.state = { editedValue: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleChange(event) {
    this.setState({ editedValue: event.target.value });
  }
  handleBlur(event) {
    this.setState({ editedValue: '' });
    if (parseMinutes(event.target.value) !== false) {
      this.props.onChange(parseMinutes(event.target.value) - this.props.time);
    }
  }

  render() {
    let value = parseTimeStamp(this.props.time);
    if (this.state.editedValue !== '') value = this.state.editedValue;
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
};

export default TimeslotInputElement;
