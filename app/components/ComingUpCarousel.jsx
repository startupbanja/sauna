import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import ScheduleItem from './ScheduleItem';

const data = {
  schedule: [
    {
      time: {
        start: new Date(2017, 11, 8, 14, 0),
        end: new Date(2017, 11, 8, 14, 20),
      },
      coach: 'Ilkka Paananen',
      table: 'table 6',
    },
    {
      time: {
        start: new Date(2017, 11, 8, 14, 20),
        end: new Date(2017, 11, 8, 14, 40),
      },
      coach: 'Juha Ruohonen',
      table: 'table 5',
    },
    {
      time: {
        start: new Date(2017, 11, 8, 14, 40),
        end: new Date(2017, 11, 8, 15, 0),
      },
      coach: 'Timo Ahopelto',
      table: 'table 5',
    },
    {
      time: {
        start: new Date(2017, 11, 8, 15, 0),
        end: new Date(2017, 11, 8, 15, 20),
      },
    },
    {
      time: {
        start: new Date(2017, 11, 8, 15, 20),
        end: new Date(2017, 11, 8, 15, 40),
      },
      coach: 'Moaffak Ahmed',
      table: 'table 2',
    },
  ],
};

class ComingUpCarousel extends Component {
  render() {
    const indicators = [];
    const items = [];

    for (let i = 0; i < data.schedule.length; i += 1) {
      let className = '';
      if (i === 0) className = 'active';
      const indicator = (<li
        key={`carouselIndicator${i}`}
        data-target="#theComingUpCarousel"
        data-slide-to={Math.min(i, data.schedule.length - 3)}
        className={className}
      />);
      indicators.push(indicator);
      if (i > data.schedule.length - 3) continue; // eslint-disable-line
      const scheduleItemContainers = [];
      for (let j = 0; j < 3; j += 1) {
        const scheduleItemData = data.schedule[i + j];
        let scheduleItem;
        if (typeof scheduleItemData.coach !== 'undefined' && typeof scheduleItemData.table !== 'undefined') {
          scheduleItem = (<ScheduleItem
            type="meeting"
            time={scheduleItemData.time}
            coach={scheduleItemData.coach}
          />);
        } else {
          scheduleItem = <ScheduleItem type="break" time={scheduleItemData.time} />;
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

};

export default ComingUpCarousel;
