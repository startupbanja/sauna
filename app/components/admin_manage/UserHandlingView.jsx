import React, { Component } from 'react';
import UserActivityList from './UserActivityList';
import pageContent from '../pageContent';
import '../../styles/user_handling_style.css';

/* Component for presenting active and inactive users */
class UserHandlingView extends Component {
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.state = {
      // array of all startups in objects {active, id, name}
      startups: undefined,
      // array of all coaches in objects {active, id, name}
      coaches: undefined,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    function sort(a, b) {
      if (b.active - a.active === 0) {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        if (aName < bName) return -1;
        if (aName > bName) return 1;
        return 0;
      }
      return b.active - a.active;
    }
    pageContent.fetchData('/activeStatuses', 'GET', {})
      .then((result) => {
        this.setState({
          startups: result.startups.sort((a, b) => sort(a, b)),
          coaches: result.coaches.sort((a, b) => sort(a, b)),
        });
      });
  }

  // when activity is changed and submitted successfully, update state
  handleActivityChanged(newActivity, userId, userType) {
    if (userType === 'startup') {
      const index = this.state.startups.findIndex(startup => startup.id === userId);
      const { startups } = this.state;
      startups[index].active = (newActivity) ? 1 : 0;
      this.setState({ startups });
    }
    if (userType === 'coach') {
      const index = this.state.coaches.findIndex(coach => coach.id === userId);
      const { coaches } = this.state;
      coaches[index].active = (newActivity) ? 1 : 0;
      this.setState({ coaches });
    }
  }

  render() {
    return (
      <div className="container user-handling-view">
        <div className="btn-container">
          <a
            className="btn btn-major"
            href="/create_user"
          >
            Create new user
          </a>
        </div>
        <div className="user-lists-container">
          {// list of startups
            (this.state.startups !== undefined) &&
            <UserActivityList
              users={this.state.startups}
              type="startups"
              onChange={(newActivity, userId) => this.handleActivityChanged(newActivity, userId, 'startup')}
            />}
          {// list of coaches
            (this.state.coaches !== undefined) &&
            <UserActivityList
              users={this.state.coaches}
              type="coaches"
              onChange={(newActivity, userId) => this.handleActivityChanged(newActivity, userId, 'coach')}
            />}
        </div>
      </div>
    );
  }
}

export default UserHandlingView;
