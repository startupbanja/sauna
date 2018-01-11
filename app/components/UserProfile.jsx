import React from 'react';
import PropTypes from 'prop-types';
import ProfileCredentialList from './ProfileCredentialList';
import ProfileInfoHeader from './ProfileInfoHeader';


// React Component for a user's profile page.
export default class UserProfile extends React.Component {
  render() {
    return (
      <div className="profileContainer">
        <ProfileInfoHeader
          name={this.props.name}
          imgSrc={this.props.imgSrc}
          titles={this.props.titles}
        />
        <ul className="profileLinks">
          <li>
              LinkedIn: <a href={this.props.linkedIn}>linkedin.com</a>
          </li>
        </ul>
        <div className="userDescription">
          <p>
            {this.props.description}
          </p>
        </div>
        <ProfileCredentialList credentials={this.props.credentials} />
      </div>
    );
  }
}


UserProfile.propTypes = {
  name: PropTypes.string.isRequired,
  linkedIn: PropTypes.string,
  imgSrc: PropTypes.string,
  description: PropTypes.string,
  titles: PropTypes.arrayOf(PropTypes.string),
  credentials: PropTypes.arrayOf(PropTypes.shape({
    company: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
  })).isRequired,
};

UserProfile.defaultProps = {
  linkedIn: 'http://linkedin.com',
  imgSrc: '../app/imgs/coach_placeholder.png',
  description: 'Description is not available.',
  titles: [],
};
