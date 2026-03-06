# Git 저장소 설정 가이드

다른 컴퓨터에서도 프로젝트를 조회/수정/사용할 수 있도록 Git을 설정하는 방법입니다.

## 1단계: 현재 컴퓨터에서 초기 커밋 생성

### 1-1. 모든 파일 추가
```bash
git add .
```

### 1-2. 첫 커밋 생성
```bash
git commit -m "Initial commit: MBTI Project with Saju & 32 Spectrum integration"
```

## 2단계: 원격 저장소 생성 (GitHub/GitLab)

### GitHub 사용 시:
1. https://github.com 에 로그인
2. 우측 상단 "+" 버튼 클릭 → "New repository" 선택
3. Repository name 입력 (예: `mbti-project`)
4. **Private** 선택 (프로젝트가 비공개인 경우)
5. "Create repository" 클릭
6. 생성된 페이지에서 **HTTPS URL** 복사 (예: `https://github.com/username/mbti-project.git`)

### GitLab 사용 시:
1. https://gitlab.com 에 로그인
2. "New project" → "Create blank project" 선택
3. Project name 입력
4. Visibility Level을 **Private**로 설정
5. "Create project" 클릭
6. 생성된 페이지에서 **HTTPS URL** 복사

## 3단계: 원격 저장소 연결 및 푸시

### 3-1. 원격 저장소 추가
```bash
git remote add origin <복사한-URL>
# 예: git remote add origin https://github.com/username/mbti-project.git
```

### 3-2. 원격 저장소 확인
```bash
git remote -v
```

### 3-3. 메인 브랜치 이름 설정 (필요한 경우)
```bash
git branch -M main
```

### 3-4. 원격 저장소에 푸시
```bash
git push -u origin main
```

**참고**: GitHub/GitLab 인증이 필요할 수 있습니다.
- Personal Access Token 사용 (권장)
- 또는 SSH 키 설정

## 4단계: 다른 컴퓨터에서 프로젝트 클론

### 4-1. Git 설치 확인
```bash
git --version
```

### 4-2. 프로젝트 클론
```bash
git clone <원격-저장소-URL>
# 예: git clone https://github.com/username/mbti-project.git
cd mbti-project
```

### 4-3. 의존성 설치
```bash
# Node.js 패키지
npm install

# Python 패키지 (스크립트 사용 시)
pip install -r requirements.txt
```

### 4-4. 환경 변수 설정
`.env` 파일을 생성하고 Supabase 정보를 입력하세요.
(원격 저장소에는 `.env` 파일이 포함되지 않습니다 - 보안상 안전합니다)

## 5단계: 일상적인 작업 흐름

### 변경사항 확인
```bash
git status
```

### 변경사항 커밋
```bash
git add .
git commit -m "변경 내용 설명"
```

### 원격 저장소에 푸시
```bash
git push
```

### 다른 컴퓨터에서 최신 변경사항 가져오기
```bash
git pull
```

## 주의사항

### ⚠️ 민감한 정보는 절대 커밋하지 마세요
- `.env` 파일 (이미 .gitignore에 포함됨)
- API 키, 비밀번호 등
- 개인 정보

### ✅ 커밋 전 확인사항
```bash
# 커밋될 파일 확인
git status

# 변경 내용 확인
git diff
```

## 문제 해결

### 인증 오류 발생 시
1. **Personal Access Token 생성** (GitHub/GitLab)
   - GitHub: Settings → Developer settings → Personal access tokens
   - GitLab: Preferences → Access Tokens
2. 토큰을 비밀번호 대신 사용

### 충돌 발생 시
```bash
# 최신 변경사항 가져오기
git pull

# 충돌 해결 후
git add .
git commit -m "Merge conflict resolved"
git push
```

## 추가 팁

### 브랜치 사용 (선택사항)
```bash
# 새 브랜치 생성
git checkout -b feature/new-feature

# 브랜치 전환
git checkout main

# 브랜치 병합
git merge feature/new-feature
```

### 변경 이력 확인
```bash
git log
git log --oneline  # 간단한 버전
```
