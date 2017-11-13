import React, { Component } from 'react';

export class TimeslotInput extends Component {
    render() {
        return (
            <div>
                <p>A input container with start {this.props.start} and end {this.props.end}</p>
            </div>
        );
    }
}