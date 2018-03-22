import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Menu from './Menu';
import pageContent from './pageContent';
import LoginView from './login/LoginView';

// This is the class that shows the whole page content after login
// Currently shows a menubar at the top and content below it
export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    const contents = pageContent.getContent(this.props.type);
    this.state = {
      contentMap: contents.content,
      labels: contents.labels,
    };
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Menu
              logoff={this.props.logoff}
              content={this.state.labels}
            />
            <div id="mainContainer">
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
