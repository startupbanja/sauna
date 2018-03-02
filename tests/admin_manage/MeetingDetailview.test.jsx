import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import MeetingDetailView from '../../app/components/admin_manage/MeetingDetailView';

class TestComponent extends MeetingDetailView {
  constructor(props) {
    super(props);
    this.fetchFeedbacks = jest.fn();
    this.fetchTimeslots = jest.fn();
  }
}

describe('When loading MeetingDetailView...', () => {
  test('fetchFeedbacks is called when we pass renderFeedbacks = true', () => {
    const component = ReactTestUtils
      .renderIntoDocument(<TestComponent date="2018-01-01" renderFeedbacks />);
    expect(component.fetchFeedbacks.mock.calls.length).toBe(1);
  });

  test('fetchFeedbacks is not called when we pass renderFeedbacks = false', () => {
    const component = ReactTestUtils
      .renderIntoDocument(<TestComponent date="2018-01-01" renderFeedbacks={false} />);
    expect(component.fetchFeedbacks.mock.calls.length).toBe(0);
  });

  test('fetchTimeslots is called when rendering component', () => {
    const component = ReactTestUtils
      .renderIntoDocument(<TestComponent date="2018-01-01" renderFeedbacks />);
    expect(component.fetchTimeslots.mock.calls.length).toBe(1);
  });
});
