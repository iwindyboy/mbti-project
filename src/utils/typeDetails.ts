// SCAN 유형 상세 정보 (src/data/scanResultData.ts로 이동됨)
import { SCAN_TYPE_DETAILS, type TypeDetail } from '../data/scanResultData';

// 기존 호환성을 위한 재export
export { SCAN_TYPE_DETAILS, type TypeDetail };

export const getTypeTitle = (typeCode: string): string => {
  return SCAN_TYPE_DETAILS[typeCode]?.title || `${typeCode} 유형`;
};

export const getTypeDetail = (typeCode: string): TypeDetail | null => {
  return SCAN_TYPE_DETAILS[typeCode] || null;
};
