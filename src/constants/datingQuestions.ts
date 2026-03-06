// 시나리오 질문 인터페이스
export interface ScenarioQuestion {
  id: number; // Q1~Q10
  text: string;
  options: {
    value: string; // A~F
    label: string;
    type: string; // 확인형, 몰입형, 신중형, 균형형, 기준형, 자유공감형
  }[];
}

// 랭킹 질문 인터페이스
export interface RankingQuestion {
  id: number; // R1~R5
  title: string;
  category: string; // 감정, 가치관, 연애방식, 커뮤니케이션, 니즈
  items: {
    id: string; // 고유 ID
    label: string;
    type: string; // 확인형, 몰입형, 신중형, 균형형, 기준형, 자유공감형
  }[];
}

// 시나리오 질문 Q1~Q10
export const scenarioQuestions: ScenarioQuestion[] = [
  {
    id: 1,
    text: '남자친구에게 하루 종일 연락이 없다면, 당신은?',
    options: [
      { value: 'A', label: '바로 전화해서 무슨 일인지 확인한다.', type: '확인형' },
      { value: 'B', label: '왜 이래? 불안해서 미치겠다.', type: '몰입형' },
      { value: 'C', label: '조금 걱정되지만, 내 할 일 하며 기다린다.', type: '균형형' },
      { value: 'D', label: '바빴나 보다 싶어 조용히 기다린다.', type: '신중형' },
      { value: 'E', label: '하루 종일 연락 없다니 말이 안 돼. 화난다.', type: '기준형' },
      { value: 'F', label: '바빴겠지 하고 넘긴다.', type: '자유공감형' },
    ],
  },
  {
    id: 2,
    text: '남자친구가 당신과의 기념일을 깜빡 잊었다. 이때 당신은?',
    options: [
      { value: 'A', label: '너무 서운해서 눈물부터 난다.', type: '몰입형' },
      { value: 'B', label: '기념일을 잊다니 이해가 안 돼. 화난다.', type: '기준형' },
      { value: 'C', label: '그럴 수도 있지 뭐. 신경 안 쓴다.', type: '자유공감형' },
      { value: 'D', label: '정말 잊었는지 슬쩍 떠본다.', type: '확인형' },
      { value: 'E', label: '속상하지만 그냥 모른 척 넘긴다.', type: '신중형' },
      { value: 'F', label: '섭섭하긴 하지만 크게 화내지 않는다.', type: '균형형' },
    ],
  },
  {
    id: 3,
    text: '남자친구가 다른 여자와 다정하게 웃고 있는 모습을 봤다. 당신의 반응은?',
    options: [
      { value: 'A', label: '혹시 오해일까 봐 가만히 지켜본다.', type: '신중형' },
      { value: 'B', label: '친구겠지 뭐. 대수롭지 않게 넘긴다.', type: '자유공감형' },
      { value: 'C', label: '질투심에 화가 머리끝까지 치민다.', type: '몰입형' },
      { value: 'D', label: '옆에 있던 여자 누군지 바로 물어본다.', type: '확인형' },
      { value: 'E', label: '조금 신경 쓰이지만, 일단 믿어본다.', type: '균형형' },
      { value: 'F', label: '애인 있는데 딴 여자랑 저러는 건 아니지. 진짜 화난다.', type: '기준형' },
    ],
  },
  {
    id: 4,
    text: '남자친구가 약속 시간에 한참 늦게 나타났다. 당신은?',
    options: [
      { value: 'A', label: '기다리느라 속 터져서 만나자마자 폭발한다.', type: '몰입형' },
      { value: 'B', label: '늦을 수도 있지 뭐. 난 괜찮다.', type: '자유공감형' },
      { value: 'C', label: '약속에 늦는 건 용납 못 해. 한 소리한다.', type: '기준형' },
      { value: 'D', label: '왜 늦었는지 이유부터 물어본다.', type: '확인형' },
      { value: 'E', label: '조금 화났지만, 일단 사정부터 들어본다.', type: '균형형' },
      { value: 'F', label: '속으로 화났지만, 티는 안 낸다.', type: '신중형' },
    ],
  },
  {
    id: 5,
    text: '남자친구와 어젯밤 심하게 다퉜다. 다음 날 당신은?',
    options: [
      { value: 'A', label: '잘못도 없는데 내가 왜 먼저? 연락 안 한다.', type: '기준형' },
      { value: 'B', label: '먼저 연락해서 화 풀었나 확인한다.', type: '확인형' },
      { value: 'C', label: '하루 지나면 금세 풀리고 평소처럼 지낸다.', type: '자유공감형' },
      { value: 'D', label: '마음 추스르고 내가 먼저 사과한다.', type: '균형형' },
      { value: 'E', label: '화나고 속상해서 잠도 못 잔다.', type: '몰입형' },
      { value: 'F', label: '먼저 연락하지 않고 조용히 기다린다.', type: '신중형' },
    ],
  },
  {
    id: 6,
    text: '남자친구가 전 여자친구와 아직도 연락하는 걸 알았다. 당신은?',
    options: [
      { value: 'A', label: '신경 쓰이지만 모른 척한다.', type: '신중형' },
      { value: 'B', label: '옛날 인연인데 뭐. 별거 아니라고 생각한다.', type: '자유공감형' },
      { value: 'C', label: '왜 아직도 연락하는지 직접 물어본다.', type: '확인형' },
      { value: 'D', label: '전 여친이랑 연락하는 건 절대 안 돼. 딱 잘라 말한다.', type: '기준형' },
      { value: 'E', label: '배신감에 펑펑 운다.', type: '몰입형' },
      { value: 'F', label: '꺼림칙하지만 믿고 이해해보려 한다.', type: '균형형' },
    ],
  },
  {
    id: 7,
    text: '연애한 지 꽤 됐는데, 남자친구는 결혼 얘기를 피하는 눈치다. 이때 당신은?',
    options: [
      { value: 'A', label: '지금 좋으면 됐지, 굳이 결혼 얘기 안 해도 된다.', type: '자유공감형' },
      { value: 'B', label: '결혼 생각이 있는지 솔직히 물어본다.', type: '확인형' },
      { value: 'C', label: '결혼 생각 없으면 왜 만나냐고 따진다.', type: '기준형' },
      { value: 'D', label: '혹시 나랑 결혼하기 싫은 건가? 별별 생각 다 한다.', type: '몰입형' },
      { value: 'E', label: '부담될까 봐 조심스럽게 이야기를 꺼낸다.', type: '균형형' },
      { value: 'F', label: '괜히 꺼내지 않고 혼자 속으로 고민한다.', type: '신중형' },
    ],
  },
  {
    id: 8,
    text: '남자친구가 주말마다 자기 취미에만 몰두해 당신과 시간을 보내지 않는다. 당신은?',
    options: [
      { value: 'A', label: '취미 존중! 나도 내 시간을 즐긴다.', type: '자유공감형' },
      { value: 'B', label: '나랑 있는 게 지겨운 건가? 서럽고 화난다.', type: '몰입형' },
      { value: 'C', label: '혼자서 조용히 시간을 보내며 기다린다.', type: '신중형' },
      { value: 'D', label: '왜 주말에 나랑 안 보내는지 물어본다.', type: '확인형' },
      { value: 'E', label: '주말엔 당연히 나랑 있어야 하는 거 아니냐고 따진다.', type: '기준형' },
      { value: 'F', label: '섭섭하지만, 서로 개인 시간도 필요하니 이해한다.', type: '균형형' },
    ],
  },
  {
    id: 9,
    text: '남자친구가 당신에게 사소한 거짓말을 한 걸 알게 됐다. 당신의 반응은?',
    options: [
      { value: 'A', label: '거짓말은 절대 용납 못 해. 크게 화낸다.', type: '기준형' },
      { value: 'B', label: '사소한 거짓말이니 웃어넘긴다.', type: '자유공감형' },
      { value: 'C', label: '별거 아니면 넘어가지만, 다음부턴 솔직하길 바란다.', type: '균형형' },
      { value: 'D', label: '거짓말이라니... 배신감에 폭발한다.', type: '몰입형' },
      { value: 'E', label: '왜 거짓말했는지 이유를 물어본다.', type: '확인형' },
      { value: 'F', label: '티는 안 내지만 마음속에 담아둔다.', type: '신중형' },
    ],
  },
  {
    id: 10,
    text: '남자친구와 중요하게 여기는 가치관이 많이 다르다는 걸 알았다. 당신은?',
    options: [
      { value: 'A', label: '생각이 달라도 괜찮아. 다름도 존중한다.', type: '자유공감형' },
      { value: 'B', label: '우리 안 맞는 걸까? 괜히 불안해진다.', type: '확인형' },
      { value: 'C', label: '내 기준에 안 맞으면 못 만난다고까지 생각한다.', type: '기준형' },
      { value: 'D', label: '성급히 판단하지 않고 천천히 생각해본다.', type: '신중형' },
      { value: 'E', label: '다를 수도 있으니 서로 이해하고 조율해본다.', type: '균형형' },
      { value: 'F', label: '가치관이 너무 달라 사랑도 식을 것 같아 걱정된다.', type: '몰입형' },
    ],
  },
];

