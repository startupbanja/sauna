import React from 'react';
import PropTypes from 'prop-types';

export default class DropdownList extends React.Component {
  render() {
    const choices = this.props.choices.map((name) => {
      return (
        <li key={`choice-${name}`}>
          <button
            className="btn btn-dropdown"
            type="button"
            onClick={() => this.props.onChoice(name, this.props.keys)}
          >{name}
          </button>
        </li>);
    });

    return (
      <div className="dropdown">
        <button
          className="btn btn-default dropdown-toggle"
          type="button"
          id="dropdownMenu1"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="true"
        >
          Edit
          <span className="caret" />
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
          {choices}
          <li role="separator" className="divider" />
          <li>
            <button
              className="btn btn-dropdown"
              type="button"
              onClick={() => this.props.onChoice(null, this.props.keys)}
            >None
            </button>
          </li>
        </ul>
      </div>

    );
  }
}
// keys is used as a key for registering change in the parent component
DropdownList.propTypes = {
  onChoice: PropTypes.func.isRequired,
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  keys: PropTypes.shape({
    leftColumn: PropTypes.string,
    cellValue: PropTypes.string,
    time: PropTypes.string,
  }).isRequired,
};
