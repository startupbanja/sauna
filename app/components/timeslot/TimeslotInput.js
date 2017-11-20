import React, { Component } from 'react';
import { TimeslotInputSet } from './TimeslotInputSet';
import { TimeslotAddBreakButton } from './TimeslotAddBreakButton';

export class TimeslotInput extends Component {
    render() {
        var breaks = [];
        for (var i = 0; i < this.props.breaks.length; i++) {
            var b = this.props.breaks[i];
            breaks.push(<TimeslotInputSet   key={"inputBreak" + i}
                                            start={b.start} 
                                            end={b.end} 
                                            type="break" />);
        }
        return (
            <div>
                <TimeslotInputSet   start={this.props.available.start} 
                                    end={this.props.available.end} 
                                    type="available"
                                    onChange={this.props.onChange} />
                <TimeslotAddBreakButton onClick={this.props.onAddBreackClick} />
                {breaks}
            </div>
        );
    }
}