# Supabase 데이터베이스 설정 가이드

## 🎯 목표
SCAN 성향검사 앱의 데이터를 Supabase에 저장하기 위한 데이터베이스 구조를 설정합니다.

## 📋 저장할 데이터

### ✅ 서버(Supabase)에 저장
1. **검사 결과** (`test_results` 테이블)
   - result_type (검사 타입: basic, dating, career, persona)
   - scores (점수 데이터)
   - result_data (전체 결과 데이터)

2. **검사 이력** (`test_results` 테이블)
   - 사용자가 진행한 모든 검사 결과

3. **공유 링크** (`share_links` 테이블)
   - share_code (공유 코드)
   - result_data (공유할 결과)
   - expires_at (만료 시간)
   - view_count (조회 수)

4. **사용자 세션 정보** (`user_sessions` 테이블)
   - session_id (기기 고유 ID)
   - device_info (기기 정보)
   - last_active_at (마지막 활동 시간)

### 📱 앱에 저장 (로컬)
- 전체 메뉴 구조
- 이미지/아이콘
- session_id (기기 고유 ID)

## 🚀 설정 단계

### 1단계: Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 접속 및 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - **Name**: SCAN 성향검사 (원하는 이름)
   - **Database Password**: 강력한 비밀번호 설정 (기억해두세요!)
   - **Region**: 가장 가까운 지역 선택
4. 프로젝트 생성 완료 대기 (약 2분)

### 2단계: SQL 스크립트 실행

1. Supabase 대시보드에서 **SQL Editor** 메뉴 클릭
2. **New Query** 클릭
3. `supabase/schema.sql` 파일의 전체 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭 (또는 `Ctrl+Enter`)
5. 성공 메시지 확인

### 3단계: 테이블 확인

1. **Table Editor** 메뉴 클릭
2. 다음 테이블들이 생성되었는지 확인:
   - ✅ `user_sessions`
   - ✅ `test_results`
   - ✅ `share_links`

### 4단계: API 키 확인

1. **Settings** → **API** 메뉴 클릭
2. 다음 정보를 복사하여 안전한 곳에 보관:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 5단계: 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성 (또는 기존 파일에 추가):

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **주의**: `.env` 파일은 Git에 커밋하지 마세요! `.gitignore`에 추가되어 있는지 확인하세요.

## 🧪 테스트

### SQL Editor에서 테스트 쿼리 실행

```sql
-- 1. 사용자 세션 생성 테스트
INSERT INTO user_sessions (session_id, device_info)
VALUES (
  'test-session-001',
  '{"os": "iOS", "browser": "Safari", "model": "iPhone 14"}'::jsonb
);

-- 2. 검사 결과 저장 테스트
INSERT INTO test_results (session_id, test_type, type_code, scores, result_data)
VALUES (
  'test-session-001',
  'basic',
  'INTJD',
  '{"EI": 5, "SN": -3, "FT": 8, "PJ": -2, "DA": 4}'::jsonb,
  '{"typeCode": "INTJD", "scores": {"EI": 5, "SN": -3, "FT": 8, "PJ": -2, "DA": 4}}'::jsonb
);

-- 3. 데이터 조회 테스트
SELECT * FROM user_sessions WHERE session_id = 'test-session-001';
SELECT * FROM test_results WHERE session_id = 'test-session-001';

-- 4. 테스트 데이터 삭제
DELETE FROM test_results WHERE session_id = 'test-session-001';
DELETE FROM user_sessions WHERE session_id = 'test-session-001';
```

## 📊 데이터 구조 예시

### test_results 예시

**SCAN 검사 (basic):**
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
    "leftSums": { "EI": 8, "SN": 15, "FT": 5, "PJ": 12, "DA": 9 },
    "rightSums": { "EI": 13, "SN": 12, "FT": 13, "PJ": 10, "DA": 13 },
    "greyZones": [],
    "badge": null
  }
}
```

**연애 검사 (dating):**
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
    "scores": { "확인형": 9, "몰입형": 15, "신중형": 17, "균형형": 42, "기준형": 13, "자유공감형": 4 },
    "confidence": 85,
    "radarData": [15, 25, 28, 70, 22, 7],
    "maxScore": 90
  }
}
```

## 🔒 보안 설정 확인

1. **Table Editor**에서 각 테이블 클릭
2. **Policies** 탭 확인
3. 다음 정책들이 설정되어 있는지 확인:
   - ✅ Users can view their own sessions
   - ✅ Users can insert their own sessions
   - ✅ Users can view their own test results
   - ✅ Anyone can view active share links

## 🐛 문제 해결

### 오류: "relation already exists"
- 테이블이 이미 존재하는 경우입니다.
- `DROP TABLE IF EXISTS` 문을 사용하거나, 기존 테이블을 삭제 후 다시 실행하세요.

### 오류: "permission denied"
- RLS 정책이 제대로 설정되지 않았을 수 있습니다.
- SQL 스크립트의 RLS 부분을 다시 실행하세요.

### 오류: "extension uuid-ossp does not exist"
- Supabase는 기본적으로 uuid-ossp가 활성화되어 있습니다.
- 문제가 지속되면 Supabase 지원팀에 문의하세요.

## 📚 다음 단계

1. ✅ 데이터베이스 스키마 생성 완료
2. ⏭️ Supabase 클라이언트 라이브러리 설치
3. ⏭️ API 연동 코드 작성
4. ⏭️ 테스트 및 검증

## 💡 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [PostgreSQL JSONB 가이드](https://www.postgresql.org/docs/current/datatype-json.html)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)
