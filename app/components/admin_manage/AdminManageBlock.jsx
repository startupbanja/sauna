import React, { Component } from 'react';
import PropTypes from 'prop-types';

/*
Container component to all admin management blocks
  takes care of presenting a closed block and opening it
*/
class AdminManageBlock extends Component {
  constructor(props) {
    super(props);
    this.openBlock = this.openBlock.bind(this);
    this.state = {
      open: false,
    };
  }

  openBlock() {
    this.setState({
      open: true,
    });
  }

  render() {
    if (this.state.open) {
      return (
        <div className="adminManageBlock open">
          {this.props.render()}
        </div>
      );
    }
    return (
      <div
        className="adminManageBlock closed"
        onClick={() => this.openBlock()}
        onKeyUp={() => {}}
        role="link"
        tabIndex="0"
      >
        <p className="blockTitle">{this.props.title}</p>
      </div>
    );
  }
}

AdminManageBlock.propTypes = {
  render: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default AdminManageBlock;
