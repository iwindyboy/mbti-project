# MBTI Project - 사주 & 32 Spectrum 통합 분석

사주(선천적 성향)와 32 Spectrum(후천적 성향) 검사 결과를 통합 분석하는 프로젝트입니다.

## 프로젝트 구조

```
mbti-project/
├── src/                    # React 애플리케이션 소스 코드
├── scripts/                # 데이터 파싱 및 DB 삽입 스크립트
├── supabase/               # Supabase 마이그레이션 및 설정
├── saju-project/           # 사주 데이터 파일
├── combinations.json       # 사주-32 Spectrum 조합 데이터
└── index-saju.html         # 사주 결과 및 통합 리포트 페이지
```

## 시작하기

### 1. 저장소 클론

```bash
git clone <repository-url>
cd mbti-project
```

### 2. 의존성 설치

#### Node.js 패키지
```bash
npm install
```

#### Python 패키지 (스크립트 실행 시)
```bash
pip install -r requirements.txt
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

### 4. 개발 서버 실행

```bash
npm run dev
```

## 주요 기능

- **사주 검사**: 선천적 성향 분석
- **32 Spectrum 검사**: 후천적 성향 분석
- **통합 리포트**: 사주와 32 Spectrum 결과를 조합한 종합 분석

## 데이터베이스 설정

### Supabase 마이그레이션 실행

1. Supabase 프로젝트에 접속
2. SQL Editor에서 `supabase/migrations/` 폴더의 SQL 파일들을 순서대로 실행

### 데이터 삽입

```bash
# combinations.json을 Supabase에 삽입
python scripts/insert_saju_combinations.py
```

## 스크립트

- `scripts/parse_saju_combinations.py`: 마크다운 파일을 JSON으로 파싱
- `scripts/insert_saju_combinations.py`: JSON 데이터를 Supabase에 삽입

## 기술 스택

- **Frontend**: React, TypeScript, Vite
- **Backend**: Supabase
- **Scripts**: Python 3

## 라이선스

Private
