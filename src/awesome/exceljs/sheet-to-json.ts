import * as ExcelJS from 'exceljs';
import { CellValue } from 'exceljs';
import { cellText } from './cell-text';

/**
 * 将Excel Row, Column数据转换成json数据
 * @param sheet excel表格sheet
 * @returns json数组
 */
export function sheetToJson(sheet: ExcelJS.Worksheet) {
  const result = [];
  const header = sheet.getRow(1).values;
  // console.debug('===header===', header);
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      // console.debug('===rowNumber===', rowNumber);
      const rowObj = {};
      (row.values as CellValue[]).forEach((v, index) => {
        const text = cellText(v);
        // console.debug('===text===', text, index);
        rowObj[header[index]] = text;
      });
      result.push(rowObj);
    }
  });
  return result;
}
