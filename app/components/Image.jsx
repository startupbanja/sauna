import React from 'react';
import PropTypes from 'prop-types';

export default class Image extends React.Component {
  render() {
    return (
      <img src={this.props.src} alt="" />
    );
  }
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
};
