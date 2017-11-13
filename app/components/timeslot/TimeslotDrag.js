import React, { Component } from 'react';
import { TimeslotDragable } from "./TimeslotDragable";

export const splitHeight = 50;

const containerStyle = {
    background: 'gray',
    position: 'relative'
};

export const endTimeStyle = {
    position: 'absolute',
    right: '5px',
    bottom: '5px',
    margin: '0px'
};

export const startTimeStyle = {
    position: 'absolute',
    right: '5px',
    top: '5px',
    margin: '0px'
}

export class TimeslotDrag extends Component {
    constructor(props) {
        super(props);
        containerStyle.height = (this.props.end - this.props.start) / this.props.split * splitHeight;
    }
    
    render() {
        return (
            <div style={containerStyle}> 
                <p style={startTimeStyle}>{this.props.start}</p>
                <p style={endTimeStyle}>{this.props.end}</p>
                <TimeslotDragable start="660" end="780" split={this.props.split} startingSplit="1" />
            </div>
        );
    }
}
