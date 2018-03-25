import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserListItem from './UserListItem';
import pageContent from '../pageContent';

/*
  Component to fetch and display lists of startups or coaches
  also filters coaches and startups
*/
export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.fetchAndUpdate = this.fetchAndUpdate.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.renderSearchBar = this.renderSearchBar.bind(this);
    this.state = {
      // array of objects {description, id, img, name}
      users: [],
      // the text by witch filtering results
      filterText: '',
    };
  }

  componentDidMount() {
    this.fetchAndUpdate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.type === this.props.type) return;
    this.fetchAndUpdate();
  }

  fetchAndUpdate() {
    pageContent.fetchData('/users', 'get', {
      type: this.props.type,
    }).then(responseJson => this.setState({
      users: responseJson.users,
    }));
  }

  handleFilterChange(event) {
    this.setState({ filterText: event.target.value });
  }
  clearFilter() {
    this.setState({ filterText: '' });
  }

  // render the textfield for filtering results
  renderSearchBar() {
    return (
      <div className="user-filter-container">
        <input
          className="filter-input text-edit form-control"
          id="user-search"
          type="search"
          onChange={this.handleFilterChange}
          value={this.state.filterText}
          placeholder="Search..."
        />
        <span
          className="glyphicon glyphicon-remove"
          onClick={this.clearFilter}
          role="button"
          tabIndex="-100"
          onKeyPress={() => {}}
          style={{ visibility: (this.state.filterText === '') ? 'hidden' : 'visible' }}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        {this.renderSearchBar()}
        {this.state.users
          .filter(user => user.name.toLowerCase().includes(this.state.filterText.toLowerCase()))
          .map(user =>
          (
            <Link
              key={user.name}
              to={`${this.props.match.url}/${user.id}`}
              href={`${this.props.match.url}/${user.id}`}
            >
              <UserListItem
                name={user.name}
                id={user.id}
                description={user.description}
                imageSrc={user.img}
              />
            </Link>
          ))}
      </div>
    );
  }
}

UserList.propTypes = {
  type: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};
