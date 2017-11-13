import React, { Component } from 'react';
import {endTimeStyle, startTimeStyle, splitHeight} from './TimeslotDrag';

const containerStyle = {
    background: 'orange',
    position: 'relative',
};

export class TimeslotDragable extends Component {
    constructor(props) {
        super(props);
        containerStyle.height = (this.props.end - this.props.start) / this.props.split * splitHeight;
        containerStyle.top = this.props.startingSplit * splitHeight;
    }
    
    render() {
        return (
            <div style={containerStyle}>
                <p style={startTimeStyle}>{this.props.start}</p>
                <p style={endTimeStyle}>{this.props.end}</p>
            </div>
        );
    }
}