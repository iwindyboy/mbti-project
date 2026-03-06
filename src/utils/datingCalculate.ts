import { scenarioQuestions, rankingQuestions, typeDescriptions } from '../constants/datingQuestions';

export interface DatingResult {
  coreType: string; // 확인형, 몰입형, 신중형, 균형형, 기준형, 자유공감형
  subType: string;
  scores: Record<string, number>;
  confidence: number;
  radarData: number[];
  maxScore: number;
}

// 시나리오 답변 타입: { Q1: 'A', Q2: 'B', ... }
// 랭킹 답변 타입: { R1: { 'r1-1': 1, 'r1-2': 2, ... }, R2: { ... }, ... }
export interface DatingAnswers {
  scenarios: Record<number, string>; // Q1~Q10: 'A'~'F'
  rankings: Record<number, Record<string, number>>; // R1~R5: { itemId: rank (1~6) }
}

// 채점 상수
const SCORE_SCENARIO = 6;  // 시나리오 문항 점수 (기존 3에서 변경)
const MAX_TOTAL = 90;      // 최대 총점 (시나리오 60점 + 랭킹 30점)

/**
 * 시나리오 질문 채점 (선택한 유형에 +6점)
 */
const calculateScenarioScores = (scenarioAnswers: Record<number, string>): Record<string, number> => {
  const scores: Record<string, number> = {
    '확인형': 0,
    '몰입형': 0,
    '신중형': 0,
    '균형형': 0,
    '기준형': 0,
    '자유공감형': 0,
  };

  scenarioQuestions.forEach((question) => {
    const answer = scenarioAnswers[question.id];
    if (answer) {
      const selectedOption = question.options.find((opt) => opt.value === answer);
      if (selectedOption) {
        scores[selectedOption.type] += SCORE_SCENARIO;
        console.log(`Q${question.id} - 답변 ${answer} (${selectedOption.type}): +${SCORE_SCENARIO}점`);
      }
    }
  });

  return scores;
};

/**
 * 랭킹 질문 채점 (1순위=6점, 2순위=5점, ..., 6순위=1점)
 */
const calculateRankingScores = (rankingAnswers: Record<number, Record<string, number>>): Record<string, number> => {
  const scores: Record<string, number> = {
    '확인형': 0,
    '몰입형': 0,
    '신중형': 0,
    '균형형': 0,
    '기준형': 0,
    '자유공감형': 0,
  };

  rankingQuestions.forEach((question) => {
    const answer = rankingAnswers[question.id];
    if (answer) {
      question.items.forEach((item) => {
        const rank = answer[item.id];
        if (rank && rank >= 1 && rank <= 6) {
          // 1순위=6점, 2순위=5점, ..., 6순위=1점
          const points = 7 - rank;
          scores[item.type] += points;
          console.log(`R${question.id} - ${item.id} (${item.type}): 순위 ${rank} → ${points}점`);
        }
      });
    }
  });

  return scores;
};

/**
 * 신뢰도 계산 (랭킹 질문의 일관성 체크)
 */
const calculateConfidence = (rankingAnswers: Record<number, Record<string, number>>): number => {
  let consistencyErrors = 0;
  const totalRankings = Object.keys(rankingAnswers).length;

  if (totalRankings === 0) return 1.0;

  // 각 랭킹 질문에서 중복 순위나 누락된 항목이 있는지 체크
  rankingQuestions.forEach((question) => {
    const answer = rankingAnswers[question.id];
    if (answer) {
      const ranks = Object.values(answer);
      const uniqueRanks = new Set(ranks);
      
      // 중복 순위가 있거나, 1~6 범위를 벗어나거나, 6개 항목이 모두 순위가 매겨지지 않은 경우
      if (ranks.length !== 6 || uniqueRanks.size !== 6 || ranks.some((r) => r < 1 || r > 6)) {
        consistencyErrors++;
      }
    } else {
      consistencyErrors++;
    }
  });

  // 일관성 오류가 많을수록 신뢰도 낮음
  const errorRate = consistencyErrors / totalRankings;
  if (errorRate >= 0.5) return 0.5;
  if (errorRate >= 0.3) return 0.7;
  if (errorRate >= 0.1) return 0.85;
  return 1.0;
};

/**
 * Tie-break 질문 생성 (1위-2위 점수 차이 ≤ 3점일 때)
 */
