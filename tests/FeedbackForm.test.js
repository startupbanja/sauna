import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import FeedbackForm from '../app/components/FeedbackForm';

describe('function calls', () => {
  describe('when rating is clicked', () => {
    const onSubmit = jest.fn();
    const info = {
      name: 'name',
      image_src: 'img_src',
      description: 'description',
      rating: 0,
      meetingId: 0,
    };
    const questions = [{
      index: 0,
      question: 'question',
      options: [0],
    }];

    const feedbackForm = ReactTestUtils.renderIntoDocument(<FeedbackForm onSubmit={onSubmit} info={info} questions={questions}/>); //eslint-disable-line

    test('onSubmit is called', () => {
      const button = ReactTestUtils.findRenderedDOMComponentWithClass(feedbackForm, 'btn btn-secondary radiobutton');
      ReactTestUtils.Simulate.click(button);
      expect(onSubmit.mock.calls.length).toBe(1);
    });

    test('handleSubmit is called', () => {
      const handleSubmit = jest.fn();
      feedbackForm.handleSubmit = handleSubmit;
      const form = ReactTestUtils.findRenderedDOMComponentWithClass(feedbackForm, 'btn btn-secondary radiobutton');
      ReactTestUtils.Simulate.click(form);
      expect(handleSubmit.mock.calls.length).toBe(1);
    });

    test('handleChange is called', () => {
      const handleChange = jest.fn();
      feedbackForm.handleSubmit = handleChange;
      const form = ReactTestUtils.findRenderedDOMComponentWithClass(feedbackForm, 'btn btn-secondary radiobutton');
      ReactTestUtils.Simulate.click(form);
      expect(handleChange.mock.calls.length).toBe(1);
    });
  });
});
