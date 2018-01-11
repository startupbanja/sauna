import React from 'react';
import LoginView from './LoginView';
import MainView from './MainView';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.changeToMenu = this.changeToMenu.bind(this);
    this.changeToLogin = this.changeToLogin.bind(this);
    this.state = {
      // Shows either LoginView or MainView
      content: <LoginView login={this.changeToMenu} />,
    };
    // this.setState = this.setState.bind(this);
  }

  changeToMenu(status) {
    this.setState({ content: <MainView type={status} logoff={this.changeToLogin} /> });
  }

  changeToLogin() {
    this.setState({ content: <LoginView login={this.changeToMenu} /> });
  }

  render() {
    return (
      this.state.content
    );
  }
}
