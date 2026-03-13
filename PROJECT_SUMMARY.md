# SCAN 프로젝트 - 작업 내용 정리

## 📋 프로젝트 개요

**프로젝트명**: SCAN - 사주 & 32 Spectrum 통합 분석 플랫폼  
**목적**: 선천적 성향(사주)과 후천적 성향(32 Spectrum)을 통합 분석하여 개인 맞춤형 인사이트 제공  
**기술 스택**: React 18, TypeScript, Vite, Tailwind CSS, Supabase

---

## 🏗️ 프로젝트 구조

```
mbti-project/
├── src/                          # React 애플리케이션 소스
│   ├── pages/                    # 페이지 컴포넌트 (25개)
│   ├── components/                # 재사용 컴포넌트 (15개)
│   ├── utils/                    # 유틸리티 함수
│   │   ├── sajuEngine.ts         # 사주 계산 엔진
│   │   ├── calculate.ts           # 32 Spectrum 계산 로직
│   │   ├── integratedReport.ts   # 통합 리포트 생성
│   │   └── storage.ts            # localStorage 관리
│   ├── data/                     # 데이터 파일
│   │   ├── sajuDb.ts             # 사주 콘텐츠 DB (10개 일간 × 8개 운세)
│   │   └── scanResultData.ts    # 32 Spectrum 타입 상세 정보
│   └── types/                    # TypeScript 타입 정의
├── scripts/                      # 데이터 처리 스크립트
│   ├── insert_saju_combinations.py  # Supabase 데이터 삽입
│   └── parse_saju_combinations.py   # 마크다운 → JSON 변환
├── supabase/                     # Supabase 마이그레이션
│   └── migrations/               # SQL 마이그레이션 파일
└── public/                       # 정적 파일
```

---

## ✨ 주요 기능

### 1. 사주 검사 (선천적 성향)
- **입력**: 이름, 생년월일, 출생시간(선택), 음력/양력, 성별
- **출력**: 사주 8글자, 일간, 오행, 운세 분석
- **콘텐츠**: 전체개관, 재물운, 애정운, 직업운, 성격운, 건강운, 가족운, 총운정리
- **페이지**: `/saju-intro` → `/fortune` → `/fortune-result` → `/fortune-report`

### 2. 32 Spectrum 검사 (후천적 성향)
- **입력**: 5개 축(EI, SN, FT, PJ, DA)에 대한 설문 답변
- **출력**: 타입 코드(예: INFJD), 축별 점수, Grey Zone 분석
- **특징**: 6단계 척도(L3, L2, L1, R1, R2, R3), Grey Zone 감지
- **페이지**: `/spectrum-intro` → `/survey` → `/result` → `/scan-result`

### 3. 통합 분석 리포트
- **입력**: 사주 결과 + 32 Spectrum 결과
- **출력**: 
  - 일치점 분석 (일치도 점수, 일치하는 특성)
  - 차이점 분석 (성장 기회, 균형 포인트)
  - 통합 인사이트 (강점, 주의점, 키워드)
  - 맞춤 코칭 (성장 방향, 관계, 커리어, 자기계발)
- **페이지**: `/integrated-result` → `/integrated-report`

### 4. 통합 결과 카드 (Supabase 연동)
- **데이터 소스**: Supabase `saju_combinations` 테이블
- **조회 조건**: 천간(cheongan) + 32 Spectrum 코드(mbti_code)
- **출력**: 조합 타입(일치형/보완형/갭형), 상황 분석, 코칭 가이드
- **페이지**: `/integrated-result-card`

---

## 📊 데이터 구조

### 사주 데이터 (SajuResult)
```typescript
{
  연주: { 천간: '甲', 지지: '子' },
  월주: { 천간: '乙', 지지: '丑' },
  일주: { 천간: '丙', 지지: '寅' },
  시주: { 천간: '丁', 지지: '卯' } | null,
  일간: '丙',
  오행: '火',
  input: { name, year, month, day, hour, isLunar, gender }
}
```

### 32 Spectrum 데이터 (CalculateResult)
```typescript
{
  typeCode: 'INFJD',
  scores: { EI: -5, SN: 2, FT: -3, PJ: 4, DA: -1 },
  leftSums: { EI: 15, SN: 8, ... },
  rightSums: { EI: 10, SN: 10, ... },
  summary: { isExtrovert: false, isSensing: false, ... },
  greyZones: [{ axis: 'DA', score: -1 }],
  badge: 'Flexible Adapter' | null,
  axisAnalysis: { EI: 'STRONG_NEGATIVE', ... },
  isGrayZone: { DA: true, ... }
}
```

### 통합 리포트 데이터 (IntegratedReport)
```typescript
{
  name: string,
  saju: { result: SajuResult, content: SajuFortune },
  scan: { result: CalculateResult, typeName: string },
  analysis: {
    alignment: { matchingTraits, alignmentScore, summary },
    gap: { differences, summary, growthPoints },
    insights: { lifeTheme, strengths, cautions, keywords, message },
    coaching: { growthDirection, relationship, career, selfDevelopment }
  }
}
```

---

## 🗄️ 데이터베이스 (Supabase)

