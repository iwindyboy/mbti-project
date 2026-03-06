// ══════════════════════════════════════════════════════════════
//  사주 계산 엔진
//  참고: 실제 계산 로직은 saju-calendar.js의 데이터를 기반으로 구현 필요
// ══════════════════════════════════════════════════════════════

import { Cheongan, JIJI, ILGAN_TO_OHANG } from '../data/sajuDb';

export interface SajuInput {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number | null; // null이면 모름
  isLunar: boolean; // true: 음력, false: 양력
  gender: 'male' | 'female';
}

export interface SajuResult {
  // 사주 8글자
  연주: { 천간: Cheongan; 지지: string };
  월주: { 천간: Cheongan; 지지: string };
  일주: { 천간: Cheongan; 지지: string };
  시주: { 천간: Cheongan; 지지: string } | null;
  
  // 일간(日干) - 오행 판별 기준
  일간: Cheongan;
  오행: '木' | '火' | '土' | '金' | '水';
  
  // 입력 정보
  input: SajuInput;
}

/**
 * 사주 계산 함수
 * 
 * TODO: 실제 계산 로직 구현 필요
 * - 연주: 입춘 기준으로 연간 결정
 * - 월주: 절기 기준으로 월간 결정
 * - 일주: 율리우스력 계산
 * - 시주: 출생 시간대별 지지 배정
 */
export function calculateSaju(input: SajuInput): SajuResult {
  // 임시: 기본 계산 로직 (실제로는 saju-calendar.js 데이터 필요)
  // 실제 구현 시 saju-calendar.js의 LUNAR_CALENDAR, SOLAR_TERMS 사용
  
  // 일간 계산 (임시 - 실제로는 율리우스력 기반)
  const dayIndex = (input.year + input.month + input.day) % 10;
  const 일간 = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][dayIndex] as Cheongan;
  
  // 오행 판별
  const 오행 = ILGAN_TO_OHANG[일간];
  
  // 지지 계산 (임시)
  const yearBranchIndex = (input.year - 4) % 12;
  const monthBranchIndex = (input.month - 1) % 12;
  const dayBranchIndex = (input.day - 1) % 12;
  const hourBranchIndex = input.hour !== null ? Math.floor((input.hour + 1) / 2) % 12 : 0;
  
  // 천간 계산 (임시)
  const yearStemIndex = (input.year - 4) % 10;
  const monthStemIndex = (input.month - 1) % 10;
  
  return {
    연주: {
      천간: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][yearStemIndex] as Cheongan,
      지지: JIJI[yearBranchIndex]
    },
    월주: {
      천간: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][monthStemIndex] as Cheongan,
      지지: JIJI[monthBranchIndex]
    },
    일주: {
      천간: 일간,
      지지: JIJI[dayBranchIndex]
    },
    시주: input.hour !== null ? {
      천간: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][hourBranchIndex] as Cheongan,
      지지: JIJI[hourBranchIndex]
    } : null,
    일간,
    오행,
    input
  };
}
