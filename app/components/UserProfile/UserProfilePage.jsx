import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserProfile from './UserProfile';
import EditUserProfile from './EditUserProfile';
import StatusMessage from '../StatusMessage';
import pageContent from '../pageContent';

// Component to either display user's profile or editing view
// fetches the data from backend and provides that for UserProfile and EditUserProfile
// also subbmits possible changes
class UserProfilePage extends Component {
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.changeEmail = this.changeEmail.bind(this);

    // Initialize the state as empty.
    this.state = {
      userType: '',
      name: '',
      description: '',
      linkedIn: '',
      credentials: [],
      canModify: false,
      canResetPW: false,
      titles: [],
      modifying: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.id === prevProps.id) return;
    this.fetchData();
  }

  // change between editing and displaying
  toggleEdit() {
    this.setState({
      modifying: !this.state.modifying,
    });
  }

  resetPassword() {
    pageContent.fetchData('/changePassword', 'POST', { uid: this.props.id }).then((res) => {
      this.setState({
        message: {
          type: res.status.toLowerCase(),
          text: res.message,
        },
      });
    });
  }

  changeEmail(addr, userType) {
    if (addr.indexOf('@') < 0) {
      this.setState({
        message: {
          type: 'error',
          text: 'Invalid email address format! Did you forget "@"?',
        },
      });
    } else {
      pageContent.fetchData('/changeEmail', 'POST', { uid: this.props.id, email: addr, type: userType }).then((res) => {
        this.setState({
          message: {
            type: res.status.toLowerCase(),
            text: res.message,
          },
        });
      });
    }
  }

  fetchData() {
    let params = {};
    if (typeof this.props.id !== 'undefined') params = { userId: this.props.id };
    pageContent.fetchData('/profile', 'get', params)
      .then((responseJSON) => {
        let link = responseJSON.linkedIn;

        if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
          link = 'http://'.concat(link);
        }

        this.setState({
          userType: responseJSON.type,
          name: responseJSON.name,
          imgURL: responseJSON.img_url,
          description: responseJSON.description,
          linkedIn: link,
          credentials: responseJSON.credentials,
          canModify: responseJSON.canModify,
          canResetPW: responseJSON.canResetPW,
          titles: [responseJSON.company],
        });
      });
  }

  handleSubmit(data) {
    if (this.state.userType === 'coach' && !data.site.split('//')[1].startsWith('linkedin.com')) {
      this.setState({
        message: {
          type: 'error',
          text: 'The provided LinkedIn URL was invalid!',
        },
      });
      return; // don't continue to the updating phase.
    }

    pageContent.fetchData('/updateProfile', 'POST', { data: JSON.stringify(data) }).then((res) => {
      const statusType = res.status.toLowerCase();
      if (statusType === 'success') {
        this.setState({
          message: {
            type: statusType,
            text: res.message,
          },
          modifying: false,
        });
        this.fetchData();
      } else {
        this.setState({
          message: {
            type: statusType,
            text: res.message,
          },
        });
      }
    });
  }

  render() {
    if (this.state.modifying) {
      return (
        <div>
          <StatusMessage message={this.state.message} />
          <EditUserProfile
            type={this.state.userType}
            id={this.props.id}
            name={this.state.name}
            imgSrc={this.state.imgURL}
            description={this.state.description}
            linkedIn={this.state.linkedIn}
            credentials={this.state.credentials}
            titles={this.state.titles}
            handleSubmit={this.handleSubmit}
            cancel={this.toggleEdit}
            canResetPW={this.state.canResetPW}
            resetPw={this.resetPassword}
            changeEmail={this.changeEmail}
          />
        </div>);
    }
    return (
      <div>
        <StatusMessage message={this.state.message} />
        <UserProfile
          type={this.state.userType}
          name={this.state.name}
          imgSrc={this.state.imgURL}
          description={this.state.description}
          linkedIn={this.state.linkedIn}
          credentials={this.state.credentials}
          canModify={this.state.canModify}
          titles={this.state.titles}
          onModifyClick={this.toggleEdit}
        />
      </div>
    );
  }
}

UserProfilePage.propTypes = {
  id: PropTypes.string,
};

UserProfilePage.defaultProps = {
  id: undefined,
};

export default UserProfilePage;
