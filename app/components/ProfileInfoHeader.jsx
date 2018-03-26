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
    let modifyBtn = '';
    let resetPW;

    if (this.props.canModify) {
      modifyBtn = (
        <span
          className="glyphicon glyphicon-cog"
          onClick={this.props.onModifyClick}
          role="button"
          tabIndex={0}
          onKeyPress={this.props.onModifyClick}
        />);
    }

    if (this.props.canResetPW) {
      resetPW = (
        <button
          className="btn btn-major"
          onClick={this.props.resetPW}
        >
        Reset password
        </button>);
    }

    return (
      <div className="userInfoHeader row">
        <img src={this.props.imgSrc} alt="Username" className="userImage img-responsive col-xs-5" />
        <div className="mainInfoSection col-xs-7">
          {resetPW}
          {modifyBtn}
          <h4 id="username">{this.props.name}</h4>
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
  canModify: PropTypes.bool,
  canResetPW: PropTypes.bool,
  resetPW: PropTypes.func.isRequired,
  onModifyClick: PropTypes.func.isRequired,
};

ProfileInfoHeader.defaultProps = {
  imgSrc: '../app/imgs/coach_placeholder.png',
  titles: [],
  canModify: false,
  canResetPW: false,
};
