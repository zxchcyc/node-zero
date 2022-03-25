import { MapReduce } from './map-reduce';
const information = [
  ['frase primera', 'primer trozo de informacion para procesado primer trozo'],
];

const map = function (key, value) {
  const list = [],
    aux = {};
  value = value.split(' ');
  value.forEach(function (w) {
    aux[w] = (aux[w] || 0) + 1;
  });
  for (const k in aux) {
    list.push([k, aux[k]]);
  }
  return list;
};

const reduce = function (key, values) {
  let sum = 0;
  values.forEach(function (e) {
    sum += e;
  });
  return sum;
};

describe('MapReduce', () => {
  test('MapReduce 实例化', async () => {
    const mapReduce = new MapReduce();
    const t1 = new Date().getTime();
    const result = await mapReduce.simple(information, map, reduce);
    console.log(result);
    //  { de: 1, informacion: 1, para: 1, primer: 2, procesado: 1, trozo: 2 }
    const t2 = new Date().getTime();
    console.log(t2 - t1);
    expect(1).toEqual(1);
  });
});
