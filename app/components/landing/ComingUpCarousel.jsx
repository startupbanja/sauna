import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ScheduleItem from './ScheduleItem';

/* Component to display carousel of upcoming timetable */
class ComingUpCarousel extends Component {
  render() {
    const indicators = [];
    const items = [];

    for (let i = 0; i < this.props.timetable.length; i += 1) {
      let className = '';
      if (i === 0) className = 'active';
      const indicator = (<li
        key={`carouselIndicator${i}`}
        data-target="#theComingUpCarousel"
        data-slide-to={Math.min(i, this.props.timetable.length - 3)}
        className={className}
      />);
      indicators.push(indicator);
      if (i > this.props.timetable.length - 3) continue; // eslint-disable-line
      const scheduleItemContainers = [];
      for (let j = 0; j < 3; j += 1) {
        const scheduleItemData = this.props.timetable[i + j];
        let scheduleItem;
        if (scheduleItemData.name) {
          scheduleItem = (<ScheduleItem
            type="meeting"
            time={{
              start: new Date(`${this.props.date}T${scheduleItemData.startTime}`),
              end: new Date(`${this.props.date}T${scheduleItemData.endTime}`),
            }}
            name={scheduleItemData.name}
          />);
        } else {
          scheduleItem = (<ScheduleItem
            type="break"
            time={{
              start: new Date(`${this.props.date}T${scheduleItemData.startTime}`),
              end: new Date(`${this.props.date}T${scheduleItemData.endTime}`),
            }}
          />);
        }
        scheduleItemContainers.push(<div key={`carouselItemItem${i + j}`} className="col-xs-4">{scheduleItem}</div>);
      }
      const item = (
        <div key={`carouselItem${i}`} className={`item ${className}`}>
          {scheduleItemContainers}
        </div>
      );
      items.push(item);
    }

    return (
      <div className="carousel slide multi-item-carousel" id="theComingUpCarousel">
        <link rel="stylesheet" type="text/css" href="app/styles/carousel_style.css" />
        <ol className="carousel-indicators">
          {indicators}
        </ol>
        <div className="carousel-inner">
          {items}
        </div>
        <a className="left carousel-control" href="#theComingUpCarousel" data-slide="prev">
          <i className="glyphicon glyphicon-chevron-left" />
        </a>
        <a className="right carousel-control" href="#theComingUpCarousel" data-slide="next">
          <i className="glyphicon glyphicon-chevron-right" />
        </a>
      </div>
    );
  }
}

ComingUpCarousel.propTypes = {
  timetable: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  })).isRequired,
  date: PropTypes.string.isRequired,
};

export default ComingUpCarousel;
