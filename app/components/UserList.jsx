import React from 'react';
import PropTypes from 'prop-types';
import UserListItem from './UserListItem';
// import Image from './Image';

export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: props.users,
      type: props.type,
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      users: newProps.users,
      type: newProps.type,
    });
  }

  render() {
    return (
      <div>
        <h1>List of {this.state.type}</h1>
        {this.state.users.map(user =>
          (
            <UserListItem
              name={user.name}
              key={user.name}
              description={user.description}
              imageSrc={user.img}
            />
          ))}
      </div>
    );
  }
}

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    img: PropTypes.string,
  })).isRequired,
  type: PropTypes.string.isRequired,
};
