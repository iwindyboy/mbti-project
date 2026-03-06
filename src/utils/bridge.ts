/**
 * WebView-앱 브릿지 유틸리티
 * React Native WebView와 통신하기 위한 인터페이스
 */

export interface BridgeMessage {
  type: 'SURVEY_COMPLETE' | 'REQUEST_AD' | 'AD_COMPLETE' | 'AD_FAILED' | 'SHOW_RESULT';
  data?: any;
}

export interface SurveyCompleteData {
  result: any; // CalculateResult
  typeCode: string;
}

/**
 * WebView에서 앱으로 메시지 전송
 * React Native에서는 window.ReactNativeWebView.postMessage() 사용
 */
export const sendToNativeApp = (message: BridgeMessage): void => {
  if (typeof window !== 'undefined') {
    // React Native WebView 환경
    if ((window as any).ReactNativeWebView) {
      (window as any).ReactNativeWebView.postMessage(JSON.stringify(message));
    } 
    // 일반 웹 환경 (개발/테스트용)
    else {
      console.log('[Bridge] Web 환경 - 메시지 전송:', message);
      // 개발 환경에서는 콘솔에 출력
      if (process.env.NODE_ENV === 'development') {
        console.log('Native App으로 전송할 메시지:', JSON.stringify(message, null, 2));
      }
    }
  }
};

/**
 * 설문 완료 신호 전송
 */
export const sendSurveyComplete = (result: any): void => {
  sendToNativeApp({
    type: 'SURVEY_COMPLETE',
    data: {
      result,
      typeCode: result.typeCode,
    } as SurveyCompleteData,
  });
};

/**
 * 애드몹 보상형 광고 요청
 */
export const requestRewardedAd = (): void => {
  sendToNativeApp({
    type: 'REQUEST_AD',
  });
};

/**
 * 애드몹 광고 완료 신호
 */
export const sendAdComplete = (): void => {
  sendToNativeApp({
    type: 'AD_COMPLETE',
  });
};

/**
 * 애드몹 광고 실패 신호
 */
export const sendAdFailed = (error?: string): void => {
  sendToNativeApp({
    type: 'AD_FAILED',
    data: { error },
  });
};

/**
 * 결과 표시 요청
 */
export const requestShowResult = (): void => {
  sendToNativeApp({
    type: 'SHOW_RESULT',
  });
};

/**
 * 앱에서 WebView로 메시지 수신 (React Native에서 호출)
 */
export const setupMessageListener = (callback: (message: BridgeMessage) => void): (() => void) => {
  if (typeof window !== 'undefined') {
    const handleMessage = (event: MessageEvent) => {
      try {
        // React Native WebView에서 온 메시지
        if (event.data) {
          const message = typeof event.data === 'string' 
            ? JSON.parse(event.data) 
            : event.data;
          callback(message as BridgeMessage);
        }
      } catch (error) {
        console.error('[Bridge] 메시지 파싱 오류:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // cleanup 함수 반환
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }
  
  return () => {}; // 빈 cleanup 함수
};
