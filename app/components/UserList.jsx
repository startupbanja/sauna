import React from 'react';
import PropTypes from 'prop-types';
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
            <div className="fullwidth text-style" key={user.name}>
              <img className="list-avatar" src={user.img} alt="" />
              <div>
                <div>
                  <span className="header">{user.name}</span>
                </div>
                <div>
                  <i>{user.description}</i>
                </div>
              </div>
            </div>
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
