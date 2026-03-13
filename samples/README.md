# 샘플 결과지

이 폴더에는 SCAN 프로젝트의 샘플 결과지 4개가 포함되어 있습니다.

## 📁 파일 목록

### 1. `sample_saju_result.json`
**사주 결과지 샘플 1개**
- **이름**: 김민지
- **일간**: 계수(癸水)
- **사주 8글자**: 乙亥 己卯 癸未 己未
- **포함 내용**: 전체개관, 재물운, 애정운, 직업운, 성격운, 건강운, 가족운, 총운정리

### 2. `sample_spectrum_result.json`
**32 Spectrum 결과지 샘플 1개**
- **이름**: 김민지
- **타입 코드**: INFJD (고요한 예언자)
- **축별 점수**: 
  - EI: -8 (내향성 강함)
  - SN: 4 (직관형)
  - FT: -6 (감정형)
  - PJ: 5 (판단형)
  - DA: -2 (Grey Zone)
- **포함 내용**: 타입 상세 정보, 강점, 약점, 조언

### 3. `sample_integrated_report_1.json`
**통합 결과지 샘플 1 - 일치형**
- **이름**: 김민지
- **사주**: 계수(癸水)
- **32 Spectrum**: INFJD
- **일치도**: 75% (높은 일치)
- **특징**: 선천적 기질과 현재 성향이 잘 일치하는 케이스
- **포함 내용**: 통합 인사이트, 일치점 분석, 차이점 분석, 맞춤 코칭

### 4. `sample_integrated_report_2.json`
**통합 결과지 샘플 2 - 보완형**
- **이름**: 박준호
- **사주**: 갑목(甲木)
- **32 Spectrum**: ENTJD
- **일치도**: 68% (보통 일치)
- **특징**: 일부 영역에서 차이가 있지만 보완적으로 작용하는 케이스
- **포함 내용**: 통합 인사이트, 일치점 분석, 차이점 분석, 맞춤 코칭

## 🔍 샘플 데이터 특징

### 샘플 1 (김민지 - 계수 × INFJD)
- **일치도**: 높음 (75%)
- **특징**: 
  - 둘 다 감성과 직관을 중시하는 성향
  - 치유와 영감의 에너지가 일치
  - Grey Zone(DA 축)으로 유연성 보유
- **성장 포인트**: 현실 감각과 감성의 균형

### 샘플 2 (박준호 - 갑목 × ENTJD)
- **일치도**: 보통 (68%)
- **특징**:
  - 둘 다 리더십과 추진력 강함
  - 원칙과 체계를 중시
  - SN, FT 축에서 차이 (성장 기회)
- **성장 포인트**: 논리와 감정의 조화, 감각과 직관의 균형

## 📊 데이터 구조

각 샘플 파일은 실제 애플리케이션에서 사용하는 데이터 구조와 동일합니다:

- **사주 결과**: `SajuResult` + `SajuFortune` 타입
- **32 Spectrum 결과**: `CalculateResult` + 타입 상세 정보
- **통합 리포트**: `IntegratedReport` 타입

## 🧪 테스트 용도

이 샘플들은 다음 용도로 활용할 수 있습니다:

1. **UI/UX 테스트**: 결과 페이지 렌더링 확인
2. **로직 검증**: 통합 분석 알고리즘 테스트
3. **데이터 검증**: 데이터 구조 및 타입 확인
4. **문서화**: 결과지 형식 예시 제공

## 💡 사용 방법

### JavaScript/TypeScript에서 사용
```typescript
import sajuResult from './samples/sample_saju_result.json';
import spectrumResult from './samples/sample_spectrum_result.json';
import integratedReport1 from './samples/sample_integrated_report_1.json';

// 사주 결과 사용
console.log(sajuResult.saju.일간); // "癸"

// 32 Spectrum 결과 사용
console.log(spectrumResult.result.typeCode); // "INFJD"

// 통합 리포트 사용
console.log(integratedReport1.analysis.alignment.alignmentScore); // 75
```

### 브라우저 콘솔에서 확인
```javascript
// 샘플 데이터 로드
fetch('/samples/sample_integrated_report_1.json')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 📝 참고사항

- 모든 샘플 데이터는 실제 사용자 정보가 아닌 가상의 데이터입니다.
- 날짜 및 시간은 예시용입니다.
- 실제 프로덕션에서는 사용자 개인정보 보호를 위해 샘플 데이터를 제거하세요.

---

**생성일**: 2024-12-19  
**버전**: 1.0.0
