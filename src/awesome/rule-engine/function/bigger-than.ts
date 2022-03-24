export const biggerThan = ($1: any, $2: any) => {
  const check = ($: unknown) => typeOf($) === 'number';
  if (!check($1) || !check($2)) return undefined;
  return $1 > $2;
};

const typeOf = (value: any) =>
  <
    | 'object'
    | 'number'
    | 'string'
    | 'undefined'
    | 'boolean'
    | 'object'
    | 'array'
    | 'function'
    | 'null'
  >Object.prototype.toString
    .call(value)
    .split(/\[| |\]/)
    .filter((v: string) => v)[1]
    .toLowerCase();
