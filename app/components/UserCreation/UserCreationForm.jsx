import React from 'react';
import PropTypes from 'prop-types';

import StatusMessage from '../StatusMessage';

// check validity for email, TODO palceholder
function isValidEmail(string) {
  return string.includes('@');
}
// Form for createing user accounts.
// Takes as props an onSubmit function and the wanted user type, either coach or startup
export default class UserCreationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      description: '',
      website: '',
      linkedin: '',
      submittedOnce: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Reset the fields when the type prop is changed
  componentWillReceiveProps(nextProps) {
    if (this.props.type !== nextProps.type) {
      this.setState({
        email: '',
        password: '',
        name: '',
        description: '',
        website: '',
        linkedin: '',
      });
    }
  }

  // validate the form fields based on form name prop
  // return "" if valid or an error string if invalid
  validate(name) {
    const value = this.state[name];
    switch (name) {
      case 'password':
        if (value.length < 6) return 'Password must be atleast 6 characters long';
        break;
      case 'email':
        if (value.length === 0) return 'Email is required';
        if (!isValidEmail(value)) return 'Please enter a valid email';
        break;
      case 'name':
        if (value.length === 0) return 'Name is required';
        break;
      default:
        break;
    }
    return '';
  }

  handleChange(e) {
    this.validate(e.target.name);
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit() {
    // check that all fields are valid
    if (Object.entries(this.state).every(arr => this.validate(arr[0]) === '')) {
      this.props.onSubmit(this.state);
    }
    this.setState({ submittedOnce: true });
  }

  render() {
    // this field changes based on this.props.type
    let changingField;
    if (this.props.type === 'startup') {
      changingField = {
        label: 'Website:',
        name: 'website',
        placeholder: 'Website of startup',
        required: false,
        type: 'text',
      };
    } else if (this.props.type === 'coach') {
      changingField = {
        label: 'Linkedin:',
        name: 'linkedin',
        placeholder: 'Linkedin profile link',
        required: false,
        type: 'text',
      };
    }
    // Array of field properties that change for each field
    const formFields = [{
      label: 'Email:',
      name: 'email',
      placeholder: 'Email',
      required: true,
      type: 'email',
    }, {
      label: 'Password:',
      name: 'password',
      placeholder: 'Password',
      required: true,
      type: 'password',
    }, {
      label: 'Full Name:',
      name: 'name',
      placeholder: 'Full Name',
      required: true,
      type: 'text',
    }, {
      label: 'Description:',
      name: 'description',
      placeholder: 'Description',
      required: false,
      type: 'text',
    }, {
      label: 'Image URL:',
      name: 'img_url',
      placeholder: 'Image URL',
      required: false,
      type: 'text',
    },
    ];
    // Map array to an array of input fields wrapped with a label and error message
    const formElements = formFields.concat(changingField).map((p) => {
      const id = `${p.name}Field`;
      const error = this.validate(p.name);
      const showFeedback = this.state.submittedOnce;
      const classNames = showFeedback ?
        `has-feedback ${error ? 'has-error' : 'has-success'}`
        : '';
      return (
        <div key={p.name} className={`form-group ${classNames}`}>
          <label className="nestingLabel control-label" htmlFor={id}>
            {p.label}
            <input
              className="form-control"
              onChange={this.handleChange}
              name={p.name}
              placeholder={p.placeholder}
              required={p.required}
              type={p.type}
              id={p.id}
              value={this.state[p.name]}
            />
          </label>
          {showFeedback &&
          <span
            className={`glyphicon glyphicon-${error ? 'remove' : 'ok'} form-control-feedback`}
            aria-hidden="true"
          />}
          <span className="help-block">{showFeedback && error}</span>
        </div>
      );
    });

    return (
      <div>
        <form className="form-create-user">
          {formElements}
        </form>
        <button
          className="btn btn-lg btn-block btn-major"
          onClick={this.handleSubmit}
        >
          Create user
        </button>
      </div>

    );
  }
}

UserCreationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};
