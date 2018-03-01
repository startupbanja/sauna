import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CheckBox from '../CheckBox';

/* List active and inactive users and changes their statuses */
class UserActivityList extends Component {
  constructor(props) {
    super(props);
    this.userActivityChanged = this.userActivityChanged.bind(this);
  }

  userActivityChanged(newActivity, user_id) {
    
  }

  render() {
    return (
      <div className="user-activity-list-container">
        <h4>{`${this.props.users.filter(user => user.active).length} active ${this.props.type}`}</h4>
        <hr />
        {this.props.users.map(user =>
          (
            <CheckBox
              key={user.id}
              label={user.name}
              checked={user.active === 1}
            />
          ))}
      </div>
    );
  }
}

UserActivityList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    active: PropTypes.number.isRequired,
  })).isRequired,
  type: PropTypes.string.isRequired,
};

export default UserActivityList;
