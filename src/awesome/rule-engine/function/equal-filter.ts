export enum EequalFilterType {
  // 任意值相等
  any = 'any',
  // 全部值相等
  all = 'all',
}

export const equalFilter = (
  locations: any[],
  value,
  type = EequalFilterType.any,
) => {
  const total = locations.length;
  locations = locations.filter((e) => e.value === value);
  if (type === EequalFilterType.any && locations.length) {
    return true;
  }
  if (type === EequalFilterType.all && locations.length === total) {
    return true;
  }
  return false;
};
