/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// import $ from 'jquery';
// import Button from './Button';

export default class Menu extends React.Component {
  render() {
    const list = Object.keys(this.props.content).map(name => (
      <li key={name} className="nav-item menuListItem" >
        <Link className="nav-link" to={name} >{this.props.content[name]}</Link>
      </li>
    ));
    /* TODO: nav className=navbar-fixed-top tähän myöhemmin, ei
    toimi placeholder kuvien kanssa */
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
            <Link className="navbar-brand" to="/main">Sauna</Link>
          </div>
          <div className="navbar-collapse collapse" id="navbarMenu">
            <ul className="nav navbar-nav">
              {list}
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li className="nav-item menuListItem">
                <a
                  className="nav-link"
                  href="#"
                  onClick={this.props.logoff}
                >
                Log Off
                </a>
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
  content: PropTypes.objectOf(PropTypes.string).isRequired,
  // onChange: PropTypes.func,
};

//
// <Button
//   className="menubutton btn"
//   onClick={() => { this.props.onChange(name); }}
//   text={this.props.content[name]}
// />
