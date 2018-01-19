import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EditUserProfile extends Component {
  render() {
    return (
      <div className="editProfileContainer container">
        <form>
          <p>
            Name:<br />
            <input id="name" type="text" value={this.props.name} />
          </p>
          <p>
            LinkedIn:<br />
            <input id="linkedIn" type="text" value={this.props.linkedIn} />
          </p>
          <p>
            Description:<br />
            <textarea id="description">
              {this.props.description}
            </textarea>
          </p>
          <div>
            <p>Titles:</p>
            {this.props.titles.map(value => <input key={`title${value.id}`} type="text" value={value} />)}
          </div>
          <div>
            <p>Credentials:</p>
            {this.props.credentials.map(value =>
              (
                <div key={`cred${value.id}`}>
                  <input key={`company${value.id}`} type="text" value={value.company} />
                  <input key={`position${value.id}`} type="text" value={value.position} />
                </div>
              ))
            }
          </div>
        </form>
      </div>
    );
  }
}

EditUserProfile.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string.isRequired,
  linkedIn: PropTypes.string,
  // imgSrc: PropTypes.string,
  description: PropTypes.string,
  titles: PropTypes.arrayOf(PropTypes.string),
  credentials: PropTypes.arrayOf(PropTypes.shape({
    company: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
  })),
};

EditUserProfile.defaultProps = {
  id: undefined,
  linkedIn: '',
  // imgSrc: '../app/imgs/coach_placeholder.png',
  description: '',
  titles: [],
  credentials: [],
};

export default EditUserProfile;
