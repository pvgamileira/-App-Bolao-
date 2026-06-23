const xlsx = require('xlsx');
const path = require('path');

const filePath = path.resolve(__dirname, 'Palpites da Copa1.xlsx');
const workbook = xlsx.readFile(filePath);

const firstSheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[firstSheetName];

const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
console.log(JSON.stringify(data.slice(0, 30), null, 2));
