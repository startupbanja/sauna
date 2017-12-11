import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { totalHeight } from './TimeslotDrag';

class TimeslotDragBall extends Component {
  constructor(props) {
    super(props);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  }

  handleDrag(event) {
    if (event.clientY === 0) return;
    let origY = event.target.parentElement.offsetTop;
    origY += (event.target.offsetTop + (totalHeight * 0.015));
    const dragY = event.clientY - event.target.closest('.dragContainer').getBoundingClientRect().top;
    this.props.onChange(dragY - origY);
  }

  handleTouchMove(event) {
    if (event.targetTouches.item(0).clientY === 0) return;
    let origY = event.target.parentElement.offsetTop;
    origY += (event.target.offsetTop + (totalHeight * 0.015));
    const dragY = event.targetTouches.item(0).clientY - event.target.closest('.dragContainer').getBoundingClientRect().top;
    this.props.onChange(dragY - origY);
  }

  render() {
    const styles = {
      height: totalHeight * 0.03,
      width: totalHeight * 0.03,
    };
    if (this.props.position === 'bottom') styles.bottom = -totalHeight * 0.015;
    else if (this.props.position === 'top') styles.top = -totalHeight * 0.015;
    return (
      <div
        className="timeslot-dragball"
        draggable="true"
        onDrag={this.handleDrag}
        onTouchMove={this.handleTouchMove}
        style={styles}
      />
    );
  }
}

TimeslotDragBall.propTypes = {
  onChange: PropTypes.func.isRequired,
  position: PropTypes.oneOf(['top', 'bottom']).isRequired,
};

export default TimeslotDragBall;
