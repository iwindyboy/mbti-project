// 답변 데이터 구조 정의
export interface Answer {
  questionId: string;
  score: number; // 1~6점 (L3:1, L2:2, L1:3, R1:4, R2:5, R3:6)
}

export interface GreyZoneInfo {
  axis: string; // 'EI', 'SN', 'FT', 'PJ', 'DA'
  score: number; // 실제 점수 (-12 ~ +12)
}

export type AxisAnalysis = 'STRONG_POSITIVE' | 'STRONG_NEGATIVE' | 'GRAY_ZONE';

export interface CalculateResult {
  typeCode: string; // 예: "ISFJA"
  scores: Record<string, number>; // 각 축당 totalDiff (rightSum - leftSum)
  leftSums: Record<string, number>; // 각 축당 좌측 성향 점수 합계
  rightSums: Record<string, number>; // 각 축당 우측 성향 점수 합계
  summary: {
    isExtrovert: boolean;
    isSensing: boolean;
    isFeeling: boolean;
    isPerceiving: boolean;
    isDeliberate: boolean;
  };
  greyZones: GreyZoneInfo[]; // Grey Zone에 해당하는 축들
  badge: string | null; // Grey Zone 배지 텍스트 (예: "Flexible Adapter")
  axisAnalysis: Record<string, AxisAnalysis>; // 각 축별 상세 분석
  isGrayZone: Record<string, boolean>; // 각 축별 Grey Zone 여부
}

// 주석: 이전 매핑 함수는 더 이상 사용하지 않음
// 새로운 로직은 버튼 값(1~7)을 직접 좌우 점수로 변환

// 상세 분석 함수 (각 축별 성향 강도 판정)
// totalDiff 기준: 편차 절댓값이 3 이하면 Grey Zone
export const getDetailedAnalysis = (totalDiff: number): AxisAnalysis => {
  if (totalDiff > 3) return 'STRONG_POSITIVE'; // 매우 뚜렷한 우측 성향 (E, S, F, P, D)
  if (totalDiff < -3) return 'STRONG_NEGATIVE'; // 매우 뚜렷한 좌측 성향 (I, N, T, J, A)
  return 'GRAY_ZONE'; // 유연한/중립적 성향 (편차 절댓값 <= 3)
};

