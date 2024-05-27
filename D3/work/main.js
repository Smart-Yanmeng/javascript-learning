const XLSX = require('xlsx');
const fs = require('fs');

// 读取 Excel 文件
const workbook = XLSX.readFile('my-work.xlsx');

// 获取 Excel 文件中的第一个工作表
const firstSheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[firstSheetName];

// 将工作表数据转换为 CSV 格式
const csvData = XLSX.utils.sheet_to_csv(worksheet);

// 将 CSV 数据写入到文件中
fs.writeFileSync('output.csv', csvData);