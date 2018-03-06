import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ScheduleItem extends Component {
  render() {
    let nameText = 'break';
    if (this.props.type === 'meeting') nameText = this.props.name;
    const startTime = this.props.time.start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const endTime = this.props.time.end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return (
      <div className="text-center schedule-item-container">
        <p>{nameText}</p>
        <p>{`${startTime}`}<br />-<br />{`${endTime}`}</p>
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
  name: PropTypes.string,
};
ScheduleItem.defaultProps = {
  name: '',
};

export default ScheduleItem;
