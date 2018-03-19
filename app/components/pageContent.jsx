import React from 'react';
import { Route, Switch } from 'react-router-dom';
/* import Image from './Image'; */
import FeedbackView from './FeedbackView';
import LandingPage from './landing/LandingPage';
import UserProfilePage from './UserProfilePage';
import UserSchedule from './UserSchedule';
import UserList from './UserList';
import UserCreationPage from './UserCreation/UserCreationPage';
import App from './App';
import MeetingDaysView from './admin_manage/MeetingDaysView';
import TimeslotView from './timeslot/TimeslotView';
import AdminSchedules from './admin_manage/AdminSchedules';
import UserHandlingView from './admin_manage/UserHandlingView';
import MeetingDetailView from './admin_manage/MeetingDetailView';
import PasswordChange from './PasswordChange';
import AdminLandingPage from './AdminLandingPage';



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
    <Route exact path="/" component={LandingPage} />
    <Route path="/timetable" render={() => <UserSchedule />} />
    <Route path="/user" component={UserProfilePage} />
    <Route path="/feedback" render={() => <FeedbackView />} />
    <Route path="/availability" component={TimeslotView} />
    <Route path="/change_password" component={PasswordChange} />
  </Switch>
);

const userLabels = {
  '/': 'Home',
  '/timetable': 'Timetable',
  '/user': 'User Profile',
  '/feedback': 'Feedback',
  '/coaches': 'Coaches',
  '/startups': 'Startups',
  '/availability': 'Availability',
  '/change_password': 'Change password',
};

const adminContent = (
  <Switch>
    <Route exact path="/" component={AdminLandingPage} />
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
      path="/timetable/:date/"
      render={({ match }) => (
        <AdminSchedules date={match.params.date} />
      )}
    />
    <Route
      path="/meetings/recent/:date/"
      render={({ match }) => (
        <MeetingDetailView date={match.params.date} renderFeedbacks />
      )}
    />
    <Route
      path="/meetings/:date/"
      render={({ match }) => (
        <MeetingDetailView date={match.params.date} renderFeedbacks={false} />
      )}
    />
    <Route path="/users" component={UserHandlingView} />
    <Route
      exact
      path="/create_user"
      render={() => <UserCreationPage />}
      type="Create User"
    />
    <Route
      exact
      path="/404"
      component={PageNotFound}
    />
  </Switch>
);

const adminLabels = {
  '/': 'Home',
  '/coaches': 'Coaches',
  '/startups': 'Startups',

  '/users': 'Users',
  '/meetingDays': 'Meeting days',
  '/create_user': 'Create User',
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
    fetch(`/api${query}`, {
      method: methodType,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyParams,
    }).then((response) => {
      switch (response.status) {
        case 200:
          resolve(response.json());
          break;
        case 401:
          App.logOff();
          reject();
          break;
        case 404:
          reject();
          break;
        default:
          reject();
          break;
      }
    })
      .catch((error) => {
        console.log(error);
        reject();
      }));
}

export default { getContent, userContent, fetchData };
