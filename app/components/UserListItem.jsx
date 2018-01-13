import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UserListItem extends Component {
  render() {
    return (
      <div className="fullwidth text-style">
        <img className="list-avatar" src={this.props.imageSrc} alt="" />
        <div>
          <div>
            <span className="header">{this.props.name}</span>
          </div>
          <div>
            <i>{this.props.description}</i>
          </div>
        </div>
      </div>
    );
  }
}

UserListItem.defaultProps = {
  imageSrc: '../app/imgs/coach_placeholder.png',
  description: 'Description is not available.',
};

UserListItem.propTypes = {
  name: PropTypes.string.isRequired,
  imageSrc: PropTypes.string,
  description: PropTypes.string,
};

export default UserListItem;
