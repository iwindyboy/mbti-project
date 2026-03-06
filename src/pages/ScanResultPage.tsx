import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLatestScanResult } from '../utils/storage';
import { ResultPage } from '../components/ResultPage';
import { CalculateResult } from '../utils/calculate';

export const ScanResultPage: React.FC = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<CalculateResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResult();
  }, []);

  const loadResult = async () => {
    try {
      const scanResultData = await getLatestScanResult();
      
      if (!scanResultData || !scanResultData.result) {
        setLoading(false);
        return;
      }

      setResult(scanResultData.result as CalculateResult);
    } catch (error) {
      console.error('32 Spectrum 결과 불러오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    navigate('/spectrum-intro');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.header}>
            <button 
              style={styles.backButton}
              onClick={() => navigate('/landing')}
            >
              ← 뒤로 가기
            </button>
          </div>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📊</div>
            <h2 style={styles.emptyTitle}>검사 결과값이 없습니다</h2>
            <p style={styles.emptyMessage}>검사를 먼저 진행해주십시요</p>
          </div>
          <div style={styles.buttonContainer}>
            <button
              style={styles.testButton}
              onClick={() => navigate('/spectrum-intro')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 58, 139, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 58, 139, 0.3)';
              }}
            >
              <span style={styles.buttonIcon}>🔄</span>
              <span style={styles.buttonText}>후천적 성향(32 Spectrum) 검사하기</span>
              <span style={styles.buttonArrow}>→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <ResultPage result={result} onReset={handleReset} />;
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#FAF5FF',
    padding: '20px',
  },
  content: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  header: {
    marginBottom: '20px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: '#8B3A8B',
    cursor: 'pointer',
    padding: '8px 0',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px 40px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '24px',
  },
  emptyTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#2D1B40',
    margin: '0 0 12px 0',
  },
  emptyMessage: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
    lineHeight: '1.6',
  },
  buttonContainer: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  testButton: {
    width: '100%',
    backgroundColor: '#8B3A8B',
    background: 'linear-gradient(135deg, #8B3A8B 0%, #6B2FA0 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    padding: '18px 24px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    boxShadow: '0 4px 12px rgba(139, 58, 139, 0.3)',
    transition: 'all 0.3s ease',
  },
  buttonIcon: {
    fontSize: '24px',
  },
  buttonText: {
    flex: 1,
    textAlign: 'left',
  },
  buttonArrow: {
    fontSize: '20px',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
    padding: '40px',
  },
};
