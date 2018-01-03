import React from 'react';
import PropTypes from 'prop-types';
import BlockHeader from './BlockHeader';


// React Component for the list of credentials on a user's profile page.
export default class ProfileCredentialList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { credentials: props.credentials };
  }
  render() {
    const h4Style = {
      textAlign: 'center',
    };

    let credentialList = (
      <div className="credentials">
        <h4 style={h4Style} >No credentials available!</h4>
      </div>);

    if (this.state.credentials.length !== 0) {
      const credentials = this.state.credentials.map(obj => (
        <li key={obj.company}>
          <dl>
            <dt className="credentialCompany">{obj.company}</dt>
            <dd className="credentialPosition">{obj.position}</dd>
          </dl>
        </li>));
      credentialList = (
        <ul className="credentialList">
          {credentials}
        </ul>);
    }

    return (
      <div className="credentials">
        <BlockHeader text="Credentials" />
        {credentialList}
      </div>
    );
  }
}

ProfileCredentialList.propTypes = {
  credentials: PropTypes.arrayOf(PropTypes.shape({
    company: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
  })),
};

ProfileCredentialList.defaultProps = {
  credentials: [],
};
