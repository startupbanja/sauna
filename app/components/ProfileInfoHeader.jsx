import React from 'react';
import PropTypes from 'prop-types';

export default class ProfileInfoHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { titles: props.titles };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      titles: nextProps.titles,
    });
  }
  render() {
    const titles = this.state.titles.map(x => (
      <li key={x}>{x}</li>
    ));
    return (
      <div className="userInfoHeader">
        <img src={this.props.imgSrc} alt="Username" className="userImage img-responsive" />
        <div className="mainInfoSection">
          <h3 id="username">{this.props.name}</h3>
          <ul className="titles">
            {titles}
          </ul>
        </div>
      </div>
    );
  }
}

ProfileInfoHeader.propTypes = {
  name: PropTypes.string.isRequired,
  imgSrc: PropTypes.string,
  titles: PropTypes.arrayOf(PropTypes.string),
};

ProfileInfoHeader.defaultProps = {
  imgSrc: '../app/imgs/coach_placeholder.png',
  titles: [],
};
