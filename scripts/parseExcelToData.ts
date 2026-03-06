import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TypeDetail {
  title: string;
  strength: string;
  weakness: string;
  advice: string;
}

// 엑셀 파일을 읽어서 데이터 구조 확인
function readExcelFile(filePath: string) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // JSON으로 변환
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log('엑셀 파일 구조 확인:');
    console.log('시트 이름:', sheetName);
    console.log('첫 5행 데이터:');
    console.log(data.slice(0, 5));
    
    return { data, sheetName };
  } catch (error) {
    console.error('엑셀 파일 읽기 오류:', error);
    throw error;
  }
}

// 엑셀 데이터를 TypeDetail 형식으로 파싱
function parseExcelData(excelData: any[][]): Record<string, TypeDetail> {
  const result: Record<string, TypeDetail> = {};
  
  // 첫 번째 행은 헤더로 간주
  const headers = excelData[0] as string[];
  console.log('헤더:', headers);
  
  // 헤더에서 각 컬럼의 인덱스 찾기
  const typeCodeIndex = headers.findIndex(h => 
    h && (h.includes('유형') || h.includes('Type') || h.includes('typeCode') || h === 'A' || h === 'B')
  );
  const titleIndex = headers.findIndex(h => 
    h && (h.includes('제목') || h.includes('Title') || h.includes('title') || h === 'C')
  );
  const strengthIndex = headers.findIndex(h => 
    h && (h.includes('강점') || h.includes('Strength') || h.includes('strength') || h === 'D')
  );
  const weaknessIndex = headers.findIndex(h => 
    h && (h.includes('약점') || h.includes('Weakness') || h.includes('weakness') || h === 'E')
  );
  const adviceIndex = headers.findIndex(h => 
    h && (h.includes('조언') || h.includes('Advice') || h.includes('advice') || h === 'F')
  );
  
  console.log('컬럼 인덱스:', {
    typeCode: typeCodeIndex,
    title: titleIndex,
    strength: strengthIndex,
    weakness: weaknessIndex,
    advice: adviceIndex
  });
  
  // 데이터 행 처리 (헤더 제외)
  for (let i = 1; i < excelData.length; i++) {
    const row = excelData[i] as any[];
    
    // 빈 행 건너뛰기
    if (!row || row.length === 0 || !row[typeCodeIndex]) continue;
    
    const typeCode = String(row[typeCodeIndex] || '').trim().toUpperCase();
    if (!typeCode || typeCode.length !== 5) {
      console.warn(`행 ${i + 1}: 유효하지 않은 타입 코드: ${typeCode}`);
      continue;
    }
    
    const title = String(row[titleIndex] || '').trim();
    const strength = String(row[strengthIndex] || '').trim();
    const weakness = String(row[weaknessIndex] || '').trim();
    const advice = String(row[adviceIndex] || '').trim();
    
    if (!title || !strength || !weakness || !advice) {
      console.warn(`행 ${i + 1} (${typeCode}): 일부 필드가 비어있습니다.`);
    }
    
    result[typeCode] = {
      title,
      strength,
      weakness,
      advice
    };
  }
  
  return result;
}

// TypeScript 파일 생성
function generateTypeScriptFile(data: Record<string, TypeDetail>, outputPath: string) {
  const typeDetails = Object.entries(data)
    .map(([typeCode, detail]) => {
      return `  "${typeCode}": {
    title: ${JSON.stringify(detail.title)},
    strength: ${JSON.stringify(detail.strength)},
    weakness: ${JSON.stringify(detail.weakness)},
    advice: ${JSON.stringify(detail.advice)}
  }`;
    })
    .join(',\n');
  
  const content = `// SCAN 유형 상세 정보
export interface TypeDetail {
  title: string;
  strength: string;
  weakness: string;
  advice: string;
}

export const SCAN_TYPE_DETAILS: Record<string, TypeDetail> = {
${typeDetails}
};
`;
  
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`\n✅ TypeScript 파일이 생성되었습니다: ${outputPath}`);
  console.log(`총 ${Object.keys(data).length}개 유형이 포함되었습니다.`);
}

// 메인 실행 함수
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('사용법: npm run parse-excel <엑셀파일경로>');
    console.log('예시: npm run parse-excel raw-data/베이직결과지.xlsx');
    process.exit(1);
  }
  
  const excelFilePath = path.resolve(__dirname, '..', args[0]);
  const outputPath = path.resolve(__dirname, '..', 'src/data/scanResultData.ts');
  
  if (!fs.existsSync(excelFilePath)) {
    console.error(`❌ 파일을 찾을 수 없습니다: ${excelFilePath}`);
    process.exit(1);
  }
  
  console.log(`📖 엑셀 파일 읽기: ${excelFilePath}`);
  const { data } = readExcelFile(excelFilePath);
  
  console.log(`\n📊 데이터 파싱 중...`);
  const parsedData = parseExcelData(data);
  
  console.log(`\n✅ 파싱 완료: ${Object.keys(parsedData).length}개 유형`);
  console.log('유형 목록:', Object.keys(parsedData).sort().join(', '));
  
  console.log(`\n📝 TypeScript 파일 생성 중...`);
  generateTypeScriptFile(parsedData, outputPath);
  
  console.log('\n✨ 완료!');
}

main();
