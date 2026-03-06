import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLogo } from '../components/ScanLogo';

export const IntroPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container} className="intro-container">
      <div style={styles.content}>
        {/* 헤더 */}
        <div style={styles.header}>
          <button 
            style={styles.backButton}
            onClick={() => navigate('/landing')}
            className="intro-back-button"
          >
            ← 뒤로 가기
          </button>
        </div>

        {/* 메인 타이틀 */}
        <div style={styles.titleSection}>
          <div style={styles.logoContainer}>
            <ScanLogo size={120} color="#C85A7A" />
          </div>
          <h1 style={styles.mainTitle}>✨ SCAN</h1>
          <p style={styles.subtitle}>
            사주 × 32 Spectrum<br />
            타고난 나와 살아낸 나의 교차점
          </p>
        </div>

        {/* 인트로 섹션 */}
        <section style={styles.section}>
          <div style={styles.quoteBox}>
            <p style={styles.quoteText}>
              "나는 원래 어떤 에너지를 가졌고, 지금은 어떤 방식으로 살아가고 있을까?"
            </p>
          </div>
          <p style={styles.bodyText}>
            SCAN은 전통 명리 해석과<br />
            인지·행동 패턴 기반 스펙트럼 분석을 결합해<br />
            당신의 삶을 더 입체적으로 조망합니다.
          </p>
          <p style={styles.bodyText}>
            고정된 운명에 나를 맞추는 것이 아니라,<br />
            <span style={styles.highlight}>타고난 기질(선천)</span>과 지금의 성향(후천) 사이의<br />
            <span style={styles.highlight}>간극(Gap)</span>을 읽어 당신에게 가장 잘 맞는<br />
            '나다운' 성장 방향을 제안합니다.
          </p>
        </section>

        {/* SCAN 시스템 가이드 */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.emoji}>✅</span> SCAN 시스템 가이드
          </h2>
          
          <div style={styles.guideCard}>
            <h3 style={styles.guideTitle}>선천적 성향 : 사주</h3>
            <p style={styles.guideText}>
              전통 명리 해석을 바탕으로 본성 · 잠재력 · 에너지 흐름이라는 '원석'을 읽습니다.
            </p>
          </div>

          <div style={styles.guideCard}>
            <h3 style={styles.guideTitle}>후천적 성향 : 32 Spectrum</h3>
            <p style={styles.guideText}>
              32가지 인지·행동 지표로 현재의 성향 · 환경적 발달 · '세공된 나'를 정리합니다.
            </p>
          </div>

          <div style={styles.guideCard}>
            <h3 style={styles.guideTitle}>통합 인사이트</h3>
            <p style={styles.guideText}>
              두 데이터의 차이에서 새로운 성장 기회와 자기 이해의 힌트를 발견합니다.
            </p>
          </div>

          <div style={styles.guideCard}>
            <h3 style={styles.guideTitle}>맞춤 코칭</h3>
            <p style={styles.guideText}>
              분석 데이터를 기반으로, 현실에 바로 적용 가능한 실행 중심 가이드를 제시합니다.
            </p>
          </div>
        </section>

        {/* SCAN이 제안하는 3가지 핵심 시선 */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.emoji}>🔍</span> SCAN이 제안하는 3가지 핵심 시선
          </h2>
          
          <div style={styles.insightCard}>
            <div style={styles.insightHeader}>
              <span style={styles.insightNumber}>1</span>
              <h3 style={styles.insightTitle}>
                Core Strength<br />
                <span style={styles.insightSubtitle}>(일치)</span>
              </h3>
            </div>
            <p style={styles.insightText}>
              타고난 강점을 지금도 유능하게 활용하고 있는 영역입니다.<br />
              당신의 가장 강력하고 확실한 무기예요.
            </p>
          </div>

          <div style={styles.insightCard}>
            <div style={styles.insightHeader}>
              <span style={styles.insightNumber}>2</span>
              <h3 style={styles.insightTitle}>
                Hidden Potential<br />
                <span style={styles.insightSubtitle}>(사주 &gt; 32 Spectrum)</span>
              </h3>
            </div>
            <p style={styles.insightText}>
              아직 충분히 꺼내 쓰지 못한 <span style={styles.highlight}>숨은 잠재력(필살기)</span>입니다.<br />
              일상에서 이 에너지를 깨우는 구체적인 힌트를 드립니다.
            </p>
          </div>

          <div style={styles.insightCard}>
            <div style={styles.insightHeader}>
              <span style={styles.insightNumber}>3</span>
              <h3 style={styles.insightTitle}>
                Developed Skill<br />
                <span style={styles.insightSubtitle}>(32 Spectrum &gt; 사주)</span>
              </h3>
            </div>
            <p style={styles.insightText}>
              환경 속에서 스스로 노력해 길러낸 역량입니다.<br />
              당신의 성장이 만든 소중한 자산을 새로운 강점으로 재정의합니다.
            </p>
          </div>
        </section>

        {/* 3단계 데이터 레이어 분석 */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.emoji}>🧠</span> 3단계 데이터 레이어 분석
          </h2>
          
          <div style={styles.layerCard}>
            <div style={styles.layerHeader}>
              <span style={styles.layerNumber}>1</span>
              <h3 style={styles.layerTitle}>본질 스캔 (Saju Analysis)</h3>
            </div>
            <p style={styles.layerText}>
              출생 정보를 바탕으로 당신의 기질과 잠재력의 방향을 분석합니다.<br />
              "내가 어떤 가능성을 품고 태어난 사람일까?"를 탐색합니다.
            </p>
          </div>

          <div style={styles.layerCard}>
            <div style={styles.layerHeader}>
              <span style={styles.layerNumber}>2</span>
              <h3 style={styles.layerTitle}>성향 스캔 (32 Spectrum)</h3>
            </div>
            <p style={styles.layerText}>
              32가지 스펙트럼으로 지금 당신이 에너지를 쓰는 방식과 선택의 기준을 읽습니다.<br />
              "요즘의 나는 어떤 모습으로 나를 표현하고 있을까?"를 보여줍니다.
            </p>
          </div>

          <div style={styles.layerCard}>
            <div style={styles.layerHeader}>
              <span style={styles.layerNumber}>3</span>
              <h3 style={styles.layerTitle}>통합 코칭 (Integrated Coaching)</h3>
            </div>
            <p style={styles.layerText}>
              사주와 32 Spectrum 분석 결과를 대조해 도출된 인사이트를 바탕으로,<br />
              현실에서 바로 적용 가능한 실행 중심 코칭을 제안합니다.
            </p>
          </div>
        </section>

        {/* 이런 분들께 추천해요 */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.emoji}>💖</span> 이런 분들께 추천해요
          </h2>
          
          <ul style={styles.recommendList}>
            <li style={styles.recommendItem}>
              상황마다 바뀌는 MBTI 결과 속에서 <span style={styles.highlight}>'흔들리지 않는 진짜 나'</span>의 중심을 잡고 싶은 분
            </li>
            <li style={styles.recommendItem}>
              "사주는 이렇다는데, 난 왜 다르게 느껴지지?"라는 궁금증의 해답을 찾고 싶은 분
            </li>
            <li style={styles.recommendItem}>
              단순한 운세 풀이를 넘어 연애·커리어·관계에서 나다운 선택을 하고 싶은 분
            </li>
            <li style={styles.recommendItem}>
              남을 따라가는 변화가 아닌, 나에게 가장 편안한 방식으로 성장하고 싶은 분
            </li>
          </ul>
        </section>

        {/* 마무리 */}
        <section style={styles.section}>
          <div style={styles.footerSection}>
            <h2 style={styles.footerTitle}>🚀 지금, SCAN으로 당신의 기준을 더 선명하게 만들어 보세요</h2>
            <p style={styles.footerText}>
              남들이 정해준 정답이 아니라,<br />
              <span style={styles.highlight}>타고난 나(SCAN : 사주)</span>와<br />
              <span style={styles.highlight}>살아낸 나(SCAN : 32 Spectrum)</span>가<br />
              만나는 지점에서 당신만의 고유한<br />
              기준과 방향이 시작됩니다.
            </p>
            <div style={styles.finalQuote}>
              <p style={styles.finalQuoteText}>
                "운명은 결정된 결론이 아니라, 더 나은 선택을 돕는 지도입니다."<br />
                SCAN은 그 지도를 오늘 당신의 발걸음으로 연결해 드립니다.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F9F7F2 0%, #F5F3ED 50%, #F1EFE8 100%)',
    padding: '20px',
    paddingBottom: '60px',
  },
  content: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '30px',
  },
  backButton: {
    padding: '10px 16px',
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontWeight: '500',
    color: '#5A4A42',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  titleSection: {
    textAlign: 'center',
    marginBottom: '35px',
    paddingTop: '20px',
  },
  logoContainer: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: '32px',
    fontFamily: '"Nanum Myeongjo", "나눔명조", "Noto Serif KR", "Batang", "Gungsuh", serif',
    color: '#5A4A42',
    fontWeight: '700',
    letterSpacing: '1px',
    marginBottom: '16px',
    lineHeight: '1.4',
  },
  subtitle: {
    fontSize: '18px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#8B7355',
    lineHeight: '1.6',
    letterSpacing: '0.3px',
  },
  section: {
    marginBottom: '35px',
    textAlign: 'left',
  },
  quoteBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '20px',
    padding: '18px',
    marginBottom: '16px',
    textAlign: 'center',
  },
  quoteText: {
    fontSize: '18px',
    fontFamily: '"Nanum Myeongjo", "나눔명조", "Noto Serif KR", "Batang", "Gungsuh", serif',
    color: '#5A4A42',
    fontWeight: '500',
    lineHeight: '1.6',
    textAlign: 'center',
  },
  bodyText: {
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#5A4A42',
    lineHeight: '1.8',
    marginBottom: '12px',
    letterSpacing: '0.2px',
  },
  highlight: {
    color: '#C85A7A',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: '24px',
    fontFamily: '"Nanum Myeongjo", "나눔명조", "Noto Serif KR", "Batang", "Gungsuh", serif',
    color: '#5A4A42',
    fontWeight: '700',
    marginBottom: '18px',
    lineHeight: '1.5',
    paddingBottom: '12px',
    borderBottom: '2px solid rgba(200, 90, 122, 0.3)',
  },
  emoji: {
    fontSize: '24px',
    marginRight: '8px',
  },
  guideCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    padding: '18px',
    marginBottom: '14px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  },
  guideTitle: {
    fontSize: '18px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#C85A7A',
    fontWeight: '600',
    marginBottom: '10px',
    margin: 0,
  },
  guideText: {
    fontSize: '15px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#5A4A42',
    lineHeight: '1.7',
    margin: 0,
  },
  insightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '16px',
    padding: '18px',
    marginBottom: '14px',
  },
  insightHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },
  insightNumber: {
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#FFFFFF',
    backgroundColor: '#C85A7A',
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    marginRight: '12px',
    flexShrink: 0,
    lineHeight: '1',
  },
  insightTitle: {
    fontSize: '18px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#C85A7A',
    fontWeight: '600',
    margin: 0,
    lineHeight: '1.4',
  },
  insightSubtitle: {
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#8B7355',
    fontWeight: '400',
  },
  insightText: {
    fontSize: '15px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#5A4A42',
    lineHeight: '1.7',
    margin: 0,
    paddingLeft: '36px',
  },
  layerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    padding: '18px',
    marginBottom: '14px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  },
  layerHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },
  layerNumber: {
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#FFFFFF',
    backgroundColor: '#C85A7A',
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    marginRight: '12px',
    flexShrink: 0,
    lineHeight: '1',
  },
  layerTitle: {
    fontSize: '18px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#C85A7A',
    fontWeight: '600',
    margin: 0,
  },
  layerText: {
    fontSize: '15px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#5A4A42',
    lineHeight: '1.7',
    margin: 0,
    paddingLeft: '44px',
  },
  recommendList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  recommendItem: {
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#5A4A42',
    lineHeight: '1.8',
    marginBottom: '14px',
    paddingLeft: '28px',
    position: 'relative',
  },
  footerSection: {
    textAlign: 'center',
    padding: '0',
  },
  footerTitle: {
    fontSize: '24px',
    fontFamily: '"Nanum Myeongjo", "나눔명조", "Noto Serif KR", "Batang", "Gungsuh", serif',
    color: '#5A4A42',
    fontWeight: '600',
    marginBottom: '20px',
    letterSpacing: '1px',
    lineHeight: '1.5',
  },
  footerText: {
    fontSize: '17px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#5A4A42',
    lineHeight: '1.8',
    marginBottom: '24px',
  },
  finalQuote: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '2px solid rgba(200, 90, 122, 0.3)',
    borderRadius: '20px',
    padding: '24px',
    marginTop: '24px',
  },
  finalQuoteText: {
    fontSize: '17px',
    fontFamily: '"Nanum Myeongjo", "나눔명조", "Noto Serif KR", "Batang", "Gungsuh", serif',
    color: '#5A4A42',
    fontWeight: '500',
    lineHeight: '1.8',
    margin: 0,
    fontStyle: 'italic',
  },
};

