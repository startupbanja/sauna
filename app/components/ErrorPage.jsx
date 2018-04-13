import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Component for displaying http error pages
class ErrorPage extends Component {
  render() {
    switch (this.props.errorCode) {
      case 504:
        return (
          <div className="error-page">
            <h1>504</h1>
            <p>Gateway Timeout Error</p>
          </div>
        );
      case 500:
        return (
          <div className="error-page">
            <h1>500</h1>
            <p>Internal Server Error</p>
          </div>
        );
      case 404:
        return (
          <div className="error-page">
            <h1>404</h1>
            <p>Page Not Found</p>
          </div>
        );
      case 403:
        return (
          <div className="error-page">
            <h1>403</h1>
            <p>Forbidden</p>
          </div>
        );
      case 401:
        return (
          <div className="error-page">
            <h1>401</h1>
            <p>Unauthorized</p>
          </div>
        );
      default:
        return (
          <div>
            <p>An unexpected error occured</p>
          </div>
        );
    }
  }
}

ErrorPage.propTypes = {
  errorCode: PropTypes.number.isRequired,
};

export default ErrorPage;
