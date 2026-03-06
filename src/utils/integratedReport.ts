// ══════════════════════════════════════════════════════════════
//  통합 리포트 계산 로직
//  사주(선천) + 32 Spectrum(후천) 통합 분석
// ══════════════════════════════════════════════════════════════

import { SajuResult } from './sajuEngine';
import { CalculateResult } from './calculate';
import { SajuFortune, ILGAN_SYMBOL, Cheongan } from '../data/sajuDb';
import { SCAN_TYPE_DETAILS } from '../data/scanResultData';

// ══════════════════════════════════════════════════════════════
//  타입 정의
// ══════════════════════════════════════════════════════════════

export interface IntegratedReport {
  // 기본 정보
  name: string;
  createdAt: string;
  
  // 사주 데이터
  saju: {
    result: SajuResult;
    content: SajuFortune;
  };
  
  // 32 Spectrum 데이터
  scan: {
    result: CalculateResult;
    typeName: string;
  };
  
  // 통합 분석
  analysis: {
    // 일치점 분석
    alignment: AlignmentAnalysis;
    
    // 차이점 분석
    gap: GapAnalysis;
    
    // 통합 인사이트
    insights: IntegratedInsights;
    
    // 맞춤 코칭
    coaching: CoachingRecommendations;
  };
}

export interface AlignmentAnalysis {
  // 일치하는 성향
  matchingTraits: Array<{
    category: string;
    sajuTrait: string;
    scanTrait: string;
    description: string;
  }>;
  
  // 일치도 점수 (0-100)
  alignmentScore: number;
  
  // 일치 요약
  summary: string;
}

export interface GapAnalysis {
  // 차이점 목록
  differences: Array<{
    category: string;
    sajuSide: string;
    scanSide: string;
    gapDescription: string;
    growthOpportunity: string;
  }>;
  
  // 차이 요약
  summary: string;
  
  // 성장 포인트
  growthPoints: string[];
}

export interface IntegratedInsights {
  // 통합 인생 테마
  lifeTheme: string;
  
  // 통합 강점
  strengths: Array<{
    title: string;
    description: string;
    source: 'saju' | 'scan' | 'both';
  }>;
  
  // 통합 주의점
  cautions: Array<{
    title: string;
    description: string;
    source: 'saju' | 'scan' | 'both';
  }>;
  
  // 통합 키워드
  keywords: string[];
  
  // 통합 메시지
  message: string;
}

export interface CoachingRecommendations {
  // 성장 방향
  growthDirection: {
    title: string;
    description: string;
    actions: string[];
  };
  
  // 관계 개선
  relationship: {
    title: string;
    description: string;
    tips: string[];
  };
  
  // 커리어
  career: {
    title: string;
    description: string;
    recommendations: string[];
  };
  
  // 자기계발
  selfDevelopment: {
    title: string;
    description: string;
    practices: string[];
  };
}

// ══════════════════════════════════════════════════════════════
//  오행 ↔ 32 Spectrum 매핑
// ══════════════════════════════════════════════════════════════

const OHANG_TO_SCAN_TRAITS: Record<string, {
  typeCodes: string[];
  traits: string[];
  axes: string[];
}> = {
  '木': {
    typeCodes: ['ISFJ', 'ISFP', 'ESFJ', 'ESFP'],
    traits: ['원칙', '성장', '강직함', '신뢰'],
    axes: ['PJ', 'DA']
  },
  '火': {
    typeCodes: ['ENFP', 'ENTP', 'ESFP', 'ESTP'],
    traits: ['열정', '에너지', '표현', '영향력'],
    axes: ['EI', 'PJ']
  },
  '土': {
    typeCodes: ['ISFJ', 'ISTJ', 'ESFJ', 'ESTJ'],
    traits: ['포용', '안정', '신뢰', '지속성'],
    axes: ['SN', 'PJ']
  },
  '金': {
    typeCodes: ['INTJ', 'ISTJ', 'ENTJ', 'ESTJ'],
    traits: ['카리스마', '원칙', '단호함', '강인함'],
    axes: ['FT', 'PJ']
  },
  '水': {
    typeCodes: ['INFP', 'INFJ', 'ENFP', 'ENFJ'],
    traits: ['자유', '지혜', '감성', '직관'],
    axes: ['SN', 'FT']
  }
};

