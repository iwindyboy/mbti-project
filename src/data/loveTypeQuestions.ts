// ══════════════════════════════════════════════════════════════
//  SCAN ME — 연애 유형 검사 57문항 데이터 (v2)
//  
//  v2 변경사항:
//  - T1: 객관적 분석/논리 강조로 변경 (E와의 변별력 강화)
//  - Q44: 안정형 선택지를 구체화 (응답 편향 방지)
//  - Q57: 두 선택지를 가치중립적 표현으로 수정
//  
//  채점 규칙:
//  - 6점 리커트 척도 (1=전혀 아니다 ~ 6=매우 그렇다)
//  - 가중치: 핵심 1.5 / 일반 1.0 / 역문항 1.2 / 결정 2.0
//  
//  점수 계산 공식:
//  - 정문항: 응답값 × 가중치
//  - 역문항: (7 - 응답값) × 가중치  ← ★ 중요
//  - 결정문항: 선택된 유형에 6 × 2.0 = 12점 부여
// ══════════════════════════════════════════════════════════════

export type LoveAxis = 'temperament' | 'attachment' | 'conflict';

export type TemperamentType = 'D' | 'S' | 'T' | 'E';
export type AttachmentType = 'SE' | 'AN' | 'AV';
export type ConflictType = 'CF' | 'ID';
export type LoveSubType = TemperamentType | AttachmentType | ConflictType;

export type QuestionRole = 'core' | 'normal' | 'reverse' | 'decisive';

export interface LoveQuestion {
  id: string;
  axis: LoveAxis;
  type?: LoveSubType;
  role: QuestionRole;
  weight: number;
  text: string;
  options?: DecisiveOption[];
}

export interface DecisiveOption {
  label: string;
  type: LoveSubType;
}

export const LIKERT_LABELS = [
  '전혀 그렇지 않다',
  '그렇지 않다',
  '약간 그렇지 않다',
  '약간 그렇다',
  '그렇다',
  '매우 그렇다',
];

export const SCALE_MIN = 1;
export const SCALE_MAX = 6;

export const WEIGHTS = {
  core: 1.5,
  normal: 1.0,
  reverse: 1.2,
  decisive: 2.0,
} as const;

