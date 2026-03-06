import { CalculateResult, AxisAnalysis } from './calculate';

// 축별 라벨 매핑
const axisLabels: Record<string, { left: string; right: string; leftFull: string; rightFull: string }> = {
  EI: {
    left: 'I',
    right: 'E',
    leftFull: '내향형',
    rightFull: '외향형',
  },
  SN: {
    left: 'S',
    right: 'N',
    leftFull: '감각형',
    rightFull: '직관형',
  },
  FT: {
    left: 'F',
    right: 'T',
    leftFull: '감정형',
    rightFull: '사고형',
  },
  PJ: {
    left: 'P',
    right: 'J',
    leftFull: '인식형',
    rightFull: '판단형',
  },
  DA: {
    left: 'D',
    right: 'A',
    leftFull: '신중형',
    rightFull: '실행형',
  },
};

// Grey Zone 특별 문구 매핑
const greyZoneMessages: Record<string, string> = {
  EI: "당신은 외향과 내향의 균형을 완벽하게 맞춘 '양방향성(Ambivert)' 유형입니다. 상황에 따라 에너지를 발산할 줄도, 스스로 충전할 줄도 아는 유연한 사회적 지능을 가졌습니다. 특정 환경에 매몰되지 않는 것이 당신의 가장 큰 무기입니다.",
  SN: "당신은 감각과 직관의 경계를 넘나드는 '통합적 인식자' 유형입니다. 구체적 사실과 추상적 가능성을 모두 포용하는 독특한 인식 방식을 가지고 있습니다. 현실과 이상을 동시에 추구하는 당신만의 통찰력이 있습니다.",
  FT: "당신은 감정과 사고의 균형을 갖춘 '균형적 결정자' 유형입니다. 논리적 분석과 인간적 가치를 모두 고려하는 통합적 사고 방식을 가지고 있습니다. 냉철함과 따뜻함을 동시에 발휘할 수 있는 당신의 판단력이 강점입니다.",
  PJ: "당신은 계획과 유연성을 모두 갖춘 '적응적 조직자' 유형입니다. 구조화된 접근과 자유로운 탐색을 상황에 맞게 조절하는 능력을 가지고 있습니다. 계획성과 유연성을 모두 활용하는 것이 당신의 특징입니다.",
  DA: "당신은 신중함과 실행력을 모두 갖춘 '균형적 행동가' 유형입니다. 신중한 검토와 빠른 실행 사이의 최적 지점을 찾아내는 능력을 가지고 있습니다. 신중함과 추진력을 상황에 맞게 발휘하는 것이 당신의 강점입니다.",
};

// 프리미엄 리포트 문구 생성
export const getPremiumAxisMessage = (
  axis: string,
  analysis: AxisAnalysis,
  score: number
): { basic: string; premium: string } => {
  const labels = axisLabels[axis];
  if (!labels) {
    return {
      basic: `당신은 ${axis} 축에서 ${score}점입니다.`,
      premium: `당신은 ${axis} 축에서 ${score}점입니다.`,
    };
  }

  // 기본 문구
  let basicMessage = '';
  if (analysis === 'STRONG_POSITIVE') {
    basicMessage = `당신은 ${labels.rightFull}(${labels.right})입니다.`;
  } else if (analysis === 'STRONG_NEGATIVE') {
    basicMessage = `당신은 ${labels.leftFull}(${labels.left})입니다.`;
  } else {
    // GRAY_ZONE
    basicMessage = `당신은 ${labels.leftFull}과 ${labels.rightFull}의 중간 성향입니다.`;
  }

  // 프리미엄 문구 (Grey Zone인 경우 특별 문구 사용)
  let premiumMessage = '';
  if (analysis === 'GRAY_ZONE') {
    premiumMessage = greyZoneMessages[axis] || basicMessage;
  } else {
    // 강한 성향인 경우 기본 문구와 동일 (향후 확장 가능)
    premiumMessage = basicMessage;
  }

  return {
    basic: basicMessage,
    premium: premiumMessage,
  };
};

// 전체 프리미엄 리포트 생성
export const generatePremiumReport = (result: CalculateResult): {
  axes: Array<{
    axis: string;
    label: string;
    basic: string;
    premium: string;
    isGreyZone: boolean;
  }>;
} => {
  const axisLabelsMap: Record<string, string> = {
    EI: '에너지 방향 (E/I)',
    SN: '인식 방식 (S/N)',
    FT: '결정 방식 (F/T)',
    PJ: '생활 방식 (P/J)',
    DA: '행동 속도 (D/A)',
  };

  const axes = ['EI', 'SN', 'FT', 'PJ', 'DA'].map((axis) => {
    const analysis = result.axisAnalysis[axis];
    const score = result.scores[axis];
    const isGreyZone = result.isGrayZone[axis];
    const messages = getPremiumAxisMessage(axis, analysis, score);

    return {
      axis,
      label: axisLabelsMap[axis] || axis,
      basic: messages.basic,
      premium: messages.premium,
      isGreyZone,
    };
  });

  return { axes };
};
