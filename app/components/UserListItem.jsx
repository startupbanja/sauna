import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UserListItem extends Component {
  /* constructor(props) {
    super(props);
    this.state = {
      id: -1,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      id: nextProps.id,
    });
  } */

  render() {
    return (
      /* eslint-disable */
      <div className="fullwidth text-style" onClick={() => this.props.handleClick(this.props.id.toString())}>
        <img className="list-avatar img-responsive" src={this.props.imageSrc} alt="" />
        <div>
          <div>
            <span className="header">{this.props.name}</span>
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
  imageSrc: '../app/imgs/coach_placeholder.png',
  description: 'Description is not available.',
};

UserListItem.propTypes = {
  name: PropTypes.string.isRequired,
  imageSrc: PropTypes.string,
  description: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default UserListItem;
