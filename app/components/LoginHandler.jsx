
export default function handle(input) {
  const res = {};
  res.name = input.name;
  if (input.name === 'admin') {
    res.type = 'admin';
  } else {
    res.type = 'user';
  }
  return res;
}
