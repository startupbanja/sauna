import React, { Component } from 'react';
import { TimeslotInputSet } from './TimeslotInputSet';

export class TimeslotInput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <TimeslotInputSet   start={this.props.available.start} 
                                    end={this.props.available.end} 
                                    type="available"
                                    onChange={this.props.onChange} />
            </div>
        );
    }
}