// ══════════════════════════════════════════════════════════════
//  통합 리포트 생성 함수
// ══════════════════════════════════════════════════════════════

export function generateIntegratedReport(
  name: string,
  sajuResult: SajuResult,
  sajuContent: SajuFortune,
  scanResult: CalculateResult
): IntegratedReport {
  const scanTypeName = getScanTypeName(scanResult.typeCode);
  
  // 일치점 분석
  const alignment = analyzeAlignment(sajuResult, sajuContent, scanResult);
  
  // 차이점 분석
  const gap = analyzeGap(sajuResult, sajuContent, scanResult);
  
  // 통합 인사이트
  const insights = generateInsights(sajuResult, sajuContent, scanResult, alignment, gap);
  
  // 맞춤 코칭
  const coaching = generateCoaching(sajuResult, sajuContent, scanResult, gap);
  
  return {
    name,
    createdAt: new Date().toISOString(),
    saju: {
      result: sajuResult,
      content: sajuContent
    },
    scan: {
      result: scanResult,
      typeName: scanTypeName
    },
    analysis: {
      alignment,
      gap,
      insights,
      coaching
    }
  };
}

// ══════════════════════════════════════════════════════════════
//  일치점 분석
// ══════════════════════════════════════════════════════════════

function analyzeAlignment(
  sajuResult: SajuResult,
  sajuContent: SajuFortune,
  scanResult: CalculateResult
): AlignmentAnalysis {
  const matchingTraits: AlignmentAnalysis['matchingTraits'] = [];
  let alignmentScore = 0;
  
  const ohang = sajuResult.오행;
  const ohangTraits = OHANG_TO_SCAN_TRAITS[ohang];
  const sajuOverview = sajuContent.전체개관;
  
  // 오행과 32 Spectrum 타입 일치도
  if (ohangTraits && ohangTraits.typeCodes.includes(scanResult.typeCode)) {
    alignmentScore += 30;
    matchingTraits.push({
      category: '기본 성향',
      sajuTrait: `${ILGAN_SYMBOL[sajuResult.일간].name} (${ohang})`,
      scanTrait: scanResult.typeCode,
      description: '타고난 기질과 현재 성향이 일치합니다.'
    });
  }
  
  // 키워드 일치도
  const sajuKeywords = sajuOverview.keywords;
  const scanTypeDetail = SCAN_TYPE_DETAILS[scanResult.typeCode];
  if (scanTypeDetail) {
    const scanText = [
      scanTypeDetail.summary || '',
      scanTypeDetail.strength || '',
      scanTypeDetail.weakness || ''
    ].join(' ');
    
    const commonKeywords = sajuKeywords.filter(kw => 
      scanText.includes(kw)
    );
    
    if (commonKeywords.length > 0) {
      alignmentScore += commonKeywords.length * 10;
      matchingTraits.push({
        category: '키워드',
        sajuTrait: commonKeywords.join(', '),
        scanTrait: scanResult.typeCode,
        description: `${commonKeywords.length}개의 공통 키워드가 발견되었습니다.`
      });
    }
  }
  
  // 강점 일치도
  const sajuStrength = sajuOverview.strength;
  if (scanTypeDetail && sajuStrength) {
    const strengthMatch = checkTextMatch(sajuStrength, scanTypeDetail.summary.strength);
    if (strengthMatch) {
      alignmentScore += 20;
      matchingTraits.push({
        category: '강점',
        sajuTrait: sajuStrength,
        scanTrait: scanTypeDetail.summary.strength,
        description: '강점 영역에서 일치하는 특성이 있습니다.'
      });
    }
  }
  
  // 축별 성향 일치도
  const axisMatches = analyzeAxisAlignment(sajuResult, scanResult);
  alignmentScore += axisMatches.score;
  matchingTraits.push(...axisMatches.traits);
  
  alignmentScore = Math.min(alignmentScore, 100);
  
  let summary = '';
  if (alignmentScore >= 70) {
    summary = '타고난 기질과 현재 성향이 높은 일치도를 보입니다. 선천적 특성이 잘 발현되고 있다는 의미입니다.';
  } else if (alignmentScore >= 50) {
    summary = '타고난 기질과 현재 성향이 어느 정도 일치합니다. 일부 영역에서 성장의 여지가 있습니다.';
  } else {
    summary = '타고난 기질과 현재 성향 사이에 차이가 있습니다. 이는 성장과 변화의 기회로 볼 수 있습니다.';
  }
  
  return {
    matchingTraits,
    alignmentScore,
    summary
  };
}

