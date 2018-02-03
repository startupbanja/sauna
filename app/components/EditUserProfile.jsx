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
          company: children[0].value,
          position: children[1].value,
        });
      }
    });
    return credentials;
  }
  
  /* eslint-enable */
  getInputData() {
    return {
      linkedIn: this.getValueOfField('linkedIn'),
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
    fetch('http://localhost:3000/updateProfile', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.assign(input, { uid: this.props.id })),
    }).then(response => console.log(response));
  }

  render() {
    return (
      <div className="editProfileContainer container">
        <form>
          <h4>{this.props.name}</h4>
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
            <p><b>NOTE:</b>To remove a credential, just leave it blank.</p>
            <div id="credentialFieldsContainer">
              {this.state.credentials.map(value =>
                (
                  <div key={`cred${value.id}`} className="credentialField">
                    <input key={`company${value.id}`} type="text" defaultValue={value.company} />
                    <input key={`position${value.id}`} type="text" defaultValue={value.position} />
                  </div>
                ))
              }
            </div>
            <button onClick={() => this.addCredential()}>
              <span className="glyphicon glyphicon-plus-sign" />
              Add a credential.
            </button>
          </div>
          <Button
            className="btn btn-lg ffbutton-red"
            onClick={() => this.handleSubmit()}
            text="Save"
          />
        </form>
      </div>
    );
  }
}

EditUserProfile.propTypes = {
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
