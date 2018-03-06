import React, { Component } from 'react';
import BlockHeader from '../BlockHeader';
import ComingUpCarousel from './ComingUpCarousel';
import pageContent from '../pageContent';

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
            <button type="button" className=" btn btn-lg btn-major col-xs-12">View feedback</button>
          </div>
          <div className="col-sm-6 col-xs-12" style={{ padding: '10px' }}>
            <button type="button" className="btn btn-lg btn-major col-xs-12">View Coaches</button>
          </div>
        </div>
        <BlockHeader text="Problems?" />
        <div className="row">
          <div className="col-sm-3" />
          <div className="col-sm-6 col-xs-12" style={{ padding: '10px' }}>
            <button type="button" className="btn btn-lg btn-minor col-xs-12">
              Email an admin
            </button>
          </div>
          <div className="col-sm-3" />
        </div>
      </div>
    );
  }
}

export default LandingPage;
