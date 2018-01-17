import React from 'react';
import PropTypes from 'prop-types';
import UserListItem from './UserListItem';
// import Image from './Image';

export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.fetchAndUpdate = this.fetchAndUpdate.bind(this);
    this.state = {
      users: [],
      // type: props.type,
    };
  }

  /*
  componentWillReceiveProps(newProps) {
    this.setState({
      users: newProps.users,
      type: newProps.type,
    });
  }
  */

  componentDidMount() {
    this.fetchAndUpdate();
  }

  /* eslint-disable */
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.type === this.props.type) return;
    this.fetchAndUpdate();
  }
  /* eslint-enable */

  fetchAndUpdate() {
    const query = `type=${this.props.type}`;
    fetch(`http://127.0.0.1:3000/users?${query}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    }).then(response => response.json())
      .then(responseJson => this.setState({
        users: responseJson.users,
      }))
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div>
        <h1>List of {this.props.type}</h1>
        {this.state.users.map(user =>
          (
            <UserListItem
              name={user.name}
              id={user.id}
              key={user.name}
              description={user.description}
              imageSrc={user.img}
              handleClick={this.props.handleClick}
            />
          ))}
      </div>
    );
  }
}

UserList.propTypes = {
  /* users: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    img: PropTypes.string,
  })).isRequired, */
  type: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};
