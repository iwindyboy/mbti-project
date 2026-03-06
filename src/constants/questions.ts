export type Axis = 'EI' | 'SN' | 'FT' | 'PJ' | 'DA';
export type TraitType = 'I' | 'E' | 'S' | 'N' | 'F' | 'T' | 'P' | 'J' | 'D' | 'A';

export interface Question {
  id: string;
  axis: Axis;
  axisLabel: string;
  text: string;
  direction: 'plus' | 'minus'; // +E, -I 등으로 명시
  measuredType: TraitType; // 이 질문이 측정하는 성향 (예: 'E', 'I', 'S', 'N' 등)
}

// 5개 그룹, 각 6문항씩 총 30개
export const questionGroups = [
  // Group 1. [에너지 방향] 타인과 함께일 때 vs 혼자일 때
  {
    groupNumber: 1,
    groupName: '에너지 방향',
    groupSubtitle: '타인과 함께일 때 vs 혼자일 때',
    questions: [
      {
        id: 'Q01',
        axis: 'EI' as const,
        axisLabel: '에너지 방향 (E/I)',
        text: '갑작스러운 모임 제안이나 약속이 생기면 기대되고 설레는 편이다.',
        direction: 'plus' as const, // +E
        measuredType: 'E' as const,
      },
      {
        id: 'Q02',
        axis: 'EI' as const,
        axisLabel: '에너지 방향 (E/I)',
        text: '시끄러운 환경에서는 집중하기 어렵고 조용한 곳을 선호한다.',
        direction: 'minus' as const, // -I
        measuredType: 'I' as const,
      },
      {
        id: 'Q03',
        axis: 'EI' as const,
        axisLabel: '에너지 방향 (E/I)',
        text: '낯선 사람에게 먼저 말을 거는 것이 어렵지 않다.',
        direction: 'plus' as const, // +E
        measuredType: 'E' as const,
      },
      {
        id: 'Q04',
        axis: 'EI' as const,
        axisLabel: '에너지 방향 (E/I)',
        text: '메시지를 보낼 때 문장을 여러 번 검토하고 신중하게 작성하는 편이다.',
        direction: 'minus' as const, // -I
        measuredType: 'I' as const,
      },
      {
        id: 'Q05',
        axis: 'EI' as const,
        axisLabel: '에너지 방향 (E/I)',
        text: '처음 만난 사람과도 빠르게 친해지고 대화를 이어갈 수 있다.',
        direction: 'plus' as const, // +E
        measuredType: 'E' as const,
      },
      {
        id: 'Q06',
        axis: 'EI' as const,
        axisLabel: '에너지 방향 (E/I)',
        text: '혼자만의 시간을 갖는 것이 진정한 휴식이라고 느낀다.',
        direction: 'minus' as const, // -I
        measuredType: 'I' as const,
      },
    ],
  },
  // Group 2. [정보 인식] 현실적 데이터 vs 미래의 가능성
  {
    groupNumber: 2,
    groupName: '정보 인식',
    groupSubtitle: '현실적 데이터 vs 미래의 가능성',
    questions: [
      {
        id: 'Q07',
        axis: 'SN' as const,
        axisLabel: '인식 방식 (S/N)',
        text: '무엇을 결정할 때 분위기나 느낌보다는 구체적인 정보와 사실을 먼저 확인하는 편이다.',
        direction: 'plus' as const, // +S
        measuredType: 'S' as const,
      },
      {
        id: 'Q08',
        axis: 'SN' as const,
        axisLabel: '인식 방식 (S/N)',
        text: '일상 중에도 미래의 가능성이나 상상의 시나리오를 자주 떠올린다.',
        direction: 'minus' as const, // -N
        measuredType: 'N' as const,
      },
      {
        id: 'Q09',
        axis: 'SN' as const,
        axisLabel: '인식 방식 (S/N)',
        text: '새로운 것을 배울 때 설명서보다 직접 만져보고 경험하며 익히는 쪽을 선호한다.',
        direction: 'plus' as const, // +S
        measuredType: 'S' as const,
      },
      {
        id: 'Q10',
        axis: 'SN' as const,
        axisLabel: '인식 방식 (S/N)',
        text: '"만약 ~라면 어떻게 될까?" 같은 가상의 상황이나 이론적인 주제를 다루는 대화를 즐긴다.',
        direction: 'minus' as const, // -N
        measuredType: 'N' as const,
      },
      {
        id: 'Q11',
        axis: 'SN' as const,
        axisLabel: '인식 방식 (S/N)',
        text: '\'적당히\'라는 말보다 \'정확히 몇 개\' 같은 명확한 기준이나 지시를 따를 때 마음이 편하다.',
        direction: 'plus' as const, // +S
        measuredType: 'S' as const,
      },
      {
        id: 'Q12',
        axis: 'SN' as const,
        axisLabel: '인식 방식 (S/N)',
        text: '작품이나 콘텐츠를 접한 뒤 그 안에 숨겨진 의미나 상징을 해석하는 것을 즐긴다.',
        direction: 'minus' as const, // -N
        measuredType: 'N' as const,
      },
    ],
  },
  // Group 3. [판단 근거] 논리적 사실 vs 감정적 공감
  {
    groupNumber: 3,
    groupName: '판단 근거',
    groupSubtitle: '논리적 사실 vs 감정적 공감',
    questions: [
      {
        id: 'Q13',
        axis: 'FT' as const,
        axisLabel: '결정 방식 (F/T)',
        text: '누군가 어려운 상황에 처했을 때, 실용적인 해결책보다 상대방의 감정과 안위를 먼저 걱정한다.',
        direction: 'plus' as const, // +F
        measuredType: 'F' as const,
      },
      {
        id: 'Q14',
        axis: 'FT' as const,
        axisLabel: '결정 방식 (F/T)',
        text: '문제가 발생했을 때 상대방의 감정보다 그 문제를 어떻게 해결할지가 더 중요하다.',
        direction: 'minus' as const, // -T
        measuredType: 'T' as const,
      },
      {
        id: 'Q15',
        axis: 'FT' as const,
        axisLabel: '결정 방식 (F/T)',
        text: '다른 사람이 억울하거나 불공평한 대우를 받는 모습을 보면 가슴이 답답하고 공감이 된다.',
        direction: 'plus' as const, // +F
        measuredType: 'F' as const,
      },
      {
        id: 'Q16',
        axis: 'FT' as const,
        axisLabel: '결정 방식 (F/T)',
        text: '누군가 조언을 구할 때 상대방의 기분을 상하게 하더라도 객관적이고 정확한 사실을 말하는 것이 중요하다고 생각한다.',
        direction: 'minus' as const, // -T
        measuredType: 'T' as const,
      },
      {
        id: 'Q17',
        axis: 'FT' as const,
        axisLabel: '결정 방식 (F/T)',
        text: '다른 사람이 어려워 보이면 내 이익보다 그 사람을 도와주는 것이 더 중요하다고 생각한다.',
        direction: 'plus' as const, // +F
        measuredType: 'F' as const,
      },
      {
        id: 'Q18',
        axis: 'FT' as const,
        axisLabel: '결정 방식 (F/T)',
        text: '감정적인 문제를 다룰 때도 논리적이고 객관적인 접근이 더 효과적이라고 생각한다.',
        direction: 'minus' as const, // -T
        measuredType: 'T' as const,
      },
    ],
  },
  // Group 4. [생활 양식] 즉흥적인 유연함 vs 계획적인 체계
  {
    groupNumber: 4,
    groupName: '생활 양식',
    groupSubtitle: '즉흥적인 유연함 vs 계획적인 체계',
    questions: [
      {
        id: 'Q19',
        axis: 'PJ' as const,
        axisLabel: '생활 방식 (P/J)',
        text: '무엇을 선택할 때 미리 정하기보다 그때그때 기분에 맞는 것을 고민하며 결정하는 편이다.',
        direction: 'plus' as const, // +P
        measuredType: 'P' as const,
      },
      {
        id: 'Q20',
        axis: 'PJ' as const,
        axisLabel: '생활 방식 (P/J)',
        text: '하루를 시작할 때 오늘 해야 할 일의 순서를 머릿속으로 미리 정리해두는 편이다.',
        direction: 'minus' as const, // -J
        measuredType: 'J' as const,
      },
      {
        id: 'Q21',
        axis: 'PJ' as const,
        axisLabel: '생활 방식 (P/J)',
        text: '물건이 어질러져 있어도 내가 찾는 게 어디 있는지만 안다면 굳이 정리하지 않아도 된다고 생각한다.',
        direction: 'plus' as const, // +P
        measuredType: 'P' as const,
      },
      {
        id: 'Q22',
        axis: 'PJ' as const,
        axisLabel: '생활 방식 (P/J)',
        text: '무엇을 준비할 때 필요한 것들을 리스트로 정리하고, 빠진 게 없는지 체크하는 편이다.',
        direction: 'minus' as const, // -J
        measuredType: 'J' as const,
      },
      {
        id: 'Q23',
        axis: 'PJ' as const,
        axisLabel: '생활 방식 (P/J)',
        text: '약속 시간에 미리 도착하기보다, 딱 맞춰 도착하거나 조금 늦어도 괜찮다고 생각한다.',
        direction: 'plus' as const, // +P
        measuredType: 'P' as const,
      },
      {
        id: 'Q24',
        axis: 'PJ' as const,
        axisLabel: '생활 방식 (P/J)',
        text: '읽지 않은 메시지나 처리하지 않은 일이 쌓여 있으면 빨리 정리해야 할 것 같은 압박을 느낀다.',
        direction: 'minus' as const, // -J
        measuredType: 'J' as const,
      },
    ],
  },
  // Group 5. [실행 속도] 신중한 검토 vs 과감한 시작
  {
    groupNumber: 5,
    groupName: '실행 속도',
    groupSubtitle: '신중한 검토 vs 과감한 시작',
    questions: [
      {
        id: 'Q25',
        axis: 'DA' as const,
        axisLabel: '행동 속도 (D/A)',
        text: '무엇을 구매하거나 결정할 때 여러 옵션을 비교하고 신중하게 검토한 후 결정하는 편이다.',
        direction: 'plus' as const, // +D
        measuredType: 'D' as const,
      },
      {
        id: 'Q26',
        axis: 'DA' as const,
        axisLabel: '행동 속도 (D/A)',
        text: '해보고 싶은 것이 생기면 완벽하게 준비하기보다 일단 시작해보는 편이다.',
        direction: 'minus' as const, // -A
        measuredType: 'A' as const,
      },
      {
        id: 'Q27',
        axis: 'DA' as const,
        axisLabel: '행동 속도 (D/A)',
        text: '새로운 도전을 할 때 성공 가능성보다 발생할 수 있는 리스크와 실패 시 대안을 먼저 고려한다.',
        direction: 'plus' as const, // +D
        measuredType: 'D' as const,
      },
      {
        id: 'Q28',
        axis: 'DA' as const,
        axisLabel: '행동 속도 (D/A)',
        text: '무엇을 선택할 때 오래 고민하기보다 빠르게 결정하고 바로 행동에 옮기는 편이다.',
        direction: 'minus' as const, // -A
        measuredType: 'A' as const,
      },
      {
        id: 'Q29',
        axis: 'DA' as const,
        axisLabel: '행동 속도 (D/A)',
        text: '중요한 일을 할 때 실수가 없는지 여러 번 확인하고 검토한 후 진행하는 편이다.',
        direction: 'plus' as const, // +D
        measuredType: 'D' as const,
      },
      {
        id: 'Q30',
        axis: 'DA' as const,
        axisLabel: '행동 속도 (D/A)',
        text: '완벽한 계획을 세우느라 시간을 보내기보다, 일단 시작하고 문제가 생기면 그때 해결하는 게 효율적이라고 생각한다.',
        direction: 'minus' as const, // -A
        measuredType: 'A' as const,
      },
    ],
  },
];

// 모든 질문을 평면 배열로도 제공 (하위 호환성)
export const questions = questionGroups.flatMap((group) => group.questions);
