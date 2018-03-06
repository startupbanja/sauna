import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import pageContent from './pageContent';

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
    const dataToPass = { data: JSON.stringify(Object.assign(input, { uid: this.props.id })) };
    pageContent.fetchData('/updateProfile', 'POST', dataToPass).then(res => console.log(res));
  }

  render() {
    return (
      <div className="editProfileContainer container">
        <form>
          <h4>{this.props.name}</h4>
          <p>
            LinkedIn:<br />
            <input id="linkedIn" type="text" defaultValue={this.props.linkedIn} />
          </p>
          <p>
            Description:<br />
            <textarea id="description" defaultValue={this.props.description} />
          </p>
          <div>
            <p>Titles:</p>
            {this.props.titles.map(value => <input className="title" key={`title${value}`} type="text" defaultValue={value} />)}
          </div>
          <div>
            <p>Credentials:</p>
            <p><b>NOTE:</b>To remove a credential, just leave it blank.</p>
            <div id="credentialFieldsContainer">
              {this.state.credentials.map(value =>
                (
                  <div key={`cred${value.id}`} className="credentialField">
                    <input key={`company${value}`} type="text" defaultValue={value.company} />
                    <input key={`position${value}`} type="text" defaultValue={value.position} />
                  </div>
                ))
              }
            </div>
          </div>
        </form>
        <button onClick={() => this.addCredential()} style={{ display: 'block' }}>
          <span className="glyphicon glyphicon-plus-sign" />
          Add a credential
        </button>
        <Button
          className="btn btn-lg ffbutton-red"
          onClick={() => this.handleSubmit()}
          text="Save"
        />
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
