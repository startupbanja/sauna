import React from 'react';
import PropTypes from 'prop-types';
import LoginHandler from './LoginHandler';
import LoginForm from './LoginForm';

//  view contains all the login-related things and is shown as the default view
export default class LoginView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      handle: LoginHandler, // This is currently just a function that returns true
    };
    this.handleInput = this.handleInput.bind(this);
  }


  handleInput(input) {
    // const name = input.names;
    // const pwd = input.pwd;
    this.state.handle(input, (authResult) => {
      console.log(authResult);
      if (authResult === 'user' || authResult === 'admin') {
        this.props.login(authResult);
      } else {
        // handleError
      }
    });
  }

  render() {
    // logoViewHandler
    return (
      <LoginForm onSubmit={this.handleInput} />
    );
  }
}

LoginView.propTypes = {
  login: PropTypes.func.isRequired,
};
