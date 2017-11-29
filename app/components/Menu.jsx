import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

export default class Menu extends React.Component {
  render() {
    const list = Object.keys(this.props.content).map(name => (
      <li key={name}>
        <Button
          onClick={() => { this.props.onChange(name); }}
          text={this.props.content[name]}
        />
      </li>
    ));
    // for (const name in this.props.content) {
    //   list.push(
    //     <li key={name}>
    //       <Button
    //         onClick={() => { this.props.onChange(name); }}
    //         text={this.props.content[name]} />
    //   </li>)
    // }
    return (
      <div>
        <ul>{list}</ul>
        <Button
          onClick={this.props.logoff}
          text="Log Off"
        />
      </div>
    );
  }
}

Menu.propTypes = {
  logoff: PropTypes.func.isRequired,
  content: PropTypes.objectOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};
