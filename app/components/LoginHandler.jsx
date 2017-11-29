
export default function handle(input) {
  if (input.name === 'admin') {
    return 'admin';
  }
  return 'user';
}
