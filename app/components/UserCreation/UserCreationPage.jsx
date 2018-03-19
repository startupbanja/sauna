import React from 'react';
import pageContent from '../pageContent';
import UserCreationForm from './UserCreationForm';
import StatusMessage from '../StatusMessage';

// Page that contains the form for an admin to create new user accounts

export default class UserCreationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'coach',
      message: undefined,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  // Toggle between coach and startup for cration
  toggle(newType) {
    this.setState({ type: newType });
  }

  handleSubmit(data) {
    const obj = Object.assign({}, data);
    obj.type = this.state.type;
    console.log(data);
    pageContent.fetchData('/create_user/', 'POST', obj)
      .then((response) => {
        console.log(response);
        this.showMessage(response.type, response.message);
      });// .catch(this.showMessage('ERROR', 'Could not connect to backend!'));
  }

  showMessage(type, receivedMessage) {
    this.setState({
      message: {
        type: type.toLowerCase(),
        text: receivedMessage,
      },
    });
  }

  render() {
    return (
      <div>
        <StatusMessage message={this.state.message} />
        <div className="container">
          <h1>Add a new {this.state.type}</h1>
          {/* TODO these tab buttons are used in two places now, rework into react component? */}
          <div className="toggle-container">
            <ul className="toggle-ul">
              <li>
                {/* conditionally set active class based on state.type */}
                <button
                  className={`toggle-button ${this.state.type === 'coach' ? 'active' : ''}`}
                  onClick={() => this.toggle('coach')}
                >
                  Coach
                </button>
              </li>
              <li>
                <button
                  className={`toggle-button ${this.state.type === 'startup' ? 'active' : ''}`}
                  onClick={() => this.toggle('startup')}
                >
                Startup
                </button>
              </li>
            </ul>
          </div>
          <UserCreationForm onSubmit={this.handleSubmit} type={this.state.type} />
        </div>
      </div>
    );
  }
}
