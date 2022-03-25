export const booleanFilter = (value, test: any[]) => {
  return String(value)
    .split('-')
    .some((e) => test.includes(e));
};
