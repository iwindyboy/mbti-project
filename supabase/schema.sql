-- ============================================
-- SCAN 성향검사 앱 - Supabase 데이터베이스 스키마
-- ============================================

-- 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. 사용자 세션 정보 테이블 (user_sessions)
-- ============================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL, -- 기기 고유 ID (UUID)
  device_info JSONB, -- 기기 정보 (OS, 브라우저, 모델 등)
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_active ON user_sessions(last_active_at DESC);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 기존 트리거가 있으면 삭제 후 재생성
DROP TRIGGER IF EXISTS update_user_sessions_updated_at ON user_sessions;
CREATE TRIGGER update_user_sessions_updated_at
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. 검사 결과 테이블 (test_results)
-- ============================================
CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL, -- 기기 고유 ID (user_sessions.session_id 참조)
  test_type TEXT NOT NULL CHECK (test_type IN ('basic', 'dating', 'career', 'persona')),
  type_code TEXT NOT NULL, -- 유형 코드 (예: 'INTJD', '확인형' 등)
  scores JSONB NOT NULL, -- 점수 데이터 (축별 점수, 총점 등)
  result_data JSONB NOT NULL, -- 전체 결과 데이터 (CalculateResult 또는 DatingResult)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
  
  -- 외래 키 제약조건 (선택사항 - 필요시 활성화)
  -- CONSTRAINT fk_test_results_session FOREIGN KEY (session_id) 
  --   REFERENCES user_sessions(session_id) ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_test_results_session_id ON test_results(session_id);
CREATE INDEX IF NOT EXISTS idx_test_results_test_type ON test_results(test_type);
CREATE INDEX IF NOT EXISTS idx_test_results_type_code ON test_results(type_code);
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON test_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_session_type ON test_results(session_id, test_type);

-- JSONB 인덱스 (점수 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_test_results_scores ON test_results USING GIN (scores);
CREATE INDEX IF NOT EXISTS idx_test_results_result_data ON test_results USING GIN (result_data);

-- updated_at 자동 업데이트 트리거
DROP TRIGGER IF EXISTS update_test_results_updated_at ON test_results;
CREATE TRIGGER update_test_results_updated_at
  BEFORE UPDATE ON test_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. 공유 링크 테이블 (share_links)
-- ============================================
CREATE TABLE IF NOT EXISTS share_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  share_code TEXT UNIQUE NOT NULL, -- 공유 코드 (짧은 고유 문자열)
  session_id TEXT NOT NULL, -- 생성한 사용자의 session_id
  test_type TEXT NOT NULL CHECK (test_type IN ('basic', 'dating', 'career', 'persona')),
  result_data JSONB NOT NULL, -- 공유할 결과 데이터
  expires_at TIMESTAMPTZ, -- 만료 시간 (NULL이면 만료 없음)
  view_count INTEGER DEFAULT 0, -- 조회 수
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_share_links_share_code ON share_links(share_code);
CREATE INDEX IF NOT EXISTS idx_share_links_session_id ON share_links(session_id);
CREATE INDEX IF NOT EXISTS idx_share_links_expires_at ON share_links(expires_at);
CREATE INDEX IF NOT EXISTS idx_share_links_created_at ON share_links(created_at DESC);

-- 만료된 링크 자동 삭제 함수 (선택사항)
CREATE OR REPLACE FUNCTION cleanup_expired_share_links()
RETURNS void AS $$
BEGIN
  DELETE FROM share_links
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. Row Level Security (RLS) 정책 설정
-- ============================================

-- RLS 활성화
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

-- user_sessions: 자신의 세션만 조회/수정 가능
DROP POLICY IF EXISTS "Users can view their own sessions" ON user_sessions;
CREATE POLICY "Users can view their own sessions"
  ON user_sessions FOR SELECT
  USING (true); -- 모든 사용자가 조회 가능 (session_id로 필터링)

DROP POLICY IF EXISTS "Users can insert their own sessions" ON user_sessions;
CREATE POLICY "Users can insert their own sessions"
  ON user_sessions FOR INSERT
  WITH CHECK (true); -- 모든 사용자가 생성 가능

DROP POLICY IF EXISTS "Users can update their own sessions" ON user_sessions;
CREATE POLICY "Users can update their own sessions"
  ON user_sessions FOR UPDATE
  USING (true); -- 모든 사용자가 수정 가능

-- test_results: 자신의 결과만 조회/수정 가능
DROP POLICY IF EXISTS "Users can view their own test results" ON test_results;
CREATE POLICY "Users can view their own test results"
  ON test_results FOR SELECT
  USING (true); -- 모든 사용자가 조회 가능 (session_id로 필터링)

DROP POLICY IF EXISTS "Users can insert their own test results" ON test_results;
CREATE POLICY "Users can insert their own test results"
  ON test_results FOR INSERT
  WITH CHECK (true); -- 모든 사용자가 생성 가능

DROP POLICY IF EXISTS "Users can update their own test results" ON test_results;
CREATE POLICY "Users can update their own test results"
  ON test_results FOR UPDATE
  USING (true); -- 모든 사용자가 수정 가능

-- share_links: 공유 링크는 누구나 조회 가능 (만료되지 않은 것만)
DROP POLICY IF EXISTS "Anyone can view active share links" ON share_links;
CREATE POLICY "Anyone can view active share links"
  ON share_links FOR SELECT
  USING (
    expires_at IS NULL OR expires_at > NOW()
  );

DROP POLICY IF EXISTS "Users can create share links" ON share_links;
CREATE POLICY "Users can create share links"
  ON share_links FOR INSERT
  WITH CHECK (true); -- 모든 사용자가 생성 가능

DROP POLICY IF EXISTS "Users can update their own share links" ON share_links;
CREATE POLICY "Users can update their own share links"
  ON share_links FOR UPDATE
  USING (true); -- 모든 사용자가 수정 가능 (view_count 증가 등)

-- ============================================
-- 5. 유용한 뷰 생성
-- ============================================

-- 사용자별 최신 검사 결과 뷰
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

-- 공유 링크 통계 뷰
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
-- 6. 샘플 데이터 삽입 (테스트용 - 선택사항)
-- ============================================

-- 샘플 사용자 세션
-- INSERT INTO user_sessions (session_id, device_info) VALUES
-- ('sample-session-001', '{"os": "iOS", "browser": "Safari", "model": "iPhone 14"}'::jsonb);

-- ============================================
-- 완료
-- ============================================
