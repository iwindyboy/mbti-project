import { calculateAlignment, getExpectedTypeCode } from './alignmentMapper';

// ──── 테스트 1: 계수(癸) × INFJD (일치형) ────
const test1 = calculateAlignment('癸', {
  EI: -8,   // I (강함) → 계수 예상 I ✅
  SN: 4,    // N (보통) → 계수 예상 N ✅
  FT: -6,   // F (강함) → 계수 예상 F ✅
  PJ: 5,    // J (보통) → 계수 예상 P ❌ 갭
  DA: -2    // Grey Zone
});

console.log('=== 계수 × INFJD ===');
console.log(`일치도: ${test1.totalScore}점 ${test1.emoji} ${test1.label}`);
console.log(`일치 축: ${test1.matchedAxes.join(', ')}`);
console.log(`갭 축: ${test1.gapAxes.join(', ')}`);
console.log(`Grey Zone: ${test1.greyZoneAxes.join(', ')}`);
console.log(`계수 예상 코드: ${getExpectedTypeCode('癸')}`);
console.log('');

// ──── 테스트 2: 갑목(甲) × ENTJD (일치형) ────
const test2 = calculateAlignment('甲', {
  EI: 7,    // E (강함) → 갑목 예상 E ✅
  SN: -5,   // S (보통) → 갑목 예상 N ❌ 갭
  FT: 6,    // T (강함) → 갑목 예상 T ✅
  PJ: 8,    // J (강함) → 갑목 예상 J ✅
  DA: 4     // A (보통) → 갑목 예상 D ❌ 갭
});

console.log('=== 갑목 × ENTJD ===');
console.log(`일치도: ${test2.totalScore}점 ${test2.emoji} ${test2.label}`);
console.log(`일치 축: ${test2.matchedAxes.join(', ')}`);
console.log(`갭 축: ${test2.gapAxes.join(', ')}`);
console.log(`갑목 예상 코드: ${getExpectedTypeCode('甲')}`);

// ──── 테스트 3: 극단적 불일치 (계수 × ESTJA) ────
const test3 = calculateAlignment('癸', {
  EI: 12,   // E (강함) → 계수 예상 I ❌
  SN: -10,  // S (강함) → 계수 예상 N ❌
  FT: 8,    // T (강함) → 계수 예상 F ❌
  PJ: 9,    // J (강함) → 계수 예상 P ❌
  DA: -11   // D (강함) → 계수 예상 A ❌
});

console.log('=== 계수 × ESTJA (극단 불일치) ===');
console.log(`일치도: ${test3.totalScore}점 ${test3.emoji} ${test3.label}`);
