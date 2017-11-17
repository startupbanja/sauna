import React, { Component } from 'react';
import { TimeslotDragable } from "./TimeslotDragable";

export const splitHeight = 50;

export class TimeslotDrag extends Component {
    render() {
        const containerStyle = {
            position: 'relative',
            height: (this.props.end - this.props.start) / this.props.split * splitHeight
        };
        return (
            <div style={containerStyle}> 
                <TimeslotDragable start={this.props.start} end={this.props.end} split={this.props.split} startingSplit="0" type="break" dragable="false" />
                <TimeslotDragable   start={this.props.available.start} 
                                    end={this.props.available.end} split={this.props.split} 
                                    startingSplit={(this.props.available.start - this.props.start) / this.props.split} 
                                    onChange={this.props.onAvailabilityChange}
                                    onManipulationEnd={this.props.onManipulationEnd}
                                    type="available" dragable="true" />
            </div>
        );
    }
}
