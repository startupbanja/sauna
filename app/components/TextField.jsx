import React from 'react';
import PropTypes from 'prop-types';

export default class TextField extends React.Component {
  render() {
    const id = `input_${this.props.label}`;
    return (
      <div>
        <label htmlFor={id}>{this.props.label}
          <br />
          <input
            id={id}
            type={this.props.type}
            onChange={this.props.onChange}
            value={this.props.value}
          />
        </label>
      </div>
    );
  }
}

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
