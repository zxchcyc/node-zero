export const subTime = (t1: string, t2: string) => {
  const T1 = new Date(t1 || undefined).getTime();
  const T2 = new Date(t2 || undefined).getTime();
  return Number.isNaN(T1) || Number.isNaN(T2) ? NaN : T1 - T2;
};
