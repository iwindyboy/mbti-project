import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatingResult } from '../utils/datingCalculate';
import { RadarChart } from '../components/RadarChart';
import { datingTypeDetails } from '../constants/datingTypeDetails';

export const DatingResultPage: React.FC = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<DatingResult | null>(null);

  useEffect(() => {
    // sessionStorage에서 결과 가져오기
    const resultData = sessionStorage.getItem('datingResult');
    if (resultData) {
      try {
        const parsed = JSON.parse(resultData);
        setResult(parsed);
      } catch (error) {
        console.error('Error parsing result', error);
        navigate('/dating');
      }
    } else {
      navigate('/dating');
    }
  }, [navigate]);

  if (!result) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>결과를 불러오는 중...</div>
      </div>
    );
  }

  const typeDetail = datingTypeDetails[result.coreType];
  if (!typeDetail) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>결과 데이터 오류</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button 
          style={styles.backButton}
          onClick={() => navigate('/dating')}
        >
          ← 뒤로 가기
        </button>
        <h1 style={styles.title}>나의 연애 유형 검사 결과</h1>
      </div>

      <div style={styles.content}>
        {/* 유형 헤더 */}
        <div style={styles.typeHeader}>
          <div style={styles.typeEmoji}>{typeDetail.emoji}</div>
          <h2 style={styles.typeName}>{typeDetail.name}</h2>
          <p style={styles.typeSubtitle}>{typeDetail.subtitle}</p>
        </div>

        {/* 나의 연애 성향 분포 */}
        <div style={styles.chartSection}>
          <h3 style={styles.sectionTitle}>나의 연애 성향 분포</h3>
          
          {/* 레이더 차트 */}
          <div style={styles.radarChartContainer}>
            <RadarChart
              data={{
                '확인형': result.normalizedScores['확인형']?.barPct || 0,
                '몰입형': result.normalizedScores['몰입형']?.barPct || 0,
                '신중형': result.normalizedScores['신중형']?.barPct || 0,
                '균형형': result.normalizedScores['균형형']?.barPct || 0,
                '기준형': result.normalizedScores['기준형']?.barPct || 0,
                '자유공감형': result.normalizedScores['자유공감형']?.barPct || 0,
              }}
              primaryType={result.coreType}
            />
          </div>

          {/* 점수 범례 */}
          <div style={styles.legendContainer}>
            {Object.entries(result.scores)
              .sort(([, a], [, b]) => b - a)
              .map(([type, score]) => (
                <div key={type} style={styles.legendItem}>
                  <span style={{
                    ...styles.legendType,
                    fontWeight: type === result.coreType ? '700' : '400',
                    color: type === result.coreType ? '#E8548A' : '#5A4A42',
                  }}>
                    {type}
                  </span>
                  <span style={styles.legendScore}>
                    {score}점 / 90점
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* 유형 상세 설명 */}
        <div style={styles.detailCard}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>✨</span>
              <h3 style={styles.sectionTitle}>이런 모습이 보인다면 당신이 {typeDetail.name}이에요</h3>
            </div>
            <ul style={styles.characteristicsList}>
              {typeDetail.characteristics.map((char, index) => (
                <li key={index} style={styles.characteristicItem}>
                  <span style={styles.bullet}>●</span>
                  <span>{char}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>⚠️</span>
              <h3 style={styles.sectionTitle}>이것만은 조심해요</h3>
            </div>
            <p style={styles.warningText}>{typeDetail.warnings}</p>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>💡</span>
              <h3 style={styles.sectionTitle}>이렇게 사랑해보세요</h3>
            </div>
            <p style={styles.tipText}>{typeDetail.tips}</p>
          </div>
        </div>

        <div style={styles.footer}>
          <button
            style={styles.shareButton}
            onClick={() => {
              // 공유 기능 (추후 구현)
              if (navigator.share) {
                navigator.share({
                  title: '나의 연애 유형 검사 결과',
                  text: `나는 ${typeDetail.name} 유형이에요!`,
                  url: window.location.href,
                }).catch(() => {
                  // 공유 실패 시 클립보드에 복사
                  navigator.clipboard.writeText(window.location.href);
                  alert('링크가 클립보드에 복사되었습니다.');
                });
              } else {
                // 공유 API 미지원 시 클립보드에 복사
                navigator.clipboard.writeText(window.location.href);
                alert('링크가 클립보드에 복사되었습니다.');
              }
            }}
          >
            결과 공유하기
          </button>
          <button
            style={styles.button}
            onClick={() => navigate('/dating')}
          >
            다시 검사하기
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
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  backButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '14px',
    color: '#8B7355',
    cursor: 'pointer',
    marginBottom: '12px',
    padding: '4px 0',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#5A4A42',
    margin: 0,
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#8B7355',
  },
  typeHeader: {
    textAlign: 'center',
    marginBottom: '32px',
    padding: '32px 20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(255, 182, 193, 0.12)',
  },
  typeEmoji: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  typeName: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#FFB6C1',
    margin: '0 0 12px 0',
  },
  typeSubtitle: {
    fontSize: '18px',
    color: '#8B7355',
    margin: 0,
    lineHeight: '1.6',
  },
  chartSection: {
    marginBottom: '24px',
    padding: '24px 20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(255, 182, 193, 0.12)',
  },
  radarChartContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '24px',
  },
  legendContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingTop: '20px',
    borderTop: '1px solid #F0C0D4',
  },
  legendItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
  },
  legendType: {
    fontSize: '15px',
    color: '#5A4A42',
  },
  legendScore: {
    fontSize: '15px',
    color: '#8B7355',
    fontWeight: '500',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 16px rgba(255, 182, 193, 0.12)',
    marginBottom: '24px',
  },
  section: {
    marginBottom: '40px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  sectionIcon: {
    fontSize: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#5A4A42',
    margin: 0,
  },
  characteristicsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  characteristicItem: {
    display: 'flex',
    gap: '12px',
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#5A4A42',
  },
  bullet: {
    color: '#FFB6C1',
    fontWeight: '700',
    flexShrink: 0,
    marginTop: '2px',
  },
  warningText: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#5A4A42',
    margin: 0,
    padding: '20px',
    backgroundColor: '#FFF8F5',
    borderRadius: '12px',
    borderLeft: '4px solid #FFB6C1',
  },
  tipText: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#5A4A42',
    margin: 0,
    padding: '20px',
    backgroundColor: '#FFF8F5',
    borderRadius: '12px',
    borderLeft: '4px solid #FFB6C1',
  },
  footer: {
    padding: '20px 0 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'center',
  },
  shareButton: {
    padding: '16px 48px',
    fontSize: '18px',
    fontWeight: '700',
    border: '2px solid #E8548A',
    borderRadius: '12px',
    backgroundColor: '#FFFFFF',
    color: '#E8548A',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
    maxWidth: '400px',
  },
  button: {
    padding: '16px 48px',
    fontSize: '18px',
    fontWeight: '700',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#FFB6C1',
    color: '#FFFFFF',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(255, 182, 193, 0.4)',
    width: '100%',
    maxWidth: '400px',
  },
};
