import React from 'react';
import PropTypes from 'prop-types';

export default class MeetingDetailView extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { date: '' };
  //   // this.getNextDate = this.getNextDate.bind(this);
  // }
  render() {
    const list = this.props.availabilities[this.props.date] ?
      Object.entries(this.props.availabilities[this.props.date]) : [];
    const availabilityList = list.map((arr) => {
      const name = arr[0];
      const filled = arr[1];
      return (
        <li key={name}>
          <p>
            {name}: {filled || '-'}
          </p>
        </li>
      );
    });

    return (
      <div>
        <h1>Meeting</h1>
        <h2>{this.props.date}</h2>
        <div className="availabilityContainer">
          <ul>
            {availabilityList}
          </ul>
        </div>

        <button>Run!</button>
      </div>
    );
  }
}

MeetingDetailView.propTypes = {
  date: PropTypes.string.isRequired,
  availabilities: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)).isRequired,
};
