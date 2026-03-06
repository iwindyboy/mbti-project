import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.label}>
        <span style={styles.title}>32 Spectrum</span>
        <span style={styles.emoji}>✨</span> {currentStep} / {totalSteps} 단계
      </div>
      <div style={styles.barContainer}>
        <div style={styles.barBackground}>
          <div
            style={{
              ...styles.barFill,
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '12px 16px',
    backgroundColor: '#FFFFFF',
    borderBottom: '2px solid #FFE5F1',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
    boxShadow: '0 2px 12px rgba(255, 182, 193, 0.1)',
  },
  label: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#C85A7A',
    marginBottom: '10px',
    textAlign: 'center' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  title: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#C85A7A',
  },
  emoji: {
    fontSize: '18px',
    marginRight: '0px',
  },
  barContainer: {
    width: '100%',
  },
  barBackground: {
    width: '100%',
    height: '12px',
    backgroundColor: '#FFE5F1',
    borderRadius: '20px',
    overflow: 'hidden' as const,
    boxShadow: 'inset 0 2px 4px rgba(255, 182, 193, 0.2)',
  },
  barFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #FFB6C1 0%, #FF9BB3 100%)',
    borderRadius: '20px',
    transition: 'width 0.5s ease',
    boxShadow: '0 2px 8px rgba(255, 182, 193, 0.4)',
  },
};
