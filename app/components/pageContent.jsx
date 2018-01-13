import React from 'react';
/* import Image from './Image'; */
import FeedbackView from './FeedbackView';
import LandingPage from './LandingPage';
import UserProfile from './UserProfile';
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
  }],
};

/*
Don't need this anymore
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
]; */

// Template data for the User Profile.
const profileInfo = {
  name: 'Sample User',
  description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed vehicula suscipit enim et faucibus.' +
      'Donec quis urna ut purus consequat viverra ultricies vel ex. ' +
      'Quisque a risus diam. Mauris luctus nisl non nibh porta blandit. ' +
      'Aenean nec vehicula enim, a rutrum neque.' +
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Donec imperdiet erat orci, at placerat odio volutpat quis. ' +
      'Nulla sodales tellus sit amet nibh dapibus, eget bibendum urna dictum. ' +
      'Quisque mauris risus, mattis et dui vel, aliquam pretium quam. ' +
      'Integer bibendum efficitur mi, nec facilisis arcu feugiat id. ' +
      'Mauris pellentesque accumsan velit ut tempor. ',
  titles: ['Software Team 12', 'Developer'],
  credentials: [
    { company: 'Aalto University', position: 'Student' },
    { company: 'Aalto University', position: 'Course assistant' },
    { company: 'Company', position: 'Position' },
  ],
};


const userContent = {
  mainPage: <div><h1>Home</h1><LandingPage /></div>,
  timetable: <UserSchedule schedule={schedule} />,
  userProfile: <UserProfile
    name={profileInfo.name}
    description={profileInfo.description}
    titles={profileInfo.titles}
    credentials={profileInfo.credentials}
  />,
  feedback: <div><FeedbackView questions={feedbackQuestions} /></div>,
  coaches: <div><UserList type="Coaches" /></div>,
  startups: <div><UserList type="Startups" /></div>,
};

const userLabels = {
  mainPage: 'Home',
  timetable: 'Timetable',
  userProfile: 'User Profile',
  feedback: 'Feedback',
  coaches: 'Coaches',
  startups: 'Startups',
};

const adminContent = {
  mainPage: <div><h1>Home</h1><LandingPage /></div>,
};

const adminLabels = {
  mainPage: 'Home',
};
// TODO change this to something better later
function getContent(userType) {
  if (userType === 'admin') {
    return { content: adminContent, labels: adminLabels };
  }
  return { content: userContent, labels: userLabels };
}

export default { getContent, userContent };
