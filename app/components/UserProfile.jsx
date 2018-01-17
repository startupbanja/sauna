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
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    fetch('http://localhost:3000/profile', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: `userId=${this.props.id}`,
    }).then(response => response.json())
      .then((responseJSON) => {
        this.setState({
          name: responseJSON.name,
          description: responseJSON.description,
          linkedIn: 'http://'.concat('', responseJSON.linkedIn),
          credentials: responseJSON.credentials,
        });
      }).catch(err => console.log(err));
  }

  render() {
    return (
      <div className="profileContainer">
        <ProfileInfoHeader
          name={this.state.name}
          imgSrc={this.state.imgSrc}
          titles={this.state.titles}
        />
        <ul className="profileLinks">
          <li>
              LinkedIn: <a href={this.state.linkedIn}>linkedin.com</a>
          </li>
        </ul>
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

UserProfile.defaultProps = {
  id: '13',
};
