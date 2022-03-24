function isMethod(propertyName: string, value: any): boolean {
  return propertyName !== 'constructor' && typeof value === 'function';
}

export function autoBind(obj: Record<string, any>): void {
  const propertyNames = Object.getOwnPropertyNames(obj.constructor.prototype);
  propertyNames.forEach((propertyName) => {
    const value = obj[propertyName];
    if (isMethod(propertyName, value)) {
      // 函数this指向问题
      obj[propertyName] = value.bind(obj);
    }
  });
}
