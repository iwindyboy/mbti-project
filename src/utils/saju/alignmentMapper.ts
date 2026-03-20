// ══════════════════════════════════════════════════════════════
//  오행-Spectrum 매핑 & 일치도 계산 엔진
//  선천(사주 천간) ↔ 후천(32 Spectrum) 갭 분석
//
//  본 통합 분석은 동양 명리학의 천간 해석과 성향 심리학 이론을
//  바탕으로 독자적으로 연구·개발한 SCAN 프레임워크입니다.
// ══════════════════════════════════════════════════════════════

// ═══════════ 타입 정의 ═══════════

type Axis = 'EI' | 'SN' | 'FT' | 'PJ' | 'DA';
type Direction = 'LEFT' | 'RIGHT';
// LEFT = I, S, F, P, D (음수 방향)
// RIGHT = E, N, T, J, A (양수 방향)

interface CheonganProfile {
  name: string;
  hanja: string;
  element: string;
  nature: string;
  expectedDirections: Record<Axis, Direction>;
  coreAxes: [Axis, Axis];  // 핵심 축 2개 (가중치 1.5배)
  keywords: string[];
}

export interface AlignmentResult {
  totalScore: number;           // 0~100
  label: string;                // 깊은 일치형, 자연스러운 조화형, 보완형, 전환형
  labelEn: string;              // Deep Alignment, Natural Harmony, etc.
  emoji: string;                // 🟢🔵🟡🟠
  summary: string;              // 한 줄 설명
  axisDetails: AxisDetail[];    // 축별 상세
  matchedAxes: string[];        // 일치하는 축 이름
  gapAxes: string[];            // 갭이 있는 축 이름
  greyZoneAxes: string[];       // Grey Zone 축 이름
}

export interface AxisDetail {
  axis: Axis;
  axisLabel: string;            // 예: "에너지 방향"
  sajuDirection: Direction;
  sajuLabel: string;            // 예: "외향적 (갑목 특성)"
  spectrumDirection: Direction;
  spectrumLabel: string;        // 예: "내향 (I, 점수: -8)"
  spectrumScore: number;
  isMatch: boolean;
  isGreyZone: boolean;
  isCoreAxis: boolean;
  axisScore: number;            // 이 축의 일치 점수
}

// ═══════════ 10천간 프로파일 ═══════════

const CHEONGAN_PROFILES: Record<string, CheonganProfile> = {
  '甲': {
    name: '갑목', hanja: '甲', element: '木',
    nature: '큰 소나무 — 곧고 강직한 리더',
    expectedDirections: { EI: 'RIGHT', SN: 'RIGHT', FT: 'RIGHT', PJ: 'RIGHT', DA: 'LEFT' },
    coreAxes: ['EI', 'DA'],
    keywords: ['리더십', '추진력', '독립', '원칙', '주도성']
  },
  '乙': {
    name: '을목', hanja: '乙', element: '木',
    nature: '넝쿨 — 유연하고 섬세한 적응가',
    expectedDirections: { EI: 'LEFT', SN: 'RIGHT', FT: 'LEFT', PJ: 'LEFT', DA: 'RIGHT' },
    coreAxes: ['FT', 'PJ'],
    keywords: ['유연함', '섬세함', '관계', '적응', '공감']
  },
  '丙': {
    name: '병화', hanja: '丙', element: '火',
    nature: '태양 — 열정적이고 환한 영향력',
    expectedDirections: { EI: 'RIGHT', SN: 'RIGHT', FT: 'LEFT', PJ: 'RIGHT', DA: 'LEFT' },
    coreAxes: ['EI', 'FT'],
    keywords: ['열정', '표현력', '외향', '영향력', '에너지']
  },
  '丁': {
    name: '정화', hanja: '丁', element: '火',
    nature: '촛불 — 따뜻하고 섬세한 집중력',
    expectedDirections: { EI: 'LEFT', SN: 'RIGHT', FT: 'LEFT', PJ: 'RIGHT', DA: 'RIGHT' },
    coreAxes: ['FT', 'DA'],
    keywords: ['헌신', '집중', '따뜻함', '내면의 빛', '섬세']
  },
  '戊': {
    name: '무토', hanja: '戊', element: '土',
    nature: '큰 산 — 포용력과 안정의 중심',
    expectedDirections: { EI: 'RIGHT', SN: 'LEFT', FT: 'RIGHT', PJ: 'RIGHT', DA: 'LEFT' },
    coreAxes: ['SN', 'PJ'],
    keywords: ['포용', '안정', '현실감각', '중심', '신뢰']
  },
  '己': {
    name: '기토', hanja: '己', element: '土',
    nature: '논밭 — 현실적이고 성실한 배려',
    expectedDirections: { EI: 'LEFT', SN: 'LEFT', FT: 'LEFT', PJ: 'RIGHT', DA: 'RIGHT' },
    coreAxes: ['SN', 'FT'],
    keywords: ['성실', '배려', '실용', '꼼꼼', '현실감각']
  },
  '庚': {
    name: '경금', hanja: '庚', element: '金',
    nature: '강철 — 결단력과 정의의 실행가',
    expectedDirections: { EI: 'RIGHT', SN: 'LEFT', FT: 'RIGHT', PJ: 'RIGHT', DA: 'LEFT' },
    coreAxes: ['FT', 'DA'],
    keywords: ['결단', '정의', '직설', '실행력', '추진']
  },
  '辛': {
    name: '신금', hanja: '辛', element: '金',
    nature: '보석 — 완벽주의와 정교한 심미안',
    expectedDirections: { EI: 'LEFT', SN: 'LEFT', FT: 'RIGHT', PJ: 'LEFT', DA: 'RIGHT' },
    coreAxes: ['SN', 'FT'],
    keywords: ['완벽', '심미안', '분석', '정교', '예민']
  },
  '壬': {
    name: '임수', hanja: '壬', element: '水',
    nature: '큰 바다 — 지혜와 전략의 자유인',
    expectedDirections: { EI: 'RIGHT', SN: 'RIGHT', FT: 'RIGHT', PJ: 'LEFT', DA: 'LEFT' },
    coreAxes: ['EI', 'PJ'],
    keywords: ['지혜', '전략', '자유', '스케일', '포용']
  },
  '癸': {
    name: '계수', hanja: '癸', element: '水',
    nature: '빗물 — 감성과 직관의 치유자',
    expectedDirections: { EI: 'LEFT', SN: 'RIGHT', FT: 'LEFT', PJ: 'LEFT', DA: 'RIGHT' },
    coreAxes: ['FT', 'SN'],
    keywords: ['감성', '직관', '공감', '창의', '치유']
  }
};

