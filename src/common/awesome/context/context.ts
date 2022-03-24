/*
 * @Author: archer zheng
 * @Date: 2021-11-08 14:45:10
 * @LastEditTime: 2022-02-22 20:10:23
 * @LastEditors: archer zheng
 * @Description: 获取上下文
 */
import { getNamespace, createNamespace } from 'cls-hooked';
export const createClsNamespace = (key = 'context') => {
  const namespace = createNamespace(key);
  return namespace;
};

export const checkNamespace = (namespace: string) => {
  return getNamespace(namespace);
};

export const getContext = (key: string) => {
  const context =
    getNamespace('context')?.get(key) ||
    getNamespace('mqContext')?.get(key) ||
    getNamespace('scheduleContext')?.get(key);
  return context;
};

export const setContext = (key: string, value: any) => {
  getNamespace('context')?.set(key, value);
};
