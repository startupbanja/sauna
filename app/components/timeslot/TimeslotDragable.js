import React, { Component } from 'react';
import {splitHeight} from './TimeslotDrag';

const styles = {
    time: {
        position: 'absolute',
        right: '5px',
        margin: '0px'
    },
    dragBall: {
        borderRadius: '100%',
        background: 'black',
        position: 'absolute',
        left: '50%',
    }
};
export class TimeslotDragable extends Component {
    constructor(props) {
        super(props);
        Object.assign(styles.dragBall, {width: splitHeight * 0.2});
        Object.assign(styles.dragBall, {height: splitHeight * 0.2});
    }
    
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
            topDragBall = <div style={Object.assign({bottom: -splitHeight * 0.1}, styles.dragBall)}></div>
            bottomDragBall = <div style={Object.assign({top: -splitHeight * 0.1}, styles.dragBall)}></div>
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