// 랭킹 질문 R1~R5
export const rankingQuestions: RankingQuestion[] = [
  {
    id: 1,
    title: '[감정] 연애를 하면서 당신이 가장 자주 느끼는 감정은 무엇인가요? 많이 느끼는 순서대로 순위 매겨 보세요. (1순위 = 가장 자주 느끼는 감정)',
    category: '감정',
    items: [
      { id: 'r1-1', label: '행복감', type: '균형형' },
      { id: 'r1-2', label: '불안감', type: '확인형' },
      { id: 'r1-3', label: '설렘', type: '몰입형' },
      { id: 'r1-4', label: '안정감', type: '신중형' },
      { id: 'r1-5', label: '뿌듯함', type: '기준형' },
      { id: 'r1-6', label: '자유로움', type: '자유공감형' },
    ],
  },
  {
    id: 2,
    title: '[가치관] 연애를 할 때 당신이 가장 중요하게 생각하는 가치는 무엇인가요? 중요도 순으로 나열해 보세요.',
    category: '가치관',
    items: [
      { id: 'r2-1', label: '신뢰 (서로에 대한 믿음)', type: '신중형' },
      { id: 'r2-2', label: '솔직함 (속마음을 거짓 없이 터놓기)', type: '확인형' },
      { id: 'r2-3', label: '존중 (서로의 생각과 경계를 존중하기)', type: '균형형' },
      { id: 'r2-4', label: '자유 (각자의 개성과 삶을 존중하는 자유)', type: '자유공감형' },
      { id: 'r2-5', label: '헌신 (상대를 위해 희생하고 헌신하는 태도)', type: '몰입형' },
      { id: 'r2-6', label: '성취 (각자의 목표와 성장을 함께 응원)', type: '기준형' },
    ],
  },
  {
    id: 3,
    title: '[연애방식] 본인의 연애 스타일을 가장 잘 나타내는 것은 어떤 것인가요? 본인과 가까운 순서대로 정렬해 보세요.',
    category: '연애방식',
    items: [
      { id: 'r3-1', label: '사랑받고 있다는 느낌이 중요한 스타일', type: '확인형' },
      { id: 'r3-2', label: '사랑할 땐 온 마음을 다 주는 스타일', type: '몰입형' },
      { id: 'r3-3', label: '서두르지 않고 천천히 알아가는 스타일', type: '신중형' },
      { id: 'r3-4', label: '나와 연애, 두 마리 토끼를 다 잡는 스타일', type: '균형형' },
      { id: 'r3-5', label: '흔들리지 않는 원칙이 있는 스타일', type: '기준형' },
      { id: 'r3-6', label: '함께하되 각자의 색이 살아있는 스타일', type: '자유공감형' },
    ],
  },
  {
    id: 4,
    title: '[커뮤니케이션] 연인과의 소통에서 당신이 특히 중요하게 생각하는 것은 무엇인가요? 중요도에 따라 순위 매겨 보세요.',
    category: '커뮤니케이션',
    items: [
      { id: 'r4-1', label: '자주 연락하고 가까이 소통하는 것 (연락 빈도)', type: '확인형' },
      { id: 'r4-2', label: '자신의 감정을 솔직하게 표현하는 것 (속마음 투명하게)', type: '몰입형' },
      { id: 'r4-3', label: '상대방의 이야기를 끝까지 잘 들어주는 것 (경청과 공감)', type: '균형형' },
      { id: 'r4-4', label: '오해나 문제가 생기면 바로 대화로 풀어버리는 것', type: '기준형' },
      { id: 'r4-5', label: '천천히 깊어지는 대화를 통해 서로를 알아가는 것', type: '신중형' },
      { id: 'r4-6', label: '각자의 시간을 존중하며 필요할 때만 소통하는 것', type: '자유공감형' },
    ],
  },
  {
    id: 5,
    title: '[니즈] 연애를 할 때 당신이 가장 필요로 하는 것은 무엇인가요? 중요한 것부터 순서대로 나열해 보세요.',
    category: '니즈',
    items: [
      { id: 'r5-1', label: '꾸준한 애정 표현과 확신 (항상 사랑받고 있다는 느낌)', type: '확인형' },
      { id: 'r5-2', label: '두근거림과 열정 (설렘 가득한 뜨거운 감정)', type: '몰입형' },
      { id: 'r5-3', label: '편안함과 안정감 (마음이 편안한 안정된 관계)', type: '신중형' },
      { id: 'r5-4', label: '솔직한 대화와 깊은 공감 (서로의 감정을 이해하는 소통)', type: '균형형' },
      { id: 'r5-5', label: '미래에 대한 약속과 책임 (신뢰와 책임감)', type: '기준형' },
      { id: 'r5-6', label: '개인의 자유 존중 (서로의 독립성을 인정해 주기)', type: '자유공감형' },
    ],
  },
];

// 유형 설명
export const typeDescriptions: Record<string, string> = {
  '확인형': '사랑받고 있다는 확신이 필요한 유형',
  '몰입형': '사랑에 빠지면 모든 걸 쏟아붓는 유형',
  '신중형': '천천히 확신을 쌓아가는 유형',
  '균형형': '관계의 조화와 배려를 중시하는 유형',
  '기준형': '원칙과 목표가 뚜렷한 유형',
  '자유공감형': '독립성과 정신적 교감을 중시하는 유형',
};
