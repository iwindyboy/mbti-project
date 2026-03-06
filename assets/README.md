# Assets 폴더 구조

React Native 하이브리드 앱을 위한 이미지 assets 구조입니다.

## 폴더 구조

```
assets/
├── images/
│   ├── types/          # 각 유형별 이미지 (32개)
│   │   ├── INTJD.png
│   │   ├── INTJA.png
│   │   ├── ENTJD.png
│   │   ├── ...
│   │   └── ESFPA.png
│   ├── backgrounds/    # 배경 이미지
│   │   ├── INTJD_bg.png
│   │   ├── INTJA_bg.png
│   │   └── ...
│   ├── cards/          # 결과 카드 이미지
│   │   ├── INTJD_card.png
│   │   ├── INTJA_card.png
│   │   └── ...
│   └── default.png     # 기본 이미지
```

## 이미지 규격

### 타입 이미지 (types/)
- 크기: 512x512px (고화질)
- 형식: PNG (투명 배경 권장)
- 용도: 각 MBTI 유형을 나타내는 아이콘/이미지

### 배경 이미지 (backgrounds/)
- 크기: 1920x1080px (고화질)
- 형식: PNG 또는 JPG
- 용도: 결과 카드 배경

### 결과 카드 이미지 (cards/)
- 크기: 1200x800px (고화질)
- 형식: PNG
- 용도: 최종 결과 카드에 표시될 완성된 이미지

## React Native에서 사용

React Native 프로젝트에서 이 폴더를 `assets/` 디렉토리로 복사하고:

```typescript
// 이미지 로드 예시
const typeImage = require('../assets/images/types/INTJD.png');
const cardImage = require('../assets/images/cards/INTJD_card.png');
```

## 웹 환경에서 사용

개발/테스트를 위해 `public/assets/` 폴더에 동일한 구조로 배치:

```
public/
└── assets/
    └── images/
        ├── types/
        ├── backgrounds/
        └── cards/
```
