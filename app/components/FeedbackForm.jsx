import React from 'react';
import PropTypes from 'prop-types';
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
        <InfoCard info={this.props.info} />
        <form className="feedback-question">
          {radioInputs}
        </form>
      </div>
    );
  }
}

FeedbackForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  info: PropTypes.shape({
    date: PropTypes.string,
    time: PropTypes.string,
    name: PropTypes.string,
    image_src: PropTypes.string,
    description: PropTypes.string,
    rating: PropTypes.number,
    meetingId: PropTypes.number,
  }).isRequired,
  questions: PropTypes.arrayOf(PropTypes.shape({
    index: PropTypes.number,
    question: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      desc: PropTypes.string,
      value: PropTypes.number,
    })),
  })).isRequired,
};
