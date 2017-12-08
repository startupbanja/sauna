import React from 'react';
import PropTypes from 'prop-types';


export default class Button extends React.Component {
  render() {
    return (
      <button
        className={this.props.className}
        onClick={this.props.onClick}
      >
        {this.props.text}
      </button>
    );
  }
}

Button.propTypes = {
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};
