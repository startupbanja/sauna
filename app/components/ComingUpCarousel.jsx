import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScheduleItem } from './ScheduleItem';

const data = {
  schedule: [
    {
      time: {
        start: new Date(2017, 11, 8, 14, 0),
        end: new Date(2017, 11, 8, 14, 20),
      },
      coach: 'Coach 1',
      table: 'table 6',
    },
    {
      time: {
        start: new Date(2017, 11, 8, 14, 20),
        end: new Date(2017, 11, 8, 14, 40),
      },
      coach: 'Coach 2',
      table: 'table 5',
    },
    {
      time: {
        start: new Date(2017, 11, 8, 14, 40),
        end: new Date(2017, 11, 8, 15, 0),
      },
      coach: 'Coach 3',
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
      coach: 'Coach 4',
      table: 'table 2',
    },
  ],
};

export class ComingUpCarousel extends Component {
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
      if (i > data.schedule.length - 3) continue;
      const scheduleItemContainers = [];
      for (let j = 0; j < 3; j += 1) {
        const scheduleItemData = data.schedule[i + j];
        let scheduleItem;
        if (typeof scheduleItemData.coach !== 'undefined' && typeof scheduleItemData.table !== 'undefined') {
          scheduleItem = (<ScheduleItem
            type="meeting"
            time={scheduleItemData.time}
            coach={scheduleItemData.coach}
            table={scheduleItemData.table}
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
      <div className="carousel slide multi-item-carousel" id="theComingUpCarousel" style={{ background: 'blue' }}>
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
