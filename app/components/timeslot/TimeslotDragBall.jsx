import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    const clientY = (event.clientY !== 0) ? event.clientY : this.state.dragY;
    if (clientY === 0) return;
    let origY = event.target.parentElement.offsetTop;
    origY += (event.target.offsetTop + (totalHeight * 0.015));
    const dragY = clientY - event.target.closest('.dragContainer').getBoundingClientRect().top;
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
