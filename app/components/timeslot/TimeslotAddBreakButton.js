import React, { Component } from 'react';

export class TimeslotAddBreakButton extends Component {
    render() {
        return (
            <div style={{display:"table"}} onClick={this.props.onClick}>
                <div>
                <svg width="40" height="40">
                    <circle cx="20" cy="20" r="16" stroke="black" strokeWidth="3" fill="transparent" />
                    <line x1="20" x2="20" y1="10" y2="30" stroke="black" strokeWidth="4"/>
                    <line x1="10" x2="30" y1="20" y2="20" stroke="black" strokeWidth="4"/>
                </svg>
                </div>
                <p style={{display:"table-cell", verticalAlign:"middle"}}>Add a break</p>
            </div>
        );
    }
}
