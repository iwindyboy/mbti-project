import React from 'react';

export const LanguagePage: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>
          <span style={styles.icon}>🌐</span>
          언어 설정
        </h1>
        <p style={styles.description}>
          언어 설정 기능이 곧 추가될 예정입니다.
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#FFF8F5',
    padding: '20px',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#5A4A42',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  icon: {
    fontSize: '36px',
  },
  description: {
    fontSize: '16px',
    color: '#8B7355',
    lineHeight: '1.6',
  },
};
