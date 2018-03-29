import pageContent from '../pageContent';

// function to submitting login info to be checked in backend
export default function handle(input, callback) {
  pageContent.fetchData('/login', 'post', {
    username: input.name,
    password: input.pwd,
  }).then(response => callback(response.status));
}
