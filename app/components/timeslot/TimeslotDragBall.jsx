import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { totalHeight } from './TimeslotDrag';

class TimeslotDragBall extends Component {
  constructor(props) {
    super(props);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.state = {
      dragY: 0,
    };
  }

  handleDrag(event) {
    event.preventDefault();
    const clientY = (event.clientY !== 0) ? event.clientY : this.state.dragY;
    if (clientY === 0) return;
    let origY = event.target.parentElement.offsetTop;
    origY += (event.target.offsetTop + (totalHeight * 0.015));
    const dragY = clientY - event.target.closest('.dragContainer').getBoundingClientRect().top;
    this.props.onChange(dragY - origY);
  }

  handleTouchMove(event) {
    event.preventDefault();
    if (event.targetTouches.item(0).clientY === 0) return;
    let origY = event.target.parentElement.offsetTop;
    origY += (event.target.offsetTop + (totalHeight * 0.015));
    const dragY = event.targetTouches.item(0).clientY - event.target.closest('.dragContainer').getBoundingClientRect().top;
    this.props.onChange(dragY - origY);
  }

  render() {
    return (
      <div
        className={`timeslot-dragball ${this.props.position}`}
        draggable="true"
        onDrag={event => this.handleDrag(event)}
        // onDragStart and onDragEnd needed for dragging in Firefox
        onDragStart={(event) => {
          event.dataTransfer.setData('text/plain', null);
          document.ondragover = (eve) => {
            eve = eve || window.event; // eslint-disable-line
            this.setState({ dragY: eve.clientY });
          };
        }}
        onDragEnd={() => {
          document.ondragover = () => {};
          this.setState({ dragY: 0 });
        }}
        onTouchMove={this.handleTouchMove}
        // prevents browser scrolling when dragging
        onTouchEnd={() => {
          $('body').css({ overflow: 'auto' });
        }}
        onTouchStart={() => {
          $('body').css({ overflow: 'hidden' });
        }}
      />
    );
  }
}

TimeslotDragBall.propTypes = {
  onChange: PropTypes.func.isRequired,
  position: PropTypes.oneOf(['top', 'bottom']).isRequired,
};

export default TimeslotDragBall;
