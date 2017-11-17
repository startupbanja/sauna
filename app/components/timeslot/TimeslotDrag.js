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
                <TimeslotDragable start={this.props.start} end={this.props.end} split={this.props.split} startingSplit="0" type="unavailable" dragable="false" />
                <TimeslotDragable start={this.props.start + 60} end={this.props.end - 60} split={this.props.split} startingSplit="1" type="available" dragable="true" />
            </div>
        );
    }
}
