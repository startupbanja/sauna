import React from 'react';
import PropTypes from 'prop-types';

/*
Component to display a popup success/error message that will disappear
by default after 3 seconds. Will display message only if new message object is
is different instance than previous (compares the references).
*/
export default class StatusMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessage: true,
    };
    this.msgTimeout = null;
    this.clearMessage = this.clearMessage.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.message !== this.props.message) {
      this.setState({
        showMessage: true,
      });
    }
    return true;
  }

  clearMessage() {
    this.setState({
      showMessage: false,
    });
  }

  render() {
    if (!this.state.showMessage || !this.props.message) return null;
    clearTimeout(this.msgTimeout);
    this.msgTimeout = setTimeout(this.clearMessage, this.props.duration);
    return (
      <div className={'statusMessage '.concat(this.props.message.type)}>
        { this.props.message.text }
      </div>
    );
  }
}

StatusMessage.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }),
  duration: PropTypes.number,
};

StatusMessage.defaultProps = {
  duration: 3000,
  message: undefined,
};
