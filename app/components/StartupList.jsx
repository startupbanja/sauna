import React from 'react';
import PropTypes from 'prop-types';
// import Image from './Image';

export default class StartupList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="fullwidth">
        <img className="list-avatar" src="../app/imgs/coach_placeholder.png" alt="" />
        <span className="texty">
          Startup Name<br />
          <i>Descriptive text</i>
        </span>
      </div>
    );
  }
}
