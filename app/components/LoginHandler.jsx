import pageContent from './pageContent';


export default function handle(input, callback) {
  pageContent.fetchData('/login', 'post', {
    username: input.name,
    password: input.pwd,
  }).then(response => callback(response.status));
  /* const bodyString = `username=${input.name}&password=${input.pwd}`;
  fetch('http://127.0.0.1:3000/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodyString,
  }).then(response => response.json())
    .then(responseJson => callback(responseJson.status))
    .catch(error => console.error(error)); */
}
