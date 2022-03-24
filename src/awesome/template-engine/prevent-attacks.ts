export default function preventAttacks(value: string): boolean {
  // 过滤部分关键词
  const sqlKeyWords = [
    'exec',
    'execute',
    'create',
    'insert',
    'delete',
    'update',
    'drop',
  ];
  for (const sqlKeyword of sqlKeyWords) {
    if (value.indexOf(sqlKeyword) !== -1) {
      // console.warn('===preventAttacks===', sqlKeyword, value);
      return true;
    }
  }
  return false;
}
