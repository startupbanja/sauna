import React, { Component } from 'react';
import {splitHeight} from './TimeslotDrag';
import {TimeslotDragBall} from './TimeslotDragBall';

const styles = {
    time: {
        position: 'absolute',
        right: '5px',
        margin: '0px'
    }
};
export class TimeslotDragable extends Component {
    
    render() {
        const containerStyle = {
            background: 'orange',
            position: 'absolute',
            height: (this.props.end - this.props.start) / this.props.split * splitHeight,
            top: this.props.startingSplit * splitHeight,
            width: '100%'
        };
        if (this.props.type === "unavailable") containerStyle.background = "gray";
        else containerStyle.background = "orange";
        var topDragBall = null
        var bottomDragBall = null
        if (this.props.dragable === 'true') {
            topDragBall = <TimeslotDragBall position="top" />
            bottomDragBall = <TimeslotDragBall position="bottom" />;
        }
        return (
            <div style={containerStyle}>
                <p style={Object.assign({top: '5px'}, styles.time)}>{this.props.start}</p>
                <p style={Object.assign({bottom: '5px'}, styles.time)}>{this.props.end}</p>
                {topDragBall}
                {bottomDragBall}
            </div>
        );
    }
}