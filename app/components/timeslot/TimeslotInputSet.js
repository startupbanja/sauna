import React, { Component } from 'react';
import { TimeslotInputElement } from './TimeslotInputElement';

const styles = {
    container: {
        position: 'relative',
        margin: '5px'
    }
};

export class TimeslotInputSet extends Component {
    constructor(props) {
        super(props);
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
    }

    handleStartChange(change) {
        this.props.onChange("start", change);
    }
    handleEndChange(change) {
        this.props.onChange("end", change);
    }
    
    render() {
        var breakText = "";
        if (this.props.type === 'break') breakText = " of break";
        return (
            <div>
                <div style={styles.container}>
                    <label>{"Start" + breakText}</label>
                    <TimeslotInputElement   time={this.props.start} 
                                            onChange={this.handleStartChange}  />
                </div>
                <div style={styles.container}>
                    <label>{"End" + breakText}</label>
                    <TimeslotInputElement   time={this.props.end} 
                                            onChange={this.handleEndChange} />
                </div>
            </div>
        );
    }
}