function analyzeAxisAlignment(
  sajuResult: SajuResult,
  scanResult: CalculateResult
): { score: number; traits: AlignmentAnalysis['matchingTraits'] } {
  const traits: AlignmentAnalysis['matchingTraits'] = [];
  let score = 0;
  
  const ohang = sajuResult.오행;
  const ohangTraits = OHANG_TO_SCAN_TRAITS[ohang];
  
  if (!ohangTraits) {
    return { score: 0, traits: [] };
  }
  
  // 축별 매칭
  ohangTraits.axes.forEach(axis => {
    const scanScore = scanResult.scores[axis] || 0;
    const isLeft = scanScore <= 0;
    
    // 오행별 축 성향 예상
    const expectedDirection = getExpectedAxisDirection(ohang, axis);
    
    if (expectedDirection === (isLeft ? 'left' : 'right')) {
      score += 10;
      traits.push({
        category: `${axis} 축`,
        sajuTrait: `${ILGAN_SYMBOL[sajuResult.일간].name} 성향`,
        scanTrait: isLeft ? '좌측 성향' : '우측 성향',
        description: `${axis} 축에서 선천적 기질과 현재 성향이 일치합니다.`
      });
    }
  });
  
  return { score, traits };
}

function getExpectedAxisDirection(ohang: string, axis: string): 'left' | 'right' | 'neutral' {
  // 오행별 축 성향 매핑 (간단한 예시)
  const mapping: Record<string, Record<string, 'left' | 'right'>> = {
    '木': { 'PJ': 'right', 'DA': 'right' },
    '火': { 'EI': 'right', 'PJ': 'left' },
    '土': { 'SN': 'left', 'PJ': 'right' },
    '金': { 'FT': 'right', 'PJ': 'right' },
    '水': { 'SN': 'right', 'FT': 'left' }
  };
  
  return mapping[ohang]?.[axis] || 'neutral';
}

// ══════════════════════════════════════════════════════════════
//  차이점 분석
// ══════════════════════════════════════════════════════════════

function analyzeGap(
  sajuResult: SajuResult,
  sajuContent: SajuFortune,
  scanResult: CalculateResult
): GapAnalysis {
  const differences: GapAnalysis['differences'] = [];
  const growthPoints: string[] = [];
  
  const sajuOverview = sajuContent.전체개관;
  const scanTypeDetail = SCAN_TYPE_DETAILS[scanResult.typeCode];
  
  // 주의점 차이 분석
  if (sajuOverview.caution && scanTypeDetail) {
    const cautionGap = analyzeTextGap(sajuOverview.caution, scanTypeDetail.summary.weakness);
    if (cautionGap) {
      differences.push({
        category: '주의점',
        sajuSide: sajuOverview.caution,
        scanSide: scanTypeDetail.summary.weakness,
        gapDescription: cautionGap.description,
        growthOpportunity: cautionGap.opportunity
      });
      growthPoints.push(cautionGap.opportunity);
    }
  }
  
  // Grey Zone 분석
  if (scanResult.greyZones.length > 0) {
    differences.push({
      category: '유연성',
      sajuSide: '명확한 성향',
      scanSide: `${scanResult.greyZones.length}개 축 Grey Zone`,
      gapDescription: '사주는 명확한 성향을 보이지만, 현재는 여러 영역에서 유연한 적응력을 보입니다.',
      growthOpportunity: 'Grey Zone의 유연성을 활용하여 다양한 상황에 적응할 수 있는 능력을 키우세요.'
    });
    growthPoints.push('유연한 적응력 활용');
  }
  
  // 축별 차이 분석
  const axisGaps = analyzeAxisGaps(sajuResult, scanResult);
  differences.push(...axisGaps);
  
  let summary = '';
  if (differences.length === 0) {
    summary = '타고난 기질과 현재 성향이 매우 잘 일치합니다.';
  } else if (differences.length <= 2) {
    summary = '일부 영역에서 차이가 있지만, 이는 자연스러운 성장 과정입니다.';
  } else {
    summary = '여러 영역에서 차이가 발견되었습니다. 이는 성장과 변화의 기회로 활용할 수 있습니다.';
  }
  
  return {
    differences,
    summary,
    growthPoints
  };
}

