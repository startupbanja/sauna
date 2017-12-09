import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { totalHeight } from './TimeslotDrag';

const styles = {
  dragBall: {
    borderRadius: '100%',
    background: 'black',
    position: 'absolute',
    left: '50%',
  },
};

export class TimeslotDragBall extends Component {
  constructor(props) {
    super(props);
    Object.assign(styles.dragBall, { width: totalHeight * 0.03 });
    Object.assign(styles.dragBall, { height: totalHeight * 0.03 });
    this.handleDrag = this.handleDrag.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  }

  handleDrag(event) {
    if (event.clientY === 0) return;
    let origY = event.target.parentElement.offsetTop;
    origY += (event.target.offsetTop + (styles.dragBall.height / 2));
    const dragY = event.clientY - event.target.closest('.dragContainer').getBoundingClientRect().top;
    this.props.onChange(dragY - origY);
  }

  handleTouchMove(event) {
    if (event.targetTouches.item(0).clientY === 0) return;
    let origY = event.target.parentElement.offsetTop;
    origY += (event.target.offsetTop + (styles.dragBall.height / 2));
    const dragY = event.targetTouches.item(0).clientY - event.target.closest('.dragContainer').getBoundingClientRect().top;
    this.props.onChange(dragY - origY);
  }

  render() {
    let position = {};
    if (this.props.position === 'bottom') position = { bottom: -totalHeight * 0.015 };
    else if (this.props.position === 'top') position = { top: -totalHeight * 0.015 };
    return (
      <div
        draggable="true"
        onDrag={this.handleDrag}
        onTouchMove={this.handleTouchMove}
        style={Object.assign(position, styles.dragBall)}
      />
    );
  }
}

TimeslotDragBall.propTypes = {
  onChange: PropTypes.func.isRequired,
  position: PropTypes.oneOf(['top', 'bottom']).isRequired,
};