export const LOVE_QUESTIONS: LoveQuestion[] = [
  // 🔥 도파민형 (D)
  { id: 'D1', axis: 'temperament', type: 'D', role: 'core', weight: 1.5,
    text: '평일 저녁 8시쯤 사랑하는 사람이 "지금 바다 보러 갈래?"라고 하면, 피곤해도 망설임 없이 따라나선다.' },
  { id: 'D2', axis: 'temperament', type: 'D', role: 'normal', weight: 1.0,
    text: '자주 가던 데이트 코스가 3~4번 반복되면, 슬쩍 지루해진다.' },
  { id: 'D3', axis: 'temperament', type: 'D', role: 'normal', weight: 1.0,
    text: '모범생 스타일보다 자기만의 독특한 매력(취미, 패션, 취향)을 가진 사람이 훨씬 끌린다.' },
  { id: 'D4', axis: 'temperament', type: 'D', role: 'normal', weight: 1.0,
    text: '안정적인 연애여도 가끔은 새로운 자극이 필요하다고 느낀다.' },
  { id: 'D5', axis: 'temperament', type: 'D', role: 'reverse', weight: 1.2,
    text: '익숙하고 편안한 일상이 새로운 모험보다 훨씬 좋다.' },
  { id: 'D6', axis: 'temperament', type: 'D', role: 'reverse', weight: 1.2,
    text: '매번 같은 코스로 데이트해도 전혀 지루하지 않다.' },

  // 🌸 세로토닌형 (S)
  { id: 'S1', axis: 'temperament', type: 'S', role: 'core', weight: 1.5,
    text: '매일 아침 같은 시간에 "잘 잤어?" 톡이 오는 한결같음이, 화려한 이벤트보다 더 큰 사랑처럼 느껴진다.' },
  { id: 'S2', axis: 'temperament', type: 'S', role: 'normal', weight: 1.0,
    text: '주말 데이트는 미리 코스를 정하고 예약까지 끝내야 마음이 놓인다.' },
  { id: 'S3', axis: 'temperament', type: 'S', role: 'normal', weight: 1.0,
    text: '약속 시간에 5분만 늦어도 미리 연락해주는 사람을 보면, "이 사람 진짜 믿음직하다"는 마음이 든다.' },
  { id: 'S4', axis: 'temperament', type: 'S', role: 'normal', weight: 1.0,
    text: '100일, 1주년 같은 기념일을 잊지 않고 챙겨주는 사람에게 깊이 끌린다.' },
  { id: 'S5', axis: 'temperament', type: 'S', role: 'reverse', weight: 1.2,
    text: '매일 똑같은 패턴보다는 변화가 있는 일상이 좋다.' },
  { id: 'S6', axis: 'temperament', type: 'S', role: 'reverse', weight: 1.2,
    text: '약속이 갑자기 바뀌어도 크게 신경 쓰이지 않는다.' },

  // ⚡ 테스토스테론형 (T) - T1 v2 수정
  { id: 'T1', axis: 'temperament', type: 'T', role: 'core', weight: 1.5,
    text: '연인이 감정에 치우치기보다 상황을 객관적으로 분석해서 말해줄 때, "이 사람 진짜 믿을 만하다"는 신뢰감이 든다.' },
  { id: 'T2', axis: 'temperament', type: 'T', role: 'normal', weight: 1.0,
    text: '연인이 "그냥 기분이 안 좋아"라고만 말하기보다 "이래서 이래서 속상했어"라고 이유를 말해주는 게 훨씬 와닿는다.' },
  { id: 'T3', axis: 'temperament', type: 'T', role: 'normal', weight: 1.0,
    text: '연인이 자기 일에 몰입해서 새벽까지 작업하는 모습을 보면, 피곤해 보여도 멋있다는 생각이 든다.' },
  { id: 'T4', axis: 'temperament', type: 'T', role: 'normal', weight: 1.0,
    text: '주변 의견에 휘둘리지 않고 자기만의 기준으로 결정하는 연인에게 끌린다.' },
  { id: 'T5', axis: 'temperament', type: 'T', role: 'reverse', weight: 1.2,
    text: '연인과의 관계에서 논리적 분석보다 따뜻한 공감이 훨씬 중요하다.' },
  { id: 'T6', axis: 'temperament', type: 'T', role: 'reverse', weight: 1.2,
    text: '연인과의 관계에서 머리보다 마음이 우선이다.' },

  // 💗 에스트로겐형 (E)
  { id: 'E1', axis: 'temperament', type: 'E', role: 'core', weight: 1.5,
    text: '연인이 카페에 들어와서 자리에 앉는 순간, 표정만 봐도 "오늘 무슨 일 있었구나"를 바로 알아챈다.' },
  { id: 'E2', axis: 'temperament', type: 'E', role: 'normal', weight: 1.0,
    text: '퇴근 후 연인과 "오늘 회사에서 이런 일 있었어"라며 시시콜콜한 일상을 나누는 시간이 가장 행복하다.' },
  { id: 'E3', axis: 'temperament', type: 'E', role: 'normal', weight: 1.0,
    text: '일일이 말하지 않아도 내 컨디션을 알아채고 조용히 챙겨주는 연인이 진짜 이상형이다.' },
  { id: 'E4', axis: 'temperament', type: 'E', role: 'normal', weight: 1.0,
    text: '비 오는 날 분위기 좋은 카페에서 도란도란 나누는 깊은 대화가 화려한 이벤트보다 훨씬 좋다.' },
  { id: 'E5', axis: 'temperament', type: 'E', role: 'reverse', weight: 1.2,
    text: '연인의 감정에 깊이 공감하기보다 객관적 조언을 해주는 편이다.' },
  { id: 'E6', axis: 'temperament', type: 'E', role: 'reverse', weight: 1.2,
    text: '연인과 감정적 교감보다 함께하는 활동(취미, 운동 등)이 더 중요하다.' },

  // 🎯 기질 결정문항
  { id: 'Q25', axis: 'temperament', role: 'decisive', weight: 2.0,
    text: '연애에서 절대 포기할 수 없는 단 한 가지를 고른다면?',
    options: [
      { label: '새로운 경험과 설렘', type: 'D' },
      { label: '한결같은 안정감과 신뢰', type: 'S' },
      { label: '깊이 있는 대화와 서로의 성장', type: 'T' },
      { label: '따뜻한 감정 교감과 깊은 유대감', type: 'E' },
    ]
  },

  // 🌳 안정형 (SE)
  { id: 'SE1', axis: 'attachment', type: 'SE', role: 'core', weight: 1.5,
    text: '연인이 친구들과 1박 2일 여행을 간다고 하면, "잘 다녀와" 하고 자연스럽게 보낼 수 있다.' },
  { id: 'SE2', axis: 'attachment', type: 'SE', role: 'normal', weight: 1.0,
    text: '회사에서 힘든 일이 있을 때 연인에게 "오늘 좀 위로해줘"라고 솔직하게 부탁할 수 있다.' },
  { id: 'SE3', axis: 'attachment', type: 'SE', role: 'normal', weight: 1.0,
    text: '연인의 별난 취미나 습관도 있는 그대로 받아들이는 편이다.' },
  { id: 'SE4', axis: 'attachment', type: 'SE', role: 'normal', weight: 1.0,
    text: '연인과 다툰 후에도 우리 관계가 흔들릴 거라는 불안은 없다.' },
  { id: 'SE5', axis: 'attachment', type: 'SE', role: 'reverse', weight: 1.2,
    text: '연인의 사소한 말과 행동에 자주 마음에 걸린다.' },
  { id: 'SE6', axis: 'attachment', type: 'SE', role: 'reverse', weight: 1.2,
    text: '연인에게 약한 모습을 보이는 게 부담스럽다.' },

  // 🌷 불안형 (AN)
  { id: 'AN1', axis: 'attachment', type: 'AN', role: 'core', weight: 1.5,
    text: '연인이 30분 넘게 답장이 없으면, 마음이 살짝 불안해진다.' },
  { id: 'AN2', axis: 'attachment', type: 'AN', role: 'normal', weight: 1.0,
    text: '연인의 미묘한 말투 변화에도 "내가 뭐 잘못했나?" 싶어진다.' },
  { id: 'AN3', axis: 'attachment', type: 'AN', role: 'normal', weight: 1.0,
    text: '"사랑해"라는 말을 자주 듣고 싶다.' },
  { id: 'AN4', axis: 'attachment', type: 'AN', role: 'normal', weight: 1.0,
    text: '관계가 너무 평온하면 오히려 "이게 진짜일까?" 의심이 든다.' },
  { id: 'AN5', axis: 'attachment', type: 'AN', role: 'reverse', weight: 1.2,
    text: '연인의 답장이 늦어도 "바쁜가 보다" 하고 넘어간다.' },
  { id: 'AN6', axis: 'attachment', type: 'AN', role: 'reverse', weight: 1.2,
    text: '연인의 사랑을 굳이 자주 확인하지 않아도 된다.' },

  // 🌬️ 회피형 (AV)
  { id: 'AV1', axis: 'attachment', type: 'AV', role: 'core', weight: 1.5,
    text: '연인과 매일 통화하거나 자주 만나다 보면, 숨이 막히는 느낌이 들 때가 있다.' },
  { id: 'AV2', axis: 'attachment', type: 'AV', role: 'normal', weight: 1.0,
    text: '연인이 "우리 진지하게 미래 얘기 좀 하자"고 하면, 살짝 부담스러워진다.' },
  { id: 'AV3', axis: 'attachment', type: 'AV', role: 'normal', weight: 1.0,
    text: '연애 중이어도 일주일에 며칠은 혼자만의 시간이 꼭 필요하다.' },
  { id: 'AV4', axis: 'attachment', type: 'AV', role: 'normal', weight: 1.0,
    text: '내 속마음을 연인에게 털어놓는 게 꺼려지는 편이다.' },
  { id: 'AV5', axis: 'attachment', type: 'AV', role: 'reverse', weight: 1.2,
    text: '연인과 깊은 감정을 나누는 시간이 가장 행복하다.' },
  { id: 'AV6', axis: 'attachment', type: 'AV', role: 'reverse', weight: 1.2,
    text: '연인과 더 가까워지는 게 늘 즐겁고 설렌다.' },

  // 🎯 애착 결정문항 - Q44 v2 수정
  { id: 'Q44', axis: 'attachment', role: 'decisive', weight: 2.0,
    text: '연애에서 가장 두려운 상황 단 하나를 고른다면?',
    options: [
      { label: '연인과 단단히 연결되어 있다는 믿음이 흔들리는 것', type: 'SE' },
      { label: '연인의 마음이 식어 멀어지는 것', type: 'AN' },
      { label: '연인의 의존이 깊어져 내 자유가 사라지는 것', type: 'AV' },
    ]
  },

  // ⚔️ 직면형 (CF)
  { id: 'CF1', axis: 'conflict', type: 'CF', role: 'core', weight: 1.5,
    text: '연인에게 서운한 일이 있으면 그날 안에 이야기해야 마음이 풀린다.' },
  { id: 'CF2', axis: 'conflict', type: 'CF', role: 'normal', weight: 1.0,
    text: '갈등 상황에서 "지금 이 부분이 문제야"라고 명확히 짚어주는 편이다.' },
  { id: 'CF3', axis: 'conflict', type: 'CF', role: 'normal', weight: 1.0,
    text: '연인이 같은 실수를 반복하면, 다음번엔 더 단호하게 말한다.' },
  { id: 'CF4', axis: 'conflict', type: 'CF', role: 'normal', weight: 1.0,
    text: '속마음을 숨기고 "괜찮아"라고 말하는 건 답답하고 비효율적이다.' },
  { id: 'CF5', axis: 'conflict', type: 'CF', role: 'reverse', weight: 1.2,
    text: '불편한 이야기는 가능하면 입 밖으로 꺼내지 않으려 한다.' },
  { id: 'CF6', axis: 'conflict', type: 'CF', role: 'reverse', weight: 1.2,
    text: '연인의 잘못이 보여도 굳이 말하지 않고 마음으로 삭이는 편이다.' },

  // 🌊 우회형 (ID)
  { id: 'ID1', axis: 'conflict', type: 'ID', role: 'core', weight: 1.5,
    text: '연인과 갈등이 생기면, 감정이 가라앉을 때까지 거리를 둔다.' },
  { id: 'ID2', axis: 'conflict', type: 'ID', role: 'normal', weight: 1.0,
    text: '직접적인 말보다 분위기, 표정, 행동으로 마음을 표현하는 편이다.' },
  { id: 'ID3', axis: 'conflict', type: 'ID', role: 'normal', weight: 1.0,
    text: '갈등을 풀 때 "타이밍"이 가장 중요하다고 생각한다.' },
  { id: 'ID4', axis: 'conflict', type: 'ID', role: 'normal', weight: 1.0,
    text: '"네 입장에서는 그럴 수 있겠다"라며 일단 받아주는 게 우선이다.' },
  { id: 'ID5', axis: 'conflict', type: 'ID', role: 'reverse', weight: 1.2,
    text: '서운하면 즉시 표현해야 속이 시원하다.' },
  { id: 'ID6', axis: 'conflict', type: 'ID', role: 'reverse', weight: 1.2,
    text: '갈등은 미루지 않고 그 자리에서 빠르게 해결해야 한다.' },

  // 🎯 갈등 결정문항 - Q57 v2 수정
  { id: 'Q57', axis: 'conflict', role: 'decisive', weight: 2.0,
    text: '연인과 다툰 직후, 당신이 가장 먼저 하는 행동은?',
    options: [
      { label: '어떤 상황이든 원인을 바로 짚고 넘어가는 것', type: 'CF' },
      { label: '분위기가 더 나빠지기 전에 한 템포 쉬어가는 것', type: 'ID' },
    ]
  },
];

