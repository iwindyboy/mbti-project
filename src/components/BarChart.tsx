import React from 'react';

interface BarChartProps {
  data: number[]; // 6개 유형의 barPct (0~100)
  labels: string[]; // 6개 유형 이름
  coreType: string; // 주요 유형
  subType: string; // 서브 유형
  normalizedScores: Record<string, { score: number; displayPct: number; barPct: number }>;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  labels,
  coreType,
  subType,
  normalizedScores,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.chartContainer}>
        {labels.map((label, index) => {
          const normalized = normalizedScores[label];
          const barPct = normalized?.barPct || 0;
          const displayPct = normalized?.displayPct || 0;
          const isCore = label === coreType;
          const isSub = label === subType;
          
          return (
            <div key={index} style={styles.barItem}>
              <span style={{
                ...styles.label,
                fontWeight: isCore ? '700' : isSub ? '600' : '400',
                color: isCore ? '#E8548A' : isSub ? '#FFB6C1' : '#5A4A42',
              }}>
                {label}
              </span>
              <div style={styles.barContainer}>
                <div
                  style={{
                    ...styles.bar,
                    width: `${barPct}%`,
                    backgroundColor: isCore 
                      ? '#E8548A' 
                      : isSub 
                      ? '#FFB6C1' 
                      : '#FFE5F1',
                    boxShadow: isCore
                      ? '0 2px 8px rgba(232, 84, 138, 0.3)'
                      : isSub
                      ? '0 2px 8px rgba(255, 182, 193, 0.3)'
                      : 'none',
                  }}
                />
                <span style={{
                  ...styles.percentage,
                  left: `${barPct}%`,
                  fontWeight: isCore ? '700' : isSub ? '600' : '400',
                  color: isCore ? '#E8548A' : isSub ? '#FFB6C1' : '#5A4A42',
                }}>
                  {displayPct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    padding: '20px',
  },
  chartContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  barItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  label: {
    fontSize: '14px',
    color: '#5A4A42',
    minWidth: '80px',
    flexShrink: 0,
  },
  percentage: {
    fontSize: '13px',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    whiteSpace: 'nowrap',
    marginLeft: '8px',
  },
  barContainer: {
    flex: 1,
    height: '32px',
    backgroundColor: '#F5F5F5',
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
  },
  bar: {
    height: '100%',
    borderRadius: '16px',
    transition: 'width 0.5s ease',
    minWidth: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '8px',
  },
};
