export const sortFilter = (datas, keys, isMax) => {
  // console.log('===sortFilter===', datas, keys, isMax);
  return datas.sort(
    (x, y) =>
      (isMax ? -1 : 1) * keys.reduce((pre, cur) => pre || x[cur] - y[cur], 0),
  );
};
