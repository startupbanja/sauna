import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import Button from '../Button';

// view for editing users' profile
class EditUserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: this.props.credentials,
      description: props.description,
      descLength: props.description.length,
    };
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
  }

  onDescriptionChange(evt) {
    const newDesc = evt.target.value.substr(0, 1000);

    this.setState({
      description: newDesc,
      descLength: newDesc.length,
    });
    evt.preventDefault();
  }

  /* eslint-disable */
  getValueOfField(id) {
    return document.getElementById(id).value;
  }

  // Returns the values of the title fields in the form.
  getTitles() {
    let titles = [];
    document.querySelectorAll('.title').forEach(function(elem){
      titles.push(elem.value);
    });
    return titles;
  }

  // Returns the values of the credentials fields.
  getCredentials() {
    let credentials = [];

    document.querySelectorAll('.credentialField').forEach(function(elem){
      const children = elem.children;
      if (children[0].value !== '' && children[1].value !== '') {
        credentials.push({
          title: children[0].value,
          content: children[1].value,
        });
      }
    });
    return credentials;
  }

  /* eslint-enable */
  getInputData() {
    return {
      site: this.getValueOfField('linkedIn'),
      img_url: this.getValueOfField('imgURL'),
      description: this.getValueOfField('description'),
      titles: this.getTitles(),
      credentials: this.getCredentials(),
    };
  }

  addCredential() {
    this.setState({
      credentials: this.state.credentials.concat({ company: '', position: '' }),
    });
  }

  handleSubmit() {
    const input = this.getInputData();

    // Adds the scheme part of the URL in case it's missing.
    if (!input.site.startsWith('http://') && !input.site.startsWith('https://')) {
      input.site = 'http://'.concat(input.site);
    }
    console.log(input);
    // URL encode the fields
    Object.keys(input).forEach((key) => {
      switch (key) {
        // titles is an array
        case 'titles':
          input[key] = input[key].map(title => encodeURIComponent(title));
          break;
        // credentials is an object
        case 'credentials':
          input[key] = input[key].map((obj) => {
            const newObj = obj;
            Object.keys(obj).forEach((k) => {
              newObj[k] = encodeURIComponent(input[key][k]);
            });
            return newObj;
          });
          break;
        default:
          input[key] = encodeURIComponent(input[key]);
          break;
      }
    });
    const toBeAdded = { uid: this.props.id, type: this.props.type };
    const dataToPass = Object.assign(input, toBeAdded);
    console.log(dataToPass);
    this.props.handleSubmit(dataToPass);
  }

  handleEmailSubmit() {
    this.props.changeEmail($('#edit_manage_email').val(), this.props.type);
  }

  render() {
    const siteName = this.props.type === 'coach' ? 'LinkedIn' : 'Website';
    const credentialsHeader = this.props.type === 'coach' ? 'Credentials:' : 'Team Members:';
    const removeText = this.props.type === 'coach' ? 'credential' : 'team member';
    const imgURL = this.props.imgSrc;
    const credentialHeaderPlaceholder = this.props.type === 'coach' ? 'Company' : 'Name';

    return (
      <div className="editProfileContainer container">
        {this.props.canResetPW &&
          <div id="edit_manage_account">
            <h2>Manage account</h2>
            <button
              className="btn btn-major"
              onClick={this.props.resetPw}
            >Reset password
            </button>
            <form>
              <div className="edit-para" htmlFor="edit_manage_email">Set email address</div>
              <input type="email" className="edit-text" id="edit_manage_email" />
            </form>
            <button
              className="btn btn-major"
              onClick={() => this.handleEmailSubmit()}
            >Set email
            </button>
          </div>
        }
        <form>
          <h4 className="edit-prof-header">{this.props.name} </h4>
          <div className="edit-para">{siteName}:</div>
          <input
            className="edit-text"
            id="linkedIn"
            type="text"
            defaultValue={this.props.linkedIn}
          />
          <div className="edit-para">Image URL:</div>
          <input type="text" id="imgURL" className="edit-text" defaultValue={imgURL} />
          <div className="edit-para">Description:</div>
          <textarea
            className="edit-text"
            id="description"
            onChange={this.onDescriptionChange}
            value={this.state.description}
          />
          <p id="charsLeft">{1000 - this.state.descLength} character{ this.state.descLength === 999 ? '' : 's'} left</p>
          <div>
            <div className="edit-para">Titles:</div>
            {this.props.titles.map(value => (
              <input
                className="edit-text title"
                key={`title${value}`}
                type="text"
                defaultValue={value}
              />))}
          </div>
          <div>
            <div className="edit-para">{credentialsHeader}</div>

            <p id="editProfileNote">
              <b>NOTE:</b>
              To remove a {removeText}, leave a field blank.
            </p>
            <div id="credentialFieldsContainer">
              {this.state.credentials.map(value =>
                (
                  <div key={`cred${value.company}`} className="credentialField">
                    <input className="edit-text" key={`company${value}`} type="text" defaultValue={value.company} placeholder={credentialHeaderPlaceholder} />
                    <input className="edit-text" key={`position${value}`} type="text" defaultValue={value.position} placeholder="Position" />
                  </div>
                ))
              }
            </div>
          </div>
        </form>
        <button onClick={() => this.addCredential()} style={{ display: 'block' }} className="credentials-btn">
          <span className="glyphicon glyphicon-plus-sign" />
          Add a {removeText}
        </button>
        <div className="control-buttons">
          <Button
            className="btn btn-lg btn-major save-button"
            onClick={() => this.handleSubmit()}
            text="Save"
          />
          <Button
            className="btn btn-lg btn-minor"
            text="Cancel"
            onClick={() => this.props.cancel()}
          />
        </div>
      </div>
    );
  }
}

EditUserProfile.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired,
  linkedIn: PropTypes.string,
  description: PropTypes.string,
  titles: PropTypes.arrayOf(PropTypes.string),
  credentials: PropTypes.arrayOf(PropTypes.shape({
    company: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
  })),
  handleSubmit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  resetPw: PropTypes.func.isRequired,
  canResetPW: PropTypes.bool.isRequired,
  changeEmail: PropTypes.func.isRequired,
};

EditUserProfile.defaultProps = {
  id: undefined,
  linkedIn: '',
  description: '',
  titles: [],
  credentials: [],
};

export default EditUserProfile;
