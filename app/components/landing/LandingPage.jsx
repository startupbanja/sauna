import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import BlockHeader from '../BlockHeader';
import ComingUpCarousel from './ComingUpCarousel';
import pageContent from '../pageContent';
/* eslint-disable jsx-a11y/anchor-is-valid */ // disable complaining from Link

/* Component for displaying landing page for users */
class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.fetchTimetable = this.fetchTimetable.bind(this);
    this.state = {
      timetable: undefined,
      date: undefined,
    };
  }

  componentDidMount() {
    this.fetchTimetable();
  }

  fetchTimetable() {
    pageContent.fetchData('/userMeetings', 'GET', {})
      .then((response) => {
        this.setState({
          timetable: response.meetings,
          date: response.date,
        });
      });
  }

  render() {
    return (
      <div className="container" >
        <h3 className="text-center" style={{ fontWeight: 'bold' }}>Coming up</h3>
        {((this.state.timetable && this.state.date) || undefined) &&
          <ComingUpCarousel timetable={this.state.timetable} date={this.state.date} />}
        <BlockHeader text="Mind these:" />
        <div className="row">
          <div className="col-sm-6 col-xs-12" style={{ padding: '10px' }}>
            <Link className="btn btn-lg btn-major col-xs-12" to="/feedback">
              Give Feedback
            </Link>
          </div>
          <div className="col-sm-6 col-xs-12" style={{ padding: '10px' }}>
            <Link className="btn btn-lg btn-major col-xs-12" to="/availability">
              Set Availabilities
            </Link>
          </div>
        </div>
        <BlockHeader text="Problems?" />
        <div className="row">
          <div className="col-sm-3" />
          <div className="col-sm-6 col-xs-12" style={{ padding: '10px' }}>
            <a href="mailto:contact@startupsauna.com" className="btn btn-lg btn-minor col-xs-12">
              Email an admin
            </a>
          </div>
          <div className="col-sm-3" />
        </div>
      </div>
    );
  }
}

export default LandingPage;