// 모바일 반응형 스타일
const mobileStyles = `
  .intro-container ul li::before {
    content: "•";
    position: absolute;
    left: 12px;
    color: #C85A7A;
    font-size: 20px;
    font-weight: bold;
  }
  
  @media (max-width: 768px) {
    .intro-container {
      padding: 16px !important;
      padding-bottom: 40px !important;
    }
    
    .intro-back-button {
      font-size: 13px !important;
      padding: 8px 14px !important;
    }
    
    .intro-container h1 {
      font-size: 26px !important;
    }
    
    .intro-container .subtitle {
      font-size: 16px !important;
    }
    
    .intro-container .section-title {
      font-size: 22px !important;
    }
    
    .intro-container .body-text {
      font-size: 15px !important;
    }
    
    .intro-container .quote-text {
      font-size: 16px !important;
      padding: 20px !important;
    }
    
    .intro-container .guide-card,
    .intro-container .insight-card,
    .intro-container .layer-card {
      padding: 16px !important;
    }
    
    .intro-container .guide-title,
    .intro-container .insight-title,
    .intro-container .layer-title {
      font-size: 16px !important;
    }
    
    .intro-container .guide-text,
    .intro-container .insight-text,
    .intro-container .layer-text {
      font-size: 14px !important;
      padding-left: 0 !important;
    }
    
    .intro-container .insight-text {
      padding-left: 0 !important;
    }
    
    .intro-container .layer-text {
      padding-left: 0 !important;
    }
  }
  
  @media (max-width: 480px) {
    .intro-container h1 {
      font-size: 24px !important;
    }
    
    .intro-container .subtitle {
      font-size: 15px !important;
    }
    
    .intro-container .section-title {
      font-size: 20px !important;
    }
    
    .intro-container .body-text {
      font-size: 14px !important;
    }
  }
  
  .intro-back-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
    background-color: rgba(255, 255, 255, 0.4) !important;
  }
`;

// 스타일을 동적으로 주입
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = mobileStyles;
  document.head.appendChild(styleSheet);
}
