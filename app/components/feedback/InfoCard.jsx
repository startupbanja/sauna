import React from 'react';
import PropTypes from 'prop-types';
import defaultImg from '../../imgs/coach_placeholder.png';

// component to display info about the user to give feedback to
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
            <img
              className="img-responsive cardImage"
              src={this.props.info.image_src || defaultImg}
              alt="coach"
            />
          </div>
          <div className="form-group feedback-info">
            {(this.props.info.description.length <= 150)
              ? this.props.info.description : (`${this.props.info.description.slice(0, 150)} ...`)
            }
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
