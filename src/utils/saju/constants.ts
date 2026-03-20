// ══════════════════════════════════════════════════════════════
//  사주 계산 상수 및 기초 데이터
// ══════════════════════════════════════════════════════════════

// 10천간
export const CHEONGAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'] as const;
export type CheonganType = typeof CHEONGAN[number];

// 12지지
export const JIJI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'] as const;
export const JIJI_ARRAY: readonly string[] = JIJI;

// 천간 → 오행
export const CHEONGAN_TO_OHANG: Record<string, '木'|'火'|'土'|'金'|'水'> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

// 월주 천간 시작 인덱스 (연간 기준)
// 갑기 → 丙(2), 을경 → 戊(4), 병신 → 庚(6), 정임 → 壬(8), 무계 → 甲(0)
export const MONTH_GAN_START: Record<string, number> = {
  '甲': 2, '己': 2,
  '乙': 4, '庚': 4,
  '丙': 6, '辛': 6,
  '丁': 8, '壬': 8,
  '戊': 0, '癸': 0,
};

// 시주 천간 시작 인덱스 (일간 기준)
// 갑기 → 甲(0), 을경 → 丙(2), 병신 → 戊(4), 정임 → 庚(6), 무계 → 壬(8)
export const HOUR_GAN_START: Record<string, number> = {
  '甲': 0, '己': 0,
  '乙': 2, '庚': 2,
  '丙': 4, '辛': 4,
  '丁': 6, '壬': 6,
  '戊': 8, '癸': 8,
};

// 시간(0~23) → 지지 인덱스
export function hourToJijiIndex(hour: number): number {
  if (hour === 23 || hour === 0) return 0;   // 子時 23:00~00:59
  return Math.floor((hour + 1) / 2);
}
