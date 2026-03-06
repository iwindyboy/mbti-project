import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScanResults, ScanResultData, TestType } from '../utils/storage';

interface TestTypeInfo {
  type: TestType;
  name: string;
  icon: string;
  path: string;
}

const TEST_TYPES: TestTypeInfo[] = [
  { type: 'basic', name: 'SCAN 성향검사', icon: '🔍', path: '/survey' },
  { type: 'dating', name: '두근두근 연애 검사', icon: '💕', path: '/dating' },
  { type: 'career', name: '갓생 커리어 검사', icon: '💼', path: '/career' },
  { type: 'persona', name: '나의 페르소나 검사', icon: '🎭', path: '/persona' },
];

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
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

  const handleViewResult = (result: ScanResultData) => {
    // 결과 상세 페이지로 이동 (결과 데이터를 sessionStorage에 저장)
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem('scanResult', JSON.stringify(result.result));
      navigate('/result');
    }
  };

  // 검사 타입별로 결과 그룹화
  const getResultsByTestType = (testType: TestType): ScanResultData[] => {
    return results.filter(r => r.testType === testType);
  };

  // 검사를 진행한 타입만 필터링
  const completedTestTypes = TEST_TYPES.filter(testTypeInfo => {
    return getResultsByTestType(testTypeInfo.type).length > 0;
  });

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <p style={styles.loading}>로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>
          <span style={styles.icon}>📋</span>
          나의 검사 기록 보기
        </h1>

        {completedTestTypes.length === 0 ? (
          <div style={styles.emptyContainer}>
            <p style={styles.emptyText}>검사 기록이 없습니다.</p>
            <p style={styles.emptySubtext}>검사를 완료하면 여기에 기록이 표시됩니다.</p>
          </div>
        ) : (
          <div style={styles.testTypesList}>
            {completedTestTypes.map((testTypeInfo) => {
              const typeResults = getResultsByTestType(testTypeInfo.type);
              return (
                <div key={testTypeInfo.type} style={styles.testTypeSection}>
                  <div style={styles.testTypeHeader}>
                    <span style={styles.testTypeIcon}>{testTypeInfo.icon}</span>
                    <h2 style={styles.testTypeTitle}>{testTypeInfo.name}</h2>
                    <span style={styles.resultCount}>({typeResults.length}건)</span>
                  </div>
                  
                  <div style={styles.resultsList}>
                    {typeResults.map((result) => (
                      <div key={result.id} style={styles.resultCard}>
                        <div style={styles.resultHeader}>
                          <div style={styles.resultType}>{result.typeCode}</div>
                          <div style={styles.resultDate}>{formatDate(result.date)}</div>
                        </div>
                        <button
                          style={styles.viewButton}
                          onClick={() => handleViewResult(result)}
                        >
                          결과 보기
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#5A4A42',
    marginBottom: '40px',
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
    padding: '40px',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyText: {
    fontSize: '18px',
    color: '#5A4A42',
    marginBottom: '12px',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#8B7355',
    lineHeight: '1.6',
  },
  testTypesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  testTypeSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #FFE5F1',
  },
  testTypeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '2px solid #FFE5F1',
  },
  testTypeIcon: {
    fontSize: '28px',
  },
  testTypeTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#5A4A42',
    margin: 0,
    flex: 1,
  },
  resultCount: {
    fontSize: '14px',
    color: '#8B7355',
    fontWeight: '500',
  },
  resultsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  resultCard: {
    backgroundColor: '#FFF8F5',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #FFE5F1',
    transition: 'all 0.2s ease',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  resultType: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#C85A7A',
    letterSpacing: '2px',
  },
  resultDate: {
    fontSize: '13px',
    color: '#8B7355',
  },
  viewButton: {
    width: '100%',
    padding: '10px 20px',
    fontSize: '14px',
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
