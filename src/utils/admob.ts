/**
 * 애드몹 보상형 광고 브릿지
 * React Native에서 애드몹 광고를 제어하기 위한 인터페이스
 */

export interface AdMobConfig {
  adUnitId: string; // 테스트용 또는 실제 광고 단위 ID
  isTestMode?: boolean;
}

/**
 * 애드몹 보상형 광고 상태
 */
export enum AdMobStatus {
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  SHOWING = 'SHOWING',
  REWARDED = 'REWARDED',
  FAILED = 'FAILED',
  CLOSED = 'CLOSED',
}

export interface AdMobReward {
  type: string;
  amount: number;
}

/**
 * 애드몹 광고 이벤트 리스너 타입
 */
export type AdMobEventListener = (status: AdMobStatus, data?: any) => void;

/**
 * 애드몹 브릿지 클래스
 * React Native에서 실제 구현 필요
 */
export class AdMobBridge {
  private listeners: AdMobEventListener[] = [];
  private config: AdMobConfig | null = null;

  /**
   * 애드몹 초기화
   */
  initialize(config: AdMobConfig): void {
    this.config = config;
    
    if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
      // React Native 환경
      this.notifyListeners(AdMobStatus.LOADED);
    } else {
      // 웹 환경 (개발/테스트용)
      console.log('[AdMob] 웹 환경 - 초기화 완료 (테스트 모드)');
      this.notifyListeners(AdMobStatus.LOADED);
    }
  }

  /**
   * 보상형 광고 로드
   */
  loadRewardedAd(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.config) {
        reject(new Error('AdMob not initialized'));
        return;
      }

      if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
        // React Native 환경 - 실제 광고 로드
        // React Native에서 구현 필요
        this.notifyListeners(AdMobStatus.LOADING);
        
        // 시뮬레이션 (실제로는 React Native에서 처리)
        setTimeout(() => {
          this.notifyListeners(AdMobStatus.LOADED);
          resolve();
        }, 1000);
      } else {
        // 웹 환경 (개발/테스트용)
        console.log('[AdMob] 웹 환경 - 광고 로드 시뮬레이션');
        this.notifyListeners(AdMobStatus.LOADING);
        
        setTimeout(() => {
          this.notifyListeners(AdMobStatus.LOADED);
          resolve();
        }, 500);
      }
    });
  }

  /**
   * 보상형 광고 표시
   */
  showRewardedAd(): Promise<AdMobReward | null> {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
        // React Native 환경
        this.notifyListeners(AdMobStatus.SHOWING);
        
        // React Native에서 실제 광고 표시
        // 실제 구현은 React Native에서 처리
        // 시뮬레이션
        setTimeout(() => {
          this.notifyListeners(AdMobStatus.REWARDED, { type: 'reward', amount: 1 });
          resolve({ type: 'reward', amount: 1 });
        }, 2000);
      } else {
        // 웹 환경 (개발/테스트용)
        console.log('[AdMob] 웹 환경 - 광고 표시 시뮬레이션');
        this.notifyListeners(AdMobStatus.SHOWING);
        
        // 사용자 확인 후 시뮬레이션
        const confirmed = window.confirm('보상형 광고를 시청하시겠습니까? (테스트 모드)');
        
        if (confirmed) {
          setTimeout(() => {
            this.notifyListeners(AdMobStatus.REWARDED, { type: 'reward', amount: 1 });
            resolve({ type: 'reward', amount: 1 });
          }, 1500);
        } else {
          this.notifyListeners(AdMobStatus.CLOSED);
          reject(new Error('User cancelled'));
        }
      }
    });
  }

  /**
   * 이벤트 리스너 추가
   */
  addEventListener(listener: AdMobEventListener): () => void {
    this.listeners.push(listener);
    
    // cleanup 함수 반환
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * 리스너에게 알림
   */
  private notifyListeners(status: AdMobStatus, data?: any): void {
    this.listeners.forEach(listener => {
      try {
        listener(status, data);
      } catch (error) {
        console.error('[AdMob] 리스너 오류:', error);
      }
    });
  }

  /**
   * React Native에서 호출할 수 있는 메서드 (앱에서 광고 완료 시)
   */
  onAdRewarded(reward: AdMobReward): void {
    this.notifyListeners(AdMobStatus.REWARDED, reward);
  }

  /**
   * React Native에서 호출할 수 있는 메서드 (앱에서 광고 실패 시)
   */
  onAdFailed(error: string): void {
    this.notifyListeners(AdMobStatus.FAILED, { error });
  }

  /**
   * React Native에서 호출할 수 있는 메서드 (앱에서 광고 닫힘 시)
   */
  onAdClosed(): void {
    this.notifyListeners(AdMobStatus.CLOSED);
  }
}

// 싱글톤 인스턴스
export const adMobBridge = new AdMobBridge();
