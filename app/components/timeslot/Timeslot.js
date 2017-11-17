import React from 'react';
import {TimeslotDrag} from './TimeslotDrag';
import {TimeslotInput} from './TimeslotInput';

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
        this.handleAvailabilityChange = this.handleAvailabilityChange.bind(this);
        this.handleManipulationEnd = this.handleManipulationEnd.bind(this);
    }

    handleAvailabilityChange(type, change) {
        var newAvailable = {
            available: {
                start: this.state.available.start,
                end: this.state.available.end
            }
        };
        if (type === 'start') newAvailable.available.start = this.state.available.start + change * split
        if (type === 'end') newAvailable.available.end = this.state.available.end + change * split
        this.setState(newAvailable);
    }
    handleManipulationEnd() {
        var newAvailable = {
            available: {
                start: Math.round(this.state.available.start / split) * split,
                end: Math.round(this.state.available.end / split) * split
            }
        };
        this.setState(newAvailable);
    }

    render() {
        return (
            <div>
                <TimeslotDrag   start={parseTimestamp(startTime)}
                                end={parseTimestamp(endTime)}
                                available={this.state.available}
                                split={split}
                                onAvailabilityChange={this.handleAvailabilityChange}
                                onManipulationEnd={this.handleManipulationEnd} />
                <TimeslotInput start={parseTimestamp(startTime)} end={parseTimestamp(endTime)} split={split} />
            </div>
        );
    }
}

function parseTimestamp(timeString) {
    if (!timeString.match(/^[0-2]?\d:[0-5]\d$/)) return 0;
    var pieces = timeString.split(":");
    return parseInt(pieces[0]) * 60 + parseInt(pieces[1]);
}
