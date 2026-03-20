// ══════════════════════════════════════════════════════════════
//  통합 리포트 계산 로직 v2.0
//  사주(선천) + 32 Spectrum(후천) 통합 분석
//
//  v1 대비 핵심 개선:
//  ① 코칭 description에 천간 페르소나 맥락 반영
//  ② overallMessage(천간별 종합 코칭) 연결
//  ③ 인사이트 메시지 천간 맥락화
//  ④ 갭 분석에 천간별 성장 기회 구체화
//  ⑤ 통합 강점/주의점 서술 심화
// ══════════════════════════════════════════════════════════════

import { SajuResult } from './sajuEngine';
import { CalculateResult } from './calculate';
import { SajuFortune, ILGAN_SYMBOL, Cheongan } from '../data/sajuDb';
import { SCAN_TYPE_DETAILS } from '../data/scanResultData';
import { calculateAlignment, getCheonganProfile, analyzeGreyZones } from './saju/alignmentMapper';
import { generateAxisCoaching, getCoachingPersona } from './saju/coachingContent';

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
  // v2 추가: 천간별 종합 코칭 메시지
  overallMessage: string;

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
  const persona = getCoachingPersona(sajuResult.일간);
  const ohang = sajuResult.오행;
  const sajuOverview = sajuContent.전체개관;

  // matchingTraits 생성
  const matchingTraits: AlignmentAnalysis['matchingTraits'] = [];

  // 1) 기본 성향 매칭 — 천간 맥락 반영
  const baseDescription = persona
    ? `${persona.metaphor}의 기운(${persona.name})과 현재 성향(${scanResult.typeCode})의 일치도: ${alignResult.totalScore}% — ${alignResult.label}`
    : `타고난 기질과 현재 성향의 일치도: ${alignResult.totalScore}% (${alignResult.label})`;

  matchingTraits.push({
    category: '기본 성향',
    sajuTrait: `${profile?.name || sajuResult.일간} (${ohang})`,
    scanTrait: scanResult.typeCode,
    description: baseDescription
  });

  // 2) 일치하는 축 추가 — 핵심 축 강조
  for (const detail of alignResult.axisDetails) {
    if (detail.isMatch) {
      const coreTag = detail.isCoreAxis ? ' 이 영역은 핵심 특성이라 일치의 의미가 더 깊어요.' : '';
      matchingTraits.push({
        category: detail.axisLabel,
        sajuTrait: detail.sajuLabel,
        scanTrait: detail.spectrumLabel,
        description: `${detail.axisLabel}에서 타고난 기질이 그대로 발현되고 있어요.${coreTag}`
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
        description: `'${commonKeywords.join("', '")}'이(가) 선천과 후천 모두에서 나타나는 핵심 키워드예요.`
      });
    }
  }

  // 4) 요약 — 천간 맥락 반영
  let summary = alignResult.summary;
  if (persona) {
    if (alignResult.totalScore >= 85) {
      summary = `${persona.metaphor}의 기운이 지금 삶에서 강하게 빛나고 있어요. ${persona.coreDrive} — 이 본능이 그대로 발현되고 있습니다.`;
    } else if (alignResult.totalScore >= 65) {
      summary = `${persona.metaphor}의 기운을 잘 살리면서, 일부 영역에서 새로운 가능성도 열어가고 있어요.`;
    } else if (alignResult.totalScore >= 45) {
      summary = `${persona.metaphor}의 본래 기운과 후천적으로 키운 역량이 서로를 보완하며 당신만의 색깔을 만들어가고 있어요.`;
    } else {
      summary = `${persona.metaphor}의 기운을 토대로, 삶의 경험이 당신을 완전히 새로운 방향으로 성장시키고 있어요. 이 변화 안에 숨겨진 강점을 발견해보세요.`;
    }
  }

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
//  차이점 분석 — v2: 천간 맥락 반영
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
  const persona = getCoachingPersona(sajuResult.일간);

  // 1) 축별 갭 분석 — 천간 맥락 반영
  for (const detail of alignResult.axisDetails) {
    if (!detail.isMatch && !detail.isGreyZone) {
      const coreTag = detail.isCoreAxis ? ' (핵심 특성 영역)' : '';
      
      // v2: 천간 페르소나에서 tension과 gift 활용
      let gapDesc = `${detail.axisLabel}에서 선천적 기질과 현재 성향이 다릅니다.${coreTag}`;
      let growthOpp = '양쪽 성향의 장점을 모두 활용할 수 있는 균형을 찾아보세요.';

      if (persona) {
        const axisKey = detail.axis as 'EI' | 'SN' | 'FT' | 'PJ' | 'DA';
        const narrative = persona.axisNarrative[axisKey];
        if (narrative) {
          gapDesc = `${persona.name}은 본래 ${narrative.natural}. 하지만 지금의 당신은 다른 방향으로도 역량을 키워왔어요.${coreTag}`;
          growthOpp = `이 차이는 성장의 증거예요. 당신 안에는 ${narrative.gift}이 있어요. 상황에 따라 두 가지 모드를 의식적으로 전환해보세요.`;
        }
      }

      differences.push({
        category: `${detail.axisLabel} 축`,
        sajuSide: detail.sajuLabel,
        scanSide: detail.spectrumLabel,
        gapDescription: gapDesc,
        growthOpportunity: growthOpp
      });

      // v2: 성장 포인트도 구체화
      if (persona) {
        const axisKey = detail.axis as 'EI' | 'SN' | 'FT' | 'PJ' | 'DA';
        const narrative = persona.axisNarrative[axisKey];
        growthPoints.push(
          narrative
            ? `${detail.axisLabel}: ${narrative.gift}을 의식적으로 활용하기`
            : `${detail.axisLabel}의 균형 찾기`
        );
      } else {
        growthPoints.push(`${detail.axisLabel}의 균형 찾기`);
      }
    }
  }

  // 2) Grey Zone 분석 — 천간 맥락 반영
  for (const detail of alignResult.axisDetails) {
    if (detail.isGreyZone) {
      let gapDesc = `${detail.axisLabel}에서 유연한 적응력을 보입니다.`;
      let growthOpp = 'Grey Zone의 유연성을 활용하여 다양한 상황에 적응할 수 있는 능력을 키우세요.';

      if (persona) {
        const axisKey = detail.axis as 'EI' | 'SN' | 'FT' | 'PJ' | 'DA';
        const narrative = persona.axisNarrative[axisKey];
        if (narrative) {
          gapDesc = `${detail.axisLabel}에서 양쪽 모두를 경험한 유연함이 보여요. ${persona.name}이 이 영역에서 Grey Zone이라는 건, 한쪽에 갇히지 않는 열린 가능성을 가졌다는 뜻이에요.`;
          growthOpp = `${narrative.gift}을 발휘할 수 있는 잠재력이 열려 있어요. 의도적으로 한쪽 모드를 선택해서 생활하는 실험을 통해 나만의 최적점을 발견해보세요.`;
        }
      }

      differences.push({
        category: '유연성',
        sajuSide: detail.sajuLabel,
        scanSide: `Grey Zone (점수: ${detail.spectrumScore})`,
        gapDescription: gapDesc,
        growthOpportunity: growthOpp
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
      gapDescription: persona
        ? `${persona.metaphor}의 선천적 주의점과 현재 성향의 주의점을 함께 인식하면, 블라인드 스팟을 줄일 수 있어요.`
        : '선천적 주의점과 현재 성향의 주의점을 함께 인식하면 성장에 도움이 됩니다.',
      growthOpportunity: persona
        ? `${persona.growthKey} — 이 원칙을 주의점 관리에도 적용해보세요.`
        : '두 관점의 주의점을 모두 인식하고 균형을 찾아보세요.'
    });
  }

  // 4) 요약 — 천간 맥락 반영
  const gapCount = alignResult.gapAxes.length;
  const greyCount = alignResult.greyZoneAxes.length;
  let summary: string;

  if (persona) {
    if (gapCount === 0) {
      summary = `${persona.metaphor}의 기운이 지금 삶에서 자연스럽게 흐르고 있어요. 선천과 후천이 잘 맞아서 에너지 소모가 적은 상태예요.`;
    } else if (gapCount <= 2) {
      summary = `${persona.name}의 본래 기질을 잘 살리면서, ${gapCount}개 영역에서 새로운 역량을 키워가고 있어요. 이 차이는 자연스러운 성장 과정이에요.`;
    } else {
      summary = `후천적 경험을 통해 ${persona.metaphor}의 본래 모습에서 많이 확장되었어요. 다양한 영역에서 변화가 일어나고 있고, 이 안에 당신만의 강점이 숨어 있어요.`;
    }
  } else {
    if (gapCount === 0) {
      summary = '선천적 기질과 현재 성향이 매우 잘 일치합니다.';
    } else if (gapCount <= 2) {
      summary = '일부 영역에서 차이가 있지만, 이는 자연스러운 성장 과정입니다.';
    } else {
      summary = '후천적 경험을 통해 다양한 영역에서 변화와 성장이 이루어지고 있습니다.';
    }
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
//  통합 인사이트 생성 — v2: 천간 맥락 심화
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
  const persona = getCoachingPersona(sajuResult.일간);
  
  // Grey Zone 심화 분석
  const greyZoneAnalysis = analyzeGreyZones(sajuResult.일간, scanResult.scores);
  
  // 통합 인생 테마 — v2: 천간 맥락 반영
  let lifeTheme: string;
  const scanDescription = scanTypeDetail?.summary || scanTypeDetail?.title || '현재의 성향을 가진';
  if (persona) {
    lifeTheme = `${persona.metaphor}처럼 ${persona.coreDrive}, 그리고 ${scanDescription} 삶`;
  } else {
    lifeTheme = `${sajuOverview.lifeTheme} 그리고 ${scanDescription} 삶`;
  }
  
  // ── 통합 강점 ──
  const strengths: IntegratedInsights['strengths'] = [];
  
  // 사주 강점 — v2: 천간 맥락 추가
  strengths.push({
    title: persona ? `${persona.metaphor}의 선천적 힘` : '선천적 강점',
    description: persona
      ? `${sajuOverview.strength} — ${persona.name}의 핵심 동력은 "${persona.coreDrive}"이에요. 이 힘이 당신의 근본적인 에너지원이에요.`
      : sajuOverview.strength,
    source: 'saju'
  });
  
  // 32 Spectrum 강점
  if (scanTypeDetail) {
    strengths.push({
      title: '후천적으로 키운 강점',
      description: persona
        ? `${scanTypeDetail.strength} — 이 역량은 ${persona.metaphor}의 기운 위에 경험이 쌓아올린 "현재의 무기"예요.`
        : scanTypeDetail.strength,
      source: 'scan'
    });
  }
  
  // 공통 강점 — v2: 구체화
  if (alignment.matchingTraits.length > 1) {
    const matchAxes = alignment.matchingTraits
      .filter(t => t.category !== '기본 성향' && t.category !== '키워드')
      .map(t => t.category);
    
    strengths.push({
      title: '선천 × 후천이 만난 시너지',
      description: matchAxes.length > 0
        ? `${matchAxes.join(', ')} 영역에서 타고난 기질과 현재 성향이 일치해요. 이 영역은 노력 없이도 자연스럽게 발휘되는 "본능적 강점"이에요. 여기에 의식적 투자를 더하면 대체 불가능한 역량이 됩니다.`
        : '선천적 기질과 현재 성향이 일치하는 영역에서 특별한 시너지가 발휘되고 있어요.',
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
  
  // ── 통합 주의점 ──
  const cautions: IntegratedInsights['cautions'] = [];
  
  cautions.push({
    title: persona ? `${persona.metaphor}의 그림자` : '선천적 주의점',
    description: persona
      ? `${sajuOverview.caution} — ${persona.name}에게는 자연스러운 패턴이지만, 인식하지 못하면 반복될 수 있어요.`
      : sajuOverview.caution,
    source: 'saju'
  });
  
  if (scanTypeDetail) {
    cautions.push({
      title: '현재 성향의 블라인드 스팟',
      description: persona
        ? `${scanTypeDetail.weakness} — 후천적 성향에서 오는 주의점이에요. ${persona.growthKey}`
        : scanTypeDetail.weakness,
      source: 'scan'
    });
  }
  
  // 차이점에서 나오는 주의점 — v2: 구체화
  if (gap.differences.length > 0) {
    const gapAreas = gap.differences
      .filter(d => d.category !== '유연성' && d.category !== '주의점 비교')
      .map(d => d.category);
    
    cautions.push({
      title: '선천 ↔ 후천 사이의 긴장',
      description: gapAreas.length > 0
        ? `${gapAreas.join(', ')} 영역에서 타고난 기질과 현재 방향이 달라요. 이 차이가 때로는 내면의 갈등으로 느껴질 수 있지만, "양쪽을 모두 가진 사람"이라는 관점으로 바라보면 성장의 기회가 보여요.`
        : '선천적 기질과 현재 성향의 차이를 이해하고 균형을 찾는 것이 중요합니다.',
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
  
  // ── 통합 키워드 ──
  const keywords = [
    ...sajuOverview.keywords,
    ...(scanTypeDetail ? [scanResult.typeCode] : []),
    ...(alignment.alignmentScore >= 70 ? ['일치', '조화'] : ['성장', '변화']),
    ...(greyZoneAnalysis.greyZoneCount > 0 ? [greyZoneAnalysis.greyZoneLabel, '유연성'] : [])
  ];
  
  // ── 통합 메시지 — v2: 천간 맥락 심화 ──
  let message = '';
  if (persona) {
    if (alignment.alignmentScore >= 70) {
      message = `${persona.metaphor}의 기운을 가진 당신은 타고난 기질을 잘 살려가고 있어요. "${persona.coreDrive}" — 이 본능이 지금의 삶에서 자연스럽게 흐르고 있어요. 이 흐름을 신뢰하면서, 더 깊이 발전시켜 나가세요.`;
    } else if (alignment.alignmentScore >= 50) {
      message = `${persona.metaphor}의 기운과 후천적 성장이 조화롭게 어우러지고 있어요. 타고난 모습을 살리면서도 새로운 가능성을 열어가는 중이에요. ${gap.growthPoints[0] || '당신의 성장 포인트'}를 의식하면 균형이 더 깊어져요.`;
    } else {
      message = `${persona.metaphor}의 기운을 토대로, 삶의 경험이 당신을 많이 성장시켰어요. 이 변화는 "어긋남"이 아니라 더 넓어진 가능성이에요. ${gap.growthPoints[0] || '새로운 시도'}를 통해 양쪽의 힘을 모두 활용해보세요.`;
    }
  } else {
    if (alignment.alignmentScore >= 70) {
      message = `당신은 타고난 기질을 잘 살려가고 있습니다. ${sajuOverview.lifeTheme}을(를) 실현하는 데 현재의 성향이 큰 도움이 되고 있어요.`;
    } else if (alignment.alignmentScore >= 50) {
      message = `타고난 기질과 현재 성향이 조화롭게 어우러지고 있습니다. ${gap.growthPoints[0] || '성장의 기회'}를 통해 더욱 발전할 수 있어요.`;
    } else {
      message = `타고난 기질과 현재 성향 사이의 차이는 성장의 기회입니다. ${gap.growthPoints[0] || '새로운 가능성'}을 탐색하며 균형을 찾아가세요.`;
    }
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
//  맞춤 코칭 생성 — v2: 천간 맥락 + overallMessage
// ══════════════════════════════════════════════════════════════

function generateCoaching(
  sajuResult: SajuResult,
  sajuContent: SajuFortune,
  scanResult: CalculateResult,
  gap: GapAnalysis
): CoachingRecommendations {
  const sajuOverview = sajuContent.전체개관;
  const persona = getCoachingPersona(sajuResult.일간);

  // v2: ilgan 전달하여 천간 맞춤 코칭 생성
  const alignResult = calculateAlignment(sajuResult.일간, scanResult.scores);
  const axisCoaching = generateAxisCoaching(alignResult.axisDetails, sajuResult.일간);

  // v2: 종합 코칭 메시지
  const overallMessage = axisCoaching.overallMessage
    || (persona
      ? `${persona.metaphor}의 기운을 믿고, 당신만의 속도로 나아가세요. ${persona.growthKey}`
      : '당신만의 고유한 강점을 믿고, 자기다운 속도로 성장해 나가세요.');

  // 성장 방향 — v2: description 천간 맥락화
  const growthDirection = {
    title: persona ? `${persona.metaphor}의 성장 나침반` : '성장 방향',
    description: persona
      ? `${persona.name}에게 성장이란 "${persona.coreDrive}"의 깊이를 더하는 것이에요. 타고난 힘은 유지하면서, 후천적 경험이 만든 새로운 역량을 통합해 나가세요.`
      : alignResult.summary,
    actions: [
      ...axisCoaching.growth,
      sajuOverview?.lifeTheme || '나만의 인생 테마를 발견하세요'
    ]
  };

  // 관계 개선 — v2: description 천간 맥락화
  const relationship = {
    title: persona ? `${persona.metaphor}의 관계 전략` : '관계 개선',
    description: persona
      ? `당신은 ${persona.relStyle}이에요. 이 자연스러운 소통 스타일을 살리면서, 상대방의 다른 스타일도 이해하면 관계의 깊이가 한 단계 올라가요.`
      : '사주와 32 Spectrum을 통합한 관계 가이드',
    tips: [
      sajuContent.애정운?.tips?.[0] || '관계에서 나만의 강점을 활용하세요',
      ...axisCoaching.relationship
    ]
  };

  // 커리어 — v2: description 천간 맥락화
  const career = {
    title: persona ? `${persona.metaphor}의 커리어 로드맵` : '커리어',
    description: persona
      ? `${persona.careerDNA} — 이것이 당신의 직업적 DNA예요. 타고난 커리어 감각 위에 후천적으로 키운 역량을 얹으면, 시장에서 독보적인 포지션을 만들 수 있어요.`
      : '통합 분석 기반 커리어 추천',
    recommendations: [
      sajuContent.직업운?.tips?.[0] || '나의 강점을 살리는 일을 찾으세요',
      ...axisCoaching.career
    ]
  };

  // 자기계발 — v2: description 천간 맥락화
  const selfDevelopment = {
    title: persona ? `${persona.metaphor}의 자기계발 플랜` : '자기계발',
    description: persona
      ? `${persona.growthKey} — 이것이 당신의 자기계발 핵심 키워드예요. 선천적 강점을 일상에서 더 자주 활용하면서, 부족한 부분을 작은 실험으로 채워나가세요.`
      : '통합 성장 가이드',
    practices: [
      persona
        ? `"${persona.coreDrive}" — 이 본능을 매일 한 가지 행동으로 실천하기`
        : (sajuOverview?.strength || '선천적 강점') + '을 일상에서 활용하기',
      ...axisCoaching.selfDev
    ]
  };

  return { overallMessage, growthDirection, relationship, career, selfDevelopment };
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
