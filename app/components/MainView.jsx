import React from 'react';
import PropTypes from 'prop-types';
import Menu from './Menu';
import pageContent from './pageContent';
import LandingPage from './LandingPage';


// This is the class that shows the whole page content after login
// Currently shows a menubar at the top and content below it
export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.changeContent = this.changeContent.bind(this);
    const content = pageContent.getContent(this.props.userType);
    console.log(content);
    this.state = {
      current: (
        <div>
          <h1>Welcome, {this.props.userName}</h1>
          <LandingPage />
        </div>),
      contentMap: content.content,
      labels: content.labels,
    };
  }


  changeContent(key) {
    const view = this.state.contentMap[key];
    this.setState({ current: view });
  }

  render() {
    return (
      <div>
        <Menu
          onChange={this.changeContent}
          logoff={this.props.logoff}
          content={this.state.labels}
        />
        <div id="mainContainer">
          {this.state.current}
        </div>
      </div>
    );
  }
}

MainView.propTypes = {
  userName: PropTypes.string.isRequired,
  logoff: PropTypes.func.isRequired,
  userType: PropTypes.string.isRequired,
};
