import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIntegratedResult, getLatestScanResult } from '../utils/storage';

export const IntegratedResultPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [missingTests, setMissingTests] = useState<{ saju: boolean; scan: boolean }>({ saju: false, scan: false });

  useEffect(() => {
    loadIntegratedResult();
  }, []);

  const loadIntegratedResult = async () => {
    try {
      // localStorage에서 통합 분석 결과 확인
      const integratedResultData = localStorage.getItem('INTEGRATED_RESULT');
      
      if (integratedResultData) {
        // 통합 분석 결과가 있으면 index-saju.html로 리다이렉트
        // (통합 리포트는 index-saju.html에서 표시)
        window.location.href = '/index-saju.html';
        return;
      }

      // 통합 분석 결과가 없으면 사주와 SCAN 결과 확인
      const sajuResult = localStorage.getItem('saju_result');
      
      // 32 Spectrum 결과는 storage 유틸리티를 통해 확인
      let hasScanResult = false;
      let scanResultData = null;
      try {
        scanResultData = await getLatestScanResult();
        hasScanResult = !!scanResultData?.result;
      } catch (e) {
        console.error('32 Spectrum 결과 확인 오류:', e);
      }
      
      // sessionStorage에서도 확인
      if (!hasScanResult && typeof window !== 'undefined' && window.sessionStorage) {
        const sessionData = window.sessionStorage.getItem('scanResult');
        hasScanResult = !!sessionData;
        if (sessionData) {
          try {
            scanResultData = { result: JSON.parse(sessionData) };
          } catch (e) {
            console.error('sessionStorage 파싱 오류:', e);
          }
        }
      }
      
      // 사주와 32 Spectrum 결과가 모두 있으면 통합 리포트로 자동 이동
      if (sajuResult && hasScanResult) {
        console.log('IntegratedResultPage - 두 결과 모두 있음, 통합 리포트로 이동');
        navigate('/integrated-report');
        return;
      }
      
      setMissingTests({
        saju: !sajuResult,
        scan: !hasScanResult
      });
    } catch (error) {
      console.error('통합 분석 결과 불러오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  // 통합 분석 결과가 없는 경우
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
          <div style={styles.emptyIcon}>🔮</div>
          <h2 style={styles.emptyTitle}>검사 결과값이 없습니다</h2>
          <p style={styles.emptyMessage}>검사를 먼저 진행해주십시요</p>
        </div>
        <div style={styles.buttonContainer}>
          {missingTests.saju && (
            <button
              style={styles.testButton}
              onClick={() => navigate('/saju-intro')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 58, 139, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 58, 139, 0.3)';
              }}
            >
              <span style={styles.buttonIcon}>🌱</span>
              <span style={styles.buttonText}>선천적 성향(사주) 검사 하기</span>
              <span style={styles.buttonArrow}>→</span>
            </button>
          )}
          {missingTests.scan && (
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
          )}
          {!missingTests.saju && !missingTests.scan && (
            <div style={styles.infoBox}>
              <p style={styles.infoText}>
                통합 분석 리포트를 생성할 수 있습니다.
              </p>
              <button
                style={styles.testButton}
                onClick={() => navigate('/integrated-report')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 58, 139, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 58, 139, 0.3)';
                }}
              >
                <span style={styles.buttonIcon}>🔮</span>
                <span style={styles.buttonText}>통합 분석 리포트 보기</span>
                <span style={styles.buttonArrow}>→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
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
  infoBox: {
    textAlign: 'center',
    padding: '20px 0',
  },
  infoText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
    lineHeight: '1.6',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
    padding: '40px',
  },
};
