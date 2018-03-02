import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CheckBox from '../CheckBox';
import pageContent from '../pageContent';

/* List active and inactive users and changes their statuses */
class UserActivityList extends Component {
  constructor(props) {
    super(props);
    this.userActivityChanged = this.userActivityChanged.bind(this);
  }

  userActivityChanged(newActivity, userId) {
    pageContent.fetchData('/setActiveStatus', 'POST', {
      id: userId,
      active: (newActivity) ? 1 : 0,
    }).then((result) => {
      if (result.status === 'success') {
        this.props.onChange(newActivity, userId);
      }
    });
  }

  render() {
    return (
      <div className="user-activity-list-container">
        <h4 className="header">
          <span className="number">{this.props.users.filter(user => user.active).length}</span>{` active ${this.props.type}`}
        </h4>
        <hr />
        {this.props.users.map(user =>
          (
            <CheckBox
              key={user.id}
              label={user.name}
              checked={user.active === 1}
              onChange={checked => this.userActivityChanged(checked, user.id)}
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
  onChange: PropTypes.func,
};

UserActivityList.defaultProps = {
  onChange: () => {},
};

export default UserActivityList;
