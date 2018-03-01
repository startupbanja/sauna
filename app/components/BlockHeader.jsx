import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BlockHeader extends Component {
  render() {
    const styles = {
      line: {
        position: 'absolute',
        display: 'inline',
        height: '4px',
        background: this.props.color,
        width: '100%',
        top: '3px',
      },
      dot: {
        display: 'inline',
        height: '10px',
        width: '10px',
        background: this.props.color,
        borderRadius: '100%',
      },
      border: {
        position: 'relative',
        flexGrow: '2',
        overflow: 'hidden',
      },
      header: {
        margin: '0px',
        fontWeight: 'bold',
        padding: '2%',
        color: this.props.color,
      },
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center' }} >
        <div style={styles.border}>
          <div style={Object.assign({ left: '5px', borderRadius: '100%' }, styles.line)} />
          <div style={Object.assign({}, styles.line, { left: '5px', width: '50%' })} />
          <div style={Object.assign({ float: 'left' }, styles.dot)} />
        </div>
        <h4 style={styles.header} >{this.props.text}</h4>
        <div style={styles.border}>
          <div style={Object.assign({ right: '5px', borderRadius: '100%' }, styles.line)} />
          <div style={Object.assign({}, styles.line, { right: '5px', width: '50%' })} />
          <div style={Object.assign({ float: 'right' }, styles.dot)} />
        </div>
      </div>
    );
  }
}

BlockHeader.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
};

BlockHeader.defaultProps = {
  color: '#A3A3A3',
};

export default BlockHeader;
