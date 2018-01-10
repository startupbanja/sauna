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
    switch (status) {
      case 0:
        //TODO tee fiksumpi alert
        alert("Incorrect username or password");
        break;
      case 1:
        this.setState({ content: <MainView type="user" logoff={this.changeToLogin} /> });
        break;
      case 2:
        this.setState({ content: <MainView type="admin" logoff={this.changeToLogin} /> });
      default:
    }
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
