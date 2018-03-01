import React, { Component } from 'react';

const testStartups = [
  { name: 'Startti1', id: 1, active: true },
  { name: 'Startti2', id: 2, active: true },
  { name: 'Startti3', id: 3, active: false },
  { name: 'Startti4', id: 4, active: false },
];
const testCoaches = [
  { name: 'Coachi1', id: 1, active: true },
  { name: 'Startti2', id: 2, active: true },
  { name: 'Startti3', id: 3, active: false },
  { name: 'Startti4', id: 4, active: false },
];

/* Component for presenting active and inactive users */
class UserHandlingView extends Component {
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
  }
  
  fetchData() {
    setTimeout(() => {
      this.setState({
        startups: testStartups,
        coaches: testCoaches,
      });
    }, 200);
  }

  render() {
    return (
      <div>
        <p>User handling</p>
      </div>
    );
  }
}

export default UserHandlingView;
