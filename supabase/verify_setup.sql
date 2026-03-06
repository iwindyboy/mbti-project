-- ============================================
-- Supabase 데이터베이스 설정 확인 쿼리
-- ============================================

-- 1. 테이블 존재 확인
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('user_sessions', 'test_results', 'share_links')
ORDER BY table_name;

-- 2. 각 테이블의 컬럼 확인
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('user_sessions', 'test_results', 'share_links')
ORDER BY table_name, ordinal_position;

-- 3. 인덱스 확인
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('user_sessions', 'test_results', 'share_links')
ORDER BY tablename, indexname;

-- 4. 트리거 확인
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table IN ('user_sessions', 'test_results')
ORDER BY event_object_table, trigger_name;

-- 5. RLS 정책 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('user_sessions', 'test_results', 'share_links')
ORDER BY tablename, policyname;

-- 6. 함수 확인
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('update_updated_at_column', 'cleanup_expired_share_links')
ORDER BY routine_name;

-- 7. 뷰 확인
SELECT 
  table_name
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name IN ('user_latest_results', 'share_link_stats')
ORDER BY table_name;

-- ============================================
-- 간단한 통합 확인 쿼리
-- ============================================
SELECT 
  '테이블' as object_type,
  COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('user_sessions', 'test_results', 'share_links')

UNION ALL

SELECT 
  '인덱스' as object_type,
  COUNT(*) as count
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('user_sessions', 'test_results', 'share_links')

UNION ALL

SELECT 
  '트리거' as object_type,
  COUNT(*) as count
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table IN ('user_sessions', 'test_results')

UNION ALL

SELECT 
  '정책' as object_type,
  COUNT(*) as count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('user_sessions', 'test_results', 'share_links')

UNION ALL

SELECT 
  '함수' as object_type,
  COUNT(*) as count
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('update_updated_at_column', 'cleanup_expired_share_links')

UNION ALL

SELECT 
  '뷰' as object_type,
  COUNT(*) as count
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name IN ('user_latest_results', 'share_link_stats');
