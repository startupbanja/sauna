import React from 'react';
import PropTypes from 'prop-types';

export default class InfoCard extends React.Component {
  render() {
    return (
      <div>
        <h2>{this.props.info.name}</h2>
        <div className="row">
          <div className="col-xs-5">
            <img className="img-responsive cardImage" src={this.props.info.image_src} alt="coach" />
          </div>
          <div className="col-xs-7">
            <p>{this.props.info.description}</p>
          </div>
        </div>
      </div>
    );
  }
}

InfoCard.propTypes = {
  info: PropTypes.shape({
    name: PropTypes.string,
    image_src: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};
