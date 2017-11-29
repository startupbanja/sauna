import React from 'react';
import PropTypes from 'prop-types';


export default class Button extends React.Component {
  render() {
    return (
      <button onClick={this.props.onClick}>{this.props.text}</button>
    );
  }
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};
