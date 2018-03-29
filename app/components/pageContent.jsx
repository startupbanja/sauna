import React from 'react';
import { Route, Switch } from 'react-router-dom';
import FeedbackView from './feedback/FeedbackView';
import LandingPage from './landing/LandingPage';
import UserProfilePage from './UserProfile/UserProfilePage';
import UserTimetable from './timetable/UserTimetable';
import UserList from './UserList/UserList';
import UserCreationPage from './UserCreation/UserCreationPage';
import App from './App';
import MeetingDaysView from './admin_manage/MeetingDaysView';
import TimeslotView from './timeslot/TimeslotView';
import AdminSchedules from './admin_manage/AdminSchedules';
import UserHandlingView from './admin_manage/UserHandlingView';
import MeetingDetailView from './admin_manage/MeetingDetailView';
import PasswordChange from './UserProfile/PasswordChange';
import AdminLandingPage from './landing/AdminLandingPage';

// file that contains contents of the app for both users and admin
// also contains the default gateway for fetching data from backend


// react router Switch that contains all the user views
/* eslint-disable */
const userContent = [
  <Route path="/coaches/:id" render={({ match }) => <UserProfilePage id={match.params.id} />} />,
  <Route
    exact
    path="/coaches"
    render={({ match }) => <UserList match={match} type="Coaches" />}
  />,
  <Route path="/startups/:id" render={({ match }) => <UserProfilePage id={match.params.id} />} />,
  <Route
    exact
    path="/startups"
    render={({ match }) => <UserList match={match} type="Startups" />}
  />,
  <Route path="/timetable" render={() => <UserTimetable />} />,
  <Route path="/user" component={UserProfilePage} />,
  <Route path="/feedback" render={() => <FeedbackView />} />,
  <Route path="/change_password" component={PasswordChange} />,
];
const coachContent = [
  <Route path="/availability" component={TimeslotView} />,
  <Route exact path="/" render={() => <LandingPage type="coach" />} />,
];
const startupContent = [
  <Route exact path="/" render={() => <LandingPage type="startup" />} />,
];
/* eslint-enable */

// object that links router paths to their display names in menu in user side
const userLabels = {
  '/': 'Home',
  '/timetable': 'Timetable',
  '/user': 'User Profile',
  '/feedback': 'Feedback',
  '/coaches': 'Coaches',
  '/startups': 'Startups',
  '/change_password': 'Change password',
};
const coachLabels = {
  '/availability': 'Availability',
};

// react router Switch that contains all the admin views
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
  </Switch>
);

// object that links router paths to their display names in menu in admin side
const adminLabels = {
  '/': 'Home',
  '/coaches': 'Coaches',
  '/startups': 'Startups',
  '/users': 'Users',
  '/meetingDays': 'Meeting days',
  '/create_user': 'Create User',
};

// TODO change this to something better later
// returns contents and labels for menu based on users type
function getContent(userType) {
  if (userType === 'admin') {
    return { content: adminContent, labels: adminLabels };
  }
  if (userType === 'coach') {
    const content = userContent.concat(coachContent);
    const labels = Object.assign({}, userLabels, coachLabels);
    return { content: <Switch>{content}</Switch>, labels };
  }
  const content = userContent.concat(startupContent);
  return { content: <Switch>{content}</Switch>, labels: userLabels };
}

// the default gateway to fetch data from backend
// path as '/pathInApi'
// methodType as either 'get' or 'post'
// params as object
// returns Promise with the response in JSON
function fetchData(path, methodType, params) {
  const paramsString = Object.keys(params).map(x => `${x}=${params[x]}`).join('&');
  let query = path;
  let bodyParams;
  if (methodType.toLowerCase() === 'get') query += `?${paramsString}`;
  else bodyParams = paramsString;
  return new Promise((resolve, reject) =>
    fetch(`/api${query}`, {
      method: methodType,
      // make sure that the cookies will be send
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
        // if user is not logged in log out in App
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
        reject(error);
      }));
}

export default { getContent, userContent, fetchData };
