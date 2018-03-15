import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Menu from './Menu';
import pageContent from './pageContent';
import LandingPage from './landing/LandingPage';
import LoginView from './LoginView';

// This is the class that shows the whole page content after login
// Currently shows a menubar at the top and content below it
export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    // this.changeContent = this.changeContent.bind(this);
    // this.changeToUserProfile = this.changeToUserProfile.bind(this);
    const contents = pageContent.getContent(this.props.type);
    this.state = {
      /* current: (
        <div>
          <h1>Welcome, {this.props.type}</h1>
          <LandingPage />
        </div>), */
      contentMap: contents.content,
      labels: contents.labels,
    };
  }

  /* changeToUserProfile(id) {
    this.setState({
      current: <UserProfilePage id={id} />,
    });
  } */

  /* changeContent(key) {
    let view;
    switch (key) {
      case 'coaches':
        view = <UserList type="Coaches" handleClick={this.changeToUserProfile} />;
        break;
      case 'startups':
        view = <UserList type="Startups" handleClick={this.changeToUserProfile} />;
        break;
      default:
        view = this.state.contentMap[key];
    }
    this.setState({ current: view });
  } */

  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Menu
              // onChange={this.changeContent}
              logoff={this.props.logoff}
              content={this.state.labels}
            />
            <div id="mainContainer">
              <Route exact path="/" component={LandingPage} />
              {this.state.contentMap}
              <Route exact path="/login" component={LoginView} />
            </div>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

MainView.propTypes = {
  type: PropTypes.string.isRequired,
  logoff: PropTypes.func.isRequired,
};
