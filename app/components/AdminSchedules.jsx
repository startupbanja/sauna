import React from 'react';
import PropTypes from 'prop-types';
import AdminScheduleTable from './AdminScheduleTable';
import pageContent from './pageContent';
// React Component for the schedule view for admins.
export default class AdminSchedules extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: this.props.date , schedule: [], firstColumn: 'coach' };
    this.getTimetable = this.getTimetable.bind(this);
    this.toggle = this.toggle.bind(this);
    this.getTimetable();
  }

  getTimetable() {
    pageContent.fetchData('/meetings', 'GET', { date: this.props.date }).then((response) => {
      this.setState({ schedule: response.schedule });
    });
  }

  toggle(n) {
    this.setState({ firstColumn: n });
  }

  render() {
    return (
      <div>
        <div className="toggle-container">
          <h1>Timetable</h1>
          <h2>{this.state.date}</h2>
          <div className="">
            <ul className="toggle-ul">
              <li>
                {/* conditionally set active class based on firstColumn */}
                <button
                  className={`toggle-button ${this.state.firstColumn === 'coach' ? 'active' : ''}`}
                  onClick={() => this.toggle('coach')}
                >
                  Coaches
                </button>
              </li>
              <li>
                <button
                  className={`toggle-button ${this.state.firstColumn === 'startup' ? 'active' : ''}`}
                  onClick={() => this.toggle('startup')}
                >
                Startups
                </button>
              </li>
            </ul>
          </div>
        </div>
        <AdminScheduleTable schedule={this.state.schedule} firstColumn={this.state.firstColumn} />
      </div>
    );
  }
}

AdminSchedules.propTypes = {
  date: PropTypes.string.isRequired,
}