### 테이블: `saju_combinations`
- **목적**: 사주 천간 × 32 Spectrum 조합별 통합 분석 데이터
- **주요 컬럼**:
  - `cheongan` (천간): '甲', '乙', '丙', ...
  - `mbti_code` (32 Spectrum 코드): 'INFJD', 'ESTJD', ...
  - `combo_type`: '일치형', '보완형', '갭형'
  - `gap_title`, `situation`, `analysis`, `reason`
  - `coaching_see`, `coaching_try`, `coaching_grow`
  - `strength_combo`

---

## 🎨 주요 페이지 라우팅

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | Landing | 메인 랜딩 페이지 |
| `/saju-intro` | 사주 소개 | 사주 검사 소개 및 시작 |
| `/fortune` | 사주 입력 | 생년월일 등 입력 폼 |
| `/fortune-result` | 사주 결과 | 사주 8글자 및 운세 분석 |
| `/fortune-report` | 사주 리포트 | 상세 운세 리포트 |
| `/spectrum-intro` | 32 Spectrum 소개 | 검사 소개 및 시작 |
| `/survey` | 설문 페이지 | 5개 축 설문 진행 |
| `/result` | 32 Spectrum 결과 | 타입 코드 및 분석 |
| `/scan-result` | 32 Spectrum 리포트 | 상세 결과 페이지 |
| `/integrated-result` | 통합 결과 진입 | 통합 분석 시작 |
| `/integrated-report` | 통합 리포트 | 상세 통합 분석 |
| `/integrated-result-card` | 통합 결과 카드 | Supabase 조합 데이터 |

---

## 🔧 핵심 로직

### 1. 사주 계산 (`sajuEngine.ts`)
- 연주, 월주, 일주, 시주 계산
- 일간 기반 오행 판별
- 음력/양력 변환 (구현 필요)

### 2. 32 Spectrum 계산 (`calculate.ts`)
- 6단계 척도 점수 변환 (1~6 → 좌우 점수)
- 5개 축별 점수 합산
- Grey Zone 감지 (절댓값 ≤ 3)
- 타입 코드 결정 (I/E, S/N, F/T, P/J, D/A)

### 3. 통합 분석 (`integratedReport.ts`)
- 오행 ↔ 32 Spectrum 매핑
- 일치도 점수 계산 (0~100)
- 일치/차이 특성 분석
- 맞춤 코칭 생성

---

## 📦 의존성 패키지

### 핵심 의존성
- `react`: ^18.3.1
- `react-dom`: ^18.3.1
- `react-router-dom`: ^7.13.0
- `@supabase/supabase-js`: ^2.98.0
- `uuid`: ^13.0.0

### 개발 의존성
- `typescript`: ^5.5.3
- `vite`: ^5.4.2
- `tailwindcss`: ^3.4.19
- `@vitejs/plugin-react`: ^4.3.1

---

## ✅ 완성된 기능

- [x] 랜딩 페이지 및 네비게이션
- [x] 사주 검사 전체 플로우 (입력 → 계산 → 결과 → 리포트)
- [x] 32 Spectrum 검사 전체 플로우 (소개 → 설문 → 결과)
- [x] 통합 리포트 생성 및 표시
- [x] Supabase 연동 (통합 결과 카드)
- [x] localStorage 기반 결과 저장/불러오기
- [x] 반응형 디자인 (모바일/데스크톱)
- [x] 다국어 지원 구조 (i18n)

---

## 🚧 개선 필요 사항

1. **사주 계산 정확도**
   - 현재 임시 계산 로직 사용
   - 실제 절기/율리우스력 기반 계산 필요
   - `saju-calendar.js` 데이터 활용 필요

2. **데이터 완성도**
   - Supabase `saju_combinations` 데이터 보강
   - 모든 천간 × 타입 조합 데이터 입력

3. **사용자 경험**
   - 결과 공유 기능
   - 히스토리 관리 개선
   - PDF 다운로드 기능

4. **성능 최적화**
   - 이미지 최적화
   - 코드 스플리팅
   - 캐싱 전략

---

## 📝 주요 파일 설명

### 핵심 유틸리티
- `src/utils/sajuEngine.ts`: 사주 계산 로직
- `src/utils/calculate.ts`: 32 Spectrum 점수 계산
- `src/utils/integratedReport.ts`: 통합 분석 생성
- `src/utils/storage.ts`: localStorage 래퍼

### 데이터 파일
- `src/data/sajuDb.ts`: 사주 콘텐츠 DB (80세트)
- `src/data/scanResultData.ts`: 32 Spectrum 타입 상세 (32개)

### 주요 페이지
- `src/pages/LandingPage.tsx`: 메인 랜딩
- `src/pages/FortunePage.tsx`: 사주 입력
- `src/pages/FortuneResultPage.tsx`: 사주 결과
- `src/pages/QuestionPage.tsx`: 32 Spectrum 설문
- `src/pages/IntegratedReportPage.tsx`: 통합 리포트

---

## 🎯 다음 단계 제안

1. **사주 계산 정확도 개선**
   - `saju-calendar.js` 통합
   - 절기 계산 로직 구현

2. **데이터베이스 보강**
   - 모든 조합 데이터 입력
   - 데이터 검증 스크립트

3. **추가 기능**
   - 결과 공유 (SNS, 링크)
   - PDF 리포트 생성
   - 사용자 계정 연동

4. **테스트 및 품질**
   - 단위 테스트 작성
   - E2E 테스트
   - 성능 모니터링

---

**작성일**: 2024년  
**버전**: 1.0.0
