# Supabase API 키 설정 가이드

## 📋 필요한 정보

Supabase API Keys 페이지에서 다음 정보를 복사해야 합니다:

1. **Project URL** - 프로젝트의 기본 URL
2. **Publishable Key** - 클라이언트 앱에서 사용할 공개 키

## 🔍 정보 찾는 방법

### 1. Project URL 확인

**방법 1: API Keys 페이지에서**
- API Keys 페이지 상단에 "Project URL" 또는 "API URL"이 표시됩니다
- 형식: `https://xxxxx.supabase.co`

**방법 2: Settings → General에서**
- Settings → General 메뉴로 이동
- "Reference ID" 또는 "Project URL" 확인

### 2. Publishable Key 복사

1. API Keys 페이지에서 **"Publishable key"** 섹션 찾기
2. "default" 키 옆의 **복사 아이콘** 클릭
3. 키 값 복사 (형식: `sb_publishable_...`)

⚠️ **주의**: Secret key는 복사하지 마세요! 서버에서만 사용하는 키입니다.

## 📝 환경 변수 설정

### 1. `.env` 파일 생성

프로젝트 루트 디렉토리에 `.env` 파일을 생성합니다.

### 2. 다음 내용 추가

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
```

**예시:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_wAj1gGgcInbjER9-QXfi4A_rHCAG...
```

### 3. 파일 저장

`.env` 파일을 저장합니다.

## ✅ 확인 방법

환경 변수가 제대로 설정되었는지 확인하려면:

1. 개발 서버 재시작 (`npm run dev`)
2. 브라우저 콘솔에서 확인:
   ```javascript
   console.log(import.meta.env.VITE_SUPABASE_URL);
   console.log(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
   ```

## 🔒 보안 주의사항

- ✅ `.env` 파일은 `.gitignore`에 포함되어 있는지 확인
- ✅ Publishable key는 공개되어도 안전합니다 (RLS로 보호됨)
- ❌ Secret key는 절대 클라이언트 코드에 포함하지 마세요
- ❌ `.env` 파일을 Git에 커밋하지 마세요

## 📚 다음 단계

환경 변수 설정이 완료되면:
1. Supabase 클라이언트 라이브러리 설치
2. Supabase 클라이언트 초기화 코드 작성
3. 데이터베이스 연동 테스트
