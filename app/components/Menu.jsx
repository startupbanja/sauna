/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';

// Navigation menu that's horizontal in desktop and collapsed vertical in smaller screens
export default class Menu extends React.Component {
  collapseNav() { // eslint-disable-line
    $('.navbar-collapse').collapse('hide');
  }

  render() {
    // create all links for navigation bar
    const list = Object.keys(this.props.content).map(name => (
      <li key={name} className="nav-item menuListItem" >
        <Link className="nav-link" to={name} onClick={this.collapseNav} >
          {this.props.content[name]}
        </Link>
      </li>
    ), this);

    return (
      <nav className="navbar navbar-inverse menubar navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <button
              className="navbar-toggle collapsed pull-left"
              type="button"
              data-toggle="collapse"
              data-target="#navbarMenu"
              aria-controls="#navbarMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <Link className="navbar-brand" to="/">Sauna</Link>
          </div>
          <div className="navbar-collapse collapse" id="navbarMenu">
            <ul className="nav navbar-nav">
              {list}
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li className="nav-item menuListItem">
                <Link
                  className="nav-link"
                  href="#"
                  onClick={this.props.logoff}
                  to="/"
                >
                Log Off
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

Menu.propTypes = {
  logoff: PropTypes.func.isRequired,
  // object mapping router paths to display names
  content: PropTypes.objectOf(PropTypes.string).isRequired,
};