export function validateQuestions(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (LOVE_QUESTIONS.length !== 57) {
    errors.push(`총 문항 수가 57개가 아닙니다: ${LOVE_QUESTIONS.length}개`);
  }

  const ids = LOVE_QUESTIONS.map(q => q.id);
  if (ids.length !== new Set(ids).size) {
    errors.push('중복된 문항 ID가 있습니다');
  }

  const expectedCounts: Record<string, number> = {
    'D': 6, 'S': 6, 'T': 6, 'E': 6,
    'SE': 6, 'AN': 6, 'AV': 6,
    'CF': 6, 'ID': 6,
  };

  for (const [type, expected] of Object.entries(expectedCounts)) {
    const actual = LOVE_QUESTIONS.filter(q => q.type === type).length;
    if (actual !== expected) {
      errors.push(`${type} 유형 문항 수 불일치: 예상 ${expected}, 실제 ${actual}`);
    }
  }

  const decisiveCount = LOVE_QUESTIONS.filter(q => q.role === 'decisive').length;
  if (decisiveCount !== 3) {
    errors.push(`결정문항 수 불일치: 예상 3, 실제 ${decisiveCount}`);
  }

  return { valid: errors.length === 0, errors };
}

export function getQuestionsByAxis(axis: LoveAxis): LoveQuestion[] {
  return LOVE_QUESTIONS.filter(q => q.axis === axis);
}

export function getQuestionsByType(type: LoveSubType): LoveQuestion[] {
  return LOVE_QUESTIONS.filter(q => q.type === type);
}

export function getQuestionById(id: string): LoveQuestion | undefined {
  return LOVE_QUESTIONS.find(q => q.id === id);
}
