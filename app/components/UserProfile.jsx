import React from "react";

export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "Tuukka"
    };
    this.getHeader = this.getHeader.bind(this)
  };

  getHeader() {
    return (
      <h1>Your profile, {this.state.userName}</h1>
    );
  }

  render() {
    return (
      <div>
      {this.getHeader()}
      </div>
    );
  }
}
