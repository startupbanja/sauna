import React from 'react';
import PropTypes from 'prop-types';
/* eslint
jsx-a11y/label-has-for: "warn",
jsx-a11y/click-events-have-key-events: "warn",
jsx-a11y/no-noninteractive-element-to-interactive-role: "warn"
*/

export default class RadioInput extends React.Component {
  render() {
    const choices = this.props.options.map(option =>
      (
        <label
          key={`option_${option}`}
          className="btn btn-secondary radiobutton"
          role="button"
          htmlFor={`${this.props.id}_${option}`}
          onClick={() => { this.props.onChange(this.props.index, option); }}
        >
          <input
            id={`${this.props.id}_${option}`}
            type="radio"
            name={this.props.name}
            autoComplete="off"
          />
          {option}
        </label>
      ));

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
  options: PropTypes.arrayOf(PropTypes.number).isRequired,
  question: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
