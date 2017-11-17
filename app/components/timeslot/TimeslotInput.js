import React, { Component } from 'react';
import { TimeslotInputSet } from './TimeslotInputSet';

export class TimeslotInput extends Component {
    render() {
        return (
            <div>
                <TimeslotInputSet start={this.props.available.start} end={this.props.available.end} type="available" />
            </div>
        );
    }
}