function analyzeAxisGaps(
  sajuResult: SajuResult,
  scanResult: CalculateResult
): GapAnalysis['differences'] {
  const gaps: GapAnalysis['differences'] = [];
  const ohang = sajuResult.오행;
  const ohangTraits = OHANG_TO_SCAN_TRAITS[ohang];
  
  if (!ohangTraits) {
    return [];
  }
  
  ohangTraits.axes.forEach(axis => {
    const scanScore = scanResult.scores[axis] || 0;
    const expectedDirection = getExpectedAxisDirection(ohang, axis);
    const actualDirection = scanScore <= 0 ? 'left' : 'right';
    
    if (expectedDirection !== 'neutral' && expectedDirection !== actualDirection) {
      const axisNames: Record<string, { left: string; right: string }> = {
        'EI': { left: '내향성', right: '외향성' },
        'SN': { left: '감각형', right: '직관형' },
        'FT': { left: '감정형', right: '사고형' },
        'PJ': { left: '인식형', right: '판단형' },
        'DA': { left: '신중형', right: '적응형' }
      };
      
      gaps.push({
        category: `${axis} 축`,
        sajuSide: expectedDirection === 'left' ? axisNames[axis].left : axisNames[axis].right,
        scanSide: actualDirection === 'left' ? axisNames[axis].left : axisNames[axis].right,
        gapDescription: `${axis} 축에서 선천적 기질과 현재 성향이 다릅니다.`,
        growthOpportunity: `양쪽 성향의 장점을 모두 활용할 수 있는 균형을 찾아보세요.`
      });
    }
  });
  
  return gaps;
}

// ══════════════════════════════════════════════════════════════
//  통합 인사이트 생성
// ══════════════════════════════════════════════════════════════

function generateInsights(
  sajuResult: SajuResult,
  sajuContent: SajuFortune,
  scanResult: CalculateResult,
  alignment: AlignmentAnalysis,
  gap: GapAnalysis
): IntegratedInsights {
  const sajuOverview = sajuContent.전체개관;
  const scanTypeDetail = SCAN_TYPE_DETAILS[scanResult.typeCode];
  
  // 통합 인생 테마
  const scanDescription = scanTypeDetail?.summary || scanTypeDetail?.title || '현재의 성향을 가진';
  const lifeTheme = `${sajuOverview.lifeTheme} 그리고 ${scanDescription} 삶`;
  
  // 통합 강점
  const strengths: IntegratedInsights['strengths'] = [];
  
  // 사주 강점
  strengths.push({
    title: '선천적 강점',
    description: sajuOverview.strength,
    source: 'saju'
  });
  
  // 32 Spectrum 강점
  if (scanTypeDetail) {
    strengths.push({
      title: '현재의 강점',
      description: scanTypeDetail.summary.strength,
      source: 'scan'
    });
  }
  
  // 공통 강점
  if (alignment.matchingTraits.length > 0) {
    strengths.push({
      title: '통합 강점',
      description: '선천적 기질과 현재 성향이 일치하는 영역에서 특별한 힘을 발휘합니다.',
      source: 'both'
    });
  }
  
  // 통합 주의점
  const cautions: IntegratedInsights['cautions'] = [];
  
  cautions.push({
    title: '선천적 주의점',
    description: sajuOverview.caution,
    source: 'saju'
  });
  
  if (scanTypeDetail) {
    cautions.push({
      title: '현재의 주의점',
      description: scanTypeDetail.summary.weakness,
      source: 'scan'
    });
  }
  
  // 차이점에서 나오는 주의점
  if (gap.differences.length > 0) {
    cautions.push({
      title: '성장 포인트',
      description: '선천적 기질과 현재 성향의 차이를 이해하고 균형을 찾는 것이 중요합니다.',
      source: 'both'
    });
  }
  
  // 통합 키워드
  const keywords = [
    ...sajuOverview.keywords,
    ...(scanTypeDetail ? [scanResult.typeCode] : []),
    ...(alignment.alignmentScore >= 70 ? ['일치', '조화'] : ['성장', '변화'])
  ];
  
  // 통합 메시지
  let message = '';
  if (alignment.alignmentScore >= 70) {
    message = `당신은 타고난 기질을 잘 살려가고 있습니다. ${sajuOverview.lifeTheme}을(를) 실현하는 데 현재의 성향이 큰 도움이 되고 있어요.`;
  } else if (alignment.alignmentScore >= 50) {
    message = `타고난 기질과 현재 성향이 조화롭게 어우러지고 있습니다. ${gap.growthPoints[0] || '성장의 기회'}를 통해 더욱 발전할 수 있어요.`;
  } else {
    message = `타고난 기질과 현재 성향 사이의 차이는 성장의 기회입니다. ${gap.growthPoints[0] || '새로운 가능성'}을 탐색하며 균형을 찾아가세요.`;
  }
  
  return {
    lifeTheme,
    strengths,
    cautions,
    keywords: [...new Set(keywords)],
    message
  };
}

