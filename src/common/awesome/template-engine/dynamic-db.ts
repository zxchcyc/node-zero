export function getDbName(key: string): string {
  if (['prod', 'test', 'local', 'dev'].includes(process.env.NODE_ENV)) {
    return `${process.env.NODE_ENV}_${key}`;
  }
  return key;
}

export function getTableName(
  env: string,
  version: string,
  name: string,
): string {
  return `${env}_${version.replace(/\./g, '_')}_${name}`;
}

export function getAggTableName(key: string, env: string): string {
  return `${env}_${key}`;
}
