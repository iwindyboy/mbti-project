# React Native 하이브리드 앱 설정 가이드

## 개요

이 프로젝트는 React Native 하이브리드 앱으로 전환될 예정입니다.
설문은 WebView를 통해 진행되고, 결과는 앱에서 네이티브 화면으로 표시됩니다.

## 아키텍처

```
┌─────────────────────────────────────┐
│   React Native App                   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  WebView (설문 진행)          │   │
│  │  - 질문 페이지                │   │
│  │  - 결과 계산                  │   │
│  │  - 브릿지로 앱에 신호 전송    │   │
│  └──────────────────────────────┘   │
│           │                          │
│           │ postMessage              │
│           ▼                          │
│  ┌──────────────────────────────┐   │
│  │  Native Screen (결과 표시)    │   │
│  │  - 애드몹 보상형 광고          │   │
│  │  - 결과 카드 (이미지 + 텍스트) │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 주요 기능

### 1. WebView-앱 브릿지

**WebView → 앱:**
- `SURVEY_COMPLETE`: 설문 완료 신호
- `REQUEST_AD`: 애드몹 광고 요청
- `SHOW_RESULT`: 결과 표시 요청

**앱 → WebView:**
- `RESULT_DATA`: 결과 데이터 전달
- `AD_REWARDED`: 광고 시청 완료
- `AD_FAILED`: 광고 실패

### 2. 이미지 Assets

모든 고화질 이미지는 앱 내 `assets/` 폴더에 저장:
- 타입별 이미지: `assets/images/types/{typeCode}.png`
- 결과 카드: `assets/images/cards/{typeCode}_card.png`
- 배경 이미지: `assets/images/backgrounds/{typeCode}_bg.png`

### 3. 애드몹 보상형 광고

결과 표시 직전에 보상형 광고 실행:
1. 설문 완료 → 앱에 신호 전송
2. 앱에서 광고 로드 및 표시
3. 광고 시청 완료 → 결과 카드 표시

## React Native 구현 체크리스트

### 1. 프로젝트 설정

```bash
# React Native 프로젝트 생성
npx react-native init MBTIApp

# 필요한 패키지 설치
npm install react-native-webview
npm install @react-native-community/async-storage
npm install react-native-admob
```

### 2. WebView 컴포넌트

```typescript
// App.tsx
import { WebView } from 'react-native-webview';

const SURVEY_URL = 'https://your-survey-url.com';

function App() {
  const handleMessage = (event: any) => {
    const message = JSON.parse(event.nativeEvent.data);
    
    switch (message.type) {
      case 'SURVEY_COMPLETE':
        // 결과 데이터 저장
        // 애드몹 광고 로드 및 표시
        break;
      case 'REQUEST_AD':
        // 광고 요청 처리
        break;
    }
  };

  return (
    <WebView
      source={{ uri: SURVEY_URL }}
      onMessage={handleMessage}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
}
```

### 3. 애드몹 설정

```typescript
// AdMobService.ts
import { RewardedAd, RewardedAdEventType } from '@react-native-admob/admob';

const adUnitId = __DEV__ 
  ? 'ca-app-pub-3940256099942544/5224354917' // 테스트
  : 'ca-app-pub-xxxxxxxxxxxxx/xxxxxxxxxx'; // 실제

export const showRewardedAd = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const rewarded = RewardedAd.createForAdRequest(adUnitId);
    
    rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      rewarded.show();
    });
    
    rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      resolve();
    });
    
    rewarded.addAdEventListener(RewardedAdEventType.ERROR, (error) => {
      reject(error);
    });
    
    rewarded.load();
  });
};
```

### 4. 결과 카드 화면

```typescript
// ResultCardScreen.tsx
import { Image } from 'react-native';
import { resultCardData } from './utils/resultCard';

function ResultCardScreen({ resultData }: { resultData: ResultCardData }) {
  return (
    <View>
      <Image 
        source={require(`../assets/images/cards/${resultData.typeCode}_card.png`)}
        style={{ width: '100%', height: 400 }}
      />
      <Text>{resultData.typeName}</Text>
      <Text>{resultData.summary.description}</Text>
      {/* ... */}
    </View>
  );
}
```

### 5. 이미지 Assets 설정

1. `assets/images/` 폴더를 React Native 프로젝트 루트에 복사
2. `react-native.config.js` 설정:

```javascript
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/images/'],
};
```

3. 이미지 링크:
```bash
npx react-native-asset
```

## 테스트

### 웹 환경 테스트
- 현재 웹 프로젝트에서 모든 기능 테스트 가능
- WebView 시뮬레이션: 브라우저 개발자 도구에서 확인

### React Native 테스트
- Android/iOS 에뮬레이터에서 WebView 테스트
- 실제 디바이스에서 애드몹 광고 테스트

## 주의사항

1. **이미지 최적화**: 고화질 이미지는 용량이 클 수 있으니 최적화 필요
2. **광고 단위 ID**: 실제 배포 시 테스트 ID를 실제 ID로 변경
3. **보안**: WebView URL은 HTTPS 필수
4. **오프라인**: 이미지는 앱 내부에 있어 오프라인에서도 표시 가능
