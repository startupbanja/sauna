import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeslotDragable from './TimeslotDragable';

export const totalHeight = 300;

// the draggable componet for setting the availability
class TimeslotDrag extends Component {
  constructor(props) {
    super(props);
    this.handleAvailableChange = this.handleAvailableChange.bind(this);
  }

  // change the distance dragged to corresponding minutes and pass the result forward
  handleAvailableChange(to, change) {
    this.props.onChange(to, (change / totalHeight) * (this.props.end - this.props.start));
  }

  render() {
    const containerStyle = {
      position: 'relative',
      height: totalHeight,
      overflow: 'hidden',
    };
    let starting = (this.props.available.start - this.props.start) * totalHeight;
    starting /= (this.props.end - this.props.start);
    let ending = (this.props.available.end - this.props.start) * totalHeight;
    ending /= (this.props.end - this.props.start);
    return (
      <div className="dragContainer" style={containerStyle}>
        {/* undraggable background for the component */}
        <TimeslotDragable
          start={this.props.start}
          end={this.props.end}
          starting={0}
          ending={totalHeight}
          type="break"
          dragable={false}
          split={this.props.split}
          totalHeight={totalHeight}
        />
        {/* the draggable availability box */}
        <TimeslotDragable
          start={this.props.available.start}
          end={this.props.available.end}
          starting={starting}
          ending={ending}
          onChange={this.handleAvailableChange}
          type="available"
          dragable
        />
      </div>
    );
  }
}

TimeslotDrag.propTypes = {
  onChange: PropTypes.func.isRequired,
  end: PropTypes.number.isRequired,
  start: PropTypes.number.isRequired,
  available: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
  }).isRequired,
  // length of one meeting
  split: PropTypes.number.isRequired,
};

export default TimeslotDrag;
