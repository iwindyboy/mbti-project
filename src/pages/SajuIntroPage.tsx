import React from 'react';
import { useNavigate } from 'react-router-dom';

export const SajuIntroPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* 뒤로 가기 버튼 */}
        <div style={styles.header}>
          <button 
            style={styles.backButton}
            onClick={() => navigate('/landing')}
          >
            ← 뒤로 가기
          </button>
        </div>

        {/* 메인 헤드라인 */}
        <div style={styles.headerSection}>
          <h1 style={styles.mainHeadline}>
            운명은 정해진 길이 아니에요
          </h1>
        </div>

        {/* 본문 섹션 1 - 운명의 의미 */}
        <section style={styles.section}>
          <div style={styles.meaningBox}>
            <div style={styles.meaningRow}>
              <div style={styles.meaningChar}>運</div>
              <div style={styles.meaningText}>움직이다</div>
            </div>
            <div style={styles.meaningRow}>
              <div style={styles.meaningChar}>命</div>
              <div style={styles.meaningText}>나의 본질</div>
            </div>
          </div>
          <p style={styles.introText}>
            운명(運命)이란<br />
            타고난 본질을 내가 직접 만들어가는 것이에요.
          </p>
        </section>

        {/* 본문 섹션 2 - 공감 문구 */}
        <section style={styles.section}>
          <p style={styles.introText}>
            혹시 이런 생각 해본 적 있나요?<br />
            나는 왜 이런 상황에서 꼭 이렇게 반응할까.<br />
            왜 같은 패턴이 반복될까.<br />
            나다운 삶이 뭔지 모르겠는 순간들.<br />
            그 이유가<br />
            나의 선천적 성향을 몰랐기 때문일 수 있어요.
          </p>
        </section>

        {/* 본문 섹션 3 - 사주에 대한 설명 */}
        <section style={styles.section}>
          <p style={styles.descriptionText}>
            사주는 점술이 아니에요.<br />
            미래를 예언하지도 않아요.<br />
            태어난 순간의 에너지 속에 담긴<br />
            나라는 사람의 본질을 읽는 도구예요.
          </p>
          
          <div style={styles.featureList}>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>💭</span>
              <span style={styles.featureText}>어떤 방식으로 생각하는지.</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>⚡</span>
              <span style={styles.featureText}>무엇에 힘이 나고 무엇에 지치는지.</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>🔄</span>
              <span style={styles.featureText}>관계에서 반복되는 나만의 패턴.</span>
            </div>
          </div>
          
          <p style={styles.historyText}>
            2,000년의 시간 동안<br />
            수많은 사람들이 사주에서 자신을 발견했어요.
          </p>
        </section>

        {/* 본문 섹션 4 - 마무리 메시지 */}
        <section style={styles.section}>
          <p style={styles.finalMessage}>
            나를 이해해야<br />
            내 방식으로 살아갈 수 있어요.<br />
            그게 운명을 운(運)하는 방법이에요.
          </p>
        </section>

        {/* CTA 섹션 */}
        <section style={styles.ctaSection}>
          <div style={styles.ctaBox}>
            <p style={styles.ctaInfo}>
              소요 시간: 약 1분<br />
              생년월일만 있으면 바로 시작할 수 있어요.
            </p>
            <button
              style={styles.ctaButton}
              onClick={() => navigate('/fortune')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(200, 90, 122, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(200, 90, 122, 0.3)';
              }}
            >
              선천적 성향(사주) 확인하기 →
            </button>
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
    padding: '12px 16px',
    paddingBottom: '30px',
  },
  content: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '12px',
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
  headerSection: {
    textAlign: 'center',
    marginBottom: '20px',
    paddingTop: '8px',
  },
  mainHeadline: {
    fontSize: '24px',
    fontFamily: '"Nanum Myeongjo", "나눔명조", "Noto Serif KR", "Batang", "Gungsuh", serif',
    color: '#2D1B40',
    fontWeight: '700',
    lineHeight: '1.4',
    letterSpacing: '1px',
  },
  section: {
    marginBottom: '20px',
  },
  meaningBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(200, 90, 122, 0.2)',
    borderRadius: '16px',
    padding: '18px',
    marginBottom: '16px',
  },
  meaningRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  meaningChar: {
    fontSize: '40px',
    fontFamily: '"Nanum Myeongjo", "나눔명조", "Noto Serif KR", "Batang", "Gungsuh", serif',
    color: '#C85A7A',
    fontWeight: '700',
    minWidth: '50px',
  },
  meaningText: {
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#5A4A42',
    fontWeight: '500',
  },
  introText: {
    fontSize: '15px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#3D2B1F',
    lineHeight: '1.7',
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: '15px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#3D2B1F',
    lineHeight: '1.7',
    textAlign: 'center',
    marginBottom: '16px',
  },
  featureList: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(200, 90, 122, 0.15)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#5A4A42',
  },
  featureIcon: {
    fontSize: '20px',
  },
  featureText: {
    flex: 1,
  },
  historyText: {
    fontSize: '15px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#8B7355',
    lineHeight: '1.8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  finalMessage: {
    fontSize: '16px',
    fontFamily: '"Nanum Myeongjo", "나눔명조", "Noto Serif KR", "Batang", "Gungsuh", serif',
    color: '#2D1B40',
    lineHeight: '1.7',
    textAlign: 'center',
    fontWeight: '600',
    backgroundColor: 'rgba(240, 230, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(200, 90, 122, 0.2)',
    borderRadius: '16px',
    padding: '18px',
  },
  ctaSection: {
    marginTop: '24px',
    marginBottom: '16px',
  },
  ctaBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(200, 90, 122, 0.3)',
    borderRadius: '20px',
    padding: '20px',
    textAlign: 'center',
  },
  ctaInfo: {
    fontSize: '13px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#8B7355',
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  ctaButton: {
    width: '100%',
    padding: '16px 24px',
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontWeight: '600',
    color: '#FFFFFF',
    background: 'linear-gradient(135deg, #C85A7A 0%, #B84A6A 100%)',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxShadow: '0 4px 16px rgba(200, 90, 122, 0.3)',
  },
};

