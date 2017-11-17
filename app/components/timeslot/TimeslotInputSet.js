import React, { Component } from 'react';
import {parseTimeStamp} from './Timeslot';

const styles = {
    input: {
        position: 'absolute',
        right: 0,
    },
    container: {
        position: 'relative',
        margin: '5px'
    }
};

export class TimeslotInputSet extends Component {
    render() {
        var breakText = "";
        if (this.props.type === 'break') breakText = " of break";
        return (
            <div>
                <div style={styles.container}>
                    <label>{"Start" + breakText}</label>
                    <input style={styles.input} value={parseTimeStamp(this.props.start)} type="text" />
                </div>
                <div style={styles.container}>
                    <label>{"End" + breakText}</label>
                    <input style={styles.input} value={parseTimeStamp(this.props.end)} type="text" />
                </div>
            </div>
        );
    }
}