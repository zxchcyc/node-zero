import { resolve } from 'path';
import * as _ from 'lodash';
import { rmdirSync } from 'fs';
import { FileSystemReader } from './readers/file-system.reader';
const copy = require('recursive-copy');

/**
 * @description: 生成CRUD模块
 * @param {string} name 模块名
 * @author: archer zheng
 */
export async function start(name: string, path: string, dir: string) {
  try {
    // 复制临时模板
    await copy(resolve(dir), resolve(`${dir}-temp`));
    await genModule(`${dir}-temp`, name);
    // 复制模板生成完成的模块到指定位置
    await copy(resolve(`${dir}-temp`), resolve(path, name));
    // 删除临时文件
    rmdirSync(resolve(`${dir}-temp`), { recursive: true });
  } catch (error) {
    console.error(error);
  } finally {
    try {
      rmdirSync(resolve(`${dir}-temp`), { recursive: true });
    } catch (error) {}
  }
}

async function genModule(dir: string, name: string) {
  // console.debug(dir);
  const fileSystemReader = new FileSystemReader(resolve(dir));
  const list = await fileSystemReader.list();
  for (const item of list) {
    if (fileSystemReader.isDirectory(item)) {
      await genModule(`${dir}/${item}`, name);
    } else {
      // console.debug(item);
      const fileContent = await fileSystemReader.read(item);
      const newfileContent = fileContent
        .replace(/template/g, name.toLocaleLowerCase())
        .replace(/Template/g, _.capitalize(name));
      await fileSystemReader.write(item, newfileContent);
      await fileSystemReader.rename(
        item,
        item.replace(/template/g, name.toLocaleLowerCase()),
      );
    }
  }
}
