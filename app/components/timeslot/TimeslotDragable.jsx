import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeslotDragBall from './TimeslotDragBall';
import { parseTimeStamp } from './Timeslot';

class TimeslotDragable extends Component {
  constructor(props) {
    super(props);
    this.handleEndChange = this.handleEndChange.bind(this);
    this.handleStartChange = this.handleStartChange.bind(this);
  }

  handleStartChange(change) {
    this.props.onChange('start', change);
  }
  handleEndChange(change) {
    this.props.onChange('end', change);
  }

  render() {
    const containerStyle = {
      height: this.props.ending - this.props.starting,
      top: this.props.starting,
    };
    let classes = 'dragableContainer';
    if (this.props.dragable !== true) classes += ' unavailable';
    let topDragBall = null;
    let bottomDragBall = null;
    if (this.props.dragable === true) {
      topDragBall = <TimeslotDragBall position="top" onChange={this.handleStartChange} />;
      bottomDragBall = <TimeslotDragBall position="bottom" onChange={this.handleEndChange} />;
    }
    return (
      <div className={classes} style={containerStyle}>
        <p style={{ top: '5px' }}>{parseTimeStamp(this.props.start)}</p>
        <p style={{ bottom: '5px' }}>{parseTimeStamp(this.props.end)}</p>
        {topDragBall}
        {bottomDragBall}
      </div>
    );
  }
}

TimeslotDragable.propTypes = {
  onChange: PropTypes.func, // eslint-disable-line
  ending: PropTypes.number.isRequired,
  starting: PropTypes.number.isRequired,
  dragable: PropTypes.bool.isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
};

export default TimeslotDragable;
