// ══════════════════════════════════════════════════════════════
//  통합 리포트 계산 로직
//  사주(선천) + 32 Spectrum(후천) 통합 분석
// ══════════════════════════════════════════════════════════════

import { SajuResult } from './sajuEngine';
import { CalculateResult } from './calculate';
import { SajuFortune, ILGAN_SYMBOL, Cheongan } from '../data/sajuDb';
import { SCAN_TYPE_DETAILS } from '../data/scanResultData';
import { calculateAlignment, getCheonganProfile, analyzeGreyZones } from './saju/alignmentMapper';
import { generateAxisCoaching } from './saju/coachingContent';

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
  // 새 매핑 엔진으로 일치도 계산
  const alignResult = calculateAlignment(sajuResult.일간, scanResult.scores);
  const profile = getCheonganProfile(sajuResult.일간);
  const ohang = sajuResult.오행;
  const sajuOverview = sajuContent.전체개관;

  // matchingTraits 생성
  const matchingTraits: AlignmentAnalysis['matchingTraits'] = [];

  // 1) 기본 성향 매칭
  matchingTraits.push({
    category: '기본 성향',
    sajuTrait: `${profile?.name || sajuResult.일간} (${ohang})`,
    scanTrait: scanResult.typeCode,
    description: `타고난 기질과 현재 성향의 일치도: ${alignResult.totalScore}% (${alignResult.label})`
  });

  // 2) 일치하는 축 추가
  for (const detail of alignResult.axisDetails) {
    if (detail.isMatch) {
      matchingTraits.push({
        category: detail.axisLabel,
        sajuTrait: detail.sajuLabel,
        scanTrait: detail.spectrumLabel,
        description: `${detail.axisLabel}에서 선천적 기질과 현재 성향이 일치합니다.${detail.isCoreAxis ? ' (핵심 특성)' : ''}`
      });
    }
  }

  // 3) 키워드 매칭
  if (profile && sajuOverview) {
    const sajuKeywords = sajuOverview.keywords || [];
    const profileKeywords = profile.keywords;
    const commonKeywords = sajuKeywords.filter(k =>
      profileKeywords.some(pk => k.includes(pk) || pk.includes(k))
    );
    if (commonKeywords.length > 0) {
      matchingTraits.push({
        category: '키워드',
        sajuTrait: sajuKeywords.join(', '),
        scanTrait: scanResult.typeCode,
        description: `${commonKeywords.length}개의 공통 키워드가 발견되었습니다.`
      });
    }
  }

  // 4) 요약 생성
  const summary = alignResult.summary;

  return {
    matchingTraits,
    alignmentScore: alignResult.totalScore,
    summary
  };
}

function analyzeAxisAlignment(
  sajuResult: SajuResult,
  scanResult: CalculateResult
): { score: number; traits: AlignmentAnalysis['matchingTraits'] } {
  // 새 매핑 엔진이 이미 축별 분석을 하므로, 여기서는 결과만 변환
  const alignResult = calculateAlignment(sajuResult.일간, scanResult.scores);
  const traits: AlignmentAnalysis['matchingTraits'] = [];
  let matchCount = 0;

  for (const detail of alignResult.axisDetails) {
    if (detail.isMatch) {
      matchCount++;
      traits.push({
        category: `${detail.axisLabel} 축`,
        sajuTrait: detail.sajuLabel,
        scanTrait: detail.spectrumLabel,
        description: `${detail.axisLabel}에서 선천적 기질과 현재 성향이 일치합니다.`
      });
    }
  }

  return {
    score: Math.round((matchCount / 5) * 30),  // 최대 30점 기여
    traits
  };
}

