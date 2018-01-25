import React from 'react';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import Timeslot, { parseMinutes, parseTimeStamp } from '../../app/components/timeslot/Timeslot';


configure({ adapter: new Adapter() });

test('parseMinutes works correctly', () => {
  expect(parseMinutes('string')).toBe(false);
  expect(parseMinutes('24:00')).toBe(false);
  expect(parseMinutes('10')).toBe(false);
  expect(parseMinutes('3:63')).toBe(false);
  expect(parseMinutes('9:00')).toBe(540);
  expect(parseMinutes('13:24')).toBe(804);
  expect(parseMinutes('-4:00')).toBe(false);
  expect(parseMinutes('23:59')).toBe(1439);
  expect(parseMinutes('0:00')).toBe(0);
});

test('parseTimeStamp works correctly', () => {
  expect(parseTimeStamp(-1)).toBe(false);
  expect(parseTimeStamp(1440)).toBe(false);
  expect(parseTimeStamp(0)).toBe('0:00');
  expect(parseTimeStamp(512)).toBe('8:32');
  expect(parseTimeStamp(770)).toBe('12:50');
  expect(parseTimeStamp(1439)).toBe('23:59');
  expect(parseTimeStamp(600)).toBe('10:00');
});

test('Timeslot initializes correctly', () => {
  var timeslot = renderer.create(<Timeslot start="8:00" end="12:00" />); //eslint-disable-line
  let tree = timeslot.toJSON();
  expect(tree).toMatchSnapshot();
  timeslot = renderer.create(<Timeslot start="12:20" end="20:40" />);
  tree = timeslot.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Timeslot handles change correctly', () => {
  const timeslot = shallow(<Timeslot start="10:00" end="12:00" />);
  timeslot.instance().handleChange('start', -30);
  expect(timeslot.state().available).toEqual({ start: 600, end: 600 });
  timeslot.instance().handleChange('end', 130);
  expect(timeslot.state().available).toEqual({ start: 600, end: 720 });
  timeslot.instance().handleChange('start', 10);
  expect(timeslot.state().available).toEqual({ start: 610, end: 720 });
  timeslot.instance().handleChange('end', 20);
  expect(timeslot.state().available).toEqual({ start: 610, end: 720 });
  timeslot.instance().handleChange('end', -35);
  expect(timeslot.state().available).toEqual({ start: 610, end: 685 });
  expect(timeslot).toMatchSnapshot();
  timeslot.instance().handleChange('end', 26);
  expect(timeslot.state().available).toEqual({ start: 610, end: 711 });
  timeslot.instance().handleChange('start', 130);
  expect(timeslot.state().available).toEqual({ start: 711, end: 711 });
  expect(timeslot).toMatchSnapshot();
});
