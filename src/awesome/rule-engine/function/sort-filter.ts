export const sortFilter = (data, keys, isMax) => {
  // console.log('===sortFilter===', data, keys, isMax);
  return data.sort(
    (x, y) =>
      (isMax ? -1 : 1) * keys.reduce((pre, cur) => pre || x[cur] - y[cur], 0),
  );
};
