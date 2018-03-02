import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import UserHandlingView from '../../app/components/admin_manage/UserHandlingView';

configure({ adapter: new Adapter() });

const testData = {
  startups: [
    { id: 1, name: 'AdLaunch', active: 1 },
    { id: 2, name: 'Avanto', active: 0 },
  ],
  coaches: [
    { id: 14, name: 'Aape Pohjavirta', active: 0 },
    { id: 15, name: 'Andrea Di Pietrantonio', active: 1 },
    { id: 16, name: 'Antti Pennanen', active: 0 },
  ],
};

describe('function calls', () => {
  const fetchData = jest.fn();
  fetchData.mockReturnValue(testData);
  UserHandlingView.prototype.fetchData = fetchData;

  const userHandlingView = mount(<UserHandlingView />); // eslint-disable-line
  userHandlingView.setState(testData);

  test('mounting calls fetchData', () => {
    expect(fetchData.mock.calls.length).toBe(1);
  });

  test('clicking boxes calls handleActivityChanged', () => {
    const handle = jest.fn();
    userHandlingView.handleActivityChanged = handle;
    userHandlingView.update();
    const checkboxes = userHandlingView.find('UserActivityList').first().find('CheckBox');
    const random = parseInt(Math.random() * checkboxes.length, 10);
    const btn = checkboxes.at(random).find('.pretty-checkbox-container');
    btn.simulate('click');
    expect(handle.mock.calls.length).toBe(1);
  });
});
