import React from 'react';
import PropTypes from 'prop-types';
import AdminScheduleTable from './AdminScheduleTable';
import pageContent from '../pageContent';

// React Component for the schedule view for admins.
export default class AdminSchedules extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: this.props.date,
      schedule: [],
      firstColumn: 'coach',
      allUsers: null,
      editable: false,
    };
    this.fetchTimetable = this.fetchTimetable.bind(this);
    this.fetchUsers = this.fetchUsers.bind(this);
    this.toggle = this.toggle.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.toggleEditable = this.toggleEditable.bind(this);
  }

  componentDidMount() {
    this.fetchTimetable();
    this.fetchUsers();
  }
  // TODO we need to fetch a list of all active users
  fetchTimetable() {
    pageContent.fetchData('/meetings', 'GET', { date: this.props.date }).then((response) => {
      this.setState({ schedule: response.schedule });
    });
  }

  toggleEditable(value) {
    this.setState({ editable: value });
  }

  fetchUsers() {
    pageContent.fetchData('/activeStatuses', 'GET', {}).then((response) => {
      const coaches = response.coaches.filter(user => user.active).map(user => user.name);
      const startups = response.startups.filter(user => user.active).map(user => user.name);
      this.setState({ allUsers: { coaches, startups } });
    });
  }

  toggle(n) {
    this.setState({ firstColumn: n });
  }
  // TODO splits?
  // newValue is new value of cell
  // cellKeys is of form: {leftColumn: either coach or startup, time, cellValue: old value}
  //
  updateValue(newValue, cellKeys) {
    this.setState((oldState) => {
      let oldValue = cellKeys.cellValue;
      if (oldValue === '-') oldValue = null;
      const oldSchedule = oldState.schedule;
      const c = oldState.firstColumn === 'coach';
      const oldCoach = c ? cellKeys.leftColumn : oldValue;
      const oldStartup = c ? oldValue : cellKeys.leftColumn;

      const oldI = oldSchedule.findIndex(o =>
        o.startup === oldStartup && o.coach === oldCoach && o.time === cellKeys.time);
      if (oldI < 0) return undefined;
      const newCoach = c ? oldCoach : newValue;
      const newStartup = c ? newValue : oldStartup;
      oldSchedule[oldI] = {
        time: cellKeys.time,
        coach: newCoach,
        startup: newStartup,
        duration: oldSchedule[oldI].duration,
      };
      return { schedule: oldSchedule };
    });
  }

  render() {
    const editButton = this.state.editable ? (
      <button
        className="btn btn-major"
        onClick={() => this.toggleEditable(false)}
      >Save changes
      </button>)
      : (
        <button
          className="btn btn-major"
          onClick={() => this.toggleEditable(true)}
        >Edit manually
        </button>);

    return (
      <div>
        <div className="toggle-container">
          <h1>Timetable</h1>
          <h2>{this.state.date}</h2>
          <div className="">
            {editButton}
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
        {this.state.schedule && this.state.allUsers && <AdminScheduleTable
          schedule={this.state.schedule}
          firstColumn={this.state.firstColumn}
          allUsers={this.state.allUsers}
          editable={this.state.editable}
          onEdit={this.updateValue}
        />}
      </div>
    );
  }
}

AdminSchedules.propTypes = {
  date: PropTypes.string.isRequired,
};
