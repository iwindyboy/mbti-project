import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IntegratedReport, generateIntegratedReport } from '../utils/integratedReport';
import { SajuResult } from '../utils/sajuEngine';
import { CalculateResult } from '../utils/calculate';
import { ILGAN_SYMBOL, getSajuContent } from '../data/sajuDb';
import { getLatestScanResult } from '../utils/storage';
import { IntegratedShareCard } from '../components/IntegratedShareCard';
import { calculateAlignment } from '../utils/saju/alignmentMapper';

export const IntegratedReportPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [report, setReport] = useState<IntegratedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareCard, setShowShareCard] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadIntegratedReport = async () => {
      try {
        // 1. location.state에서 데이터 가져오기 (우선순위 1)
        let sajuResult: SajuResult | null = null;
        let scanResult: CalculateResult | null = null;
        let name = '';

        const stateData = location.state || {};
        if (stateData.sajuResult && stateData.scanResult && stateData.name) {
          sajuResult = stateData.sajuResult;
          scanResult = stateData.scanResult;
          name = stateData.name;
          console.log('IntegratedReportPage - location.state에서 데이터 로드');
        } else {
          // 2. localStorage에서 저장된 결과 가져오기 (우선순위 2)
          console.log('IntegratedReportPage - localStorage에서 데이터 로드 시도');
          
          // 사주 결과 가져오기
          const sajuResultData = localStorage.getItem('saju_result');
          if (sajuResultData) {
            try {
              const parsed = JSON.parse(sajuResultData);
              if (parsed.result) {
                sajuResult = parsed.result;
                name = parsed.name || '사용자';
                console.log('IntegratedReportPage - 사주 결과 로드 완료:', sajuResult);
              }
            } catch (e) {
              console.error('IntegratedReportPage - 사주 결과 파싱 오류:', e);
            }
          }

          // 32 Spectrum 결과 가져오기
          const scanResultData = await getLatestScanResult();
          if (scanResultData && scanResultData.result) {
            scanResult = scanResultData.result as CalculateResult;
            console.log('IntegratedReportPage - 32 Spectrum 결과 로드 완료:', scanResult);
          }

          // sessionStorage에서도 확인
          if (!scanResult && typeof window !== 'undefined' && window.sessionStorage) {
            const sessionData = window.sessionStorage.getItem('scanResult');
            if (sessionData) {
              try {
                scanResult = JSON.parse(sessionData) as CalculateResult;
                console.log('IntegratedReportPage - sessionStorage에서 32 Spectrum 결과 로드');
              } catch (e) {
                console.error('IntegratedReportPage - sessionStorage 파싱 오류:', e);
              }
            }
          }
        }

        // 데이터 검증
        if (!sajuResult || !scanResult) {
          console.warn('IntegratedReportPage - 필요한 데이터가 없습니다:', {
            hasSaju: !!sajuResult,
            hasScan: !!scanResult
          });
          alert('통합 리포트를 생성하려면 사주 검사와 32 Spectrum 검사를 모두 완료해야 합니다.');
          navigate('/landing');
          return;
        }

        // 사주 콘텐츠 가져오기
        const sajuContent = getSajuContent(sajuResult.일간);
        if (!sajuContent) {
          throw new Error('사주 콘텐츠를 불러올 수 없습니다.');
        }

        // 통합 리포트 생성
        console.log('IntegratedReportPage - 통합 리포트 생성 시작:', {
          name,
          일간: sajuResult.일간,
          typeCode: scanResult.typeCode
        });
        
        const integratedReport = generateIntegratedReport(
          name,
          sajuResult,
          sajuContent,
          scanResult
        );

        console.log('IntegratedReportPage - 통합 리포트 생성 완료:', integratedReport);
        setReport(integratedReport);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'instant' });
      } catch (error) {
        console.error('IntegratedReportPage - 통합 리포트 생성 오류:', error);
        alert('통합 리포트를 생성하는 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : String(error)));
        navigate('/landing');
      }
    };

    loadIntegratedReport();
  }, [location, navigate]);

  // 스크롤 진행률 바
  useEffect(() => {
    const handleScroll = () => {
      if (!progressBarRef.current) return;
      
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = total > 0 ? (scrolled / total) * 100 : 0;
      
      progressBarRef.current.style.width = `${percentage}%`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading || !report) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>통합 리포트를 생성하고 있어요...</div>
      </div>
    );
  }

  const { saju, scan, analysis } = report;
  const sajuSymbol = ILGAN_SYMBOL[saju.result.일간];

  return (
    <div ref={containerRef} style={styles.container}>
      {/* 스크롤 진행률 바 */}
      <div ref={progressBarRef} style={styles.progressBar} />

      {/* 헤더 */}
      <section style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerSubtitle}>{report.name}님의 통합 분석 리포트</div>
          
          {/* 일간 뱃지 */}
          <div style={styles.ilganBadge}>
            <span style={styles.ilganEmoji}>{sajuSymbol.emoji}</span>
            <div style={styles.ilganInfo}>
              <div style={styles.ilganName}>{sajuSymbol.name} ({saju.result.일간})</div>
              <div style={styles.ilganSymbol}>— {sajuSymbol.symbol}</div>
            </div>
          </div>

          {/* 사주 8글자 카드 */}
          <div style={styles.sajuCards}>
            <div style={styles.sajuCard}>
              <div style={styles.sajuLabel}>연주</div>
              <div style={styles.sajuText}>
                {saju.result.연주.천간}{saju.result.연주.지지}
              </div>
            </div>
            <div style={styles.sajuCard}>
              <div style={styles.sajuLabel}>월주</div>
              <div style={styles.sajuText}>
                {saju.result.월주.천간}{saju.result.월주.지지}
              </div>
            </div>
            <div style={{ ...styles.sajuCard, ...styles.sajuCardHighlight }}>
              <div style={styles.sajuLabel}>일주</div>
              <div style={styles.sajuText}>
                {saju.result.일주.천간}{saju.result.일주.지지}
              </div>
            </div>
            {saju.result.시주 ? (
              <div style={styles.sajuCard}>
                <div style={styles.sajuLabel}>시주</div>
                <div style={styles.sajuText}>
                  {saju.result.시주.천간}{saju.result.시주.지지}
                </div>
              </div>
            ) : (
              <div style={styles.sajuCard}>
                <div style={styles.sajuLabel}>시주</div>
                <div style={styles.sajuText}>모름</div>
              </div>
            )}
          </div>

          {/* 32 Spectrum 타입 */}
          <div style={styles.scanTypeBadge}>
            <div style={styles.scanTypeLabel}>32 Spectrum</div>
            <div style={styles.scanTypeCode}>{scan.result.typeCode}</div>
            <div style={styles.scanTypeName}>{scan.typeName}</div>
          </div>
        </div>
      </section>

      {/* 섹션 1: 통합 인사이트 */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionNumber}>01</div>
          <div>
            <h2 style={styles.sectionTitle}>통합 인사이트</h2>
            <p style={styles.sectionSubtitle}>{analysis.insights.lifeTheme}</p>
          </div>
        </div>

        <div style={styles.sectionContent}>
          <div style={styles.insightMessage}>
            {analysis.insights.message}
          </div>

          {/* 통합 강점 */}
          <div style={styles.strengthsSection}>
            <h3 style={styles.subsectionTitle}>✨ 통합 강점</h3>
            {analysis.insights.strengths.map((strength, idx) => (
              <div key={idx} style={styles.strengthCard}>
                <div style={styles.strengthSource}>
                  {strength.source === 'saju' && '🌙 선천'}
                  {strength.source === 'scan' && '⭐ 후천'}
                  {strength.source === 'both' && '🌟 통합'}
                </div>
                <div style={styles.strengthTitle}>{strength.title}</div>
                <div style={styles.strengthDescription}>{strength.description}</div>
              </div>
            ))}
          </div>

          {/* 통합 주의점 */}
          <div style={styles.cautionsSection}>
            <h3 style={styles.subsectionTitle}>⚠️ 통합 주의점</h3>
            {analysis.insights.cautions.map((caution, idx) => (
              <div key={idx} style={styles.cautionCard}>
                <div style={styles.cautionSource}>
                  {caution.source === 'saju' && '🌙 선천'}
                  {caution.source === 'scan' && '⭐ 후천'}
                  {caution.source === 'both' && '🌟 통합'}
                </div>
                <div style={styles.cautionTitle}>{caution.title}</div>
                <div style={styles.cautionDescription}>{caution.description}</div>
              </div>
            ))}
          </div>

          {/* 통합 키워드 */}
          <div style={styles.keywordsSection}>
            {analysis.insights.keywords.map((keyword, idx) => (
              <span key={idx} style={styles.keywordTag}>{keyword}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 섹션 2: 일치점 분석 */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionNumber}>02</div>
          <div>
            <h2 style={styles.sectionTitle}>일치점 분석</h2>
            <p style={styles.sectionSubtitle}>타고난 기질과 현재 성향의 일치도</p>
          </div>
        </div>

        <div style={styles.sectionContent}>
          {/* 일치도 점수 */}
          <div style={styles.alignmentScoreCard}>
            <div style={styles.scoreValue}>{analysis.alignment.alignmentScore}%</div>
            <div style={styles.scoreLabel}>일치도</div>
            <div style={styles.scoreBar}>
              <div 
                style={{
                  ...styles.scoreBarFill,
                  width: `${analysis.alignment.alignmentScore}%`
                }}
              />
            </div>
          </div>

          {/* 일치 요약 */}
          <div style={styles.summaryBox}>
            {analysis.alignment.summary}
          </div>

          {/* 일치하는 특성 */}
          <div style={styles.matchingTraitsSection}>
            <h3 style={styles.subsectionTitle}>일치하는 특성</h3>
            {analysis.alignment.matchingTraits.map((trait, idx) => (
              <div key={idx} style={styles.traitCard}>
                <div style={styles.traitCategory}>{trait.category}</div>
                <div style={styles.traitComparison}>
                  <div style={styles.traitSide}>
                    <div style={styles.traitLabel}>선천</div>
                    <div style={styles.traitValue}>{trait.sajuTrait}</div>
                  </div>
                  <div style={styles.traitArrow}>↔</div>
                  <div style={styles.traitSide}>
                    <div style={styles.traitLabel}>후천</div>
                    <div style={styles.traitValue}>{trait.scanTrait}</div>
                  </div>
                </div>
                <div style={styles.traitDescription}>{trait.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 섹션 3: 차이점 분석 */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionNumber}>03</div>
          <div>
            <h2 style={styles.sectionTitle}>차이점 분석</h2>
            <p style={styles.sectionSubtitle}>성장의 기회를 발견하세요</p>
          </div>
        </div>

        <div style={styles.sectionContent}>
          {/* 차이 요약 */}
          <div style={styles.summaryBox}>
            {analysis.gap.summary}
          </div>

          {/* 차이점 목록 */}
          <div style={styles.differencesSection}>
            {analysis.gap.differences.map((diff, idx) => (
              <div key={idx} style={styles.differenceCard}>
                <div style={styles.differenceCategory}>{diff.category}</div>
                <div style={styles.differenceComparison}>
                  <div style={styles.differenceSide}>
                    <div style={styles.differenceLabel}>선천</div>
                    <div style={styles.differenceValue}>{diff.sajuSide}</div>
                  </div>
                  <div style={styles.differenceArrow}>→</div>
                  <div style={styles.differenceSide}>
                    <div style={styles.differenceLabel}>후천</div>
                    <div style={styles.differenceValue}>{diff.scanSide}</div>
                  </div>
                </div>
                <div style={styles.differenceDescription}>{diff.gapDescription}</div>
                <div style={styles.growthOpportunity}>
                  <strong>성장 기회:</strong> {diff.growthOpportunity}
                </div>
              </div>
            ))}
          </div>

          {/* 성장 포인트 */}
          {analysis.gap.growthPoints.length > 0 && (
            <div style={styles.growthPointsSection}>
              <h3 style={styles.subsectionTitle}>🌱 성장 포인트</h3>
              <div style={styles.growthPointsList}>
                {analysis.gap.growthPoints.map((point, idx) => (
                  <div key={idx} style={styles.growthPointItem}>
                    {point}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 섹션 4: 맞춤 코칭 */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionNumber}>04</div>
          <div>
            <h2 style={styles.sectionTitle}>맞춤 코칭</h2>
            <p style={styles.sectionSubtitle}>통합 분석 기반 성장 가이드</p>
          </div>
        </div>

        <div style={styles.sectionContent}>
          {/* 성장 방향 */}
          <div style={styles.coachingCard}>
            <h3 style={styles.coachingTitle}>📈 {analysis.coaching.growthDirection.title}</h3>
            <p style={styles.coachingDescription}>{analysis.coaching.growthDirection.description}</p>
            <div style={styles.coachingActions}>
              {analysis.coaching.growthDirection.actions.map((action, idx) => (
                <div key={idx} style={styles.coachingActionItem}>• {action}</div>
              ))}
            </div>
          </div>

          {/* 관계 개선 */}
          <div style={styles.coachingCard}>
            <h3 style={styles.coachingTitle}>💞 {analysis.coaching.relationship.title}</h3>
            <p style={styles.coachingDescription}>{analysis.coaching.relationship.description}</p>
            <div style={styles.coachingTips}>
              {analysis.coaching.relationship.tips.map((tip, idx) => (
                <div key={idx} style={styles.coachingTipItem}>✓ {tip}</div>
              ))}
            </div>
          </div>

          {/* 커리어 */}
          <div style={styles.coachingCard}>
            <h3 style={styles.coachingTitle}>💼 {analysis.coaching.career.title}</h3>
            <p style={styles.coachingDescription}>{analysis.coaching.career.description}</p>
            <div style={styles.coachingRecommendations}>
              {analysis.coaching.career.recommendations.map((rec, idx) => (
                <div key={idx} style={styles.coachingRecItem}>→ {rec}</div>
              ))}
            </div>
          </div>

          {/* 자기계발 */}
          <div style={styles.coachingCard}>
            <h3 style={styles.coachingTitle}>🌱 {analysis.coaching.selfDevelopment.title}</h3>
            <p style={styles.coachingDescription}>{analysis.coaching.selfDevelopment.description}</p>
            <div style={styles.coachingPractices}>
              {analysis.coaching.selfDevelopment.practices.map((practice, idx) => (
                <div key={idx} style={styles.coachingPracticeItem}>☆ {practice}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 하단 버튼 */}
      <div style={styles.footer}>
        <button 
          style={styles.backButton}
          onClick={() => navigate('/')}
        >
          ← 홈으로
        </button>
        <button 
          style={styles.shareButton}
          onClick={() => setShowShareCard(true)}
        >
          📋 결과 공유하기
        </button>
      </div>
      {showShareCard && report && (
        <IntegratedShareCard
          name={report.name}
          cheongan={report.saju.result.일간}
          cheonganName={(() => {
            const names: Record<string, string> = {
              '甲': '갑목', '乙': '을목', '丙': '병화', '丁': '정화', '戊': '무토',
              '己': '기토', '庚': '경금', '辛': '신금', '壬': '임수', '癸': '계수',
            };
            return names[report.saju.result.일간] || report.saju.result.일간;
          })()}
          spectrumCode={report.scan.result.typeCode}
          alignmentScore={report.analysis.alignment.alignmentScore}
          alignmentLabel={(() => {
            const s = report.analysis.alignment.alignmentScore;
            if (s >= 85) return '깊은 일치형';
            if (s >= 65) return '자연스러운 조화형';
            if (s >= 45) return '보완형';
            return '전환형';
          })()}
          alignmentEmoji={(() => {
            const s = report.analysis.alignment.alignmentScore;
            if (s >= 85) return '🟢';
            if (s >= 65) return '🔵';
            if (s >= 45) return '🟡';
            return '🟠';
          })()}
          matchedAxes={(() => {
            const result = calculateAlignment(report.saju.result.일간, report.scan.result.scores);
            return result.matchedAxes;
          })()}
          greyZoneCount={report.scan.result.greyZones?.length || 0}
          onClose={() => setShowShareCard(false)}
        />
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
//  스타일
// ══════════════════════════════════════════════════════════════

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F9F7F2 0%, #F5F3ED 50%, #F1EFE8 100%)',
    paddingBottom: '60px',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1A0A2E 0%, #4A1468 50%, #8B3A8B 100%)',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: '18px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  },
  progressBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #8B3A8B 0%, #C8956C 100%)',
    width: '0%',
    zIndex: 9999,
    transition: 'width 0.1s ease-out',
  },
  header: {
    background: 'linear-gradient(135deg, #1A0A2E 0%, #4A1468 50%, #8B3A8B 100%)',
    padding: '48px 20px 36px',
    color: '#FFFFFF',
  },
  headerContent: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  headerSubtitle: {
    fontSize: '14px',
    opacity: 0.8,
    marginBottom: '24px',
    textAlign: 'center',
  },
  ilganBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50px',
    padding: '16px 24px',
    marginBottom: '24px',
  },
  ilganEmoji: {
    fontSize: '48px',
  },
  ilganInfo: {
    textAlign: 'center',
  },
  ilganName: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '4px',
  },
  ilganSymbol: {
    fontSize: '16px',
    opacity: 0.9,
  },
  sajuCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  },
  sajuCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '16px',
    textAlign: 'center',
  },
  sajuCardHighlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: '#1A0A2E',
  },
  sajuLabel: {
    fontSize: '12px',
    opacity: 0.8,
    marginBottom: '8px',
  },
  sajuText: {
    fontSize: '24px',
    fontWeight: '700',
    fontFamily: '"Nanum Myeongjo", "나눔명조", serif',
  },
  scanTypeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '16px',
    textAlign: 'center',
  },
  scanTypeLabel: {
    fontSize: '12px',
    opacity: 0.8,
    marginBottom: '4px',
  },
  scanTypeCode: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '4px',
  },
  scanTypeName: {
    fontSize: '14px',
    opacity: 0.9,
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: '20px',
    borderRadius: '20px',
    padding: '32px 20px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  },
  sectionHeader: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    alignItems: 'flex-start',
  },
  sectionNumber: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #8B3A8B 0%, #C8956C 100%)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1A0A2E',
    marginBottom: '8px',
    fontFamily: '"Noto Serif KR", serif',
  },
  sectionSubtitle: {
    fontSize: '16px',
    color: '#7B6B8A',
    lineHeight: '1.6',
  },
  sectionContent: {
    lineHeight: '1.9',
  },
  insightMessage: {
    fontSize: '18px',
    color: '#2D1B40',
    marginBottom: '32px',
    padding: '20px',
    backgroundColor: '#F5F0FF',
    borderRadius: '16px',
    borderLeft: '4px solid #8B3A8B',
  },
  strengthsSection: {
    marginBottom: '32px',
  },
  subsectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1A0A2E',
    marginBottom: '16px',
  },
  strengthCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
    borderLeft: '4px solid #2E8B57',
  },
  strengthSource: {
    fontSize: '12px',
    color: '#2E8B57',
    marginBottom: '8px',
    fontWeight: '600',
  },
  strengthTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1A0A2E',
    marginBottom: '8px',
  },
  strengthDescription: {
    fontSize: '15px',
    color: '#2D1B40',
    lineHeight: '1.7',
  },
  cautionsSection: {
    marginBottom: '32px',
  },
  cautionCard: {
    backgroundColor: '#FFF8F0',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
    borderLeft: '4px solid #CD853F',
  },
  cautionSource: {
    fontSize: '12px',
    color: '#CD853F',
    marginBottom: '8px',
    fontWeight: '600',
  },
  cautionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1A0A2E',
    marginBottom: '8px',
  },
  cautionDescription: {
    fontSize: '15px',
    color: '#2D1B40',
    lineHeight: '1.7',
  },
  keywordsSection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '24px',
  },
  keywordTag: {
    backgroundColor: '#F0E6FF',
    color: '#6B2FA0',
    padding: '8px 16px',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: '500',
  },
  alignmentScoreCard: {
    backgroundColor: '#F5F0FF',
    borderRadius: '20px',
    padding: '32px',
    textAlign: 'center',
    marginBottom: '24px',
  },
  scoreValue: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#8B3A8B',
    marginBottom: '8px',
  },
  scoreLabel: {
    fontSize: '16px',
    color: '#7B6B8A',
    marginBottom: '16px',
  },
  scoreBar: {
    width: '100%',
    height: '12px',
    backgroundColor: '#EDE0F5',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #8B3A8B 0%, #C8956C 100%)',
    transition: 'width 0.3s ease',
  },
  summaryBox: {
    backgroundColor: '#F5F0FF',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    fontSize: '16px',
    color: '#2D1B40',
    lineHeight: '1.8',
    borderLeft: '4px solid #8B3A8B',
  },
  matchingTraitsSection: {
    marginTop: '32px',
  },
  traitCard: {
    backgroundColor: '#F8F0FF',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
  },
  traitCategory: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#8B3A8B',
    marginBottom: '12px',
  },
  traitComparison: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '12px',
  },
  traitSide: {
    flex: 1,
    textAlign: 'center',
  },
  traitLabel: {
    fontSize: '12px',
    color: '#7B6B8A',
    marginBottom: '4px',
  },
  traitValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1A0A2E',
  },
  traitArrow: {
    fontSize: '24px',
    color: '#8B3A8B',
  },
  traitDescription: {
    fontSize: '14px',
    color: '#2D1B40',
    lineHeight: '1.6',
    paddingTop: '12px',
    borderTop: '1px solid #EDE0F5',
  },
  differencesSection: {
    marginTop: '24px',
  },
  differenceCard: {
    backgroundColor: '#FFF8F0',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    borderLeft: '4px solid #CD853F',
  },
  differenceCategory: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#CD853F',
    marginBottom: '12px',
  },
  differenceComparison: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '12px',
  },
  differenceSide: {
    flex: 1,
  },
  differenceLabel: {
    fontSize: '12px',
    color: '#7B6B8A',
    marginBottom: '4px',
  },
  differenceValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1A0A2E',
  },
  differenceArrow: {
    fontSize: '20px',
    color: '#CD853F',
  },
  differenceDescription: {
    fontSize: '14px',
    color: '#2D1B40',
    lineHeight: '1.6',
    marginBottom: '12px',
  },
  growthOpportunity: {
    fontSize: '14px',
    color: '#2E8B57',
    lineHeight: '1.6',
    padding: '12px',
    backgroundColor: '#F0FFF4',
    borderRadius: '8px',
  },
  growthPointsSection: {
    marginTop: '32px',
    padding: '24px',
    backgroundColor: '#F0FFF4',
    borderRadius: '16px',
  },
  growthPointsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  growthPointItem: {
    fontSize: '15px',
    color: '#2D1B40',
    lineHeight: '1.7',
    paddingLeft: '8px',
    borderLeft: '3px solid #2E8B57',
  },
  coachingCard: {
    backgroundColor: '#F5F0FF',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
  },
  coachingTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1A0A2E',
    marginBottom: '12px',
  },
  coachingDescription: {
    fontSize: '16px',
    color: '#2D1B40',
    lineHeight: '1.8',
    marginBottom: '16px',
  },
  coachingActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  coachingActionItem: {
    fontSize: '15px',
    color: '#2D1B40',
    lineHeight: '1.7',
  },
  coachingTips: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  coachingTipItem: {
    fontSize: '15px',
    color: '#2D1B40',
    lineHeight: '1.7',
  },
  coachingRecommendations: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  coachingRecItem: {
    fontSize: '15px',
    color: '#2D1B40',
    lineHeight: '1.7',
  },
  coachingPractices: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  coachingPracticeItem: {
    fontSize: '15px',
    color: '#2D1B40',
    lineHeight: '1.7',
  },
  footer: {
    display: 'flex',
    gap: '12px',
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  backButton: {
    flex: 1,
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#1A0A2E',
    backgroundColor: '#FFFFFF',
    border: '2px solid #EDE0F5',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  shareButton: {
    flex: 1,
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#FFFFFF',
    background: 'linear-gradient(135deg, #8B3A8B 0%, #C8956C 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};
