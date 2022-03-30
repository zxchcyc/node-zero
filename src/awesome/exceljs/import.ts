/*
 * @Author: archer zheng
 * @Date: 2021-11-08 14:45:10
 * @LastEditTime: 2022-03-30 11:59:15
 * @LastEditors: archer zheng
 * @Description: exceljs 导入
 */
import * as ExcelJS from 'exceljs';
import * as axios from 'axios';
import { sheetToJson } from './sheet-to-json';
export const excelImport = async (importUrl: string) => {
  let importData = [];
  try {
    const remoteFile = await axios.default.get(encodeURI(importUrl), {
      responseType: 'arraybuffer',
    });
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(remoteFile.data as Buffer);
    workbook.worksheets.forEach((worksheet) => {
      const sheetData = sheetToJson(worksheet);
      importData = importData.concat(sheetData);
    });
    console.debug('===importData===', importData);
    return importData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
