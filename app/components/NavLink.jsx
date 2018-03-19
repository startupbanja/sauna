import React from 'react';
import PropTypes from 'prop-types';


export default class NavLink extends React.Component {
  render() {
    return (
      <li className={(this.props.active ? 'active' : '')}>
        <a href={this.props.linkTo}>{this.props.text}</a>
      </li>
    );
  }
}

NavLink.propTypes = {
  active: PropTypes.bool.isRequired,
  linkTo: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
