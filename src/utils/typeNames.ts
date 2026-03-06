import { getTypeTitle } from './typeDetails';

// 유형 코드에 따른 네이밍 매핑 (새로운 데이터 우선 사용)
export const typeNames: Record<string, string> = {
  // I (내향) 조합
  'ISFTJ': '신중한 완벽주의자',
  'ISFTP': '유연한 관찰자',
  'ISFTA': '체계적 실행가',
  'ISNTJ': '전략적 설계자',
  'ISNTP': '논리적 탐험가',
  'ISNTA': '혁신적 실행가',
  'ITFTJ': '원칙적 분석가',
  'ITFTP': '독립적 사색가',
  'ITFTA': '체계적 혁신가',
  'ITNTJ': '완벽주의 아키텍트',
  'ITNTP': '논리적 혁신가',
  'ITNTA': '혁신적 실행가',
  'IFSTJ': '따뜻한 체계가',
  'IFSTP': '온화한 관찰자',
  'IFSTA': '배려심 많은 실행가',
  'IFNTJ': '이상주의 설계자',
  'IFNTP': '상상력 풍부한 탐험가',
  'IFNTA': '창의적 실행가',
  'ISTFJ': '신중한 관리자',
  'ISTFP': '유연한 실용가',
  'ISTFA': '체계적 실행가',
  'ISTNJ': '전략적 계획가',
  'ISTNP': '논리적 탐험가',
  'ISTNA': '혁신적 실행가',
  'INTFJ': '통찰력 있는 이상주의자',
  'INTFP': '독립적 사색가',
  'INTFA': '창의적 실행가',
  'INTNJ': '전략적 비전가',
  'INTNP': '논리적 철학가',
  'INTNA': '혁신적 실행가',
  'INFTJ': '이상주의 설계자',
  'INFTP': '상상력 풍부한 탐험가',
  'INFTA': '창의적 실행가',
  'INNTJ': '비전있는 설계자',
  'INNTP': '독창적 혁신가',
  'INNTA': '혁신적 실행가',

  // E (외향) 조합
  'ESFTJ': '체계적인 리더',
  'ESFTP': '활발한 탐험가',
  'ESFTA': '추진력 있는 실행가',
  'ESNTJ': '효율적 관리자',
  'ESNTP': '적응력 있는 실행가',
  'ESNTA': '혁신적 리더',
  'ETFTJ': '논리적 조직가',
  'ETFTP': '도전적 탐험가',
  'ETFTA': '전략적 실행가',
  'ETNTJ': '비전있는 경영자',
  'ETNTP': '혁신적 기업가',
  'ETNTA': '혁신적 리더',
  'EFSTJ': '따뜻한 조직가',
  'EFSTP': '활발한 실용가',
  'EFSTA': '배려심 있는 리더',
  'EFNTJ': '열정적 비전가',
  'EFNTP': '창의적 활동가',
  'EFNTA': '감성적 리더',
  'ESTFJ': '실용적 조직가',
  'ESTFP': '활동적인 탐험가',
  'ESTFA': '효율적 실행가',
  'ESTNJ': '결단력 있는 리더',
  'ESTNP': '모험적 실행가',
  'ESTNA': '추진력 있는 리더',
  'ENTFJ': '카리스마 리더',
  'ENTFP': '열정적 혁신가',
  'ENTFA': '비전있는 실행가',
  'ENTNJ': '전략적 경영자',
  'ENTNP': '혁신적 기업가',
  'ENTNA': '혁신적 리더',
  'ENFTJ': '이상주의 리더',
  'ENFTP': '창의적 활동가',
  'ENFTA': '감성적 비전가',
  'ENNTJ': '혁신적 경영자',
  'ENNTP': '독창적 기업가',
  'ENNTA': '혁신적 리더',
};

// 기본값: 유형 코드를 그대로 반환 (새로운 데이터 우선 사용)
export const getTypeName = (typeCode: string): string => {
  // 새로운 데이터에서 제목 가져오기
  const newTitle = getTypeTitle(typeCode);
  if (newTitle && newTitle !== `${typeCode} 유형`) {
    return newTitle;
  }
  // 기존 데이터에서 가져오기
  return typeNames[typeCode] || `${typeCode} 유형`;
};
