import React from 'react';
import Image from './Image';
import FeedbackView from './FeedbackView';
import LandingPage from './LandingPage';

const feedbackQuestions = [
  {
    index: 0,
    question: 'Was it useful?',
    options: [0, 1, 2],
  },
  {
    index: 1,
    question: 'Would you like to meet again?',
    options: [0, 1, 3],
  },
];

const content = {
  mainPage: <div><h1>Home</h1><LandingPage /></div>,
  timetable: <div><h1>Timetable</h1><Image src="../app/imgs/userSchedule1.png" /></div>,
  userProfile: <div><h1>User Profile</h1><Image src="../app/imgs/userProfile1.png" /></div>,
  feedback: <div><FeedbackView questions={feedbackQuestions} /></div>,
  coaches: <div><h1>Coach Information</h1><Image src="../app/imgs/coaches1.png" /></div>,
};

const labels = {
  mainPage: 'Home',
  timetable: 'Timetable',
  userProfile: 'User Profile',
  feedback: 'Feedback',
  coaches: 'Coaches',
};

export default { content, labels };
