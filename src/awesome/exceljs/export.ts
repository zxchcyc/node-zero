/*
 * @Author: archer zheng
 * @Date: 2021-11-08 14:45:10
 * @LastEditTime: 2022-03-30 11:45:43
 * @LastEditors: archer zheng
 * @Description: exceljs 导出
 */
import * as ExcelJS from 'exceljs';

export const excelExport = async (
  fileName: string,
  columns: Partial<ExcelJS.Column>[],
  data: any[],
) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(fileName);
    sheet.columns = columns;
    data.forEach((e) => sheet.addRow(e));
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
