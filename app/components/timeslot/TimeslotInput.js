import React, { Component } from 'react';
import { TimeslotInputSet } from './TimeslotInputSet';
import { TimeslotAddBreakButton } from './TimeslotAddBreakButton';

export class TimeslotInput extends Component {
    constructor(props) {
        super(props);
        this.handleAvailableChange = this.handleAvailableChange.bind(this);
        this.handleBreakChange = this.handleBreakChange.bind(this);
    }
    
    handleAvailableChange(to, change) {
        this.props.onChange("available", to, change);
    }
    handleBreakChange(to, change, index) {
        this.props.onChange("break", to, change, index);
    }

    render() {
        return (
            <div>
                <TimeslotInputSet   start={this.props.available.start} 
                                    end={this.props.available.end} 
                                    type="available"
                                    onChange={this.handleAvailableChange} />
                <TimeslotAddBreakButton onClick={this.props.onAddBreackClick} />
                {this.props.breaks.map((b, index) => (<TimeslotInputSet key={"inputBreak" + index}
                                                                        start={b.start}
                                                                        end={b.end}
                                                                        type="break"
                                                                        onChange={function(to, change) {this.handleBreakChange(to, change, index)}.bind(this)} />))}
            </div>
        );
    }
}