import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScanResults, ScanResultData } from '../utils/storage';
// import { useI18n } from '../utils/i18n';

export const MyResultsPage: React.FC = () => {
  const navigate = useNavigate();
  // const { t } = useI18n();
  const t = (key: string) => {
    const map: Record<string, string> = {
      'common.loading': '로딩 중...',
      'pages.myResults.title': '지난 나의 결과 보기',
      'pages.myResults.noResults': '저장된 결과가 없습니다.',
      'pages.myResults.viewDetail': '상세 보기',
    };
    return map[key] || key;
  };
  const [results, setResults] = useState<ScanResultData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const data = await getScanResults();
      setResults(data);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return dateString;
    }
  };

  const handleViewDetail = (result: ScanResultData) => {
    // 결과 상세 페이지로 이동 (결과 데이터를 sessionStorage에 저장)
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem('scanResult', JSON.stringify(result.result));
      navigate('/result');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <p style={styles.loading}>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>
          <span style={styles.icon}>📊</span>
          {t('pages.myResults.title')}
        </h1>

        {results.length === 0 ? (
          <div style={styles.emptyContainer}>
            <p style={styles.emptyText}>{t('pages.myResults.noResults')}</p>
          </div>
        ) : (
          <div style={styles.resultsList}>
            {results.map((result) => (
              <div key={result.id} style={styles.resultCard}>
                <div style={styles.resultHeader}>
                  <div style={styles.resultType}>{result.typeCode}</div>
                  <div style={styles.resultDate}>{formatDate(result.date)}</div>
                </div>
                <button
                  style={styles.viewButton}
                  onClick={() => handleViewDetail(result)}
                >
                  {t('pages.myResults.viewDetail')}
                </button>
              </div>
            ))}
          </div>
        )}
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
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#5A4A42',
    marginBottom: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  icon: {
    fontSize: '36px',
  },
  loading: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#8B7355',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#8B7355',
    lineHeight: '1.6',
  },
  resultsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #FFE5F1',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  resultType: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#C85A7A',
    letterSpacing: '2px',
  },
  resultDate: {
    fontSize: '14px',
    color: '#8B7355',
  },
  viewButton: {
    width: '100%',
    padding: '12px 20px',
    fontSize: '15px',
    fontWeight: '600',
    backgroundColor: '#FFB6C1',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 2px 8px rgba(255, 182, 193, 0.3)',
  },
};
