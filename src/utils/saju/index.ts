// ══════════════════════════════════════════════════════════════
//  사주 계산 엔진 v2.0
//  - 연주: 입춘 기준 연간 판별
//  - 월주: 절기 기반 월간 판별
//  - 일주: 율리우스 일수 기반
//  - 시주: 일간 기반 시간 배정
// ══════════════════════════════════════════════════════════════

import {
  CHEONGAN,
  JIJI,
  JIJI_ARRAY,
  CHEONGAN_TO_OHANG,
  MONTH_GAN_START,
  HOUR_GAN_START,
  hourToJijiIndex,
} from './constants';
import { getSajuMonthIndex, isBeforeIpchun } from '../../data/solarTerms';
import { lunarToSolar } from './lunarConverter';

// 기존 타입과 호환
import type { Cheongan } from '../../data/sajuDb';

export interface SajuInput {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number | null;
  isLunar: boolean;
  isLeapMonth?: boolean;
  gender: 'male' | 'female';
}

export interface SajuResult {
  연주: { 천간: Cheongan; 지지: string };
  월주: { 천간: Cheongan; 지지: string };
  일주: { 천간: Cheongan; 지지: string };
  시주: { 천간: Cheongan; 지지: string } | null;
  일간: Cheongan;
  오행: '木' | '火' | '土' | '金' | '水';
  input: SajuInput;
}

// ═══════════ 메인 함수 ═══════════

export function calculateSaju(input: SajuInput): SajuResult {
  try {
    // ① 음력 → 양력 변환
    let sy = input.year;
    let sm = input.month;
    let sd = input.day;

    if (input.isLunar) {
      try {
        const converted = lunarToSolar(
          input.year,
          input.month,
          input.day,
          input.isLeapMonth ?? false,
        );
        sy = converted.year;
        sm = converted.month;
        sd = converted.day;
      } catch (error) {
        console.error('음력→양력 변환 실패, 양력으로 처리:', error);
        // 변환 실패 시 양력으로 처리
      }
    }

    const hourForCalc = input.hour ?? 12; // 시간 모름이면 정오 기본

    // ② 입춘 판별
    let beforeIpchun = false;
    try {
      beforeIpchun = isBeforeIpchun(sy, sm, sd, hourForCalc);
    } catch (error) {
      console.error('입춘 판별 실패:', error);
      // 기본값: 입춘 이후로 처리
      beforeIpchun = false;
    }

    // ③ 연주 계산
    const 연주 = calcYearPillar(sy, beforeIpchun);

    // ④ 월주 계산
    let monthIndex = 0;
    try {
      monthIndex = getSajuMonthIndex(sy, sm, sd, hourForCalc);
    } catch (error) {
      console.error('절기 월 계산 실패, 근사값 사용:', error);
      // 근사값: (sm - 1) % 12
      monthIndex = (sm - 1) % 12;
    }
    const 월주 = calcMonthPillar(연주.천간, monthIndex);

    // ⑤ 일주 계산
    const 일주 = calcDayPillar(sy, sm, sd);

    // ⑥ 시주 계산
    const 시주 = input.hour !== null ? calcHourPillar(일주.천간, input.hour) : null;

    // ⑦ 일간, 오행
    const 일간 = 일주.천간 as Cheongan;
    const 오행 = CHEONGAN_TO_OHANG[일간] || '木';

    return { 연주, 월주, 일주, 시주, 일간, 오행: 오행 as '木' | '火' | '土' | '金' | '水', input };
  } catch (error) {
    console.error('사주 계산 중 오류 발생:', error);
    // 기본값 반환 (에러 발생 시)
    const default일간 = '甲' as Cheongan;
    return {
      연주: { 천간: default일간, 지지: '子' },
      월주: { 천간: default일간, 지지: '寅' },
      일주: { 천간: default일간, 지지: '子' },
      시주: input.hour !== null ? { 천간: default일간, 지지: '子' } : null,
      일간: default일간,
      오행: '木',
      input,
    };
  }
}

// ═══════════ 연주 ═══════════

function calcYearPillar(solarYear: number, beforeIpchun: boolean) {
  const y = beforeIpchun ? solarYear - 1 : solarYear;
  let ganIdx = (y - 4) % 10;
  let jiIdx = (y - 4) % 12;
  if (ganIdx < 0) ganIdx += 10;
  if (jiIdx < 0) jiIdx += 12;

  return {
    천간: CHEONGAN[ganIdx] as Cheongan,
    지지: JIJI_ARRAY[jiIdx] || JIJI[jiIdx],
  };
}

// ═══════════ 월주 ═══════════

function calcMonthPillar(yearGan: string, monthIndex: number) {
  // 월지: 인(寅)=index2 부터 시작
  const jiIdx = (2 + monthIndex) % 12;

  // 월천간: 연간에 따른 시작점 + 월 offset
  const startGan = MONTH_GAN_START[yearGan];
  const ganIdx = (startGan + monthIndex) % 10;

  return {
    천간: CHEONGAN[ganIdx] as Cheongan,
    지지: JIJI_ARRAY[jiIdx] || JIJI[jiIdx],
  };
}

// ═══════════ 일주 ═══════════

function calcDayPillar(year: number, month: number, day: number) {
  const jdn = julianDayNumber(year, month, day);

  // 기준점: 2000년 1월 1일 = 甲子일
  // 일반적 공식: (JDN + 9) % 60 → 60갑자 인덱스
  const ganzhiIdx = ((jdn + 49) % 60 + 60) % 60;

  return {
    천간: CHEONGAN[ganzhiIdx % 10] as Cheongan,
    지지: JIJI_ARRAY[ganzhiIdx % 12] || JIJI[ganzhiIdx % 12],
  };
}

function julianDayNumber(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * m2 + 2) / 5) +
    365 * y2 +
    Math.floor(y2 / 4) -
    Math.floor(y2 / 100) +
    Math.floor(y2 / 400) -
    32045
  );
}

// ═══════════ 시주 ═══════════

function calcHourPillar(dayGan: string, hour: number) {
  const jiIdx = hourToJijiIndex(hour);
  const startGan = HOUR_GAN_START[dayGan];
  const ganIdx = (startGan + jiIdx) % 10;

  return {
    천간: CHEONGAN[ganIdx] as Cheongan,
    지지: JIJI_ARRAY[jiIdx] || JIJI[jiIdx],
  };
}

