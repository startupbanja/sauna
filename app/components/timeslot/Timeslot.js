import React from 'react';
import {TimeslotDrag} from './TimeslotDrag';
import {TimeslotInput} from './TimeslotInput';
import { TimeslotAddBreakButton } from './TimeslotAddBreakButton';

const startTime = "10:00";
const endTime = "16:00";
const split = 60;
export class Timeslot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            available: {
                start: 600,
                end: 960
            }
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(type, change) {
        var correction = Math.sign(change) * (split - Math.abs(change) % split);
        change = Math.round(change / split);
        var newAvailable = {
            available: {
                start: this.state.available.start,
                end: this.state.available.end
            }
        };
        if (type === 'start') {
            newAvailable.available.start = Math.min(Math.max(this.state.available.start + change * split, parseMinutes(startTime)), this.state.available.end);
        }
        if (type === 'end') {
             newAvailable.available.end = Math.max(Math.min(this.state.available.end + change * split, parseMinutes(endTime)), this.state.available.start);
        }
        this.setState(newAvailable);
    }

    render() {
        return (
            <div style={{width: '300px'}}>
                <TimeslotDrag   start={parseMinutes(startTime)}
                                end={parseMinutes(endTime)}
                                available={this.state.available}
                                split={split}
                                onChange={this.handleChange} />
                <TimeslotInput  start={parseMinutes(startTime)} 
                                end={parseMinutes(endTime)} 
                                available={this.state.available}
                                split={split}
                                onChange={this.handleChange} />
                <TimeslotAddBreakButton />
            </div>
        );
    }
}

export function parseMinutes(timeString) {
    if (!timeString.match(/^[0-2]?\d:[0-5]\d$/)) return false;
    var pieces = timeString.split(":");
    return parseInt(pieces[0]) * 60 + parseInt(pieces[1]);
}
export function parseTimeStamp(minutes) {
    var hours = parseInt(minutes / 60);
    var minutesOver = minutes % 60;
    if (minutesOver < 10) minutesOver = "0" + minutesOver;
    return hours + ":" + minutesOver;
}
