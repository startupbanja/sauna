import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TimeslotDragBall } from './TimeslotDragBall';
import { parseTimeStamp } from './Timeslot';

const styles = {
  time: {
    position: 'absolute',
    right: '5px',
    margin: '0px',
  },
};
export default class TimeslotDragable extends Component {
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
      background: 'orange',
      position: 'absolute',
      height: this.props.ending - this.props.starting,
      top: this.props.starting,
      width: '100%',
    };
    if (this.props.dragable !== true) containerStyle.background = 'gray';
    else containerStyle.background = 'orange';
    let topDragBall = null;
    let bottomDragBall = null;
    if (this.props.dragable === true) {
      topDragBall = <TimeslotDragBall position="top" onChange={this.handleStartChange} />;
      bottomDragBall = <TimeslotDragBall position="bottom" onChange={this.handleEndChange} />;
    }
    return (
      <div className="dragableContainer" style={containerStyle}>
        <p style={Object.assign({ top: '5px' }, styles.time)}>{parseTimeStamp(this.props.start)}</p>
        <p style={Object.assign({ bottom: '5px' }, styles.time)}>{parseTimeStamp(this.props.end)}</p>
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
