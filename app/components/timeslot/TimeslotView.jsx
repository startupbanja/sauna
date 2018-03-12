import React, { Component } from 'react';
import pageContents from '../pageContent';
import Timeslot, { parseMinutes, parseTimeStamp } from './Timeslot';
import StatusMessage from '../StatusMessage';
import '../../styles/timeslot_style.css';

/* Component to handle availability data between backend and Timeslot */
class TimeslotView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      data: [],
      message: undefined,
    };
    this.renderTimeslot = this.renderTimeslot.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.submitAvailability = this.submitAvailability.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    pageContents.fetchData('/getComingMeetingDays', 'GET', {})
      .then((result) => {
        const newData = [];
        result.forEach((day) => {
          const start = parseMinutes(new Date(`${day.date}T${day.startTime}`).toTimeString().substr(0, 5));
          const end = parseMinutes(new Date(`${day.date}T${day.endTime}`).toTimeString().substr(0, 5));
          newData.push({
            date: new Date(day.date),
            start,
            end,
            split: day.split,
            available: {
              start: (day.time === null) ? start : parseMinutes(day.time),
              end: (day.duration === null) ? start : parseMinutes(day.time) + day.duration,
            },
          });
        });
        this.setState({ data: newData });
      });
  }

  submitAvailability(startAvail, endAvail) {
    const meetingDay = this.state.data[this.state.index];
    let startTime = Math.ceil((startAvail - meetingDay.start) / meetingDay.split);
    startTime = (startTime * meetingDay.split) + meetingDay.start;
    let endTime = Math.floor((endAvail - meetingDay.start) / meetingDay.split);
    endTime = (endTime * meetingDay.split) + meetingDay.start;
    pageContents.fetchData('/insertAvailability', 'POST', {
      date: meetingDay.date.toISOString().substr(0, 10),
      start: parseTimeStamp(startTime),
      end: parseTimeStamp(endTime),
    }).then((result) => {
      if (result.status === 'success') {
        const oldData = this.state.data;
        oldData[this.state.index].available = {
          start: startTime,
          end: endTime,
        };
        this.setState({
          data: oldData,
          message: {
            text: 'Saved',
            type: 'success',
          },
        });
      } else {
        this.setState({
          message: {
            text: 'Error when saving availability',
            type: 'error',
          },
        });
      }
    });
  }

  changeDate(diff) {
    this.setState({
      index: Math.min(this.state.data.length - 1, Math.max(0, this.state.index + diff)),
    });
  }

  renderTimeslot() {
    if (this.state.data.length > 0) {
      const day = this.state.data[this.state.index];
      return (
        <Timeslot
          key={day.date}
          start={day.start}
          end={day.end}
          split={day.split}
          available={day.available}
          date={day.date}
          onSubmit={this.submitAvailability}
          onMoveToPrev={((this.state.index > 0) || undefined) && (() => this.changeDate(-1))}
          onMoveToNext={((this.state.index < this.state.data.length - 1) || undefined)
            && (() => this.changeDate(1))}
          statusMessage={this.state.message}
        />
      );
    }
    return undefined;
  }

  render() {
    return (
      <div className="timeslot-picker">
        {/* <link rel="stylesheet" type="text/css" href="app/styles/timeslot_style.css" /> */}
        <StatusMessage message={this.state.message} />
        {this.renderTimeslot()}
      </div>
    );
  }
}

export default TimeslotView;
