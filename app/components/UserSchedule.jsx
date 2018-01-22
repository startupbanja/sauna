import React from 'react';
import PropTypes from 'prop-types';

export default class UserSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = { schedule: props.schedule };
  }
  render() {
    return (
      <div>
        <h1 className="schedule-header-style">{this.state.schedule.date}</h1>
        {this.state.schedule.meetings.map(b => (
          <div id="figure" key={b.name}>
            <div className="schedule-text-style">
              <img className="schedule-list-avatar" src={b.img} alt="" />
              <figcaption className="schedule-name-style">{b.name}</figcaption>
              {b.time}
            </div>
            <img src="../app/imgs/piste2.png" alt="" className="divider" />
          </div>
        ))}
      </div>
    );
  }
}

UserSchedule.propTypes = {
  schedule: PropTypes.shape({
    meetings: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      time: PropTypes.string,
      img: PropTypes.string,
    })).isRequired,
    date: PropTypes.string,
  }).isRequired,
};
