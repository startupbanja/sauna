import React from 'react';
import BlockHeader from './BlockHeader';
/* import PropTypes from 'prop-types'; */

export default class UserProfile extends React.Component {
  render() {
    return (
      <div className="profileContainer">
        <div className="userInfoHeader">
          <img src="../app/imgs/coach_placeholder.png" alt="Username" className="userImage" />
          <div className="mainInfoSection">
            <h3 id="username">Sample User</h3>
            <ul className="titles">
              <li>Software Team 12</li>
              <li>Developer</li>
            </ul>
          </div>
        </div>
        <ul className="profileLinks">
          <li>
              LinkedIn: <a href="http://linkedin.com">linkedin.com</a>
          </li>
        </ul>
        <div className="userDescription">
          <p>
           Lorem ipsum dolor sit amet, consectetur adipiscing elit.
           Sed vehicula suscipit enim et faucibus.
           Donec quis urna ut purus consequat viverra ultricies vel ex.
           Quisque a risus diam. Mauris luctus nisl non nibh porta blandit.
           Aenean nec vehicula enim, a rutrum neque.
           Lorem ipsum dolor sit amet, consectetur adipiscing elit.
           Donec imperdiet erat orci, at placerat odio volutpat quis.
           Nulla sodales tellus sit amet nibh dapibus, eget bibendum urna dictum.
           Quisque mauris risus, mattis et dui vel, aliquam pretium quam.
           Integer bibendum efficitur mi, nec facilisis arcu feugiat id.
           Mauris pellentesque accumsan velit ut tempor.
          </p>
        </div>
        <div className="credentials">
          <BlockHeader text="Credentials" />
          <ul className="crendentialsList">
            <li>
              <dl>
                <dt className="credentialCompany">Aalto University</dt>
                <dd className="credentialPosition">Student</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt className="credentialCompany">Aalto University</dt>
                <dd className="credentialPosition">Course assistant</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt className="credentialCompany">Company</dt>
                <dd className="credentialPosition">Position</dd>
              </dl>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

/*
UserProfile.propTypes = {
  linkedIn: PropTypes.string.isRequired,
  imgSrc: PropTypes.string,
  // define required props and their types here
};

UserProfile.defaultProps = {
  imgSrc: 'something',
};
*/
