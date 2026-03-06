import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 엑셀 파일을 읽어서 데이터 구조 확인
function readExcelFile(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // JSON으로 변환
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    
    return { data, sheetName };
  } catch (error) {
    console.error('엑셀 파일 읽기 오류:', error);
    throw error;
  }
}

// 엑셀 데이터를 TypeDetail 형식으로 파싱
function parseExcelData(excelData) {
  const result = {};
  
  // 첫 번째 행은 헤더로 간주
  const headers = excelData[0];
  
  // 헤더에서 각 컬럼의 인덱스 찾기
  // A: 유형 코드, D: 성향 요약 (title), E: 강점, F: 약점, G: 조언
  // H: 인간관계 유형, I: 커리어 적합 유형
  // J~U: 매칭 정보들
  const typeCodeIndex = 0; // A열
  const titleIndex = 3;    // D열 (성향 요약)
  const strengthIndex = 4; // E열 (강점)
  const weaknessIndex = 5; // F열 (약점)
  const adviceIndex = 6;   // G열 (당신을 위한 조언)
  const relationshipIndex = 7; // H열 (인간관계 유형)
  const careerIndex = 8;       // I열 (커리어 적합 유형)
  const matchingStartIndex = 9; // J열부터 매칭 정보
  
  console.log('컬럼 매핑:');
  console.log('  유형 코드:', headers[typeCodeIndex]);
  console.log('  제목:', headers[titleIndex]);
  console.log('  강점:', headers[strengthIndex]);
  console.log('  약점:', headers[weaknessIndex]);
  console.log('  조언:', headers[adviceIndex]);
  console.log('  인간관계:', headers[relationshipIndex]);
  console.log('  커리어:', headers[careerIndex]);
  
  // 데이터 행 처리 (헤더 제외)
  for (let i = 1; i < excelData.length; i++) {
    const row = excelData[i];
    
    // 빈 행 건너뛰기
    if (!row || row.length === 0 || !row[typeCodeIndex]) continue;
    
    const typeCode = String(row[typeCodeIndex] || '').trim().toUpperCase();
    if (!typeCode || typeCode.length !== 5) {
      console.warn(`행 ${i + 1}: 유효하지 않은 타입 코드: ${typeCode}`);
      continue;
    }
    
    // 성향 요약 전체 내용 저장
    const summaryFull = String(row[titleIndex] || '').trim();
    
    // 성향 요약에서 첫 번째 문장을 title로 사용 (따옴표 안의 내용)
    let title = summaryFull;
    // 따옴표로 둘러싸인 부분 추출
    const titleMatch = summaryFull.match(/"([^"]+)"/);
    if (titleMatch) {
      title = titleMatch[1];
    } else {
      // 따옴표가 없으면 첫 줄만 사용
      title = summaryFull.split('\n')[0].trim();
    }
    
    const strength = String(row[strengthIndex] || '').trim();
    const weakness = String(row[weaknessIndex] || '').trim();
    const advice = String(row[adviceIndex] || '').trim();
    const relationship = String(row[relationshipIndex] || '').trim();
    const career = String(row[careerIndex] || '').trim();
    
    // 매칭 정보 파싱 (J~U열: 직장, 사업동료, 연애 매칭)
    const matching = {
      workplace: {
        best1: String(row[matchingStartIndex + 0] || '').trim(),
        best2: String(row[matchingStartIndex + 1] || '').trim(),
        worst1: String(row[matchingStartIndex + 2] || '').trim(),
        worst2: String(row[matchingStartIndex + 3] || '').trim(),
      },
      business: {
        best1: String(row[matchingStartIndex + 4] || '').trim(),
        best2: String(row[matchingStartIndex + 5] || '').trim(),
        worst1: String(row[matchingStartIndex + 6] || '').trim(),
        worst2: String(row[matchingStartIndex + 7] || '').trim(),
      },
      dating: {
        best1: String(row[matchingStartIndex + 8] || '').trim(),
        best2: String(row[matchingStartIndex + 9] || '').trim(),
        worst1: String(row[matchingStartIndex + 10] || '').trim(),
        worst2: String(row[matchingStartIndex + 11] || '').trim(),
      },
    };
    
    if (!title || !strength || !weakness || !advice) {
      console.warn(`행 ${i + 1} (${typeCode}): 일부 필드가 비어있습니다.`);
    }
    
    result[typeCode] = {
      title,
      summary: summaryFull, // 성향 요약 전체 내용
      strength,
      weakness,
      advice,
      relationship,
      career,
      matching
    };
  }
  
  return result;
}