// ═══════════ 축 라벨 ═══════════

const AXIS_LABELS: Record<Axis, { name: string; left: string; right: string }> = {
  EI: { name: '에너지 방향', left: '내향 (I)', right: '외향 (E)' },
  SN: { name: '인식 방식',   left: '감각 (S)', right: '직관 (N)' },
  FT: { name: '판단 기준',   left: '감정 (F)', right: '사고 (T)' },
  PJ: { name: '생활 양식',   left: '인식 (P)', right: '판단 (J)' },
  DA: { name: '실행 방식',   left: '신중 (D)', right: '행동 (A)' },
};

// ═══════════ 점수 상수 ═══════════

const MAX_AXIS_SCORE = 15;  // 한 축의 최대 절댓값 (6문항 × L3/R3 기준)
const GREY_ZONE_THRESHOLD = 3;
const GREY_ZONE_SCORE = 45;
const CORE_AXIS_WEIGHT = 1.5;
const NORMAL_AXIS_WEIGHT = 1.0;

// ═══════════ 메인 함수 ═══════════

export function calculateAlignment(
  ilgan: string,
  spectrumScores: Record<string, number>
): AlignmentResult {
  const profile = CHEONGAN_PROFILES[ilgan];
  if (!profile) {
    throw new Error(`알 수 없는 일간: ${ilgan}`);
  }

  const axes: Axis[] = ['EI', 'SN', 'FT', 'PJ', 'DA'];
  const axisDetails: AxisDetail[] = [];
  let weightedSum = 0;
  let weightTotal = 0;
  const matchedAxes: string[] = [];
  const gapAxes: string[] = [];
  const greyZoneAxes: string[] = [];

  for (const axis of axes) {
    const score = spectrumScores[axis] || 0;
    const isCoreAxis = profile.coreAxes.includes(axis);
    const isGreyZone = Math.abs(score) <= GREY_ZONE_THRESHOLD;
    const spectrumDir: Direction = score >= 0 ? 'RIGHT' : 'LEFT';
    const sajuDir = profile.expectedDirections[axis];
    const isMatch = isGreyZone ? false : (spectrumDir === sajuDir);

    // 축별 점수 계산
    let axisScore: number;
    if (isGreyZone) {
      axisScore = GREY_ZONE_SCORE;
      greyZoneAxes.push(AXIS_LABELS[axis].name);
    } else if (isMatch) {
      axisScore = 50 + (Math.abs(score) / MAX_AXIS_SCORE) * 50;
      matchedAxes.push(AXIS_LABELS[axis].name);
    } else {
      axisScore = 50 - (Math.abs(score) / MAX_AXIS_SCORE) * 50;
      gapAxes.push(AXIS_LABELS[axis].name);
    }

    // 가중치 적용
    const weight = isCoreAxis ? CORE_AXIS_WEIGHT : NORMAL_AXIS_WEIGHT;
    weightedSum += axisScore * weight;
    weightTotal += weight;

    // 라벨 생성
    const sajuLabel = `${sajuDir === 'LEFT' ? AXIS_LABELS[axis].left : AXIS_LABELS[axis].right} (${profile.name} 특성)`;
    const spectrumLabel = `${spectrumDir === 'LEFT' ? AXIS_LABELS[axis].left : AXIS_LABELS[axis].right} (점수: ${score})`;

    axisDetails.push({
      axis,
      axisLabel: AXIS_LABELS[axis].name,
      sajuDirection: sajuDir,
      sajuLabel,
      spectrumDirection: spectrumDir,
      spectrumLabel,
      spectrumScore: score,
      isMatch,
      isGreyZone,
      isCoreAxis,
      axisScore: Math.round(axisScore)
    });
  }

  // 최종 점수
  const totalScore = Math.round(weightedSum / weightTotal);

  // 라벨 결정
  const { label, labelEn, emoji, summary } = getAlignmentLabel(totalScore);

  return {
    totalScore,
    label,
    labelEn,
    emoji,
    summary,
    axisDetails,
    matchedAxes,
    gapAxes,
    greyZoneAxes
  };
}

