import React, { Component } from 'react';
import {parseTimeStamp, parseMinutes} from './Timeslot';

const styles = {
    input: {
        position: 'absolute',
        right: 0,
    }
};

export class TimeslotInputElement extends Component {
    constructor(props) {
        super(props);
        this.state = {editedValue: ""};
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);
    }

    handleChange(event) {
        this.setState({editedValue: event.target.value});
    }
    handleBlur(event) {
        this.setState({editedValue: ""});
        if (parseMinutes(event.target.value) !== false) {
            this.props.onChange(parseMinutes(event.target.value) - this.props.time);
        }
    }
    handleKeypress(event) {
        if (event.key == 'Enter') {
            event.target.blur();
        }
    }
    
    render() {
        var value = parseTimeStamp(this.props.time);
        if (this.state.editedValue !== "") value = this.state.editedValue;
        return (
            <input onKeyPress={this.handleKeypress} onChange={this.handleChange} onBlur={this.handleBlur} style={styles.input} value={value} type="text" />
        );
    }
}