export const generateTieBreakQuestion = (
  firstType: string,
  secondType: string
): { question: string; options: { value: string; label: string; type: string }[] } => {
  const typeNames: Record<string, string> = {
    '확인형': '확인형',
    '몰입형': '몰입형',
    '신중형': '신중형',
    '균형형': '균형형',
    '기준형': '기준형',
    '자유공감형': '자유공감형',
  };

  return {
    question: `당신은 ${firstType}과 ${secondType} 성향 사이에 있네요. 둘 중 어느 쪽이 더 가깝나요?`,
    options: [
      { 
        value: firstType, 
        label: `${firstType}: ${typeDescriptions[firstType] || ''}`, 
        type: firstType 
      },
      { 
        value: secondType, 
        label: `${secondType}: ${typeDescriptions[secondType] || ''}`, 
        type: secondType 
      },
    ],
  };
};

/**
 * 연애 유형 검사 분석
 */
export const analyzeDatingTest = (answers: DatingAnswers): DatingResult => {
  // Step 1: 시나리오 점수 계산
  const scenarioScores = calculateScenarioScores(answers.scenarios);

  // Step 2: 랭킹 점수 계산
  const rankingScores = calculateRankingScores(answers.rankings);

  // Step 3: 총점 계산
  const totalScores: Record<string, number> = {
    '확인형': scenarioScores['확인형'] + rankingScores['확인형'],
    '몰입형': scenarioScores['몰입형'] + rankingScores['몰입형'],
    '신중형': scenarioScores['신중형'] + rankingScores['신중형'],
    '균형형': scenarioScores['균형형'] + rankingScores['균형형'],
    '기준형': scenarioScores['기준형'] + rankingScores['기준형'],
    '자유공감형': scenarioScores['자유공감형'] + rankingScores['자유공감형'],
  };

  // 디버깅: 점수 출력
  console.log('=== 점수 계산 결과 ===');
  console.log('시나리오 점수:', scenarioScores);
  console.log('랭킹 점수:', rankingScores);
  console.log('총점:', totalScores);

  // Step 4: 신뢰도 계산
  const confidence = calculateConfidence(answers.rankings);

  // Step 5: 최종 유형 결정
  const sortedTypes = Object.entries(totalScores).sort((a, b) => b[1] - a[1]);
  const [firstType, firstScore] = sortedTypes[0];
  const [secondType, secondScore] = sortedTypes[1];

  console.log('정렬된 점수:', sortedTypes);
  console.log('1위:', firstType, firstScore);
  console.log('2위:', secondType, secondScore);

  const scoreDiff = firstScore - secondScore;

  let coreType: string;
  let subType: string;

  // 점수 차이가 3 이하면 Tie-break 필요 (호출하는 쪽에서 처리)
  // 여기서는 일단 첫 번째 타입을 coreType으로 설정
  if (scoreDiff <= 3) {
    // 완전 동점이면 균형형 반환
    if (scoreDiff === 0) {
      coreType = '균형형';
      subType = firstType === '균형형' ? secondType : firstType;
    } else {
      // 차이가 3 이하면 첫 번째 타입을 기본값으로, 실제로는 Tie-break 질문 필요
      coreType = firstType;
      subType = secondType;
    }
  } else {
    coreType = firstType;
    subType = secondType;
  }

  // 점수 정규화 함수
  const normalizeScores = (rawScores: Record<string, number>) => {
    const values = Object.values(rawScores);
    const minVal = Math.min(...values);

    const result: Record<string, { score: number; displayPct: number; barPct: number }> = {};
    for (const type in rawScores) {
      const score = rawScores[type];
      result[type] = {
        score, // 원점수
        displayPct: Math.round((score / MAX_TOTAL) * 100), // 표시 숫자
        barPct: minVal === MAX_TOTAL 
          ? 0 
          : Math.round(((score - minVal) / (MAX_TOTAL - minVal)) * 100), // 막대 길이
      };
    }
    return result;
  };

  // 점수 정규화
  const normalizedScores = normalizeScores(totalScores);
  
  // 레이더 차트용 데이터 (barPct 사용)
  const types = ['확인형', '몰입형', '신중형', '균형형', '기준형', '자유공감형'];
  const radarData = types.map((type) => {
    return normalizedScores[type]?.barPct || 0;
  });

  console.log('=== 정규화된 점수 ===');
  types.forEach((type) => {
    const normalized = normalizedScores[type];
    console.log(`${type}: 원점수 ${normalized.score}점, 표시 ${normalized.displayPct}%, 막대 ${normalized.barPct}%`);
  });

  console.log('최종 유형:', coreType, '/ 서브 유형:', subType);

  return {
    coreType,
    subType,
    scores: totalScores,
    normalizedScores,
    confidence,
    radarData,
    maxScore: MAX_TOTAL, // 시나리오 60점 + 랭킹 30점
  };
};
