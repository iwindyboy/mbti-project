# Supabase 데이터베이스 설정 가이드

이 폴더에는 SCAN 성향검사 앱의 Supabase 데이터베이스 스키마가 포함되어 있습니다.

## 📋 테이블 구조

### 1. `user_sessions` - 사용자 세션 정보
기기 고유 ID와 세션 정보를 저장합니다.

**컬럼:**
- `id` (UUID): 기본 키
- `session_id` (TEXT, UNIQUE): 기기 고유 ID (UUID 형식)
- `device_info` (JSONB): 기기 정보 (OS, 브라우저, 모델 등)
- `last_active_at` (TIMESTAMPTZ): 마지막 활동 시간
- `created_at` (TIMESTAMPTZ): 생성 시간
- `updated_at` (TIMESTAMPTZ): 수정 시간

### 2. `test_results` - 검사 결과 및 이력
모든 검사 결과를 저장합니다.

**컬럼:**
- `id` (UUID): 기본 키
- `session_id` (TEXT): 기기 고유 ID
- `test_type` (TEXT): 검사 타입 ('basic', 'dating', 'career', 'persona')
- `type_code` (TEXT): 유형 코드 (예: 'INTJD', '확인형')
- `scores` (JSONB): 점수 데이터
  - SCAN 검사: `{ EI: 5, SN: -3, FT: 8, PJ: -2, DA: 4 }`
  - 연애 검사: `{ 확인형: 42, 몰입형: 15, ... }`
- `result_data` (JSONB): 전체 결과 데이터
  - SCAN 검사: `CalculateResult` 객체
  - 연애 검사: `DatingResult` 객체
- `created_at` (TIMESTAMPTZ): 생성 시간
- `updated_at` (TIMESTAMPTZ): 수정 시간

### 3. `share_links` - 공유 링크
결과 공유를 위한 링크를 저장합니다.

**컬럼:**
- `id` (UUID): 기본 키
- `share_code` (TEXT, UNIQUE): 공유 코드 (짧은 고유 문자열)
- `session_id` (TEXT): 생성한 사용자의 session_id
- `test_type` (TEXT): 검사 타입
- `result_data` (JSONB): 공유할 결과 데이터
- `expires_at` (TIMESTAMPTZ): 만료 시간 (NULL이면 만료 없음)
- `view_count` (INTEGER): 조회 수
- `created_at` (TIMESTAMPTZ): 생성 시간

## 🚀 설정 방법

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에 로그인
2. 새 프로젝트 생성
3. 프로젝트 설정에서 Database URL과 API Key 확인

### 2. SQL 스크립트 실행
1. Supabase 대시보드 → SQL Editor 이동
2. `schema.sql` 파일 내용을 복사하여 실행
3. 또는 Supabase CLI 사용:
   ```bash
   supabase db reset
   supabase db push
   ```

### 3. 환경 변수 설정
프로젝트 루트에 `.env` 파일 생성:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📊 데이터 예시

### test_results 예시

**SCAN 검사 결과:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "test_type": "basic",
  "type_code": "INTJD",
  "scores": {
    "EI": 5,
    "SN": -3,
    "FT": 8,
    "PJ": -2,
    "DA": 4
  },
  "result_data": {
    "typeCode": "INTJD",
    "scores": { "EI": 5, "SN": -3, "FT": 8, "PJ": -2, "DA": 4 },
    "leftSums": { "EI": 8, "SN": 15, ... },
    "rightSums": { "EI": 13, "SN": 12, ... },
    "greyZones": [],
    "badge": null,
    ...
  }
}
```

**연애 검사 결과:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "test_type": "dating",
  "type_code": "균형형",
  "scores": {
    "확인형": 9,
    "몰입형": 15,
    "신중형": 17,
    "균형형": 42,
    "기준형": 13,
    "자유공감형": 4
  },
  "result_data": {
    "coreType": "균형형",
    "subType": "신중형",
    "scores": { ... },
    "confidence": 85,
    "radarData": [15, 25, 28, 70, 22, 7],
    "maxScore": 90
  }
}
```

## 🔒 보안 설정

- Row Level Security (RLS)가 활성화되어 있습니다.
- 모든 테이블에 대해 기본 정책이 설정되어 있습니다.
- 필요에 따라 정책을 수정할 수 있습니다.

## 📝 유용한 쿼리

### 사용자별 최신 검사 결과 조회
```sql
SELECT * FROM user_latest_results 
WHERE session_id = 'your-session-id';
```

### 특정 검사 타입의 결과 조회
```sql
SELECT * FROM test_results 
WHERE session_id = 'your-session-id' 
  AND test_type = 'dating'
ORDER BY created_at DESC;
```

### 공유 링크 조회
```sql
SELECT * FROM share_links 
WHERE share_code = 'abc123' 
  AND (expires_at IS NULL OR expires_at > NOW());
```

### 공유 링크 조회 수 증가
```sql
UPDATE share_links 
SET view_count = view_count + 1 
WHERE share_code = 'abc123';
```

## 🔧 유지보수

### 만료된 공유 링크 정리
```sql
SELECT cleanup_expired_share_links();
```

### 통계 확인
```sql
SELECT * FROM share_link_stats;
```

## 📚 참고 자료

- [Supabase 문서](https://supabase.com/docs)
- [PostgreSQL JSONB 문서](https://www.postgresql.org/docs/current/datatype-json.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
