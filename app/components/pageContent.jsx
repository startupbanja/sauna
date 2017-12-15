import React from 'react';
import Image from './Image';
import FeedbackView from './FeedbackView';
import LandingPage from './LandingPage';
import UserList from './UserList';

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

const users = [
  {
    name: 'joku',
    description: 'ehehe',
    img: '../app/imgs/coach_placeholder.png',
  },
  {
    name: 'joku muu',
    description: 'iha cool dude',
    img: '../app/imgs/coach_placeholder.png',
  },
  {
    name: 'beibi corps',
    description: 'ehehe',
    img: '../app/imgs/feedback2.png',
  },
  {
    name: 'wgatever',
    description: 'yolo in corporate form',
    img: '../app/imgs/coach_placeholder.png',
  },
];


const content = {
  mainPage: <div><h1>Home</h1><LandingPage /></div>,
  timetable: <div><h1>Timetable</h1><Image src="../app/imgs/userSchedule1.png" /></div>,
  userProfile: <div><h1>User Profile</h1><Image src="../app/imgs/userProfile1.png" /></div>,
  feedback: <div><FeedbackView questions={feedbackQuestions} /></div>,
  coaches: <div><UserList users={users} type="Coaches" /></div>,
  startups: <div><UserList users={users} type="Startups" /></div>,
};

const labels = {
  mainPage: 'Home',
  timetable: 'Timetable',
  userProfile: 'User Profile',
  feedback: 'Feedback',
  coaches: 'Coaches',
  startups: 'Startups',
};

export default { content, labels };
