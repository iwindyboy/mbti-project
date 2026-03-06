/**
 * 결과 카드 생성 유틸리티
 * 앱에서 결과 카드를 표시하기 위한 데이터 구조
 */

import { CalculateResult } from './calculate';
import { getTypeName } from './typeNames';
import { SCAN_TYPE_DETAILS } from '../data/scanResultData';
import { getResultCardImage, getTypeImage } from './imageLoader';

export interface ResultCardData {
  typeCode: string;
  typeName: string;
  badge: string | null;
  image: {
    card: string; // 결과 카드 이미지 경로
    type: string; // 타입 이미지 경로
  };
  summary: {
    title: string;
    description: string;
    strength: string;
    weakness: string;
    advice: string;
  };
  scores: {
    axes: Array<{
      name: string;
      leftLabel: string;
      rightLabel: string;
      leftPercent: number;
      rightPercent: number;
      isGreyZone: boolean;
    }>;
  };
  matching: {
    workplace: {
      best: string[];
      worst: string[];
    };
    business: {
      best: string[];
      worst: string[];
    };
    dating: {
      best: string[];
      worst: string[];
    };
  };
}

/**
 * CalculateResult를 ResultCardData로 변환
 */
export const createResultCard = (result: CalculateResult): ResultCardData => {
  const typeCode = result.typeCode;
  const typeDetails = SCAN_TYPE_DETAILS[typeCode];
  
  // 축별 데이터 생성
  const axes = [
    { key: 'EI', left: 'I 내향', right: 'E 외향' },
    { key: 'SN', left: 'S 감각', right: 'N 직관' },
    { key: 'FT', left: 'F 감정', right: 'T 논리' },
    { key: 'PJ', left: 'P 유연', right: 'J 계획' },
    { key: 'DA', left: 'D 신중', right: 'A 즉시' },
  ].map((axis) => {
    const totalDiff = result.scores[axis.key] || 0;
    const isGreyZone = result.isGrayZone[axis.key] || false;
    
    // 좌우 비율 계산
    const leftPercent = isGreyZone 
      ? 50 + (totalDiff / 2) 
      : totalDiff < 0 ? 50 + Math.abs(totalDiff) * 2.5 : 50 - totalDiff * 2.5;
    const rightPercent = 100 - leftPercent;
    
    return {
      name: axis.key,
      leftLabel: axis.left,
      rightLabel: axis.right,
      leftPercent: Math.max(0, Math.min(100, leftPercent)),
      rightPercent: Math.max(0, Math.min(100, rightPercent)),
      isGreyZone,
    };
  });

  // 매칭 데이터 추출
  const matching = typeDetails?.matching ? {
    workplace: {
      best: [
        typeDetails.matching.workplace.best1,
        typeDetails.matching.workplace.best2,
      ],
      worst: [
        typeDetails.matching.workplace.worst1,
        typeDetails.matching.workplace.worst2,
      ],
    },
    business: {
      best: [
        typeDetails.matching.business.best1,
        typeDetails.matching.business.best2,
      ],
      worst: [
        typeDetails.matching.business.worst1,
        typeDetails.matching.business.worst2,
      ],
    },
    dating: {
      best: [
        typeDetails.matching.dating.best1,
        typeDetails.matching.dating.best2,
      ],
      worst: [
        typeDetails.matching.dating.worst1,
        typeDetails.matching.dating.worst2,
      ],
    },
  } : {
    workplace: { best: [], worst: [] },
    business: { best: [], worst: [] },
    dating: { best: [], worst: [] },
  };

  // 이미지 경로 (React Native에서는 실제 require 경로로 변경 필요)
  const cardImage = getResultCardImage(typeCode);
  const typeImage = getTypeImage(typeCode);

  return {
    typeCode,
    typeName: getTypeName(typeCode),
    badge: result.badge,
    image: {
      card: cardImage.uri || cardImage.src || '',
      type: typeImage.uri || typeImage.src || '',
    },
    summary: {
      title: typeDetails?.title || '',
      description: typeDetails?.summary || '',
      strength: typeDetails?.strength || '',
      weakness: typeDetails?.weakness || '',
      advice: typeDetails?.advice || '',
    },
    scores: {
      axes,
    },
    matching,
  };
};

/**
 * 결과 카드 데이터를 JSON으로 직렬화 (앱으로 전달용)
 */
export const serializeResultCard = (result: CalculateResult): string => {
  const cardData = createResultCard(result);
  return JSON.stringify(cardData, null, 2);
};
