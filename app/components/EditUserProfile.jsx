import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EditUserProfile extends Component {
  /* static constructBodyString(dataObject) {
    let str = '';

    Object.keys(dataObject).forEach((key) => {
      if (key.toLowerCase() === 'titles') {
        str = str.concat('titles=', dataObject[key].join(), '&');
      } else if (key.toLowerCase() === 'credentials') {
        const creds = dataObject[key].map(x => x.company.concat(';', x.position));
        str = str.concat('credentials=', creds.join());
      } else {
        str = str.concat(key.concat('=', dataObject[key]), '&');
      }
    });

    return str;
  } */

  constructor(props) {
    super(props);
    this.getChangedFields = this.getChangedFields.bind(this);
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
      credentials.push({
        company: children[0].value,
        position: children[1].value,
      });
      
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

  // Returns an object with only the changed data.
  getChangedFields(data) {
    const obj = {};
    Object.keys(data).forEach((key) => {
      console.log(data[key]);
      console.log(this.props[key]);
      if (data[key] !== this.props[key]) {
        obj[key] = data[key];
      }
    });
    return obj;
  }

  handleSubmit() {
    const changedData = this.getChangedFields(this.getInputData());
    const jsonData = JSON.stringify(changedData);
    console.log(jsonData);
    fetch('http://localhost:3000/updateProfile', {
      method: 'POST',
      body: jsonData,
    }).then(response => console.log(response));
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
            {this.props.titles.map(value => <input className="title" key={`title${value.id}`} type="text" defaultValue={value} />)}
          </div>
          <div>
            <p>Credentials:</p>
            {this.props.credentials.map(value =>
              (
                <div key={`cred${value.id}`} className="credentialField">
                  <input key={`company${value.id}`} type="text" defaultValue={value.company} />
                  <input key={`position${value.id}`} type="text" defaultValue={value.position} />
                </div>
              ))
            }
          </div>
          <button
            className="btn btn-lg btn-primary btn-block"
            onClick={() => this.handleSubmit()}
          >Save
          </button>
        </form>
      </div>
    );
  }
}

EditUserProfile.propTypes = {
  // id: PropTypes.number,
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
  // id: undefined,
  linkedIn: '',
  // imgSrc: '../app/imgs/coach_placeholder.png',
  description: '',
  titles: [],
  credentials: [],
};

export default EditUserProfile;
