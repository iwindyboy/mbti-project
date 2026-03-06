# 다른 컴퓨터에서 프로젝트 사용하기 가이드

이 가이드는 현재 작업 중인 프로젝트를 다른 컴퓨터에서도 Cursor로 열어서 조회/수정/사용할 수 있도록 설정하는 방법을 안내합니다.

## 📋 목차
1. [현재 상태 확인](#현재-상태-확인)
2. [원격 저장소 생성 (GitHub/GitLab)](#원격-저장소-생성)
3. [첫 커밋 및 푸시](#첫-커밋-및-푸시)
4. [다른 컴퓨터에서 클론하기](#다른-컴퓨터에서-클론하기)
5. [일상적인 작업 흐름](#일상적인-작업-흐름)
6. [주의사항](#주의사항)

---

## 현재 상태 확인

현재 프로젝트는 Git이 초기화되어 있고, 파일들이 staged 상태입니다. 하지만 아직 커밋이 없고 원격 저장소가 연결되어 있지 않습니다.

### 확인 명령어
```bash
# Git 상태 확인
git status

# 원격 저장소 확인 (현재 없음)
git remote -v
```

---

## 원격 저장소 생성

### 방법 1: GitHub 사용 (추천)

1. **GitHub 계정으로 로그인**
   - https://github.com 접속
   - 로그인 또는 계정 생성

2. **새 저장소 생성**
   - 우측 상단 `+` 버튼 클릭 → `New repository`
   - Repository name: `mbti-project` (또는 원하는 이름)
   - Description: 선택사항
   - Public 또는 Private 선택
   - **⚠️ 중요**: `Initialize this repository with a README` 체크하지 않기
   - `Create repository` 클릭

3. **저장소 URL 복사**
   - 생성된 페이지에서 HTTPS URL 복사
   - 예: `https://github.com/your-username/mbti-project.git`

### 방법 2: GitLab 사용

1. **GitLab 계정으로 로그인**
   - https://gitlab.com 접속
   - 로그인 또는 계정 생성

2. **새 프로젝트 생성**
   - `New project` → `Create blank project`
   - Project name: `mbti-project`
   - Visibility Level 선택
   - `Create project` 클릭

3. **프로젝트 URL 복사**
   - HTTPS URL 복사
   - 예: `https://gitlab.com/your-username/mbti-project.git`

---

## 첫 커밋 및 푸시

### 1단계: 첫 커밋 생성

```bash
# 현재 디렉토리 확인
cd C:\Users\cho_changgi\Desktop\mbti-project

# 모든 변경사항 커밋
git commit -m "Initial commit: MBTI project setup"

# 또는 더 자세한 커밋 메시지
git commit -m "Initial commit

- React + TypeScript 프로젝트 설정
- 32 Spectrum 검사 기능
- 사주(선천적 성향) 검사 기능
- 통합 분석 리포트 기능
- Supabase 연동 준비
- Python 스크립트 (데이터 파싱 및 DB 삽입)"
```

### 2단계: 원격 저장소 연결

```bash
# 원격 저장소 추가 (GitHub 예시)
git remote add origin https://github.com/your-username/mbti-project.git

# 또는 GitLab 예시
git remote add origin https://gitlab.com/your-username/mbti-project.git

# 연결 확인
git remote -v
```

### 3단계: 브랜치 이름 설정 (필요시)

```bash
# 기본 브랜치를 main으로 변경 (GitHub 권장)
git branch -M main

# 또는 master 유지
# git branch -M master
```

### 4단계: 원격 저장소에 푸시

```bash
# 첫 푸시
git push -u origin main
# 또는 master 브랜치 사용 시
# git push -u origin master

# 인증 정보 입력 (GitHub/GitLab 계정)
# Username: your-username
# Password: Personal Access Token (PAT) 사용 권장
```

### ⚠️ 인증 문제 해결

GitHub/GitLab은 2021년부터 비밀번호 인증을 중단했습니다. **Personal Access Token (PAT)**을 사용해야 합니다.

#### GitHub PAT 생성:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. `Generate new token (classic)` 클릭
3. Note: `mbti-project` 입력
4. Expiration: 원하는 기간 선택
5. Scopes: `repo` 체크
6. `Generate token` 클릭
7. **토큰을 복사** (다시 볼 수 없음!)
8. 푸시 시 Password 대신 이 토큰 사용

#### GitLab PAT 생성:
1. GitLab → Preferences → Access Tokens
2. Token name: `mbti-project`
3. Expiration date: 설정
4. Scopes: `write_repository` 체크
5. `Create personal access token` 클릭
6. 토큰 복사하여 사용

---

## 다른 컴퓨터에서 클론하기

### 1단계: Git 설치 확인

```bash
# Git 설치 확인
git --version

# 설치되어 있지 않다면
# Windows: https://git-scm.com/download/win
# Mac: brew install git
# Linux: sudo apt install git
```

### 2단계: 프로젝트 클론

```bash
# 원하는 위치로 이동
cd C:\Users\your-username\Desktop

# 저장소 클론
git clone https://github.com/your-username/mbti-project.git

# 또는 GitLab
git clone https://gitlab.com/your-username/mbti-project.git

# 프로젝트 폴더로 이동
cd mbti-project
```

### 3단계: 의존성 설치

```bash
# Node.js 패키지 설치
npm install

# Python 패키지 설치 (필요시)
pip install -r requirements.txt
```

### 4단계: 환경 변수 설정

`.env` 파일은 Git에 포함되지 않으므로 수동으로 생성해야 합니다.

```bash
# .env 파일 생성
# 프로젝트 루트에 .env 파일 생성 후 아래 내용 추가

# Supabase 설정
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

**⚠️ 중요**: `.env` 파일은 Git에 포함되지 않습니다. 각 컴퓨터에서 개별적으로 설정해야 합니다.

### 5단계: Cursor에서 열기

```bash
# Cursor로 프로젝트 열기
cursor .

# 또는 Cursor GUI에서 File → Open Folder → 프로젝트 폴더 선택
```

---

## 일상적인 작업 흐름

### 현재 컴퓨터에서 작업 후 푸시

```bash
# 변경사항 확인
git status

# 변경된 파일 추가
git add .

# 또는 특정 파일만 추가
git add src/pages/NewPage.tsx

# 커밋
git commit -m "Add new feature: integrated report"

# 원격 저장소에 푸시
git push
```

### 다른 컴퓨터에서 최신 변경사항 가져오기

```bash
# 원격 저장소의 최신 변경사항 가져오기
git pull

# 또는 fetch 후 merge
git fetch
git merge origin/main
```

### 충돌 해결

두 컴퓨터에서 같은 파일을 수정한 경우 충돌이 발생할 수 있습니다.

```bash
# 충돌 발생 시
git pull

# 충돌 파일 확인
git status

# 충돌 해결 후
git add .
git commit -m "Resolve merge conflicts"
git push
```

---

## 주의사항

### ✅ 안전하게 관리되는 항목
- 소스 코드 (`.ts`, `.tsx`, `.js`, `.py` 등)
- 설정 파일 (`package.json`, `tsconfig.json` 등)
- 문서 파일 (`.md` 파일)
- 데이터 파일 (`combinations.json` 등)

### ⚠️ Git에 포함되지 않는 항목
- `.env` 파일 (환경 변수)
- `node_modules/` (의존성 패키지)
- `dist/`, `build/` (빌드 결과물)
- 개인 설정 파일

### 🔒 민감한 정보 보호
- `.env` 파일은 절대 Git에 커밋하지 마세요
- Supabase 키, API 키 등은 환경 변수로 관리
- 각 컴퓨터에서 `.env` 파일을 개별적으로 설정

### 📦 대용량 파일 처리
- `combinations.json` 같은 데이터 파일은 Git에 포함 가능
- 하지만 매우 큰 파일(100MB 이상)은 Git LFS 사용 고려

---

## 문제 해결

### 원격 저장소 URL 변경
```bash
# 현재 원격 저장소 확인
git remote -v

# URL 변경
git remote set-url origin https://github.com/new-username/new-repo.git
```

### 브랜치 확인 및 전환
```bash
# 현재 브랜치 확인
git branch

# 다른 브랜치로 전환
git checkout branch-name

# 새 브랜치 생성 및 전환
git checkout -b new-feature
```

### 커밋 이력 확인
```bash
# 커밋 로그 확인
git log

# 간단한 로그
git log --oneline

# 그래프 형태
git log --graph --oneline --all
```

---

## 빠른 참조 명령어

```bash
# 상태 확인
git status

# 변경사항 확인
git diff

# 모든 변경사항 추가
git add .

# 커밋
git commit -m "커밋 메시지"

# 푸시
git push

# 풀 (가져오기)
git pull

# 원격 저장소 확인
git remote -v

# 브랜치 확인
git branch
```

---

## 추가 리소스

- [Git 공식 문서](https://git-scm.com/doc)
- [GitHub 가이드](https://guides.github.com/)
- [GitLab 문서](https://docs.gitlab.com/)

---

**질문이나 문제가 있으면 언제든지 물어보세요!** 🚀
