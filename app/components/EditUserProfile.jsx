import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

class EditUserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: this.props.credentials,
    };
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
      description: this.getValueOfField('description'),
      titles: this.getTitles(),
      credentials: this.getCredentials(),
    };
  }

  addCredential() {
    this.setState({
      credentials: this.state.credentials.concat({ company: 'Company', position: 'Position' }),
    });
  }
  handleSubmit() {
    const input = this.getInputData();
    const toBeAdded = { uid: this.props.id, type: this.props.type };
    const dataToPass = { data: JSON.stringify(Object.assign(input, toBeAdded)) };
    this.props.handleSubmit(dataToPass);
  }

  render() {
    const siteName = this.props.type === 'coach' ? 'LinkedIn' : 'Website';
    const credentialsHeader = this.props.type === 'coach' ? 'Credentials:' : 'Team Members:';
    const removeText = this.props.type === 'coach' ? 'credential' : 'team member';
    return (
      <div className="editProfileContainer container">
        <form>
          <h4>{this.props.name} </h4>
          <div className="edit-para">{siteName}:</div>
          <input
            className="edit-text"
            id="linkedIn"
            type="text"
            defaultValue={this.props.linkedIn}
          />
          <div className="edit-para">Description:</div>
          <textarea className="edit-text" id="description" defaultValue={this.props.description} />
          <div>
            <div className="edit-para">Titles:</div>
            {this.props.titles.map(value => <input className="edit-text title" key={`title${value}`} type="text" defaultValue={value} />)}
          </div>
          <div>
            <div className="edit-para">{credentialsHeader}</div>

            <p id="editProfileNote">
              <b>NOTE:</b>
              To remove a {removeText}, just leave either (or both) of the fields blank.
            </p>
            <div id="credentialFieldsContainer">
              {this.state.credentials.map(value =>
                (
                  <div key={`cred${value}`} className="credentialField">
                    <input className="edit-text" key={`company${value}`} type="text" defaultValue={value.company} />
                    <input className="edit-text" key={`position${value}`} type="text" defaultValue={value.position} />
                  </div>
                ))
              }
            </div>
          </div>
        </form>
        <button onClick={() => this.addCredential()} style={{ display: 'block' }}>
          <span className="glyphicon glyphicon-plus-sign" />
          Add a {removeText}
        </button>
        <Button
          className="btn btn-lg ffbutton-red"
          onClick={() => this.handleSubmit()}
          text="Save"
        />
        <Button
          className="btn btn-lg ffbutton-red"
          text="Cancel"
          onClick={() => this.props.cancel()}
        />
      </div>
    );
  }
}

EditUserProfile.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  name: PropTypes.string.isRequired,
  linkedIn: PropTypes.string,
  // imgSrc: PropTypes.string,
  description: PropTypes.string,
  titles: PropTypes.arrayOf(PropTypes.string),
  credentials: PropTypes.arrayOf(PropTypes.shape({
    company: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
  })),
  handleSubmit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
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
