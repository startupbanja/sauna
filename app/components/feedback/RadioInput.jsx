import React from 'react';
import PropTypes from 'prop-types';

// radio input for a one guestion in feedback form
export default class RadioInput extends React.Component {
  render() {
    const choices = this.props.options.map((option) => {
      // if the choice is the same as current rating set as active
      const activeClass = (this.props.rating === option.value) ? ' active' : ' inactive';
      return (
        <div
          key={`option_${option.value}`}
          className={`btn btn-secondary radiobutton${activeClass}`}
          role="button"
          htmlFor={`${this.props.id}_${option.value}`}
          value={option.value}
          tabIndex={-100}
          onClick={() => { this.props.onChange(this.props.index, option.value); }}
          onKeyPress={() => {}}
        >
          <input
            id={`${this.props.id}_${option.value}`}
            type="radio"
            name={this.props.name}
            autoComplete="off"
          />
          <p><span className="option-desc">{option.desc}</span>{option.value}</p>
        </div>
      );
    });

    return (
      <div className="row">
        <div className="form-group col-xs-6">
          <p className="control-label feedback-question-label" >{this.props.question}</p>
        </div>
        <div className="btn-group form-group col-xs-6" data-toggle="buttons">
          {choices}
        </div>
      </div>
    );
  }
}

RadioInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    desc: PropTypes.string,
    value: PropTypes.number,
  })).isRequired,
  question: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  rating: PropTypes.number,
  index: PropTypes.number.isRequired,
};

RadioInput.defaultProps = {
  rating: null,
};
