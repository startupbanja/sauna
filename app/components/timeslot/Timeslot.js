import React from 'react';
import {TimeslotDrag} from './TimeslotDrag';
import {TimeslotInput} from './TimeslotInput';

export class Timeslot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            available: {
                start: parseMinutes(this.props.start),
                end: parseMinutes(this.props.start)
            }
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(to, change) {
        var newStart = this.state.available.start;
        var newEnd = this.state.available.end;
        if (to === 'start') {
            newStart = Math.round(Math.min(Math.max(newStart + change, parseMinutes(this.props.start)), newEnd));
        }
        else if (to === 'end') {
            newEnd = Math.round(Math.max(Math.min(newEnd + change, parseMinutes(this.props.end)), newStart));
        }
        var newObj = {available: {start: newStart, end: newEnd}};
        this.setState(newObj);
    }

    render() {
        return (
            <div style={{width: '300px'}}>
                <TimeslotDrag   start={parseMinutes(this.props.start)}
                                end={parseMinutes(this.props.end)}
                                available={this.state.available}
                                onChange={this.handleChange} />
                <TimeslotInput  available={this.state.available}
                                onChange={this.handleChange} />
            </div>
        );
    }
}

export function parseMinutes(timeString) {
    if (!timeString.match(/^([0-1]?\d|2[0-3]):[0-5]\d$/)) return false;
    var pieces = timeString.split(":");
    return parseInt(pieces[0]) * 60 + parseInt(pieces[1]);
}
export function parseTimeStamp(minutes) {
    if (minutes < 0 || minutes >= 1440) return false;
    var hours = parseInt(minutes / 60);
    var minutesOver = minutes % 60;
    if (minutesOver < 10) minutesOver = "0" + minutesOver;
    return hours + ":" + minutesOver;
}
