import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EditUserProfile extends Component {
  render() {
    let titles;
    let credentials;

    if (this.props.titles[0] !== null) {
      titles = this.props.titles.map(value => <input key={`title${value.id}`} type="text" value={value} />);
    } else {
      titles = <input type="text" value="" />;
    }

    if (this.props.credentials[0].company !== null && this.props.credentials[0].position !== null) {
      credentials = this.props.credentials.map(value =>
        (
          <div key={`cred${value}`}>
            <input key={`company${value}`} type="text" value={value.company} />
            <input key={`position${value}`} type="text" value={value.position} />
          </div>
        ));
    }

    return (
      <div className="editProfileContainer container">
        <form>
          <div className="edit-para">Name:</div>
          <input className="edit-text" id="name" type="text" value={this.props.name} />
          <div className="edit-para">LinkedIn:</div>
          <input className="edit-text" id="linkedIn" type="text" value={this.props.linkedIn} />
          <div className="edit-para">Description:</div>
          <textarea className="edit-text" id="description">
            {this.props.description}
          </textarea>
          <div className="edit-para">Image URL:</div>
          <input type="text" className="edit-text" defaultValue={this.props.imgSrc} />
          <div>
            <div className="edit-para">Titles:</div>
            {this.props.titles.map(value => <input className="edit-text" key={`title${value}`} type="text" value={value} />)}
          </div>
          <div>
            <div className="edit-para">Credentials:</div>
            {this.props.credentials.map(value =>
              (
                <div key={`cred${value}`}>
                  <input className="edit-text" key={`company${value}`} type="text" value={value.company} />
                  <input className="edit-text" key={`position${value}`} type="text" value={value.position} />
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
  id: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  name: PropTypes.string.isRequired,
  linkedIn: PropTypes.string,
  imgSrc: PropTypes.string,
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
  imgSrc: '../app/imgs/coach_placeholder.png',
  description: '',
  titles: [],
  credentials: [],
};

export default EditUserProfile;
