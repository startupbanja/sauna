import React from 'react';
import PropTypes from 'prop-types';
import ProfileCredentialList from './ProfileCredentialList';
import ProfileInfoHeader from './ProfileInfoHeader';


// React Component for a user's profile page.
export default class UserProfile extends React.Component {
  render() {
    return (
      <div className="profileContainer container">
        <link rel="stylesheet" type="text/css" href="app/styles/user_profile_style.css" />
        <ProfileInfoHeader
          name={this.props.name}
          imgSrc={this.props.imgSrc}
          titles={this.props.titles}
          canModify={this.props.canModify}
          onModifyClick={this.props.onModifyClick}
        />
        <ul className="profileLinks">
          <li>
              LinkedIn: <a href={this.props.linkedIn}>linkedin.com</a>
          </li>
        </ul>
        <hr />
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
  })),
  canModify: PropTypes.bool,
  onModifyClick: PropTypes.func.isRequired,
};

UserProfile.defaultProps = {
  linkedIn: '',
  imgSrc: '../app/imgs/coach_placeholder.png',
  description: '',
  titles: [],
  credentials: [],
  canModify: false,
};
