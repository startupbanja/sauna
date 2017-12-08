import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class ScheduleItem extends Component {
  render() {
    let coachText = 'break';
    if (this.props.type === 'meeting') coachText = this.props.coach;
    const startTime = this.props.time.start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const endTime = this.props.time.end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return (
      <div style={{ background: 'red', height: 200 }}>
        <p>{coachText}</p>
        <p>{`${startTime} - ${endTime}`}</p>
        <p>{this.props.table}</p>
      </div>
    );
  }
}

ScheduleItem.propTypes = {
  type: PropTypes.oneOf(['break', 'meeting']).isRequired,
  time: PropTypes.shape({
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
  coach: PropTypes.string,
  table: PropTypes.string,
};
ScheduleItem.defaultProps = {
  coach: '',
  table: '',
};
