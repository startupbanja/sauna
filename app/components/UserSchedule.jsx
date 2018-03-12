import React from 'react';
import PropTypes from 'prop-types';
import pageContent from './pageContent';
import ScheduleItem from './landing/ScheduleItem';

export default class Usertimetable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { timetable: undefined, date: undefined };
  }

  componentDidMount() {
    this.fetchTimetable();
  }

  fetchTimetable() {
    pageContent.fetchData('/userMeetings', 'GET', {})
      .then((response) => {
        this.setState({
          timetable: response.meetings,
          date: response.date,
        });
      });
  }

  render() {

    const data = this.props.timetable.sort((a, b) => a.startTime - b.startTime);
    for (let i = 0; i < data.length - 1; i += 1) {
      if (data[i].endTime < data[i + 1].startTime) {
        data.splice(i + 1, 0, {
          startTime: data[i].endTime,
          endTime: data[i + 1].startTime,
        });
      }

      if (i > data.length - 3) continue; // eslint-disable-line
      const scheduleItemContainers = [];
      for (let j = 0; j < 3; j += 1) {
        const scheduleItemData = data[i + j];
        let scheduleItem;
        if (scheduleItemData.name) {
          scheduleItem = (<ScheduleItem
            type="meeting"
            time={{
              start: new Date(`${this.props.date}T${scheduleItemData.startTime}`),
              end: new Date(`${this.props.date}T${scheduleItemData.endTime}`),
            }}
            name={scheduleItemData.name}
          />);
        } else {
          scheduleItem = (<ScheduleItem
            type="break"
            time={{
              start: new Date(`${this.props.date}T${scheduleItemData.startTime}`),
              end: new Date(`${this.props.date}T${scheduleItemData.endTime}`),
            }}
          />);
        }

    return (
      <div>
        <div className="timetable-header-style">{this.state.date}</div>
        {this.state.timetable.map(b => (
          <div id="figure" key={b.name}>
            <div className="timetable-text-style">
              <figcaption className="timetable-name-style">{b.name}</figcaption>
              {b.time}
            </div>
            <img src="../app/imgs/piste2.png" alt="" className="timetable-divider" />
          </div>
        ))}
      </div>
    );
  }
}

Usertimetable.propTypes = {
  timetable: PropTypes.shape({
    meetings: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      time: PropTypes.string,
      img: PropTypes.string,
    })).isRequired,
    date: PropTypes.string,
  }).isRequired,
};
