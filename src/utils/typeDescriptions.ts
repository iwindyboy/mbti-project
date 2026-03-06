import { getTypeDetail, getTypeTitle, SCAN_TYPE_DETAILS } from './typeDetails';

// 32개 유형별 상세 설명 데이터
export interface TypeDescription {
  typeCode: string;
  typeName: string;
  description: string; // 베이직 리포트용 기본 설명 (strength 기반)
  strength: string; // 강점
  weakness: string; // 약점
  advice: string; // 조언
  identityMain?: string; // 프리미엄용: Identity_Main
  identityDeep?: string; // 프리미엄용: Identity_Deep
}

// 유형별 기본 설명 (베이직 리포트용) - 새로운 데이터 기반으로 생성
export const typeDescriptions: Record<string, TypeDescription> = {};

// 새로운 데이터를 기반으로 typeDescriptions 자동 생성
Object.keys(SCAN_TYPE_DETAILS).forEach((typeCode) => {
  const detail = getTypeDetail(typeCode);
  if (detail) {
    typeDescriptions[typeCode] = {
      typeCode,
      typeName: getTypeTitle(typeCode),
      description: detail.strength, // 강점을 기본 설명으로 사용
      strength: detail.strength,
      weakness: detail.weakness,
      advice: detail.advice,
    };
  }
});

// 유형 설명 가져오기
export const getTypeDescription = (typeCode: string): TypeDescription => {
  // 먼저 새로운 데이터에서 찾기
  const detail = getTypeDetail(typeCode);
  if (detail) {
    return {
      typeCode,
      typeName: getTypeTitle(typeCode),
      description: detail.strength,
      strength: detail.strength,
      weakness: detail.weakness,
      advice: detail.advice,
    };
  }
  
  // 기존 데이터에서 찾기
  if (typeDescriptions[typeCode]) {
    return typeDescriptions[typeCode];
  }
  
  // 기본값
  return {
    typeCode,
    typeName: `${typeCode} 유형`,
    description: '이 유형에 대한 설명이 준비 중입니다.',
    strength: '',
    weakness: '',
    advice: '',
  };
};
