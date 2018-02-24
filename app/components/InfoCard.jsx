import React from 'react';
import PropTypes from 'prop-types';

export default class InfoCard extends React.Component {
  render() {
    return (
      <div>
        <h2 className="feedback-header" >{this.props.info.name}</h2>
        <div>
          <div>
            <img className="img-responsive cardImage" src={this.props.info.image_src} alt="coach" />
          </div>
          <div className="feedback-info">
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
