import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TimeslotDragable } from './TimeslotDragable';

export const totalHeight = 400;

export class TimeslotDrag extends Component {
  constructor(props) {
    super(props);
    this.handleAvailableChange = this.handleAvailableChange.bind(this);
  }

  handleAvailableChange(to, change) {
    this.props.onChange(to, (change / totalHeight) * (this.props.end - this.props.start));
  }

  render() {
    const containerStyle = {
      position: 'relative',
      height: totalHeight,
    };
    let starting = (this.props.available.start - this.props.start) * totalHeight;
    starting /= (this.props.end - this.props.start);
    let ending = (this.props.available.end - this.props.start) * totalHeight;
    ending /= (this.props.end - this.props.start);
    return (
      <div className="dragContainer" style={containerStyle}>
        <TimeslotDragable
          start={this.props.start}
          end={this.props.end}
          starting={0}
          ending={totalHeight}
          type="break"
          dragable={false}
        />
        <TimeslotDragable
          start={this.props.available.start}
          end={this.props.available.end}
          starting={starting}
          ending={ending}
          onChange={this.handleAvailableChange}
          type="available"
          dragable={true}
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
};