// ══════════════════════════════════════════════════════════════
//  맞춤 코칭 생성
// ══════════════════════════════════════════════════════════════

function generateCoaching(
  sajuResult: SajuResult,
  sajuContent: SajuFortune,
  scanResult: CalculateResult,
  gap: GapAnalysis
): CoachingRecommendations {
  const sajuOverview = sajuContent.전체개관;
  const scanTypeDetail = SCAN_TYPE_DETAILS[scanResult.typeCode];
  
  // 성장 방향
  const growthDirection = {
    title: '성장 방향',
    description: gap.summary || '선천적 기질과 현재 성향을 조화롭게 발전시켜 나가세요.',
    actions: [
      ...gap.growthPoints,
      sajuOverview.lifeTheme,
      scanTypeDetail?.summary.advice || '현재 성향을 활용한 성장'
    ]
  };
  
  // 관계 개선
  const relationship = {
    title: '관계 개선',
    description: '사주와 32 Spectrum을 통합한 관계 가이드',
    tips: [
      sajuContent.애정운.tips[0] || '관계에서 균형 찾기',
      scanTypeDetail?.summary.advice || '현재 성향을 활용한 관계',
      '선천적 기질과 현재 성향의 조화'
    ]
  };
  
  // 커리어
  const career = {
    title: '커리어',
    description: '통합 분석 기반 커리어 추천',
    recommendations: [
      sajuContent.직업운.tips[0] || '전문성 강화',
      scanTypeDetail?.summary.advice || '현재 성향 활용',
      '선천적 기질과 현재 성향의 시너지'
    ]
  };
  
  // 자기계발
  const selfDevelopment = {
    title: '자기계발',
    description: '통합 성장 가이드',
    practices: [
      sajuOverview.strength + ' 활용하기',
      gap.growthPoints[0] || '성장 포인트 개발',
      '일치하는 영역 강화',
      '차이점 균형 맞추기'
    ]
  };
  
  return {
    growthDirection,
    relationship,
    career,
    selfDevelopment
  };
}

// ══════════════════════════════════════════════════════════════
//  유틸리티 함수
// ══════════════════════════════════════════════════════════════

function getScanTypeName(typeCode: string): string {
  // SCAN_TYPE_DETAILS에서 타입 이름 가져오기
  const typeDetail = SCAN_TYPE_DETAILS[typeCode];
  return typeDetail?.name || typeCode;
}

function checkTextMatch(text1: string, text2: string): boolean {
  // 간단한 텍스트 매칭 (키워드 기반)
  const keywords1 = extractKeywords(text1);
  const keywords2 = extractKeywords(text2);
  
  const common = keywords1.filter(kw => keywords2.includes(kw));
  return common.length >= 2;
}

function extractKeywords(text: string): string[] {
  // 간단한 키워드 추출
  const commonWords = ['강점', '능력', '특성', '특징', '장점', '재능'];
  return text.split(/[,\s]+/).filter(word => 
    word.length > 1 && !commonWords.includes(word)
  );
}

function analyzeTextGap(text1: string, text2: string): { description: string; opportunity: string } | null {
  if (!text1 || !text2) return null;
  
  const match = checkTextMatch(text1, text2);
  if (match) return null;
  
  return {
    description: '선천적 주의점과 현재의 약점이 다릅니다.',
    opportunity: '양쪽 모두 고려하여 균형잡힌 성장을 추구하세요.'
  };
}
