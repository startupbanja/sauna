import React from 'react';
import PropTypes from 'prop-types';
import LoginHandler from './LoginHandler';
import LoginForm from './LoginForm';

//  view contains all the login-related things and is shown as the default view
export default class LoginView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      handle: LoginHandler,
      errorMessage: '',
    };
    this.handleInput = this.handleInput.bind(this);
  }


  handleInput(input) {
    this.state.handle(input, (authResult) => {
      if (authResult === 'user' || authResult === 'admin') {
        document.cookie = `ssaunaloggedin=${authResult}`;
        this.props.login(authResult);
      } else {
        this.setState({ errorMessage: 'Invalid username or password' });
      }
    });
  }

  render() {
    // logoViewHandler
    return (
      <LoginForm onSubmit={this.handleInput} errorMessage={this.state.errorMessage} />
    );
  }
}

LoginView.propTypes = {
  login: PropTypes.func.isRequired,
};
