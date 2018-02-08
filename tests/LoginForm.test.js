import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import LoginForm from '../app/components/LoginForm';

describe('function calls', () => {
  const onSubmit = jest.fn();
  const pwdChanged = jest.fn();
  const usernameChanged = jest.fn();

  const loginform = ReactTestUtils.renderIntoDocument(<LoginForm onSubmit={onSubmit} />); //eslint-disable-line
  loginform.pwdChanged = pwdChanged;
  loginform.usernameChanged = usernameChanged;

  loginform.forceUpdate();

  test('onSubmit is called', () => {
    const button = ReactTestUtils.findRenderedDOMComponentWithTag(loginform, 'button');
    ReactTestUtils.Simulate.click(button);
    expect(onSubmit.mock.calls.length).toBe(1);
  });

  test('usernameChanged is called', () => {
    const input = ReactTestUtils.scryRenderedDOMComponentsWithTag(loginform, 'input')[0];
    ReactTestUtils.Simulate.change(input);
    expect(usernameChanged.mock.calls.length).toBe(1);
  });

  test('pwdChanged is called', () => {
    const input = ReactTestUtils.scryRenderedDOMComponentsWithTag(loginform, 'input')[1];
    ReactTestUtils.Simulate.change(input);
    expect(pwdChanged.mock.calls.length).toBe(1);
  });
});
