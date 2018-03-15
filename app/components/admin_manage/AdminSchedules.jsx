import React from 'react';
import PropTypes from 'prop-types';
import AdminScheduleTable from './AdminScheduleTable';
import pageContent from '../pageContent';

/* eslint react/no-unused-state:0 */ // This rule doesn't work correctly here

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
      oldSchedule: null,
    };
    this.fetchTimetable = this.fetchTimetable.bind(this);
    this.fetchUsers = this.fetchUsers.bind(this);
    this.toggle = this.toggle.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.setEditable = this.setEditable.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.revertChanges = this.revertChanges.bind(this);
  }

  componentDidMount() {
    this.fetchTimetable();
    this.fetchUsers();
  }

  setEditable() {
    this.setState(old => ({ editable: true, oldSchedule: Object.assign([], old.schedule) }));
  }

  fetchTimetable() {
    pageContent.fetchData('/timetable', 'GET', { date: this.props.date }).then((response) => {
      this.setState({ schedule: response.schedule });
    });
  }

  saveTimetable(callback) {
    pageContent.fetchData('/timetable', 'POST', { date: this.props.date, schedule: JSON.stringify(this.state.schedule) }).then((response) => {
      callback(response);
    });
  }


  handleSaveClick() {
    this.saveTimetable((res) => {
      console.log(res);
      this.setState({ editable: false, oldSchedule: null });
    });
  }

  revertChanges() {
    this.setState(old => ({ schedule: old.oldSchedule, oldSchedule: null, editable: false }));
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


  // newValue is new value of cell
  // cellKeys is of form: {leftColumn: either coach or startup, time, cellValue: old value}
  //
  updateValue(newValue, cellKeys, replace) {
    this.setState((oldState) => {
      let oldValue = cellKeys.cellValue;
      if (oldValue === '-') oldValue = null;
      const newSchedule = oldState.schedule;
      const c = oldState.firstColumn === 'coach';
      const oldCoach = c ? cellKeys.leftColumn : oldValue;
      const oldStartup = c ? oldValue : cellKeys.leftColumn;

      const oldI = newSchedule.findIndex(o =>
        o.startup === oldStartup && o.coach === oldCoach && o.time === cellKeys.time);
      const newCoach = c ? oldCoach : newValue;
      const newStartup = c ? newValue : oldStartup;
      if (!replace || oldI < 0) {
        newSchedule.push({
          time: cellKeys.time,
          coach: newCoach,
          startup: newStartup,
          duration: newSchedule[0].duration, // This assumes all have same duration
        });
      } else {
        newSchedule[oldI] = {
          time: cellKeys.time,
          coach: newCoach,
          startup: newStartup,
          duration: newSchedule[oldI].duration,
        };
      }
      return { schedule: newSchedule };
    });
  }

  render() {
    const editButton = this.state.editable ? (
      <div>
        <button
          className="btn btn-minor"
          onClick={this.revertChanges}
        >Cancel
        </button>
        <button
          className="btn btn-major"
          onClick={this.handleSaveClick}
        >Save changes
        </button>
      </div>)
      : (
        <div>
          <button
            className="btn btn-major"
            onClick={this.setEditable}
          >Edit manually
          </button>
        </div>);

    return (
      <div>
        <div className="toggle-container">
          <h1>Timetable</h1>
          <h2>{this.state.date.split('-').reverse().join('.')}</h2>
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
