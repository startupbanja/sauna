import React, { Component } from 'react';
import PropTypes from 'prop-types';
import defaultImg from '../imgs/coach_placeholder.png';

class UserListItem extends Component {
  render() {
    return (
      /* eslint-disable */
      <div className="fullwidth list-text-style" >
        <img className="list-avatar img-responsive" src={this.props.imageSrc || defaultImg} alt="" />
        <div>
          <div>
            <span className="list-header">{this.props.name}</span>
          </div>
          <div>
            <i>{this.props.description}</i>
          </div>
        </div>
      </div>
      /* eslint-enable */
    );
  }
}

UserListItem.defaultProps = {
  imageSrc: null,
  description: 'Description is not available.',
};

UserListItem.propTypes = {
  name: PropTypes.string.isRequired,
  imageSrc: PropTypes.string,
  description: PropTypes.string,
  id: PropTypes.number.isRequired, // eslint-disable-line
};

export default UserListItem;
