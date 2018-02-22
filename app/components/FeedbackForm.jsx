import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import RadioInput from './RadioInput';
import InfoCard from './InfoCard';


export default class FeedbackForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(index, value) {
    this.handleSubmit(value);
  }

  handleSubmit(value) {
    this.props.onSubmit((value === undefined) ? this.state.choices[0] : value);
  }

  render() {
    const radioInputs = this.props.questions.map(obj =>
      (<RadioInput
        key={`Q_${obj.index}`}
        id={`Q_${obj.index}`}
        name={`Q_${obj.index}`}
        index={obj.index}
        options={obj.options}
        question={obj.question}
        rating={this.props.info.rating}
        onChange={this.handleChange}
      />
      ));
    return (
      <div className="container-fluid">
        <h1>Give Feedback</h1>
        <InfoCard info={this.props.info} />
        <form className="feedback-question">
          {radioInputs}
        </form>
        { // <Button className="btn btn-lg ffbutton-red" onClick={this.handleSubmit} text="Done" />
        }
      </div>
    );
  }
}

FeedbackForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  info: PropTypes.shape({
    name: PropTypes.string,
    image_src: PropTypes.string,
    description: PropTypes.string,
    rating: PropTypes.number,
    meetingId: PropTypes.number,
  }).isRequired,
  questions: PropTypes.arrayOf(PropTypes.shape({
    index: PropTypes.number,
    question: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.number),
  })).isRequired,
  // handleReset: PropTypes.func.isRequired,
  // handleChange: PropTypes.func.isRequired,
  // activeChoices: PropTypes.arrayOf(PropTypes.number).isRequired,
};
