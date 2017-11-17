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
    constructor(props) {
        super(props);
        this.handleEndChange = this.handleEndChange.bind(this);
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleStartChange(change) {
        //check if changed enough
        this.handleChange("start", change);
    }
    handleEndChange(change) {
        this.handleChange("end", change);
    }
    handleChange(type, change) {
        this.props.onChange(type, change / this.props.split);
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
            topDragBall = <TimeslotDragBall position="top" onChange={this.handleStartChange} onManipulationEnd={this.props.onManipulationEnd} />
            bottomDragBall = <TimeslotDragBall position="bottom" onChange={this.handleEndChange} onManipulationEnd={this.props.onManipulationEnd} />;
        }
        return (
            <div style={containerStyle}>
                <p style={Object.assign({top: '5px'}, styles.time)}>{parseTimeStamp(this.props.start)}</p>
                <p style={Object.assign({bottom: '5px'}, styles.time)}>{parseTimeStamp(this.props.end)}</p>
                {topDragBall}
                {bottomDragBall}
            </div>
        );
    }
}

function parseTimeStamp(minutes) {
    var hours = parseInt(minutes / 60);
    var minutesOver = minutes % 60;
    if (minutesOver < 10) minutesOver = "0" + minutesOver;
    return hours + ":" + minutesOver;
}