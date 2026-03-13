// ══════════════════════════════════════════════════════════════
//  음양력 변환 모듈
//  korean-lunar-calendar 라이브러리를 사용한 음력/양력 변환
// ══════════════════════════════════════════════════════════════

import KoreanLunarCalendar from 'korean-lunar-calendar';

const calendar = new KoreanLunarCalendar();

/**
 * 음력을 양력으로 변환
 * @param lunarYear 음력 연도
 * @param lunarMonth 음력 월 (1-12)
 * @param lunarDay 음력 일
 * @param isLeapMonth 윤달 여부
 * @returns 양력 날짜 정보
 */
export function lunarToSolar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  isLeapMonth: boolean = false
): { year: number; month: number; day: number } {
  try {
    calendar.setLunarDate(lunarYear, lunarMonth, lunarDay, isLeapMonth);
    const solar = calendar.getSolarCalendar();
    return {
      year: solar.year,
      month: solar.month,
      day: solar.day
    };
  } catch (error) {
    console.error('음력→양력 변환 오류:', error);
    // 변환 실패 시 원본 반환 (임시 처리)
    return {
      year: lunarYear,
      month: lunarMonth,
      day: lunarDay
    };
  }
}

/**
 * 양력을 음력으로 변환
 * @param solarYear 양력 연도
 * @param solarMonth 양력 월 (1-12)
 * @param solarDay 양력 일
 * @returns 음력 날짜 정보
 */
export function solarToLunar(
  solarYear: number,
  solarMonth: number,
  solarDay: number
): { year: number; month: number; day: number; isLeapMonth: boolean } {
  try {
    calendar.setSolarDate(solarYear, solarMonth, solarDay);
    const lunar = calendar.getLunarCalendar();
    return {
      year: lunar.year,
      month: lunar.month,
      day: lunar.day,
      isLeapMonth: lunar.isIntercalation
    };
  } catch (error) {
    console.error('양력→음력 변환 오류:', error);
    // 변환 실패 시 원본 반환 (임시 처리)
    return {
      year: solarYear,
      month: solarMonth,
      day: solarDay,
      isLeapMonth: false
    };
  }
}
