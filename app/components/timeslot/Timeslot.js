import React from 'react';
import {TimeslotDrag} from './TimeslotDrag';
import {TimeslotInput} from './TimeslotInput';

const startTime = "10:00";
const endTime = "16:00";
export class Timeslot extends React.Component {
    render() {
        return (
            <div>
                <TimeslotDrag start={parseTimestamp(startTime)} end={parseTimestamp(endTime)} split="60" />
                <TimeslotInput start={parseTimestamp(startTime)} end={parseTimestamp(endTime)} split="60" />
            </div>
        );
    }
}

function parseTimestamp(timeString) {
    if (!timeString.match(/^[0-2]?\d:[0-5]\d$/)) return 0;
    var pieces = timeString.split(":");
    return parseInt(pieces[0]) * 60 + parseInt(pieces[1]);
}
