import React from 'react';
import {TimeslotDrag} from './TimeslotDrag';
import {TimeslotInput} from './TimeslotInput';

export class Timeslot extends React.Component {
    render() {
        return (
            <div>
                <TimeslotDrag start="600" end="960" split="60" />
                <TimeslotInput start="600" end="960" split="60" />
            </div>
        );
    }
}
