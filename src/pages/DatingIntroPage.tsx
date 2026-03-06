import React from 'react';
import { useNavigate } from 'react-router-dom';

export const DatingIntroPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.icon}>💕</div>
        <h1 style={styles.title}>SCAN 연애 정체성 검사</h1>
        <p style={styles.description}>
          당신의 연애 스타일과 심리를 분석하여<br />
          나만의 연애 유형을 찾아보세요.
        </p>
        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            • 시나리오 문항: 10개 (각 문항당 1개 선택)<br />
            • 랭킹 문항: 5개 (각 항목을 1~6위로 배열)<br />
            • 소요 시간: 약 3분 내외
          </p>
        </div>
        <button
          style={styles.startButton}
          onClick={() => navigate('/dating/my-type')}
          onTouchEnd={(e) => {
            e.preventDefault();
            navigate('/dating/my-type');
          }}
        >
          시작하기
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#FFF8F5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  content: {
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
  },
  icon: {
    fontSize: '64px',
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#E8548A',
    margin: '0 0 16px 0',
    lineHeight: '1.3',
  },
  description: {
    fontSize: '16px',
    color: '#5A4A42',
    lineHeight: '1.6',
    margin: '0 0 24px 0',
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '32px',
    border: '1px solid #FFE5F1',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  infoText: {
    fontSize: '14px',
    color: '#8B7355',
    lineHeight: '1.8',
    margin: 0,
    textAlign: 'left',
  },
  startButton: {
    width: '100%',
    padding: '16px 32px',
    fontSize: '18px',
    fontWeight: '700',
    backgroundColor: '#E8548A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(232, 84, 138, 0.3)',
  },
};
