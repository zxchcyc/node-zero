export default function charLength(value: string) {
  let len = 0;
  for (let i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) > 127 || value.charCodeAt(i) == 94) {
      len += 2;
    } else {
      len++;
    }
  }
  return len;
}
