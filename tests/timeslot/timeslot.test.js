import React from 'react';
import {parseMinutes, parseTimeStamp, Timeslot} from '../../app/components/timeslot/Timeslot';
import renderer from 'react-test-renderer';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

test('parseMinutes works correctly', () => {
    expect(parseMinutes("string")).toBe(false);
    expect(parseMinutes("24:00")).toBe(false);
    expect(parseMinutes("10")).toBe(false);
    expect(parseMinutes("3:63")).toBe(false);
    expect(parseMinutes("9:00")).toBe(540);
    expect(parseMinutes("13:24")).toBe(804);
    expect(parseMinutes("-4:00")).toBe(false);
    expect(parseMinutes("23:59")).toBe(1439);
    expect(parseMinutes("0:00")).toBe(0);
});

test('parseTimeStamp works correctly', () => {
    expect(parseTimeStamp(-1)).toBe(false);
    expect(parseTimeStamp(1440)).toBe(false);
    expect(parseTimeStamp(0)).toBe("0:00");
    expect(parseTimeStamp(512)).toBe("8:32");
    expect(parseTimeStamp(770)).toBe("12:50");
    expect(parseTimeStamp(1439)).toBe("23:59");
    expect(parseTimeStamp(600)).toBe("10:00");
});

test('Timeslot initializes correctly', () => {
    var timeslot = renderer.create(<Timeslot start="8:00" end="12:00" split={40} />);
    let tree = timeslot.toJSON();
    expect(tree).toMatchSnapshot();
    timeslot = renderer.create(<Timeslot start="12:20" end="20:40" split={20} />);
    tree = timeslot.toJSON();
    expect(tree).toMatchSnapshot();
});

test('Timeslot adds breaks correctly', () => {
    const timeslot = shallow(<Timeslot start="8:00" end="12:00" split={30} />);
    timeslot.instance().handleBreakAddition();
    expect(timeslot.state().breaks).toEqual([{start: 510, end: 540}]);
    expect(timeslot).toMatchSnapshot();
    timeslot.instance().handleBreakAddition();
    expect(timeslot.state().breaks).toEqual([{start: 510, end: 540}, {start: 570, end: 600}]);
    expect(timeslot).toMatchSnapshot();
    timeslot.instance().handleBreakAddition();
    timeslot.instance().handleBreakAddition();
    timeslot.instance().handleBreakAddition();
    expect(timeslot.state().breaks).toEqual([{start: 510, end: 540}, {start: 570, end: 600}, {start: 630, end: 660}, {start: 690, end: 720}, {start: 480, end: 510}]);
    expect(timeslot).toMatchSnapshot();
});

describe('Timeslot handles change correctly', () => {
    test("handles availability change", () => {
        const timeslot = shallow(<Timeslot start="10:00" end="12:00" split={20} />);
        timeslot.instance().handleChange("available", 'start', -30);
        expect(timeslot.state().available).toEqual({start: 600, end: 720});
        timeslot.instance().handleChange("available", 'start', 10);
        expect(timeslot.state().available).toEqual({start: 620, end: 720});
        timeslot.instance().handleChange("available", 'start', 9);
        expect(timeslot.state().available).toEqual({start: 620, end: 720});
        timeslot.instance().handleChange("available", "end", 20);
        expect(timeslot.state().available).toEqual({start: 620, end: 720});
        timeslot.instance().handleChange("available", "end", -35);
        expect(timeslot.state().available).toEqual({start: 620, end: 680});
        expect(timeslot).toMatchSnapshot();
        timeslot.instance().handleChange("available", "end", 26);
        expect(timeslot.state().available).toEqual({start: 620, end: 700});
        timeslot.instance().handleChange("available", "start", 100);
        expect(timeslot.state().available).toEqual({start: 700, end: 700});
        expect(timeslot).toMatchSnapshot();
    });
    test("handles break change", () => {
        const timeslot = shallow(<Timeslot start="10:00" end="12:00" split={20} />);
        timeslot.setState({breaks: [{start: 620, end: 640}, {start: 680, end: 700}]});
        timeslot.instance().handleChange("break", "start", -11, 0);
        expect(timeslot.state().breaks).toEqual([{start: 600, end: 640}, {start: 680, end: 700}]);
        timeslot.instance().handleChange("break", "start", -11, 0);
        expect(timeslot.state().breaks).toEqual([{start: 600, end: 640}, {start: 680, end: 700}]);
        timeslot.instance().handleChange("break", "end", -10, 0);
        expect(timeslot.state().breaks).toEqual([{start: 600, end: 640}, {start: 680, end: 700}]);
        timeslot.instance().handleChange("break", "end", 27, 0);
        expect(timeslot.state().breaks).toEqual([{start: 600, end: 660}, {start: 680, end: 700}]);
        expect(timeslot).toMatchSnapshot();
        timeslot.instance().handleChange("break", "end", 40, 1);
        expect(timeslot.state().breaks).toEqual([{start: 600, end: 660}, {start: 680, end: 720}]);
        timeslot.instance().handleChange("break", "end", -60, 1);
        expect(timeslot.state().breaks).toEqual([{start: 600, end: 660}, {start: 680, end: 680}]);
        expect(timeslot).toMatchSnapshot();
    });
});