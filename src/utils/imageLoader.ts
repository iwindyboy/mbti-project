/**
 * 이미지 로더 유틸리티
 * 웹 환경과 React Native 환경 모두 지원
 */

export interface ImageSource {
  uri?: string; // React Native용
  src?: string; // 웹용
  require?: any; // React Native require()용
}

/**
 * 타입별 이미지 경로 매핑
 * React Native에서는 require()를 사용하여 assets에서 로드
 */
export const getTypeImage = (typeCode: string): ImageSource => {
  // 웹 환경
  if (typeof window !== 'undefined' && !(window as any).ReactNativeWebView) {
    return {
      src: `/assets/images/types/${typeCode}.png`,
    };
  }
  
  // React Native 환경
  // TODO: React Native 전환 시 실제 이미지 파일 경로로 변경
  // 예: return { require: require(`../assets/images/types/${typeCode}.png`) };
  return {
    uri: `asset:/images/types/${typeCode}.png`, // Android
    // iOS의 경우: return { uri: require(`../assets/images/types/${typeCode}.png`) };
  };
};

/**
 * 배경 이미지 경로
 */
export const getBackgroundImage = (typeCode: string): ImageSource => {
  if (typeof window !== 'undefined' && !(window as any).ReactNativeWebView) {
    return {
      src: `/assets/images/backgrounds/${typeCode}_bg.png`,
    };
  }
  
  return {
    uri: `asset:/images/backgrounds/${typeCode}_bg.png`,
  };
};

/**
 * 결과 카드 배경 이미지
 */
export const getResultCardImage = (typeCode: string): ImageSource => {
  if (typeof window !== 'undefined' && !(window as any).ReactNativeWebView) {
    return {
      src: `/assets/images/cards/${typeCode}_card.png`,
    };
  }
  
  return {
    uri: `asset:/images/cards/${typeCode}_card.png`,
  };
};

/**
 * 이미지 로드 실패 시 기본 이미지
 */
export const getDefaultImage = (): ImageSource => {
  if (typeof window !== 'undefined' && !(window as any).ReactNativeWebView) {
    return {
      src: `/assets/images/default.png`,
    };
  }
  
  return {
    uri: `asset:/images/default.png`,
  };
};
