import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showRewarded } from '../utils/adMobService';
import { getLatestScanResult } from '../utils/storage';
import { getSajuContent } from '../data/sajuDb';
import { generateIntegratedReport } from '../utils/integratedReport';
import { SajuResult } from '../utils/sajuEngine';
import { CalculateResult } from '../utils/calculate';

export const PremiumCoachingPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [report, setReport] = useState<ReturnType<typeof generateIntegratedReport> | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const sajuRaw = localStorage.getItem('saju_result');
        const scanSaved = await getLatestScanResult();

        const sajuResult = sajuRaw ? (JSON.parse(sajuRaw).result as SajuResult | undefined) : undefined;
        const name = sajuRaw ? (JSON.parse(sajuRaw).name as string | undefined) : undefined;

        let scanResult = scanSaved?.result as CalculateResult | undefined;
        if (!scanResult && typeof window !== 'undefined' && window.sessionStorage) {
          const sessionScan = window.sessionStorage.getItem('scanResult');
          if (sessionScan) {
            scanResult = JSON.parse(sessionScan) as CalculateResult;
          }
        }

        if (!sajuResult || !scanResult) {
          alert('프리미엄 코칭을 보려면 사주 검사와 32 Spectrum 검사를 먼저 완료해주세요.');
          navigate('/landing');
          return;
        }

        const sajuContent = getSajuContent(sajuResult.일간);
        if (!sajuContent) {
          alert('사주 코칭 콘텐츠를 불러오지 못했습니다.');
          navigate('/landing');
          return;
        }

        const integrated = generateIntegratedReport(
          name || '사용자',
          sajuResult,
          sajuContent,
          scanResult
        );
        setReport(integrated);
      } catch (error) {
        console.error('PremiumCoachingPage load error:', error);
        alert('코칭 데이터를 불러오는 중 오류가 발생했습니다.');
        navigate('/landing');
      } finally {
        setLoading(false);
      }
    };

    void loadReport();
  }, [navigate]);

  const roadmap = useMemo(() => {
    if (!report) return [];

    const { coaching } = report.analysis;
    return [
      {
        week: '1주차',
        title: '자기 인식 정렬',
        action: coaching.selfDevelopment.practices[0] || '하루 10분 자기 관찰 기록 시작',
      },
      {
        week: '2주차',
        title: '관계 코칭 적용',
        action: coaching.relationship.tips[0] || '관계에서 1가지 소통 습관 실천',
      },
      {
        week: '3주차',
        title: '일/커리어 실행',
        action: coaching.career.recommendations[0] || '업무에서 강점 기반 액션 1개 실행',
      },
      {
        week: '4주차',
        title: '성장 루틴 고정',
        action: coaching.growthDirection.actions[0] || '개인 성장 루틴 1개 고정',
      },
    ];
  }, [report]);

  const handleUnlock = async () => {
    const rewarded = await showRewarded();
    if (rewarded) {
      setUnlocked(true);
    } else {
      alert('광고를 끝까지 시청해야 프리미엄 코칭을 열 수 있어요.');
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingText}>프리미엄 코칭을 준비하고 있어요...</div>
      </div>
    );
  }

  if (!report) return null;

  const { coaching } = report.analysis;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.badge}>PREMIUM</div>
        <h1 style={styles.title}>통합 분석 프리미엄 코칭</h1>
        <p style={styles.subtitle}>
          {report.name}님을 위한 선천(사주) × 후천(32 Spectrum) 맞춤 실행 가이드
        </p>
      </div>

      {!unlocked && (
        <section style={styles.lockCard}>
          <div style={styles.lockIcon}>🔒</div>
          <h2 style={styles.lockTitle}>프리미엄 코칭 잠금 상태</h2>
          <p style={styles.lockDesc}>
            프리미엄 코칭은 구체 행동 가이드 중심으로 제공됩니다.
            <br />
            짧은 광고 시청 후 바로 확인할 수 있어요.
          </p>
          <button style={styles.unlockButton} onClick={handleUnlock}>
            🎬 광고 보고 프리미엄 코칭 열기
          </button>
        </section>
      )}

      {unlocked && (
        <>
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>핵심 코칭 메시지</h2>
            <p style={styles.message}>{coaching.overallMessage}</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>4주 실행 로드맵</h2>
            {roadmap.map((step) => (
              <div key={step.week} style={styles.roadmapItem}>
                <div style={styles.roadmapWeek}>{step.week}</div>
                <div style={styles.roadmapContent}>
                  <div style={styles.roadmapTitle}>{step.title}</div>
                  <div style={styles.roadmapAction}>{step.action}</div>
                </div>
              </div>
            ))}
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>성장 방향</h2>
            <p style={styles.paragraph}>{coaching.growthDirection.description}</p>
            {coaching.growthDirection.actions.map((item, idx) => (
              <div key={`growth-${idx}`} style={styles.listItem}>• {item}</div>
            ))}
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>관계 코칭</h2>
            <p style={styles.paragraph}>{coaching.relationship.description}</p>
            {coaching.relationship.tips.map((item, idx) => (
              <div key={`rel-${idx}`} style={styles.listItem}>• {item}</div>
            ))}
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>커리어 코칭</h2>
            <p style={styles.paragraph}>{coaching.career.description}</p>
            {coaching.career.recommendations.map((item, idx) => (
              <div key={`career-${idx}`} style={styles.listItem}>• {item}</div>
            ))}
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>자기계발 코칭</h2>
            <p style={styles.paragraph}>{coaching.selfDevelopment.description}</p>
            {coaching.selfDevelopment.practices.map((item, idx) => (
              <div key={`self-${idx}`} style={styles.listItem}>• {item}</div>
            ))}
          </section>
        </>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%)',
    color: '#fff',
    padding: '20px',
    paddingBottom: '80px',
  },
  loadingWrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#111827',
  },
  loadingText: {
    color: '#e5e7eb',
    fontSize: '18px',
  },
  header: {
    maxWidth: '720px',
    margin: '0 auto 20px',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.8px',
    background: 'linear-gradient(90deg, #f59e0b, #f97316)',
    color: '#111827',
    marginBottom: '12px',
  },
  title: {
    fontSize: '30px',
    fontWeight: 800,
    margin: 0,
  },
  subtitle: {
    marginTop: '10px',
    color: '#cbd5e1',
    lineHeight: 1.6,
  },
  lockCard: {
    maxWidth: '720px',
    margin: '20px auto',
    borderRadius: '18px',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    padding: '28px',
    textAlign: 'center',
  },
  lockIcon: {
    fontSize: '42px',
    marginBottom: '10px',
  },
  lockTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 700,
  },
  lockDesc: {
    marginTop: '12px',
    color: '#cbd5e1',
    lineHeight: 1.7,
  },
  unlockButton: {
    marginTop: '18px',
    border: 'none',
    borderRadius: '14px',
    padding: '14px 20px',
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
  },
  section: {
    maxWidth: '720px',
    margin: '16px auto',
    borderRadius: '18px',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(148, 163, 184, 0.32)',
    padding: '22px',
  },
  sectionTitle: {
    margin: '0 0 12px',
    fontSize: '20px',
    fontWeight: 700,
  },
  message: {
    margin: 0,
    color: '#e2e8f0',
    lineHeight: 1.8,
    fontSize: '15px',
  },
  paragraph: {
    margin: '0 0 10px',
    color: '#cbd5e1',
    lineHeight: 1.7,
    fontSize: '15px',
  },
  listItem: {
    marginTop: '8px',
    color: '#f8fafc',
    lineHeight: 1.7,
    fontSize: '14px',
  },
  roadmapItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    padding: '10px 0',
    borderTop: '1px solid rgba(148, 163, 184, 0.2)',
  },
  roadmapWeek: {
    minWidth: '56px',
    fontSize: '13px',
    fontWeight: 700,
    color: '#fbbf24',
    marginTop: '2px',
  },
  roadmapContent: {
    flex: 1,
  },
  roadmapTitle: {
    fontSize: '14px',
    fontWeight: 700,
    marginBottom: '4px',
  },
  roadmapAction: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: '#cbd5e1',
  },
};

