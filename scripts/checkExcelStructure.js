import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const excelFilePath = path.resolve(__dirname, '..', 'raw-data', '베이직 결과지_심층결과v2.xlsx');

console.log('📖 엑셀 파일 읽기:', excelFilePath);

try {
  const workbook = XLSX.readFile(excelFilePath);
  console.log('\n시트 목록:', workbook.SheetNames);
  
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // JSON으로 변환 (헤더 포함)
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
  
  console.log(`\n시트 "${sheetName}"의 구조:`);
  console.log(`총 행 수: ${data.length}`);
  
  // 첫 10행 출력
  console.log('\n첫 10행 데이터:');
  data.slice(0, 10).forEach((row, index) => {
    console.log(`행 ${index + 1}:`, row);
  });
  
  // 헤더 행 확인
  if (data.length > 0) {
    console.log('\n헤더 행 (첫 번째 행):');
    data[0].forEach((cell, index) => {
      console.log(`  컬럼 ${index + 1} (${String.fromCharCode(65 + index)}):`, cell);
    });
  }
  
} catch (error) {
  console.error('❌ 오류:', error.message);
  process.exit(1);
}
