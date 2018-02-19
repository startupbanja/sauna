import React from 'react';
import PropTypes from 'prop-types';
import AdminScheduleTable from './AdminScheduleTable';
import MeetingManagementPanel from './MeetingManagementPanel';
import pageContent from './pageContent';
// React Component for the schedule view for admins.
export default class MeetingView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { current: this.getClosestDate(), list: [] };
    this.getNextDate = this.getNextDate.bind(this);
  }

  getClosestDate() {
    return '2018-01-01';
  }


  render() {
    return (
      <div>
        <h1>{this.state.current}</h1>
        <MeetingManagementPanel date={this.state.current} />
      </div>
    );
  }
}
