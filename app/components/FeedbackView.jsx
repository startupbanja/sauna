import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import FeedbackForm from './FeedbackForm';
import Button from './Button';
import pageContent from './pageContent';


// This is the class that shows the whole page content after login
// Currently shows a menubar at the top and content below it
export default class FeedbackView extends React.Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.submitCurrentForm = this.submitCurrentForm.bind(this);
    this.state = {
      data: [{
        meetingId: null,
        user_id: null,
        name: '',
        description: '',
        image_src: '',
        rating: null,
      }],
      userType: 'coach',
      index: 0,
    };
    this.changeForm = this.changeForm.bind(this);
  }


  componentDidMount() {
    this.getData();
  }

  getData() { //eslint-disable-line
    pageContent.fetchData('/feedback', 'get', {})
      .then((result) => {
        this.setState({
          data: result.data,
          userType: result.userType,
        });
      });
  }

  submitCurrentForm(newRating) {
    pageContent.fetchData('/giveFeedback', 'post', {
      meetingId: this.state.data[this.state.index].meetingId,
      rating: newRating,
    }).then((result) => {
      this.setState((oldState) => {
        const newData = oldState.data.slice();
        newData[this.state.index].rating = newRating;
        return {
          data: newData,
        };
      });
    });
  }

  changeForm(newI) {
    if (newI < 0 || newI > this.state.data.length - 1) return false;
    this.setState({
      index: newI,
    });
    return true;
  }

  render() {
    return (
      <div>
        <FeedbackForm
          info={this.state.data[this.state.index]}
          onSubmit={this.submitCurrentForm}
          questions={this.props.questions[this.state.userType]}
        />
        <div className="row">
          <div className="col-xs-5">
            <Button
              className="feedback-btn"
              text="<"
              onClick={() => { this.changeForm(this.state.index - 1); }}
            />
          </div>
          <div className="col-xs-4" >
            <p className="feedback-nro">{`${this.state.index + 1} / ${this.state.data.length}`}</p>
          </div>
          <div className="col-xs-3">
            <Button
              className="feedback-btn"
              text=">"
              onClick={() => { this.changeForm(this.state.index + 1); }}
            />
          </div>

        </div>
      </div>
    );
  }
}

FeedbackView.propTypes = {
  questions: PropTypes.shape({
    coach: PropTypes.arrayOf(PropTypes.shape({
      index: PropTypes.number,
      question: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.number),
    })),
    startup: PropTypes.arrayOf(PropTypes.shape({
      index: PropTypes.number,
      question: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.number),
    })),
  }).isRequired,
};
