import React from 'react';

interface RadarChartProps {
  data: Record<string, number>; // 각 유형별 0~100 점수 객체
  primaryType: string; // 1위 유형명
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, primaryType }) => {
  // 유형별 색상
  const typeColors: Record<string, string> = {
    '확인형': '#E8548A',
    '몰입형': '#D63F6B',
    '신중형': '#3A8F65',
    '균형형': '#5B4FCF',
    '기준형': '#C0590A',
    '자유공감형': '#6A50D3',
  };

  // 유형 순서 (위쪽부터 시계방향)
  const typeOrder = ['확인형', '몰입형', '신중형', '균형형', '기준형', '자유공감형'];

  // SVG 설정
  const size = 280; // SVG 크기
  const center = size / 2;
  const maxRadius = 110; // 최대 반지름
  const numLevels = 5; // 배경 동심원 개수

  // 각도 계산 (위쪽부터 시계방향, 6개 점)
  const getAngle = (index: number) => {
    // 위쪽부터 시작: -90도 (12시 방향)
    // 시계방향으로 60도씩 증가
    return (-90 + index * 60) * (Math.PI / 180);
  };

  // 좌표 계산
  const getPoint = (index: number, radius: number) => {
    const angle = getAngle(index);
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  // 배경 동심원 생성
  const backgroundPolygons = [];
  for (let level = 1; level <= numLevels; level++) {
    const radius = (maxRadius / numLevels) * level;
    const points = typeOrder.map((_, index) => {
      const point = getPoint(index, radius);
      return `${point.x},${point.y}`;
    }).join(' ');
    backgroundPolygons.push(
      <polygon
        key={level}
        points={points}
        fill="none"
        stroke="#F0C0D4"
        strokeWidth="1"
      />
    );
  }

  // 중심에서 각 꼭짓점까지의 선
  const gridLines = typeOrder.map((_, index) => {
    const point = getPoint(index, maxRadius);
    return (
      <line
        key={index}
        x1={center}
        y1={center}
        x2={point.x}
        y2={point.y}
        stroke="#F0C0D4"
        strokeWidth="1"
      />
    );
  });

  // 데이터 영역 (폴리곤)
  const dataPoints = typeOrder.map((type, index) => {
    const value = data[type] || 0;
    const radius = (maxRadius * value) / 100;
    return getPoint(index, radius);
  });

  const dataPolygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');
  const primaryColor = typeColors[primaryType] || '#E8548A';
  
  // 30% 투명도로 변환 (hex to rgba)
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  const fillColor = hexToRgba(primaryColor, 0.3);

  // 꼭짓점 점들
  const vertexDots = typeOrder.map((type, index) => {
    const value = data[type] || 0;
    const radius = (maxRadius * value) / 100;
    const point = getPoint(index, radius);
    const color = typeColors[type] || '#999999';
    
    return (
      <circle
        key={type}
        cx={point.x}
        cy={point.y}
        r="5"
        fill={color}
        stroke="#FFFFFF"
        strokeWidth="2"
      />
    );
  });

  // 레이블 위치 계산 (꼭짓점 바깥쪽)
  const labelRadius = maxRadius + 25;
  const labels = typeOrder.map((type, index) => {
    const point = getPoint(index, labelRadius);
    const isPrimary = type === primaryType;
    const color = isPrimary ? typeColors[type] || '#E8548A' : '#999999';
    
    return (
      <text
        key={type}
        x={point.x}
        y={point.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="13"
        fontWeight={isPrimary ? '700' : '400'}
        fill={color}
      >
        {type}
      </text>
    );
  });

  return (
    <div style={styles.container}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={styles.svg}>
        {/* 배경 동심원 */}
        {backgroundPolygons}
        
        {/* 중심에서 꼭짓점까지의 선 */}
        {gridLines}
        
        {/* 데이터 영역 (폴리곤) */}
        <polygon
          points={dataPolygonPoints}
          fill={fillColor}
          stroke={primaryColor}
          strokeWidth="2"
        />
        
        {/* 꼭짓점 점들 */}
        {vertexDots}
        
        {/* 레이블 */}
        {labels}
      </svg>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  svg: {
    maxWidth: '100%',
    height: 'auto',
  },
};
