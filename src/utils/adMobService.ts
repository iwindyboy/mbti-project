import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

// ⚠️ 테스트 ID — 프로덕션 배포 시 실제 ID로 교체 필요
const AD_IDS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
};

// ═══ 배너 광고 ═══
export async function showBanner(): Promise<void> {
  try {
    await AdMob.showBanner({
      adId: AD_IDS.banner,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true,
    });
  } catch (error) {
    console.error('배너 광고 표시 실패:', error);
  }
}

export async function hideBanner(): Promise<void> {
  try {
    await AdMob.hideBanner();
  } catch (error) {
    console.error('배너 광고 숨기기 실패:', error);
  }
}

// ═══ 전면 광고 ═══
export async function showInterstitial(): Promise<boolean> {
  try {
    await AdMob.prepareInterstitial({
      adId: AD_IDS.interstitial,
      isTesting: true,
    });
    await AdMob.showInterstitial();
    return true;
  } catch (error) {
    console.error('전면 광고 표시 실패:', error);
    return false;
  }
}

// ═══ 보상형 광고 ═══
export async function showRewarded(): Promise<boolean> {
  try {
    await AdMob.prepareRewardVideoAd({
      adId: AD_IDS.rewarded,
      isTesting: true,
    });

    return new Promise((resolve) => {
      // 보상 받았을 때
      AdMob.addListener('onRewardedVideoAdReward' as any, () => {
        resolve(true);
      });

      // 광고가 닫혔을 때 (보상 없이)
      AdMob.addListener('onRewardedVideoAdDismissed' as any, () => {
        resolve(false);
      });

      AdMob.showRewardVideoAd();
    });
  } catch (error) {
    console.error('보상형 광고 표시 실패:', error);
    return false;
  }
}

