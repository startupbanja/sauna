import React from 'react';
import PropTypes from 'prop-types';

export default class InfoCard extends React.Component {
  render() {
    const datetime = new Date(`${this.props.info.date}T${this.props.info.time}`);
    const dateOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return (
      <div>
        <h2 className="feedback-header" >{this.props.info.name}</h2>
        <p className="datetime">{datetime.toLocaleDateString('en-GB', dateOptions).replace(/\//g, '.')}</p>
        <div className="row">
          <div className="form-group col-xs-5">
            <img className="img-responsive cardImage" src={this.props.info.image_src} alt="coach" />
          </div>
          <div className="form-group feedback-info">
            {this.props.info.description}
          </div>
        </div>
      </div>
    );
  }
}

InfoCard.propTypes = {
  info: PropTypes.shape({
    date: PropTypes.string,
    time: PropTypes.string,
    name: PropTypes.string,
    image_src: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};
