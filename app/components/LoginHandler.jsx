
export default function handle(input) {
  fetch('localhost:3000/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: input.name,
      password: input.pwd,
    }),
  }).then((response) => { response.json(); }).then((responseJson) => {
    return responseJson.status;
  });
}
