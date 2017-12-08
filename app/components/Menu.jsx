/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
// import Button from './Button';

export default class Menu extends React.Component {
  render() {
    const list = Object.keys(this.props.content).map(name => (
      <li key={name} className="nav-item menuListItem" >
        <a
          className="nav-link"
          href="#"
          onClick={() => { this.props.onChange(name); }}
        >
          {this.props.content[name]}
        </a>
      </li>
    ));
    return (
      <nav className="navbar navbar-toggleable-md navbar-inverse bg-inverse fixed-top menubar">
        <div className="ads">
          <div className="navbar-header">
            <button
              className="navbar-toggle collapsed"
              type="button"
              data-toggle="collapse"
              data-target="#navbarMenu"
              aria-controls="navbarMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <a className="navbar-brand" href="#">Sauna</a>
          </div>
          <div className="navbar-collapse collapse" id="navbarMenu">
            <ul className="navbar-nav mr-auto">
              {list}
              <a
                className="menubutton nav-button"
                href="#"
                onClick={this.props.logoff}
              >
                Log Off
              </a>
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
  onChange: PropTypes.func.isRequired,
};

//
// <Button
//   className="menubutton btn"
//   onClick={() => { this.props.onChange(name); }}
//   text={this.props.content[name]}
// />
