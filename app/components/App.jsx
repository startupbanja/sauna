import React from 'react';
import LoginView from './LoginView';
import MainView from './MainView';
import '../styles/login_page.css';
import '../styles/adminViews.css';
import '../styles/main_style.css';
import '../styles/feedback_style.css';
import '../styles/schedule_style.css';
import '../styles/list_style.css';
import '../styles/user_profile_style.css';
import '../styles/checkbox_style.css';
import '../styles/statusMessage_style.css';
import '../styles/admin_landing_style.css';
import '../styles/block_header_style.css';

export default class App extends React.Component {
  static logOff() {
    this.changeToLogin();
  }

  constructor(props) {
    super(props);
    this.changeToMenu = this.changeToMenu.bind(this);
    this.changeToLogin = this.changeToLogin.bind(this);
    App.logOff = App.logOff.bind(this);
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
