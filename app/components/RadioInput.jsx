import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
/* eslint
jsx-a11y/label-has-for: "warn",
jsx-a11y/click-events-have-key-events: "warn",
jsx-a11y/no-noninteractive-element-to-interactive-role: "warn"
*/
// TODO make the activeness of buttons change here, not based on bootstrap jquery stuff
export default class RadioInput extends React.Component {
  render() {
    const choices = this.props.options.map((option) => {
      const activeClass = (this.props.rating === option.value) ? ' active' : '';
      return (
        <label
          key={`option_${option.value}`}
          className={`btn btn-secondary radiobutton${activeClass}`}
          role="button"
          htmlFor={`${this.props.id}_${option.value}`}
          value={option.value}
          onClick={() => { this.props.onChange(this.props.index, option.value); }}
        >
          <input
            id={`${this.props.id}_${option.value}`}
            type="radio"
            name={this.props.name}
            autoComplete="off"
          />
          <p><span className="option-desc">{option.desc}</span>{option.value}</p>
        </label>
      );
    });

    return (
      <div className="row">
        <div className="form-group col-xs-6">
          <label className="control-label" >{this.props.question}</label>
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
