/**
 * saju_combinations 테이블 타입 정의
 */
export interface SajuCombination {
  id: string;
  cheongan: string;
  cheongan_symbol: string;
  mbti_code: string;
  combo_type: '일치형' | '보완형' | '갭형';
  gap_title: string;
  situation: string;
  type_label?: string;
  analysis: string;
  reason: string;
  coaching_see: string;
  coaching_try: string;
  coaching_grow: string;
  strength_combo: string;
  created_at: string;
}
