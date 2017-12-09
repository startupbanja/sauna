import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TimeslotInputSet } from './TimeslotInputSet';

export class TimeslotInput extends Component {
  render() {
    return (
      <div>
        <TimeslotInputSet
          start={this.props.available.start}
          end={this.props.available.end}
          type="available"
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

TimeslotInput.propTypes = {
  available: PropTypes.shape({
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};
