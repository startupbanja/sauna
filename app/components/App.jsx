import React from 'react';
import LoginView from './LoginView';
import MainView from './MainView';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.changeToMenu = this.changeToMenu.bind(this);
    this.changeToLogin = this.changeToLogin.bind(this);
    let firstContent = <LoginView login={this.changeToMenu} />;
    if (document.cookie.indexOf('ssaunaloggedin=') > -1) {
      let type = '';
      if (document.cookie.indexOf('ssaunaloggedin=user') > -1) type = 'user';
      else if (document.cookie.indexOf('ssaunaloggedin=admin') > -1) type = 'admin';
      firstContent = <MainView type={type} logoff={this.changeToLogin} />;
    }
    this.state = {
      // Shows either LoginView or MainView
      content: firstContent,
    };
  }

  changeToMenu(status) {
    this.setState({ content: <MainView type={status} logoff={this.changeToLogin} /> });
  }

  changeToLogin() {
    document.cookie = 'ssaunaloggedin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    this.setState({ content: <LoginView login={this.changeToMenu} /> });
  }

  render() {
    return (
      this.state.content
    );
  }
}
