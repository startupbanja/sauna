import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import TextField from './TextField';


export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameInput: '',
      pwdInput: '',
    };
    this.usernameChanged = this.usernameChanged.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.pwdChanged = this.pwdChanged.bind(this);
  }


  usernameChanged(e) {
    this.setState({ nameInput: e.target.value });
  }
  pwdChanged(e) {
    this.setState({ pwdInput: e.target.value });
  }

  handleSubmit() {
    this.props.onSubmit({ name: this.state.nameInput, pwd: this.state.pwdInput });
  }


  render() {
    return (
      <div>
        <TextField
          label="Username"
          type="text"
          onChange={this.usernameChanged}
          value={this.state.nameInput}
        />
        <br />
        <TextField
          label="Password"
          type="password"
          onChange={this.pwdChanged}
          value={this.state.pwdInput}
        />
        <br />
        <Button onClick={this.handleSubmit} text="Log In" />
      </div>
    );
  }
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