function getExpectedAxisDirection(
  ohang: string,
  axis: string
): 'left' | 'right' | 'neutral' {
  // 새 매핑 엔진의 프로파일 활용
  // 오행 → 대표 천간으로 변환하여 조회
  const ohangToCheongan: Record<string, string> = {
    '木': '甲', '火': '丙', '土': '戊', '金': '庚', '水': '壬'
  };
  const cheongan = ohangToCheongan[ohang];
  if (!cheongan) return 'neutral';

  const profile = getCheonganProfile(cheongan);
  if (!profile) return 'neutral';

  const axisKey = axis as 'EI' | 'SN' | 'FT' | 'PJ' | 'DA';
  const direction = profile.expectedDirections[axisKey];
  if (!direction) return 'neutral';

  return direction === 'LEFT' ? 'left' : 'right';
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
  const alignResult = calculateAlignment(sajuResult.일간, scanResult.scores);
  const profile = getCheonganProfile(sajuResult.일간);

  // 1) 축별 갭 분석 (새 엔진 기반)
  for (const detail of alignResult.axisDetails) {
    if (!detail.isMatch && !detail.isGreyZone) {
      differences.push({
        category: `${detail.axisLabel} 축`,
        sajuSide: detail.sajuLabel,
        scanSide: detail.spectrumLabel,
        gapDescription: `${detail.axisLabel}에서 선천적 기질과 현재 성향이 다릅니다.${detail.isCoreAxis ? ' (핵심 특성 영역)' : ''}`,
        growthOpportunity: `양쪽 성향의 장점을 모두 활용할 수 있는 균형을 찾아보세요.`
      });
      growthPoints.push(`${detail.axisLabel}의 균형 찾기`);
    }
  }

  // 2) Grey Zone 분석
  for (const detail of alignResult.axisDetails) {
    if (detail.isGreyZone) {
      differences.push({
        category: '유연성',
        sajuSide: detail.sajuLabel,
        scanSide: `Grey Zone (점수: ${detail.spectrumScore})`,
        gapDescription: `${detail.axisLabel}에서 유연한 적응력을 보입니다.`,
        growthOpportunity: `Grey Zone의 유연성을 활용하여 다양한 상황에 적응할 수 있는 능력을 키우세요.`
      });
    }
  }

  // 3) 주의점 차이
  const sajuOverview = sajuContent.전체개관;
  if (sajuOverview?.caution && profile) {
    differences.push({
      category: '주의점 비교',
      sajuSide: sajuOverview.caution,
      scanSide: `${scanResult.typeCode} 타입의 주의점`,
      gapDescription: '선천적 주의점과 현재 성향의 주의점을 함께 인식하면 성장에 도움이 됩니다.',
      growthOpportunity: '두 관점의 주의점을 모두 인식하고 균형을 찾아보세요.'
    });
  }

  // 4) 요약
  const gapCount = alignResult.gapAxes.length;
  const greyCount = alignResult.greyZoneAxes.length;
  let summary: string;

  if (gapCount === 0) {
    summary = '선천적 기질과 현재 성향이 매우 잘 일치합니다.';
  } else if (gapCount <= 2) {
    summary = '일부 영역에서 차이가 있지만, 이는 자연스러운 성장 과정입니다.';
  } else {
    summary = '후천적 경험을 통해 다양한 영역에서 변화와 성장이 이루어지고 있습니다.';
  }

  if (greyCount > 0) {
    summary += ` ${greyCount}개 축에서 Grey Zone(유연 영역)이 감지되었습니다.`;
  }

  return { differences, summary, growthPoints };
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
  
  // Grey Zone 심화 분석
  const greyZoneAnalysis = analyzeGreyZones(sajuResult.일간, scanResult.scores);
  
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
      description: scanTypeDetail.strength,
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
  
  // Grey Zone 강점
  if (greyZoneAnalysis.greyZoneCount > 0) {
    strengths.push({
      title: `유연한 적응력 (${greyZoneAnalysis.greyZoneLabel})`,
      description: greyZoneAnalysis.overallInterpretation,
      source: 'both' as const
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
      description: scanTypeDetail.weakness,
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
  
  // Grey Zone 심화 해석
  for (const detail of greyZoneAnalysis.details) {
    cautions.push({
      title: `${detail.axisLabel} 유연 영역${detail.isCoreAxis ? ' (핵심 특성)' : ''}`,
      description: detail.interpretation,
      source: 'both' as const
    });
  }
  
  // 통합 키워드
  const keywords = [
    ...sajuOverview.keywords,
    ...(scanTypeDetail ? [scanResult.typeCode] : []),
    ...(alignment.alignmentScore >= 70 ? ['일치', '조화'] : ['성장', '변화']),
    ...(greyZoneAnalysis.greyZoneCount > 0 ? [greyZoneAnalysis.greyZoneLabel, '유연성'] : [])
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
  
  // Grey Zone 성장 메시지 추가
  if (greyZoneAnalysis.greyZoneCount > 0) {
    message += ' ' + greyZoneAnalysis.growthMessage;
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

  // 새 매핑 엔진으로 축별 코칭 생성
  const alignResult = calculateAlignment(sajuResult.일간, scanResult.scores);
  const axisCoaching = generateAxisCoaching(alignResult.axisDetails);

  // 성장 방향
  const growthDirection = {
    title: '성장 방향',
    description: alignResult.summary,
    actions: [
      ...axisCoaching.growth,
      sajuOverview?.lifeTheme || '나만의 인생 테마를 발견하세요'
    ]
  };

  // 관계 개선
  const relationship = {
    title: '관계 개선',
    description: '사주와 32 Spectrum을 통합한 관계 가이드',
    tips: [
      sajuContent.애정운?.tips?.[0] || '관계에서 나만의 강점을 활용하세요',
      ...axisCoaching.relationship
    ]
  };

  // 커리어
  const career = {
    title: '커리어',
    description: '통합 분석 기반 커리어 추천',
    recommendations: [
      sajuContent.직업운?.tips?.[0] || '나의 강점을 살리는 일을 찾으세요',
      ...axisCoaching.career
    ]
  };

  // 자기계발
  const selfDevelopment = {
    title: '자기계발',
    description: '통합 성장 가이드',
    practices: [
      (sajuOverview?.strength || '선천적 강점') + '을 일상에서 활용하기',
      ...axisCoaching.selfDev
    ]
  };

  return { growthDirection, relationship, career, selfDevelopment };
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
