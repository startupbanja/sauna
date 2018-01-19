import React from 'react';
import PropTypes from 'prop-types';
import ProfileCredentialList from './ProfileCredentialList';
import ProfileInfoHeader from './ProfileInfoHeader';


// React Component for a user's profile page.
export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);

    // Initialize the state as empty.
    this.state = {
      name: '',
      description: '',
      linkedIn: '',
      credentials: [],
      canModify: false,
      titles: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.id === prevProps.id) return;
    this.fetchData();
  }

  fetchData() {
    let query = '';
    if (typeof this.props.id !== 'undefined') query = `userId=${this.props.id}`;
    fetch(`http://127.0.0.1:3000/profile?${query}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    }).then(response => response.json())
      .then((responseJSON) => {
        this.setState({
          name: responseJSON.name,
          description: responseJSON.description,
          linkedIn: 'http://'.concat('', responseJSON.linkedIn),
          credentials: responseJSON.credentials,
          canModify: responseJSON.canModify,
          titles: [responseJSON.company],
        });
      }).catch(err => console.log(err));
  }

  render() {
    return (
      <div className="profileContainer container">
        <link rel="stylesheet" type="text/css" href="app/styles/user_profile_style.css" />
        <ProfileInfoHeader
          name={this.state.name}
          imgSrc={this.state.imgSrc}
          titles={this.state.titles}
          canModify={this.state.canModify}
        />
        <ul className="profileLinks">
          <li>
              LinkedIn: <a href={this.state.linkedIn}>linkedin.com</a>
          </li>
        </ul>
        <hr />
        <div className="userDescription">
          <p>
            {this.state.description}
          </p>
        </div>
        <ProfileCredentialList credentials={this.state.credentials} />
      </div>
    );
  }
}


UserProfile.propTypes = {
  id: PropTypes.string,
  /* name: PropTypes.string.isRequired,
  linkedIn: PropTypes.string,
  imgSrc: PropTypes.string,
  description: PropTypes.string,
  titles: PropTypes.arrayOf(PropTypes.string),
  credentials: PropTypes.arrayOf(PropTypes.shape({
    company: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
  })).isRequired, */
};

/* UserProfile.defaultProps = {
  id: '13',
}; */
