import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import pageContent from './pageContent';

/* eslint-disable jsx-a11y/anchor-is-valid */ // disable complaining from Link


// React Component for the schedule view for admins.
export default class MeetingListView extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { dateAvailabilities: {} };
  //   this.getNextDate = this.getNextDate.bind(this);
  // }


  render() {
    const list = Object.entries(this.props.nOfAvailabilities).map((arr) => {
      const date = arr[0];
      const avail = arr[1];
      return (
        <li key={date}>
          <h2>{date}</h2>
          <p>{avail.done}/{avail.total} Coach availabilities given</p>
          <Link
            className="btn btn-primary"
            to={`/meetings/${date}/`}
          >
            View details
          </Link>
          <Link
            className="btn btn-primary"
            to={`/timetable/${date}/`}
          >
            View timetable
          </Link>
        </li>
      );
    });
    return (
      <div>
        <ul>
          {list}
        </ul>
      </div>
    );
  }
}

MeetingListView.propTypes = {
  nOfAvailabilities: PropTypes.objectOf(PropTypes.objectOf(PropTypes.number)).isRequired,
  // meetings: PropTypes.shape({
  //   startupTotal: PropTypes.number,
  //   startupDone: PropTypes.number,
  //   coachTotal: PropTypes.number,
  //   coachDone: PropTypes.number,
  // }).isRequired,
};
