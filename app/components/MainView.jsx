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
    let pageContents = pageContent.content;
    let pageLabels = pageContent.labels;
    if (this.props.type === 'admin') {
      pageContents = pageContent.adminContent;
      pageLabels = pageContent.adminLabels;
    }
    this.state = {
      current: (
        <div>
          <h1>Welcome, {this.props.type}</h1>
          <LandingPage />
        </div>),
      contentMap: pageContents,
      labels: pageLabels,
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
  type: PropTypes.string.isRequired,
  logoff: PropTypes.func.isRequired,
};
