import React, { Component } from 'react';
import PropTypes from 'prop-types';

/* Component for prettier checkboxes */
class CheckBox extends Component {
  constructor(props) {
    super(props);
    this.checkedChanged = this.checkedChanged.bind(this);
  }

  checkedChanged() {
    this.props.onChange(!this.props.checked);
  }

  render() {
    return (
      <div
        className="pretty-checkbox-container"
        onClick={this.checkedChanged}
        onKeyDown={() => {}}
        role="button"
        tabIndex={-100}
      >
        <div className={`pretty-checkbox ${(this.props.checked && 'checked') || 'unchecked'}`} />
        {((this.props.label !== undefined) || undefined) &&
          <p className="checkbox-label">{this.props.label}</p>}
      </div>
    );
  }
}

CheckBox.propTypes = {
  onChange: PropTypes.func,
  label: PropTypes.string,
  checked: PropTypes.bool.isRequired,
};

CheckBox.defaultProps = {
  onChange: () => {},
  label: undefined,
};

export default CheckBox;
