import React, { Component } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import pageContents from '../pageContent';

/* Conponen for displaying and submitting new meeting days */
class NewMeetingDayBlock extends Component {
  constructor(props) {
    super(props);
    this.validateForm = this.validateForm.bind(this);
  }

  /* Makes sure that the meetings can be devided in full lenght
  and submits the data */
  validateForm(e) {
    e.preventDefault();
    const date = $('#dateInput').val();
    const start = new Date(`${date}T${$('#startTimeInput').val()}`);
    const end = new Date(`${date}T${$('#endTimeInput').val()}`);
    const diff = (end.getTime() - start.getTime()) / 60000;
    if (diff % parseInt($('#splitInput').val(), 10) === 0) {
      pageContents.fetchData('/createMeetingDay', 'POST', {
        date,
        start: start.toTimeString().substr(0, 8),
        end: end.toTimeString().substr(0, 8),
        split: parseInt($('#splitInput').val(), 10),
      }).then(() => this.props.onSubmit());
    }
  }

  render() {
    /* eslint-disable */
    return (
      <div>
        <form className="form-horizontal" onSubmit={this.validateForm}>
          <div className="form-group">
            <label htmlFor="dateInput" className="control-label col-sm-2">Date</label>
            <div className="col-sm-10">
              <input className="form-control" type="date" id="dateInput" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="startTimeInput" className="control-label col-sm-2">Start</label>
            <div className="col-sm-10">
              <input className="form-control" type="time" id="startTimeInput" required />
            </div>
            <div className="clearfix visible-xs"></div>
            <label htmlFor="endTimeInput" className="control-label col-sm-2">End</label>
            <div className="col-sm-10">
              <input className="form-control" type="time" id="endTimeInput" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="splitInput" className="control-label col-sm-7">Time for each meeting</label>
            <div className="col-sm-4">
              <input className="form-control" type="number" id="splitInput" defaultValue="40" min="0" step="1" required />
            </div>
          </div>
          <button className="btn btn-primary" type="submit">Create</button>
        </form>
      </div>
    );
    /* eslint-enable */
  }
}

NewMeetingDayBlock.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default NewMeetingDayBlock;
