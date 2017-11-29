import React from 'react';
import PropTypes from 'prop-types';
import Menu from './Menu';
import Image from './Image';
import pageContent from './pageContent';


// This is the class that shows the whole page content after login
// Currently shows a menubar at the top and content below it
export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.changeContent = this.changeContent.bind(this);
    this.state = {
      current: (
        <div>
          <h1>Welcome, {this.props.user}</h1>
          <Image src="../app/imgs/firstScreen1.png" />
        </div>),
      contentMap: pageContent.content,
      labels: pageContent.labels,
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
        {this.state.current}
      </div>
    );
  }
}

MainView.propTypes = {
  user: PropTypes.string.isRequired,
  logoff: PropTypes.func.isRequired,
};
