# 매칭 유형 링크 디버깅 가이드

## 확인 방법

1. **브라우저 개발자 도구 열기**
   - F12 키를 누르거나
   - 우클릭 → "검사" 또는 "개발자 도구"

2. **콘솔 탭 확인**
   - Console 탭을 열어서 다음 메시지들을 확인:
     - "유형 코드를 찾을 수 없습니다. 라인: ..." → 정규식이 매칭 실패
     - "유형 코드를 찾았지만 SCAN_TYPE_DETAILS에 없습니다: ..." → 데이터에 해당 유형이 없음

3. **Elements 탭에서 확인**
   - 매칭 유형 텍스트를 찾아서
   - 유형 코드 부분이 `<span>` 태그로 감싸져 있는지 확인
   - `style="color: rgb(200, 90, 122); font-weight: 700; text-decoration: underline; cursor: pointer;"` 같은 스타일이 있는지 확인

## 해결 방법

### 방법 1: 서버 재시작
```bash
# 터미널에서 Ctrl+C로 서버 중지 후
npm run dev
```

### 방법 2: 브라우저 캐시 삭제
- Ctrl+Shift+R (강력 새로고침)
- 또는 개발자 도구 → Network 탭 → "Disable cache" 체크

### 방법 3: 실제 데이터 형식 확인
브라우저 콘솔에서 다음 명령 실행:
```javascript
// 현재 표시되는 매칭 유형 데이터 확인
console.log(document.querySelectorAll('.matchingLine'));
```

## 예상되는 문제

1. **정규식이 매칭하지 못하는 경우**
   - 데이터 형식이 예상과 다를 수 있음
   - 예: "ENTJD[든든한 방패]" (공백 없음)

2. **스타일이 적용되지 않는 경우**
   - CSS 우선순위 문제
   - 인라인 스타일이 덮어씌워지는 경우

## 수동 테스트

브라우저 콘솔에서 다음 코드 실행:
```javascript
// 정규식 테스트
const testLine = "ENTJD [든든한 방패] : 내 전략을 큰 그림에서 인정함";
const match = testLine.match(/([A-Z]{5})(?=\s|\[|$)/);
console.log('매칭 결과:', match);
```
