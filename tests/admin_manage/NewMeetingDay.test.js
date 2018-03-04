import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import NewMeetingDayBlock from '../../app/components/admin_manage/NewMeetingDayBlock';

class TestComponent extends NewMeetingDayBlock {
  constructor(props) {
    super(props);
    this.validateForm = jest.fn();
  }
}

describe('form validation', () => {
  let newMeetingDayBlock = null;
  let submitButton = null;
  let form = null;
  let inputs = null;
  beforeEach(() => {
    newMeetingDayBlock = ReactTestUtils
      .renderIntoDocument(<NewMeetingDayBlock onSubmit={jest.fn()}/>); // eslint-disable-line
    submitButton = ReactTestUtils.findRenderedDOMComponentWithTag(newMeetingDayBlock, 'button');
    form = ReactTestUtils.findRenderedDOMComponentWithTag(newMeetingDayBlock, 'form');
    inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(newMeetingDayBlock, 'input');

    const values = ['2018-02-02', '10:00', '14:00', 40];
    for (let i = 0; i < values.length; i += 1) {
      inputs[i].value = values[i];
    }
  });

  test('validateForm should be called on submit', () => {
    newMeetingDayBlock.validateForm = jest.fn();
    newMeetingDayBlock.forceUpdate();

    ReactTestUtils.Simulate.submit(form);
    expect(newMeetingDayBlock.validateForm.mock.calls.length).toBe(1);
  });

  // test('valid data should pass validation and submit...', () => {
  //   ReactTestUtils.Simulate.submit(form);
  //   expect(newMeetingDayBlock.props.onSubmit.mock.calls.length).toBe(1);
  // });
});
