import React from 'react';
import { Route, Switch } from 'react-router-dom';
/* import Image from './Image'; */
import FeedbackView from './FeedbackView';
import LandingPage from './LandingPage';
import UserProfilePage from './UserProfilePage';
import UserSchedule from './UserSchedule';
import UserList from './UserList';
import App from './App';
import MeetingDaysView from './admin_manage/MeetingDaysView';
import TimeslotView from './timeslot/TimeslotView';
import AdminSchedules from './AdminSchedules';
// import MeetingListView from './MeetingListView';
import MeetingView from './MeetingView';

const feedbackQuestions = {
  coach: [{
    index: 0,
    question: 'Would you like to meet again?',
    options: [0, 1, 2],
  }],
  startup: [{
    index: 0,
    question: 'Would you like to meet again?',
    options: [0, 1, 3],
  }],
};

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

const userContent = (
  <Switch>
    <Route path="/coaches/:id" render={({ match }) => <UserProfilePage id={match.params.id} />} />
    <Route
      exact
      path="/coaches"
      render={({ match }) => <UserList match={match} type="Coaches" />}
    />
    <Route path="/startups/:id" render={({ match }) => <UserProfilePage id={match.params.id} />} />
    <Route
      exact
      path="/startups"
      render={({ match }) => <UserList match={match} type="Startups" />}
    />
    <Route path="/main" render={() => <div><h1>Home</h1><LandingPage /></div>} />
    <Route path="/timetable" render={() => <UserSchedule schedule={schedule} />} />
    <Route path="/user" component={UserProfilePage} />
    <Route path="/feedback" render={() => <FeedbackView questions={feedbackQuestions} />} />
    <Route path="/availability" component={TimeslotView} />
  </Switch>
);

const userLabels = {
  '/main': 'Home',
  '/timetable': 'Timetable',
  '/user': 'User Profile',
  '/feedback': 'Feedback',
  '/coaches': 'Coaches',
  '/startups': 'Startups',
  '/availability': 'Availability',
};
/* eslint-disable */
const testSchedule = [
{
  coachName: 'Coach 1',
  startUps: [{
    startupName: 'Startup 1',
    time: '13:00 - 13:20',
  },
  {
    startupName: 'Startup 2',
    time: '13:20 - 13:40',
  },
  ],
},
{
  coachName: 'Coach 2',
  startUps: [{
    startupName: 'Startup 3',
    time: '13:00 - 13:20',
  },
  {
    startupName: 'Startup 4',
    time: '13:20 - 13:40',
  },
  ],

},
{ coachName: 'Coach 3',
  startUps: [{
    startupName: 'Startup 5',
    time: '13:00 - 13:20',
  },
  {
    startupName: 'Startup 6',
    time: '13:20 - 13:40',
  },
  ],},
];

/* eslint-enable */

const adminContent = (
  <Switch>
    <Route path="/main" render={() => <div><h1>Home</h1><LandingPage /></div>} />
    <Route path="/coaches/:id" render={({ match }) => <UserProfilePage id={match.params.id} />} />
    <Route
      exact
      path="/coaches"
      render={({ match }) => <UserList match={match} type="Coaches" />}
    />
    <Route path="/startups/:id" render={({ match }) => <UserProfilePage id={match.params.id} />} />
    <Route
      exact
      path="/startups"
      render={({ match }) => <UserList match={match} type="Startups" />}
    />
    <Route path="/meetingDays" component={MeetingDaysView} />
    <Route
      path="/timetable/:date"
      render={({ match }) => (
        <AdminSchedules date={match.params.date} />
      )}
    />
    <Route
      exact
      path="/meetings/"
      render={() => (
        <MeetingView />
      )}
    />
    <Route
      path="/meetings/:date/"
      render={({ match }) => (
        <MeetingView detail date={match.params.date} />
      )}
    />
  </Switch>
);

const adminLabels = {
  '/main': 'Home',
  '/coaches': 'Coaches',
  '/startups': 'Startups',
  '/meetingDays': 'Meeting days',
};
// TODO change this to something better later
function getContent(userType) {
  if (userType === 'admin') {
    return { content: adminContent, labels: adminLabels };
  }
  return { content: userContent, labels: userLabels };
}

function fetchData(path, methodType, params) {
  const paramsString = Object.keys(params).map(x => `${x}=${params[x]}`).join('&');
  let query = path;
  let bodyParams;
  if (methodType.toLowerCase() === 'get') query += `?${paramsString}`;
  else bodyParams = paramsString;
  return new Promise((resolve, reject) =>
    fetch(`http://127.0.0.1:3000${query}`, {
      method: methodType,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyParams,
    }).then((response) => {
      if (response.status === 401) {
        App.logOff();
        reject();
      } else resolve(response.json());
    })
      .catch((error) => {
        console.log(error);
        reject();
      }));
}

export default { getContent, userContent, fetchData };
