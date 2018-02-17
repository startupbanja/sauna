import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import NewMeetingDayBlock from '../../app/components/admin_manage/NewMeetingDayBlock';

describe('form validation', () => {
  const newMeetingDayBlock = ReactTestUtils.renderIntoDocument(<NewMeetingDayBlock />); // eslint-disable-line
  const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(newMeetingDayBlock, 'input');
  const form = ReactTestUtils.findRenderedDOMComponentWithTag(newMeetingDayBlock, 'form');
  const submitButton = ReactTestUtils.findRenderedDOMComponentWithTag(newMeetingDayBlock, 'button');
  const onSubmitFn = jest.fn();
  const module = require('../../app/components/admin_manage/NewMeetingDayBlock'); // eslint-disable-line
  module.validateForm = jest.fn();

  beforeEach(() => {
    const values = ['2018-02-02', '10:00', '14:00', 40];
    for (let i = 0; i < values.length; i += 1) {
      inputs[i].value = values[i];
    }
  });

  test('form submits with valid data', () => {
    for (let i = 0; i < inputs.length; i += 1) {
      console.log(inputs[i].value);
    }
    ReactTestUtils.Simulate.click(submitButton);
    expect(module.validateForm.mock.calls.length).toBe(1);
  });
});