// 모바일 반응형 스타일
const mobileStyles = `
  @media (max-width: 768px) {
    .saju-intro-container {
      padding: 16px 12px !important;
      padding-bottom: 30px !important;
    }
    
    .saju-intro-main-headline {
      font-size: 22px !important;
      margin-bottom: 24px !important;
      padding-top: 12px !important;
    }
    
    .saju-intro-section {
      margin-bottom: 24px !important;
    }
    
    .saju-intro-meaning-box {
      padding: 20px !important;
    }
    
    .saju-intro-meaning-char {
      font-size: 40px !important;
      min-width: 50px !important;
    }
    
    .saju-intro-meaning-text {
      font-size: 16px !important;
    }
    
    .saju-intro-text {
      font-size: 15px !important;
      line-height: 1.8 !important;
    }
    
    .saju-intro-description {
      font-size: 15px !important;
      line-height: 1.8 !important;
    }
    
    .saju-intro-feature-list {
      padding: 16px !important;
    }
    
    .saju-intro-feature-item {
      font-size: 14px !important;
      margin-bottom: 10px !important;
    }
    
    .saju-intro-final-message {
      font-size: 16px !important;
      padding: 20px !important;
    }
    
    .saju-intro-cta-box {
      padding: 24px 20px !important;
    }
    
    .saju-intro-cta-button {
      padding: 14px 20px !important;
      font-size: 15px !important;
    }
  }
  
  @media (max-width: 480px) {
    .saju-intro-main-headline {
      font-size: 20px !important;
    }
    
    .saju-intro-meaning-char {
      font-size: 36px !important;
    }
    
    .saju-intro-meaning-text {
      font-size: 14px !important;
    }
    
    .saju-intro-text,
    .saju-intro-description {
      font-size: 14px !important;
    }
    
    .saju-intro-final-message {
      font-size: 15px !important;
      padding: 18px !important;
    }
  }
`;

// 스타일을 동적으로 주입
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = mobileStyles;
  document.head.appendChild(styleSheet);
}
