import React from 'react';
import PropTypes from 'prop-types';

export default class UserSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = { schedule: props.schedule };
  }
  render() {
    // const styles = {
    //   dot: {
    //     // display: 'inline',
    //     height: '10px',
    //     width: '10px',
    //     background: '#A3A3A3',
    //     borderRadius: '100%',
    //   },
    // };

    return (
      <div>
        <h1 className="header-style">{this.state.schedule.date}</h1>
        {this.state.schedule.meetings.map(b => (
          <div id="figure" key={b.name}>
            <div className="fullWidth text-style">
              <img className="list-avatar" src={b.img} alt="" />
              <figcaption className="name-style">{b.name}</figcaption>
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
    })),
    date: PropTypes.string,
  }).isRequired,
};
