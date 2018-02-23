import React from 'react';
import PropTypes from 'prop-types';
import pageContent from './pageContent';

export default class MeetingDetailView extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { };
  //   this.runMatchmaking = this.runMatchmaking.bind(this);
  // }

  render() {
    const availabilityList = this.props.availabilities.entries.map((name, filled) => (
      <li key={name}>
        {name}: {filled || '-'}
      </li>
    ));

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
  availabilities: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
};
