import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SCAN_TYPE_DETAILS } from '../data/scanResultData';
import { getTypeName } from '../utils/typeNames';

export const TypeDetailPage: React.FC = () => {
  const { typeCode } = useParams<{ typeCode: string }>();
  const navigate = useNavigate();
  const [typeData, setTypeData] = React.useState<any>(null);

  useEffect(() => {
    if (typeCode && SCAN_TYPE_DETAILS[typeCode]) {
      setTypeData(SCAN_TYPE_DETAILS[typeCode]);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      // 유형이 없으면 결과 페이지로 리다이렉트
      navigate('/result');
    }
  }, [typeCode, navigate]);

  if (!typeCode || !typeData) {
    return (
      <div style={styles.loadingContainer}>
        <h2>유형 정보를 불러오는 중...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* 헤더 */}
        <div style={styles.header}>
          <button 
            style={styles.backButton}
            onClick={() => navigate(-1)}
            title="뒤로 가기"
          >
            ←
          </button>
          <div style={styles.typeCode}>{typeCode}</div>
          <div style={styles.typeNameContainer}>
            <h1 style={styles.typeName}>{getTypeName(typeCode)}</h1>
            {typeData.badge && (
              <span style={styles.badge}>[{typeData.badge}]</span>
            )}
          </div>
        </div>

        {/* 성향 요약 */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>✨</span>
            <h3 style={styles.cardTitle}>성향 요약</h3>
          </div>
          <div style={styles.cardContent}>
            <p style={styles.cardText}>
              {typeData.summary || typeData.title}
            </p>
          </div>
        </div>

        {/* 강점 */}
        <div style={styles.cardStrength}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>💪</span>
            <h3 style={styles.cardTitle}>강점</h3>
          </div>
          <div style={styles.cardContent}>
            <p style={styles.cardText}>{typeData.strength}</p>
          </div>
        </div>

        {/* 약점 */}
        <div style={styles.cardWeakness}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>🌱</span>
            <h3 style={styles.cardTitle}>약점</h3>
          </div>
          <div style={styles.cardContent}>
            <p style={styles.cardText}>{typeData.weakness}</p>
          </div>
        </div>

        {/* 조언 */}
        <div style={styles.cardAdvice}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>💡</span>
            <h3 style={styles.cardTitle}>조언</h3>
          </div>
          <div style={styles.cardContent}>
            <p style={styles.cardText}>{typeData.advice}</p>
          </div>
        </div>

        {/* 뒤로 가기 버튼 */}
        <div style={styles.footer}>
          <button 
            style={styles.backToResultButton}
            onClick={() => navigate('/result')}
          >
            결과로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#FFF8F5',
    padding: '12px',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 8px 32px rgba(255, 182, 193, 0.15)',
    border: '1px solid #FFE5F1',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8F5',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
    paddingBottom: '20px',
    borderBottom: '2px solid #FFE5F1',
    background: 'linear-gradient(135deg, #FFF5F8 0%, #FFE5F1 100%)',
    borderRadius: '16px',
    padding: '20px',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.8)',
    border: '2px solid #FFB6C1',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '20px',
    color: '#C85A7A',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    fontWeight: 'bold',
  },
  typeCode: {
    fontSize: '36px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #FFB6C1 0%, #FF9BB3 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '12px',
    letterSpacing: '4px',
    textShadow: '0 2px 8px rgba(255, 182, 193, 0.2)',
  },
  typeNameContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '12px',
  },
  typeName: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#5A4A42',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  badge: {
    display: 'inline-block',
    padding: '8px 20px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#C85A7A',
    backgroundColor: '#FFF5F8',
    borderRadius: '24px',
    border: '2px solid #FFB6C1',
    boxShadow: '0 2px 8px rgba(255, 182, 193, 0.3)',
  },
  card: {
    backgroundColor: '#FFF5F8',
    borderRadius: '16px',
    padding: '0px',
    marginBottom: '16px',
    border: '1px solid #FFE5F1',
    boxShadow: '0 2px 12px rgba(255, 182, 193, 0.15)',
  },
  cardStrength: {
    backgroundColor: '#E8F5E9',
    borderRadius: '16px',
    padding: '0px',
    marginBottom: '16px',
    border: '1px solid #C8E6C9',
    boxShadow: '0 2px 12px rgba(76, 175, 80, 0.15)',
  },
  cardWeakness: {
    backgroundColor: '#FFF3E0',
    borderRadius: '16px',
    padding: '0px',
    marginBottom: '16px',
    border: '1px solid #FFE0B2',
    boxShadow: '0 2px 12px rgba(255, 152, 0, 0.15)',
  },
  cardAdvice: {
    backgroundColor: '#E3F2FD',
    borderRadius: '16px',
    padding: '0px',
    marginBottom: '16px',
    border: '1px solid #BBDEFB',
    boxShadow: '0 2px 12px rgba(33, 150, 243, 0.15)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px 20px 0 20px',
  },
  cardIcon: {
    fontSize: '24px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#5A4A42',
    margin: 0,
  },
  cardContent: {
    padding: '0 20px 20px 20px',
  },
  cardText: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#4A4A4A',
    margin: 0,
    whiteSpace: 'pre-line' as const,
  },
  footer: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '2px solid #FFE5F1',
    textAlign: 'center',
  },
  backToResultButton: {
    padding: '14px 32px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#FFB6C1',
    border: 'none',
    borderRadius: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(255, 182, 193, 0.3)',
  },
};