export const calculateScanResult = (answers: Answer[], questions: any[]): CalculateResult => {
  // 입력 데이터 검증
  if (!answers || answers.length === 0) {
    console.error('calculateScanResult: answers is empty');
    throw new Error('답변 데이터가 없습니다.');
  }
  if (!questions || questions.length === 0) {
    console.error('calculateScanResult: questions is empty');
    throw new Error('질문 데이터가 없습니다.');
  }

  // 1. 각 축별 성향별 점수 초기화
  // ResultPage의 좌우 매핑:
  // - EI: left='I', right='E'
  // - SN: left='S', right='N'
  // - FT: left='F', right='T'
  // - PJ: left='P', right='J'
  // - DA: left='D', right='A'
  const leftSums: Record<string, number> = { EI: 0, SN: 0, FT: 0, PJ: 0, DA: 0 };
  const rightSums: Record<string, number> = { EI: 0, SN: 0, FT: 0, PJ: 0, DA: 0 };
  const counts: Record<string, number> = { EI: 0, SN: 0, FT: 0, PJ: 0, DA: 0 };

  // 2. 각 축별 성향 매핑 (ResultPage 기준)
  const axisTraitMap: Record<string, { left: string; right: string }> = {
    'EI': { left: 'I', right: 'E' },
    'SN': { left: 'S', right: 'N' },
    'FT': { left: 'F', right: 'T' },
    'PJ': { left: 'P', right: 'J' },
    'DA': { left: 'D', right: 'A' },
  };

  // 3. 문항별 성향별 점수 합산 로직
  answers.forEach((ans) => {
    if (!ans || !ans.questionId || ans.score === undefined || ans.score === null) {
      console.warn('calculateScanResult: Invalid answer', ans);
      return;
    }

    const q = questions.find((item) => item.id === ans.questionId);
    if (!q) {
      console.warn('calculateScanResult: Question not found for', ans.questionId);
      return;
    }

    if (!q.axis || !q.measuredType) {
      console.warn('calculateScanResult: Question missing axis or measuredType', q);
      return;
    }

    // 6단계 척도: 버튼 [L3, L2, L1, R1, R2, R3] = 내부 값 [1, 2, 3, 4, 5, 6]
    // 배점 로직: 버튼 위치에 따라 해당 성향의 합산 변수에 1~3점씩 더함
    // 버튼 1(L3): 좌측 성향 3점, 버튼 2(L2): 좌측 성향 2점, 버튼 3(L1): 좌측 성향 1점
    // 버튼 4(R1): 우측 성향 1점, 버튼 5(R2): 우측 성향 2점, 버튼 6(R3): 우측 성향 3점
    // 중립(0) 버튼 제거 - 모든 문항은 반드시 최소 1점 이상의 방향성을 가짐
    const getButtonScore = (score: number): { leftScore: number; rightScore: number } => {
      if (score <= 3) {
        // 왼쪽 버튼(1,2,3): 좌측 성향 점수 (3점, 2점, 1점)
        return { leftScore: 4 - score, rightScore: 0 }; // 1->3, 2->2, 3->1
      } else {
        // 오른쪽 버튼(4,5,6): 우측 성향 점수 (1점, 2점, 3점)
        return { leftScore: 0, rightScore: score - 3 }; // 4->1, 5->2, 6->3
      }
    };
    
    const { leftScore, rightScore } = getButtonScore(ans.score);
    
    // 질문이 측정하는 성향(measuredType)에 따라 점수를 해당 성향에 직접 합산
    // direction은 질문의 긍정/부정 표현 방식을 나타내지만, 
    // 실제 점수는 measuredType과 버튼 선택에 따라 결정됨
    // - 우측 버튼(매우 그렇다) 선택 → measuredType 성향에 점수 추가
    // - 좌측 버튼(매우 아니다) 선택 → 반대 성향에 점수 추가
    
    const axisTraits = axisTraitMap[q.axis];
    if (!axisTraits) {
      console.warn('calculateScanResult: Unknown axis', q.axis);
      return;
    }
    
    // measuredType에 따라 점수 배분
    if (q.measuredType === axisTraits.left) {
      // 좌측 성향을 측정하는 질문 (I, S, F, P, D)
      // 우측 버튼 선택(매우 그렇다) → 좌측 성향에 점수 추가
      // 좌측 버튼 선택(매우 아니다) → 우측 성향에 점수 추가
      leftSums[q.axis] += rightScore;  // 우측 버튼 → 좌측 성향
      rightSums[q.axis] += leftScore;   // 좌측 버튼 → 우측 성향
    } else if (q.measuredType === axisTraits.right) {
      // 우측 성향을 측정하는 질문 (E, N, T, J, A)
      // 우측 버튼 선택(매우 그렇다) → 우측 성향에 점수 추가
      // 좌측 버튼 선택(매우 아니다) → 좌측 성향에 점수 추가
      rightSums[q.axis] += rightScore;  // 우측 버튼 → 우측 성향
      leftSums[q.axis] += leftScore;   // 좌측 버튼 → 좌측 성향
    } else {
      console.warn('calculateScanResult: measuredType does not match axis traits', q);
    }
    
    counts[q.axis] += 1;
  });

  // 3. 각 축별 편차 계산 (totalDiff = rightSum - leftSum)
  const totals: Record<string, number> = {};
  const axisKeys = ['EI', 'SN', 'FT', 'PJ', 'DA'];
  axisKeys.forEach((axis) => {
    totals[axis] = rightSums[axis] - leftSums[axis];
  });

  // 디버깅: 각 축별 점수 확인
  console.log('calculateScanResult: leftSums =', leftSums);
  console.log('calculateScanResult: rightSums =', rightSums);
  console.log('calculateScanResult: totals (totalDiff) =', totals);
  console.log('calculateScanResult: counts =', counts);

  // 4. 최종 유형 코드 판정 (totalDiff 기준)
  // totalDiff = rightSum - leftSum
  // ResultPage의 좌우 매핑 기준:
  // - EI: left='I', right='E' → totals['EI'] > 0이면 E
  // - SN: left='S', right='N' → totals['SN'] > 0이면 N
  // - FT: left='F', right='T' → totals['FT'] > 0이면 T
  // - PJ: left='P', right='J' → totals['PJ'] > 0이면 J
  // - DA: left='D', right='A' → totals['DA'] > 0이면 A
  const typeCode = [
    totals['EI'] > 0 ? 'E' : 'I',
    totals['SN'] > 0 ? 'N' : 'S',
    totals['FT'] > 0 ? 'T' : 'F',
    totals['PJ'] > 0 ? 'J' : 'P',
    totals['DA'] > 0 ? 'A' : 'D',
  ].join('');

  // typeCode 검증
  if (!typeCode || typeCode.length !== 5) {
    console.error('calculateScanResult: Invalid typeCode generated', typeCode, totals);
    throw new Error(`유형 코드 생성 실패: ${typeCode}`);
  }

  console.log('calculateScanResult: Generated typeCode =', typeCode);

  // 5. Grey Zone 감지 로직 (편차 절댓값 <= 3)
  const greyZones: GreyZoneInfo[] = [];
  const axisAnalysis: Record<string, AxisAnalysis> = {};
  const isGrayZone: Record<string, boolean> = {};

  axisKeys.forEach((axis) => {
    const totalDiff = totals[axis];
    
    // 상세 분석 저장
    const analysis = getDetailedAnalysis(totalDiff);
    axisAnalysis[axis] = analysis;
    
    // Grey Zone 판정: 편차 절댓값이 3 이하
    const isGrey = Math.abs(totalDiff) <= 3;
    isGrayZone[axis] = isGrey;
    
    if (isGrey) {
      greyZones.push({
        axis,
        score: totalDiff,
      });
    }
  });

  // 5. Grey Zone 배지 생성
  const getBadgeText = (greyZones: GreyZoneInfo[]): string | null => {
    if (greyZones.length === 0) return null;
    
    // Grey Zone이 1개 이상이면 배지 표시
    // 배지 텍스트는 Grey Zone 개수에 따라 다르게 표시
    const badgeMap: Record<number, string> = {
      1: 'Flexible Adapter',
      2: 'Balanced Explorer',
      3: 'Adaptive Navigator',
      4: 'Versatile Harmonizer',
      5: 'Universal Adapter',
    };
    
    return badgeMap[greyZones.length] || 'Flexible Adapter';
  };

  const badge = getBadgeText(greyZones);

  return {
    typeCode, // 예: "ISFJA"
    scores: totals, // 각 축당 totalDiff (rightSum - leftSum)
    leftSums, // 각 축당 좌측 성향 점수 합계
    rightSums, // 각 축당 우측 성향 점수 합계
    summary: {
      isExtrovert: totals['EI'] > 0, // E 성향
      isSensing: totals['SN'] <= 0, // S 성향 (totals['SN'] > 0이면 N이므로)
      isFeeling: totals['FT'] <= 0, // F 성향 (totals['FT'] > 0이면 T이므로)
      isPerceiving: totals['PJ'] <= 0, // P 성향 (totals['PJ'] > 0이면 J이므로)
      isDeliberate: totals['DA'] <= 0, // D 성향 (totals['DA'] > 0이면 A이므로)
    },
    greyZones, // Grey Zone에 해당하는 축들
    badge, // Grey Zone 배지 텍스트
    axisAnalysis, // 각 축별 상세 분석
    isGrayZone, // 각 축별 Grey Zone 여부
  };
};
