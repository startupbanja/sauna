import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BlockHeader from './BlockHeader';
import pageContent from './pageContent';

class AdminLandingPage extends Component {
  constructor(props) {
    super(props);
    this.fetchAvailabilityStats = this.fetchAvailabilityStats.bind(this);
    this.fetchGivenFeedbacks = this.fetchGivenFeedbacks.bind(this);
    this.fetchActivityStatuses = this.fetchActivityStatuses.bind(this);
    this.renderActiveUsers = this.renderActiveUsers.bind(this);
    this.state = {
      availabilities: undefined,
      feedbacks: undefined,
      nextDate: '',
      activeUsers: undefined,
    };
  }

  componentDidMount() {
    this.fetchAvailabilityStats();
    this.fetchGivenFeedbacks();
    this.fetchActivityStatuses();
  }

  fetchAvailabilityStats() {
    pageContent.fetchData('/numberOfTimeslots', 'GET', {})
      .then((result) => {
        const nextDate = Object.keys(result).reduce((a, b) => (a < b) ? a : b); // eslint-disable-line
        this.setState({
          availabilities: result[nextDate],
          nextDate,
        });
      });
  }
  fetchGivenFeedbacks() {
    pageContent.fetchData('/givenFeedbacks', 'GET', {})
      .then((result) => {
        this.setState({
          feedbacks: {
            startupTotal: result.startupTotal,
            startupDone: result.startupDone,
            coachTotal: result.coachTotal,
            coachDone: result.coachDone,
          },
        });
      });
  }
  fetchActivityStatuses() {
    pageContent.fetchData('/activeStatuses', 'GET', {})
      .then((result) => {
        this.setState({
          activeUsers: {
            startups: result.startups.filter(user => user.active === 1).length,
            coaches: result.coaches.filter(user => user.active === 1).length,
          },
        });
      });
  }

  renderStats() {
    const { total: totalAvail, done: doneAvail } = this.state.availabilities
      || { total: null, done: null };
    const dateOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    const date = new Date(this.state.nextDate);
    return (
      <div>
        {(this.state.nextDate !== '') &&
          <p className="next-date">
            {`Next meeting date: ${date.toLocaleDateString('en-GB', dateOptions).replace(/\//g, '.')}`}
          </p>}
        {(totalAvail !== null && doneAvail !== null) &&
          <p>{`${doneAvail}/${totalAvail} Coaches' availability reports`}</p>}
        {(this.state.feedbacks) && (
          <div>
            {((this.state.feedbacks.coachTotal &&
                this.state.feedbacks.coachDone !== undefined)
              || undefined) &&
              <p>{`${this.state.feedbacks.coachDone}/${this.state.feedbacks.coachTotal} Coach-given feedbacks`}</p>}
            {((this.state.feedbacks.startupTotal &&
                this.state.feedbacks.startupDone !== undefined)
              || undefined) &&
              <p>{`${this.state.feedbacks.startupDone}/${this.state.feedbacks.startupTotal} Startup-given feedbacks`}</p>}
          </div>
        )}
      </div>
    );
  }

  renderActiveUsers() {
    if (!this.state.activeUsers) return null;
    const { startups, coaches } = this.state.activeUsers;
    return (
      <div>
        <p>{`${coaches} active coaches`}</p>
        <p>{`${startups} active startups`}</p>
      </div>
    );
  }

  render() {
    return (
      <div className="admin-landing">
        <div className="stats">
          <h2>Welcome</h2>
          <BlockHeader text="Mind these:" />
          <Link
            href={`/meetings/recent/${this.state.nextDate}`}
            to={`/meetings/recent/${this.state.nextDate}`}
          >
            {this.renderStats()}
          </Link>
        </div>
        <div>
          <BlockHeader text="" />
          <Link href="/users" to="/users">
            {this.renderActiveUsers()}
          </Link>
        </div>
      </div>
    );
  }
}

export default AdminLandingPage;
