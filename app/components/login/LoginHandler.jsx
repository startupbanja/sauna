import pageContent from '../pageContent';


export default function handle(input, callback) {
  pageContent.fetchData('/login', 'post', {
    username: input.name,
    password: input.pwd,
  }).then(response => callback(response.status));
}
