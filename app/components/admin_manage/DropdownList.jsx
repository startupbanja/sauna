import React from 'react';
import PropTypes from 'prop-types';

export default class DropdownList extends React.Component {
  render() {
    const choices = this.props.choices.map((name) => {
      const cn = `btn dropdown-choice${this.props.markedChoices.includes(name) ? ' marked' : ''}`;
      return (
        <li key={`choice-${name}`}>
          <button
            className={cn}
            type="button"
            onClick={() => this.props.onChoice(name)}
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
          {this.props.text}
          <span className="caret" />
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
          {choices}
          <li role="separator" className="divider" />
          <li>
            <button
              className="btn dropdown-choice"
              type="button"
              onClick={() => this.props.onChoice(null)}
            >None
            </button>
          </li>
        </ul>
      </div>

    );
  }
}
// choices: list of schoices excluding the defaut None
// markedChoices: choices to be colored differently.
DropdownList.propTypes = {
  text: PropTypes.string.isRequired,
  onChoice: PropTypes.func.isRequired, // takes as parameter new value of cell
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  markedChoices: PropTypes.arrayOf(PropTypes.string).isRequired,
};
