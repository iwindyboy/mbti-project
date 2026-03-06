/**
 * Navigation 유틸리티
 * React Native로 전환 시 React Navigation으로 쉽게 교체할 수 있도록 추상화
 */

// 결과 데이터 저장 (React Native 호환)
export const saveResult = (result: any): void => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    // 웹 환경
    sessionStorage.setItem('scanResult', JSON.stringify(result));
  } else {
    // React Native 환경에서는 AsyncStorage 등을 사용
    // TODO: React Native 전환 시 AsyncStorage로 변경
    console.log('React Native: 결과 저장 필요', result);
  }
};

// 결과 데이터 불러오기
export const loadResult = (): any | null => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    // 웹 환경
    const stored = sessionStorage.getItem('scanResult');
    return stored ? JSON.parse(stored) : null;
  } else {
    // React Native 환경
    // TODO: React Native 전환 시 AsyncStorage로 변경
    return null;
  }
};

// 결과 데이터 삭제
export const clearResult = (): void => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    // 웹 환경
    sessionStorage.removeItem('scanResult');
  } else {
    // React Native 환경
    // TODO: React Native 전환 시 AsyncStorage로 변경
  }
};
