-- Migration: 001_initial_schema.sql
-- Description: 초기 데이터베이스 스키마 생성
-- Created: 2024

-- 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. 사용자 세션 정보 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  device_info JSONB,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_active ON user_sessions(last_active_at DESC);

-- ============================================
-- 2. 검사 결과 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  test_type TEXT NOT NULL CHECK (test_type IN ('basic', 'dating', 'career', 'persona')),
  type_code TEXT NOT NULL,
  scores JSONB NOT NULL,
  result_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_test_results_session_id ON test_results(session_id);
CREATE INDEX IF NOT EXISTS idx_test_results_test_type ON test_results(test_type);
CREATE INDEX IF NOT EXISTS idx_test_results_type_code ON test_results(type_code);
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON test_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_session_type ON test_results(session_id, test_type);
CREATE INDEX IF NOT EXISTS idx_test_results_scores ON test_results USING GIN (scores);
CREATE INDEX IF NOT EXISTS idx_test_results_result_data ON test_results USING GIN (result_data);

-- ============================================
-- 3. 공유 링크 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS share_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  share_code TEXT UNIQUE NOT NULL,
  session_id TEXT NOT NULL,
  test_type TEXT NOT NULL CHECK (test_type IN ('basic', 'dating', 'career', 'persona')),
  result_data JSONB NOT NULL,
  expires_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_share_links_share_code ON share_links(share_code);
CREATE INDEX IF NOT EXISTS idx_share_links_session_id ON share_links(session_id);
CREATE INDEX IF NOT EXISTS idx_share_links_expires_at ON share_links(expires_at);
CREATE INDEX IF NOT EXISTS idx_share_links_created_at ON share_links(created_at DESC);

-- ============================================
-- 4. 트리거 함수
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_sessions_updated_at
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_results_updated_at
  BEFORE UPDATE ON test_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. 유틸리티 함수
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_expired_share_links()
RETURNS void AS $$
BEGIN
  DELETE FROM share_links
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. 뷰 생성
-- ============================================
CREATE OR REPLACE VIEW user_latest_results AS
SELECT DISTINCT ON (session_id, test_type)
  id,
  session_id,
  test_type,
  type_code,
  scores,
  result_data,
  created_at
FROM test_results
ORDER BY session_id, test_type, created_at DESC;

CREATE OR REPLACE VIEW share_link_stats AS
SELECT
  test_type,
  COUNT(*) as total_links,
  COUNT(*) FILTER (WHERE expires_at IS NULL OR expires_at > NOW()) as active_links,
  SUM(view_count) as total_views,
  AVG(view_count) as avg_views
FROM share_links
GROUP BY test_type;

-- ============================================
-- 7. Row Level Security
-- ============================================
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

-- user_sessions 정책
CREATE POLICY "Users can view their own sessions"
  ON user_sessions FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own sessions"
  ON user_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own sessions"
  ON user_sessions FOR UPDATE
  USING (true);

-- test_results 정책
CREATE POLICY "Users can view their own test results"
  ON test_results FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own test results"
  ON test_results FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own test results"
  ON test_results FOR UPDATE
  USING (true);

-- share_links 정책
CREATE POLICY "Anyone can view active share links"
  ON share_links FOR SELECT
  USING (
    expires_at IS NULL OR expires_at > NOW()
  );

CREATE POLICY "Users can create share links"
  ON share_links FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own share links"
  ON share_links FOR UPDATE
  USING (true);
