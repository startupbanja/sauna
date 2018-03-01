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
  constructor(props) {
    super(props);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }

  componentDidUpdate() {
    const { rating } = this.props;
    $('.radiobutton').each(function doSmth() {
      if ($(this).attr('value') === rating.toString()) $(this).addClass('active');
      else $(this).removeClass('active');
    });
  }

  render() {
    const choices = this.props.options.map(option =>
      (
        <label
          key={`option_${option}`}
          className="btn btn-secondary radiobutton"
          role="button"
          htmlFor={`${this.props.id}_${option}`}
          value={option}
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
  rating: PropTypes.number,
  index: PropTypes.number.isRequired,
};

RadioInput.defaultProps = {
  rating: null,
};
