import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TITLES: Record<string, string> = {
  'saju-love': '선천적 연애 궁합 (사주)',
  'post-29': '후천적 연애 궁합 (29조합)',
  'integrated-love': '통합 연애 궁합 + 코칭',
};

export const ComingSoonPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const title = (slug && TITLES[slug]) || '서비스';

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <p style={styles.badge}>준비 중</p>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.desc}>해당 기능은 곧 제공될 예정입니다.</p>
        <button type="button" style={styles.button} onClick={() => navigate(-1)}>
          이전으로
        </button>
        <button type="button" style={styles.buttonSecondary} onClick={() => navigate('/landing')}>
          홈으로
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#FFF8F5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    maxWidth: '400px',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '32px 24px',
    textAlign: 'center',
    boxShadow: '0 4px 24px rgba(90, 74, 66, 0.12)',
    border: '1px solid rgba(255, 182, 193, 0.35)',
  },
  badge: {
    display: 'inline-block',
    margin: '0 0 12px 0',
    padding: '4px 12px',
    borderRadius: '999px',
    backgroundColor: 'rgba(255, 182, 193, 0.35)',
    color: '#8B4513',
    fontSize: '13px',
    fontWeight: 600,
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '20px',
    fontWeight: 700,
    color: '#5A4A42',
    lineHeight: 1.4,
  },
  desc: {
    margin: '0 0 28px 0',
    fontSize: '15px',
    color: '#8B7355',
    lineHeight: 1.6,
  },
  button: {
    display: 'block',
    width: '100%',
    marginBottom: '10px',
    padding: '12px 16px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#FFF8F5',
    backgroundColor: '#C97B84',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  buttonSecondary: {
    display: 'block',
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    fontWeight: 500,
    color: '#5A4A42',
    backgroundColor: 'transparent',
    border: '1px solid rgba(90, 74, 66, 0.25)',
    borderRadius: '10px',
    cursor: 'pointer',
  },
};