// TypeScript 파일 생성
function generateTypeScriptFile(data, outputPath) {
  // 32개 유형을 그룹별로 정렬
  const groups = {
    NT: ['INTJD', 'INTJA', 'ENTJD', 'ENTJA', 'INTPD', 'INTPA', 'ENTPD', 'ENTPA'],
    ST: ['ISTJD', 'ISTJA', 'ESTJD', 'ESTJA', 'ISTPD', 'ISTPA', 'ESTPD', 'ESTPA'],
    NF: ['INFJD', 'INFJA', 'ENFJD', 'ENFJA', 'INFPD', 'INFPA', 'ENFPD', 'ENFPA'],
    SF: ['ISFJD', 'ISFJA', 'ESFJD', 'ESFJA', 'ISFPD', 'ISFPA', 'ESFPD', 'ESFPA']
  };
  
  const groupNames = {
    NT: '논리/전략 그룹 (NT)',
    ST: '현실/실무 그룹 (ST)',
    NF: '가치/공감 그룹 (NF)',
    SF: '지원/적응 그룹 (SF)'
  };
  
  let content = `// SCAN 유형 상세 정보
export interface TypeDetail {
  title: string;
  strength: string;
  weakness: string;
  advice: string;
}

export const SCAN_TYPE_DETAILS: Record<string, TypeDetail> = {
`;
  
  // 그룹별로 정렬하여 출력
  Object.entries(groups).forEach(([groupKey, typeCodes], groupIndex) => {
    if (groupIndex > 0) {
      content += '\n';
    }
    content += `  // ${groupIndex + 1}. ${groupNames[groupKey]}\n`;
    
    typeCodes.forEach((typeCode, index) => {
      const detail = data[typeCode];
      if (!detail) {
        console.warn(`⚠️  ${typeCode} 데이터가 없습니다.`);
        return;
      }
      
      content += `  "${typeCode}": {\n`;
      content += `    title: ${JSON.stringify(detail.title)},\n`;
      content += `    summary: ${JSON.stringify(detail.summary)},\n`;
      content += `    strength: ${JSON.stringify(detail.strength)},\n`;
      content += `    weakness: ${JSON.stringify(detail.weakness)},\n`;
      content += `    advice: ${JSON.stringify(detail.advice)},\n`;
      content += `    relationship: ${JSON.stringify(detail.relationship)},\n`;
      content += `    career: ${JSON.stringify(detail.career)},\n`;
      content += `    matching: {\n`;
      content += `      workplace: {\n`;
      content += `        best1: ${JSON.stringify(detail.matching.workplace.best1)},\n`;
      content += `        best2: ${JSON.stringify(detail.matching.workplace.best2)},\n`;
      content += `        worst1: ${JSON.stringify(detail.matching.workplace.worst1)},\n`;
      content += `        worst2: ${JSON.stringify(detail.matching.workplace.worst2)},\n`;
      content += `      },\n`;
      content += `      business: {\n`;
      content += `        best1: ${JSON.stringify(detail.matching.business.best1)},\n`;
      content += `        best2: ${JSON.stringify(detail.matching.business.best2)},\n`;
      content += `        worst1: ${JSON.stringify(detail.matching.business.worst1)},\n`;
      content += `        worst2: ${JSON.stringify(detail.matching.business.worst2)},\n`;
      content += `      },\n`;
      content += `      dating: {\n`;
      content += `        best1: ${JSON.stringify(detail.matching.dating.best1)},\n`;
      content += `        best2: ${JSON.stringify(detail.matching.dating.best2)},\n`;
      content += `        worst1: ${JSON.stringify(detail.matching.dating.worst1)},\n`;
      content += `        worst2: ${JSON.stringify(detail.matching.dating.worst2)},\n`;
      content += `      },\n`;
      content += `    }\n`;
      content += `  }`;
      
      // 마지막 항목이 아니면 쉼표 추가
      if (index < typeCodes.length - 1 || groupIndex < Object.keys(groups).length - 1) {
        content += ',';
      }
      content += '\n';
    });
  });
  
  content += `};\n`;
  
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`\n✅ TypeScript 파일이 생성되었습니다: ${outputPath}`);
  console.log(`총 ${Object.keys(data).length}개 유형이 포함되었습니다.`);
}

// 메인 실행 함수
function main() {
  const excelFilePath = path.resolve(__dirname, '..', 'raw-data', '베이직 결과지_심층결과v2.xlsx');
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
