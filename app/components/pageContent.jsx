import React from 'react';
import Image from './Image';
import FeedbackView from './FeedbackView';
import LandingPage from './LandingPage';
import UserSchedule from './UserSchedule';
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

const schedule = {
  date: 'Wed 27.11.2017',
  meetings: [{
    name: 'Ilkka Paananen',
    img: 'http://startupsauna.com/wp-content/uploads/2017/06/Ilkka-Paananen.jpg',
    time: '10.00 - 10.40',
  }, {
    name: 'Juha Ruohonen',
    img: 'http://startupsauna.com/wp-content/uploads/2017/06/Juha-Ruohonen.jpg',
    time: '10.40 - 11.00',
  }, {
    name: 'Timo Ahopelto',
    img: 'http://startupsauna.com/wp-content/uploads/2017/06/57593326324cc12c26fb3fff_Timo-Ahopelto.png',
    time: '11.00 - 11.40',
  }, {
    name: 'Moaffak Ahmed',
    img: 'http://startupsauna.com/wp-content/uploads/2017/06/Moaffak-Ahmed.jpg',
    time: '11.40 - 12.00',
  }, {
    name: 'Aape Pohjavirta',
    img: 'http://startupsauna.com/wp-content/uploads/2017/06/Aape-Pohjavirta.jpg',
    time: '12.00 - 12.40',
  }],
};

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
  timetable: <UserSchedule schedule={schedule} />,
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
