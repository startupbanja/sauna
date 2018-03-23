import React from 'react';
import PropTypes from 'prop-types';
import FeedbackForm from './FeedbackForm';
import Button from '../Button';
import pageContent from '../pageContent';
import StatusMessage from '../StatusMessage';

// View to display all feedbacks for previous meetings
export default class FeedbackView extends React.Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.submitCurrentForm = this.submitCurrentForm.bind(this);
    this.state = {
      // object containing info about the user to give feedback to and the currenti rating if exist
      data: undefined,
      // the type of the logged in user
      userType: 'coach',
      index: 0,
      message: undefined,
    };
    this.changeForm = this.changeForm.bind(this);
  }


  componentDidMount() {
    this.getData();
  }

  getData() {
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
      // if uploaded successfully update state
      if (result.status === 'success') {
        this.setState((oldState) => {
          const newData = oldState.data.slice();
          newData[this.state.index].rating = newRating;
          return {
            data: newData,
            // display StatusMessage on success
            message: {
              text: 'Saved',
              type: 'success',
            },
          };
        });
      } else {
        this.setState({
          // display StatusMessage on error
          message: {
            text: 'Error when saving the feedback',
            type: 'error',
          },
        });
      }
    });
  }

  // navigate between feedbacks
  changeForm(newI) {
    if (newI < 0 || newI > this.state.data.length - 1) return false;
    this.setState({
      index: newI,
      message: undefined,
    });
    return true;
  }

  render() {
    if (!this.state.data) return null;
    if (this.state.data.length === 0) {
      return <p className="empty-content-text">No feedbacks currently open</p>;
    }
    return (
      <div>
        <StatusMessage message={this.state.message} />
        <FeedbackForm
          info={this.state.data[this.state.index]}
          onSubmit={this.submitCurrentForm}
          questions={this.props.questions[this.state.userType]}
        />
        <div className="navigation-container">
          <Button
            className="feedback-btn"
            text="<"
            onClick={() => { this.changeForm(this.state.index - 1); }}
          />
          <p className="feedback-nro">{`${this.state.index + 1} / ${this.state.data.length}`}</p>
          <Button
            className="feedback-btn"
            text=">"
            onClick={() => { this.changeForm(this.state.index + 1); }}
          />
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
      options: PropTypes.arrayOf(PropTypes.shape({
        desc: PropTypes.string,
        value: PropTypes.number,
      })),
    })),
    startup: PropTypes.arrayOf(PropTypes.shape({
      index: PropTypes.number,
      question: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.shape({
        desc: PropTypes.string,
        value: PropTypes.number,
      })),
    })),
  }).isRequired,
};