// ═══════════ 라벨 결정 ═══════════

function getAlignmentLabel(score: number): {
  label: string;
  labelEn: string;
  emoji: string;
  summary: string;
} {
  if (score >= 85) {
    return {
      label: '깊은 일치형',
      labelEn: 'Deep Alignment',
      emoji: '🟢',
      summary: '타고난 기질이 그대로 발현되고 있습니다. 선천적 강점을 더욱 깊이 발전시켜 나가세요.'
    };
  } else if (score >= 65) {
    return {
      label: '자연스러운 조화형',
      labelEn: 'Natural Harmony',
      emoji: '🔵',
      summary: '대체로 일치하며, 일부 영역에서 새로운 성장의 여지가 있습니다.'
    };
  } else if (score >= 45) {
    return {
      label: '보완형',
      labelEn: 'Complementary',
      emoji: '🟡',
      summary: '선천과 후천이 서로 보완하며, 성향의 폭을 넓히고 있습니다.'
    };
  } else {
    return {
      label: '전환형',
      labelEn: 'Transformed',
      emoji: '🟠',
      summary: '후천적 경험으로 기질이 크게 변화했습니다. 이 변화 속에 숨겨진 성장을 발견하세요.'
    };
  }
}

// ═══════════ 유틸리티 ═══════════

export function getCheonganProfile(ilgan: string): CheonganProfile | null {
  return CHEONGAN_PROFILES[ilgan] || null;
}

export function getExpectedTypeCode(ilgan: string): string | null {
  const profile = CHEONGAN_PROFILES[ilgan];
  if (!profile) return null;

  const dirs = profile.expectedDirections;
  return [
    dirs.EI === 'RIGHT' ? 'E' : 'I',
    dirs.SN === 'RIGHT' ? 'N' : 'S',
    dirs.FT === 'RIGHT' ? 'T' : 'F',
    dirs.PJ === 'RIGHT' ? 'J' : 'P',
    dirs.DA === 'RIGHT' ? 'A' : 'D',
  ].join('');
}

// ═══════════ Grey Zone 심화 분석 ═══════════

export interface GreyZoneAnalysis {
  overallInterpretation: string;    // 전체 해석
  greyZoneCount: number;
  greyZoneLabel: string;            // 확고한 성향 / 유연한 탐색가 / 자유로운 적응자
  details: GreyZoneDetail[];        // 축별 상세
  growthMessage: string;            // 성장 메시지
}

export interface GreyZoneDetail {
  axis: string;
  axisLabel: string;
  sajuExpected: string;             // 선천적으로 예상되는 방향
  interpretation: string;           // 교차 해석
  opportunity: string;              // 성장 기회
  isCoreAxis: boolean;
}

/**
 * Grey Zone 심화 분석
 * 사주(선천)와 교차하여 Grey Zone의 의미를 깊이 해석
 */
