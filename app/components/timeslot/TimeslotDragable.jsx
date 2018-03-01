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
    let splitBreaks = null;
    if (this.props.dragable === true) {
      topDragBall = <TimeslotDragBall position="top" onChange={this.handleStartChange} />;
      bottomDragBall = <TimeslotDragBall position="bottom" onChange={this.handleEndChange} />;
    } else {
      splitBreaks = [];
      const splitCount = ((this.props.end - this.props.start) / this.props.split);
      const splitHeight = this.props.totalHeight / splitCount;
      for (let i = 1; i < splitCount; i += 1) {
        splitBreaks.push(<hr style={{ top: ((i * splitHeight) - (i * 2)) + 1 }} key={`hr_${i}`} />);
      }
    }
    return (
      <div className={classes} style={containerStyle}>
        <p style={{ top: '5px' }}>{parseTimeStamp(Math.round(this.props.start / 5) * 5)}</p>
        {splitBreaks}
        <p style={{ bottom: '5px' }}>{parseTimeStamp(Math.round(this.props.end / 5) * 5)}</p>
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
  split: PropTypes.number,
  totalHeight: PropTypes.number,
};

TimeslotDragable.defaultProps = {
  split: 1,
  totalHeight: 0,
};

export default TimeslotDragable;
