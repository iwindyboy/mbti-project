-- Migration: 002_create_saju_combinations.sql
-- Description: 사주 10천간과 32 Spectrum 조합 결과 테이블 생성
-- Created: 2024

-- ============================================
-- 사주 10천간과 32 Spectrum 조합 코칭 결과 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS saju_combinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cheongan TEXT NOT NULL,
  cheongan_symbol TEXT NOT NULL,
  mbti_code TEXT NOT NULL,
  combo_type TEXT NOT NULL CHECK (combo_type IN ('일치형', '보완형', '갭형')),
  gap_title TEXT,
  situation TEXT,
  type_label TEXT,
  analysis TEXT,
  reason TEXT,
  coaching_see TEXT,
  coaching_try TEXT,
  coaching_grow TEXT,
  strength_combo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_saju_combinations_cheongan ON saju_combinations(cheongan);
CREATE INDEX IF NOT EXISTS idx_saju_combinations_mbti_code ON saju_combinations(mbti_code);
CREATE INDEX IF NOT EXISTS idx_saju_combinations_combo_type ON saju_combinations(combo_type);
CREATE INDEX IF NOT EXISTS idx_saju_combinations_cheongan_mbti ON saju_combinations(cheongan, mbti_code);
CREATE INDEX IF NOT EXISTS idx_saju_combinations_created_at ON saju_combinations(created_at DESC);

-- RLS는 비활성화 (사용자 요청에 따라)
-- ALTER TABLE saju_combinations ENABLE ROW LEVEL SECURITY;