export function analyzeGreyZones(
  ilgan: string,
  spectrumScores: Record<string, number>
): GreyZoneAnalysis {
  const profile = CHEONGAN_PROFILES[ilgan];
  if (!profile) {
    return {
      overallInterpretation: '',
      greyZoneCount: 0,
      greyZoneLabel: '확고한 성향',
      details: [],
      growthMessage: ''
    };
  }

  const axes: Axis[] = ['EI', 'SN', 'FT', 'PJ', 'DA'];
  const details: GreyZoneDetail[] = [];

  for (const axis of axes) {
    const score = spectrumScores[axis] || 0;
    if (Math.abs(score) > GREY_ZONE_THRESHOLD) continue;

    const isCoreAxis = profile.coreAxes.includes(axis);
    const sajuDir = profile.expectedDirections[axis];
    const sajuLabel = sajuDir === 'LEFT' ? AXIS_LABELS[axis].left : AXIS_LABELS[axis].right;
    const oppositeLabel = sajuDir === 'LEFT' ? AXIS_LABELS[axis].right : AXIS_LABELS[axis].left;

    // 교차 해석 생성
    const interpretation = isCoreAxis
      ? `${profile.name}의 핵심 특성인 ${sajuLabel} 성향이 후천적으로 유연해졌습니다. 이는 ${oppositeLabel}의 장점도 흡수하며 성장했다는 의미입니다.`
      : `선천적으로 ${sajuLabel} 성향이지만, 경험을 통해 ${oppositeLabel}의 가치도 이해하게 되었습니다.`;

    const opportunity = isCoreAxis
      ? `이 축은 ${profile.name}의 핵심 영역입니다. 양쪽 모두를 활용할 수 있는 지금의 유연함은 큰 강점이에요. 상황에 따라 의식적으로 선택하는 연습을 하면 더 강력해집니다.`
      : `${sajuLabel}의 깊이와 ${oppositeLabel}의 넓이를 모두 갖출 수 있는 잠재력이 있어요. 다양한 환경에서 실험하며 나만의 최적점을 찾아보세요.`;

    details.push({
      axis,
      axisLabel: AXIS_LABELS[axis].name,
      sajuExpected: sajuLabel,
      interpretation,
      opportunity,
      isCoreAxis
    });
  }

  const greyZoneCount = details.length;

  // 개수별 전체 해석
  const { greyZoneLabel, overallInterpretation } = getOverallGreyZoneInterpretation(
    greyZoneCount, profile.name
  );

  // 성장 메시지
  const growthMessage = getGreyZoneGrowthMessage(greyZoneCount, details);

  return {
    overallInterpretation,
    greyZoneCount,
    greyZoneLabel,
    details,
    growthMessage
  };
}

function getOverallGreyZoneInterpretation(
  count: number,
  cheonganName: string
): { greyZoneLabel: string; overallInterpretation: string } {
  if (count === 0) {
    return {
      greyZoneLabel: '확고한 성향',
      overallInterpretation: `모든 축에서 뚜렷한 성향을 보이고 있습니다. ${cheonganName}의 선천적 기질이 후천적으로도 명확하게 자리잡았거나, 자신만의 확고한 방향을 형성한 상태입니다.`
    };
  } else if (count <= 2) {
    return {
      greyZoneLabel: '유연한 탐색가',
      overallInterpretation: `${count}개 영역에서 유연한 적응력을 보입니다. 대부분의 성향은 뚜렷하지만, 일부 영역에서 양쪽의 장점을 모두 활용할 수 있는 균형감각을 갖추고 있습니다. 이는 다양한 상황에 적응하면서 자연스럽게 키운 역량입니다.`
    };
  } else {
    return {
      greyZoneLabel: '자유로운 적응자',
      overallInterpretation: `${count}개 영역에서 Grey Zone이 감지되었습니다. 이는 후천적 경험이 풍부하여 다양한 상황에서 유연하게 대처할 수 있다는 뜻입니다. ${cheonganName}의 선천적 기질을 토대로, 고정된 틀을 넘어 자유롭게 성장하고 있습니다.`
    };
  }
}

function getGreyZoneGrowthMessage(count: number, details: GreyZoneDetail[]): string {
  if (count === 0) {
    return '뚜렷한 성향은 일관된 강점이 됩니다. 가끔 반대쪽 관점을 의도적으로 탐색하면 시야가 더 넓어질 수 있어요.';
  }

  const hasCoreGreyZone = details.some(d => d.isCoreAxis);

  if (hasCoreGreyZone) {
    const coreDetail = details.find(d => d.isCoreAxis)!;
    return `특히 ${coreDetail.axisLabel}은 당신의 핵심 특성 영역인데 Grey Zone에 있습니다. 이는 선천적 기질이 후천적 경험과 만나 더 넓은 스펙트럼으로 확장되고 있다는 뜻이에요. 이 유연함을 의식적으로 활용하면 다른 사람들이 갖지 못한 독보적인 강점이 됩니다.`;
  }

  return 'Grey Zone의 유연함은 다양한 환경에서 적응할 수 있는 잠재력입니다. 어떤 상황에서 어떤 모드가 더 편안한지 관찰하면서, 나만의 최적 패턴을 발견해보세요.';
}
