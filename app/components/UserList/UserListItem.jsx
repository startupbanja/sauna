import React, { Component } from 'react';
import PropTypes from 'prop-types';

// individual item in UserList displaying info about the user
class UserListItem extends Component {
  render() {
    return (
      <div className="fullwidth list-text-style" >
        <img className="list-avatar img-responsive" src={this.props.imageSrc} alt="" />
        <div>
          <div>
            <span className="list-header">{this.props.name}</span>
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
  id: PropTypes.number.isRequired, // eslint-disable-line
};

export default UserListItem;
