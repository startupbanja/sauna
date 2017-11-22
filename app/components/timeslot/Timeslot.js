import React from 'react';
import {TimeslotDrag} from './TimeslotDrag';
import {TimeslotInput} from './TimeslotInput';

export class Timeslot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            available: {
                start: parseMinutes(this.props.start),
                end: parseMinutes(this.props.end)
            },
            breaks: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleBreakAddition = this.handleBreakAddition.bind(this);
    }

    handleChange(type, to, change, index = 0) {
        change = Math.round(change / this.props.split);
        let newStart;
        if (type === "break") newStart = this.state.breaks[index].start;
        else newStart = this.state.available.start;
        let newEnd;
        if (type === "break") newEnd = this.state.breaks[index].end;
        else newEnd = this.state.available.end;
        if (to === 'start') {
            newStart = Math.min(Math.max(newStart + change * this.props.split, parseMinutes(this.props.start)), newEnd);
        }
        else if (to === 'end') {
            newEnd = Math.max(Math.min(newEnd + change * this.props.split, parseMinutes(this.props.end)), newStart);
        }
        let newObj;
        if (type === "break") {
            newObj = this.state.breaks;
            newObj[index] = {start: newStart, end: newEnd};
            newObj = {breaks: newObj};
        } else {
            newObj = {available: {start: newStart, end: newEnd}};
        }
        this.setState(newObj);
    }
    handleBreakAddition() {
        for (var i = this.state.available.start + this.props.split; i < this.state.available.end; i+=this.props.split) {
            var notSuited = false;
            for (var j = 0; j < this.state.breaks.length && !notSuited; j++) {
                if (this.state.breaks[j].start <= i && this.state.breaks[j].end >= i) notSuited = true;
            }
            if (!notSuited) {
                var newBreaks = this.state.breaks;
                newBreaks.push({start: i, end: i + this.props.split});
                this.setState({breaks: newBreaks});
                return;
            }
        }
        var newBreaks = this.state.breaks;
        newBreaks.push({start: this.state.available.start, end: this.state.available.start + this.props.split});
        this.setState({breaks: newBreaks});
    }

    render() {
        return (
            <div style={{width: '300px'}}>
                <TimeslotDrag   start={parseMinutes(this.props.start)}
                                end={parseMinutes(this.props.end)}
                                available={this.state.available}
                                breaks={this.state.breaks}
                                split={this.props.split}
                                onChange={this.handleChange} />
                <TimeslotInput  available={this.state.available}
                                breaks={this.state.breaks}
                                onChange={this.handleChange}
                                onAddBreackClick={this.handleBreakAddition} />
            </div>
        );
    }
}

export function parseMinutes(timeString) {
    if (!timeString.match(/^([0-1]?\d|2[0-3]):[0-5]\d$/)) return false;
    var pieces = timeString.split(":");
    return parseInt(pieces[0]) * 60 + parseInt(pieces[1]);
}
export function parseTimeStamp(minutes) {
    if (minutes < 0 || minutes >= 1440) return false;
    var hours = parseInt(minutes / 60);
    var minutesOver = minutes % 60;
    if (minutesOver < 10) minutesOver = "0" + minutesOver;
    return hours + ":" + minutesOver;
}
