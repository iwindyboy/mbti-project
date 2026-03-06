import React from 'react';

interface ScanLogoProps {
  size?: number;
  color?: string;
}

export const ScanLogo: React.FC<ScanLogoProps> = ({ 
  size = 140, 
  color = '#C85A7A' 
}) => {
  return (
    <div style={styles.container}>
      <svg
        width={size}
        height={size * 0.5}
        viewBox="0 0 240 120"
        xmlns="http://www.w3.org/2000/svg"
        style={styles.svg}
      >
        <defs>
          {/* 그라데이션 정의 */}
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FF9BB3" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C85A7A" stopOpacity="1" />
          </linearGradient>
          
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFE5F1" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0.4" />
          </linearGradient>
          
          {/* 부드러운 그림자 필터 */}
          <filter id="softShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* 배경 장식 원형들 (부드러운 레이어) */}
        <circle
          cx="120"
          cy="60"
          r="45"
          fill="url(#accentGradient)"
          opacity="0.3"
        />
        <circle
          cx="120"
          cy="60"
          r="38"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="1.5"
          opacity="0.25"
        />
        
        {/* 장식 꽃잎 모양 (우아한 곡선) */}
        <g opacity="0.2">
          <path
            d="M 120 25 Q 135 30, 140 45 Q 135 40, 120 35 Q 105 40, 100 45 Q 105 30, 120 25 Z"
            fill="url(#logoGradient)"
          />
          <path
            d="M 155 60 Q 150 45, 140 50 Q 150 55, 155 60 Z"
            fill="url(#logoGradient)"
          />
          <path
            d="M 120 95 Q 135 90, 140 75 Q 135 80, 120 85 Q 105 80, 100 75 Q 105 90, 120 95 Z"
            fill="url(#logoGradient)"
          />
          <path
            d="M 85 60 Q 90 45, 100 50 Q 90 55, 85 60 Z"
            fill="url(#logoGradient)"
          />
        </g>
        
        {/* SCAN 텍스트 (우아한 스타일) */}
        <text
          x="120"
          y="72"
          fontSize="38"
          fontFamily='"Nanum Myeongjo", "나눔명조", "Noto Serif KR", "Batang", "Gungsuh", serif'
          fill="url(#logoGradient)"
          textAnchor="middle"
          fontWeight="500"
          letterSpacing="3"
          filter="url(#softShadow)"
        >
          SCAN
        </text>
        
        {/* 하단 장식 곡선 (흐르는 느낌) */}
        <path
          d="M 30 100 Q 60 95, 90 98 Q 120 100, 150 98 Q 180 95, 210 100"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          opacity="0.4"
          strokeLinecap="round"
        />
        <path
          d="M 40 108 Q 70 103, 100 106 Q 130 108, 160 106 Q 190 103, 200 108"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="1.5"
          opacity="0.3"
          strokeLinecap="round"
        />
        
        {/* 작은 별/반짝이 장식 */}
        <g opacity="0.5">
          <circle cx="50" cy="40" r="1.5" fill="url(#logoGradient)" />
          <circle cx="190" cy="35" r="1.5" fill="url(#logoGradient)" />
          <circle cx="45" cy="85" r="1" fill="url(#logoGradient)" />
          <circle cx="195" cy="90" r="1" fill="url(#logoGradient)" />
        </g>
      </svg>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '32px',
  },
  svg: {
    display: 'block',
  },
};
