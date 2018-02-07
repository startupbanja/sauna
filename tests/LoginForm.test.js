import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import LoginForm from '../app/components/LoginForm';

describe('function calls', () => {
  const onSubmit = jest.fn();

  const loginform = ReactTestUtils.renderIntoDocument(<LoginForm onSubmit={onSubmit} />); //eslint-disable-line

  test('onSubmit is called', () => {
    const button = ReactTestUtils.findRenderedDOMComponentWithTag(loginform, 'button');
    ReactTestUtils.Simulate.click(button);
    expect(onSubmit.mock.calls.length).toBe(1);
  });
});
