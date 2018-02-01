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
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      data: [{
        user_id: null,
        name: '',
        description: '',
        image_src: '',
        rating: null,
      }],
      userType: 'coach',
      index: 0,
      choices: [],
    };
    this.changeForm = this.changeForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.resetChoices = this.resetChoices.bind(this);
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

  submitForm(id) { // eslint-disable-line
    console.log(id + " " + JSON.stringify(this.state.choices)); // eslint-disable-line
    this.changeForm(this.state.index + 1);
  }

  handleChange(index, value) {
    this.setState((oldState) => {
      const newChoices = oldState.choices.slice(0);
      newChoices[index] = value;
      return { choices: newChoices };
    });
  }
  resetChoices() {
    this.setState({ choices: [] });
    $('.radiobutton').removeClass('active');
  }

  changeForm(newI) {
    this.resetChoices();
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
          onSubmit={this.submitForm}
          questions={this.props.questions[this.state.userType]}
          handleChange={this.handleChange}
          handleReset={this.resetChoices}
        />
        <div className="row">
          <div className="col-xs-5">
            <Button
              className="btn"
              text="prev"
              onClick={() => { this.changeForm(this.state.index - 1); }}
            />
          </div>
          <div className="col-xs-4" >
            <p>{`${this.state.index + 1} / ${this.state.data.length}`}</p>
          </div>
          <div className="col-xs-3">
            <Button
              className="btn"
              text="next"
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
