import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLogo } from '../components/ScanLogo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleIntroClick = () => {
    navigate('/intro');
  };

  const handleFortuneClick = () => {
    navigate('/saju-intro');
  };

  const handleSpectrumClick = () => {
    navigate('/spectrum-intro');
  };

  return (
    <div style={styles.container} className="landing-container">
      <div style={styles.content}>
        {/* 상단 작은 글씨 */}
        <div style={styles.topLabel} className="landing-top-label">
          성격 · 연애 · 관계
        </div>

        {/* 중앙 큰 글씨 */}
        <div style={styles.mainHeadline} className="landing-main-headline">
          스치듯 지나친 당신의 성향,<br />
          SCAN이 분석해 드릴게요.
        </div>

        {/* SCAN 로고 */}
        <div style={styles.logoContainer} className="landing-logo-container">
          <ScanLogo size={120} color="#C85A7A" />
        </div>
      </div>

      {/* 하단 버튼 및 아이콘 */}
      <div style={styles.buttonContainer} className="landing-button-container">
        <div style={styles.buttonColumn} className="landing-button-column">
          <button
            style={styles.iconButton}
            onClick={handleIntroClick}
            className="landing-icon-button"
          >
            <div style={styles.iconButtonContent}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3"/>
                <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
              <span style={styles.iconButtonText} className="landing-icon-button-text">SCAN 소개</span>
            </div>
          </button>
          
          <button
            style={styles.iconButton}
            onClick={handleFortuneClick}
            className="landing-icon-button"
          >
            <div style={styles.iconButtonContent}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3"/>
                <path d="M3 10h18M8 4v6M16 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="15" r="1.5" fill="currentColor" opacity="0.6"/>
                <circle cx="12" cy="15" r="1.5" fill="currentColor" opacity="0.6"/>
                <circle cx="16" cy="15" r="1.5" fill="currentColor" opacity="0.6"/>
              </svg>
              <span style={styles.iconButtonText} className="landing-icon-button-text">선천적 성향 검사(사주)</span>
            </div>
          </button>
          
          <button
            style={styles.iconButton}
            onClick={handleSpectrumClick}
            className="landing-icon-button"
          >
            <div style={styles.iconButtonContent}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3"/>
                <path d="M3 10h18M8 4v6M16 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="15" r="1.5" fill="currentColor" opacity="0.6"/>
                <circle cx="12" cy="15" r="1.5" fill="currentColor" opacity="0.6"/>
                <circle cx="16" cy="15" r="1.5" fill="currentColor" opacity="0.6"/>
              </svg>
              <span style={styles.iconButtonText} className="landing-icon-button-text">후천적 성향 검사 (32 Spectrum)</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F9F7F2 0%, #F5F3ED 50%, #F1EFE8 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px 20px',
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    maxWidth: '800px',
    width: '100%',
    zIndex: 1,
  },
  topLabel: {
    fontSize: '18px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#8B7355',
    letterSpacing: '2px',
    marginBottom: '20px',
    fontWeight: '400',
    textTransform: 'uppercase',
  },
  mainHeadline: {
    fontSize: '32px',
    fontFamily: '"Nanum Myeongjo", "나눔명조", "Noto Serif KR", "Batang", "Gungsuh", serif',
    color: '#5A4A42',
    letterSpacing: '1px',
    lineHeight: '1.5',
    fontWeight: '400',
    maxWidth: '600px',
    marginBottom: '16px',
  },
  logoContainer: {
    marginTop: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: '400px',
    padding: '0 20px 20px 20px',
    zIndex: 1,
  },
  buttonColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '10px',
    width: '100%',
  },
  startButton: {
    width: '100%',
    padding: '18px 32px',
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontWeight: '500',
    letterSpacing: '1px',
    color: '#5A4A42',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    outline: 'none',
  },
  iconButton: {
    width: '100%',
    padding: '12px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    color: '#5A4A42',
  },
  iconButtonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  iconButtonText: {
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontWeight: '500',
    letterSpacing: '0.5px',
    color: '#5A4A42',
  },
};

// 모바일 반응형 스타일 추가
const mobileStyles = `
  @media (max-width: 768px) {
    .landing-container {
      padding: 16px 16px !important;
    }
    
    .landing-main-headline {
      font-size: 22px !important;
      letter-spacing: 0.5px !important;
      line-height: 1.4 !important;
      padding: 0 20px;
      margin-bottom: 12px !important;
    }
    
    .landing-top-label {
      font-size: 14px !important;
      letter-spacing: 1.5px !important;
      margin-bottom: 16px !important;
    }
    
    .landing-logo-container {
      margin-top: 8px !important;
    }
    
    .landing-logo-container svg {
      width: 80px !important;
      height: auto !important;
    }
    
    .landing-button-container {
      padding: 0 16px 16px 16px !important;
    }
    
    .landing-start-button {
      padding: 16px 28px !important;
      font-size: 15px !important;
    }
  }
  
  @media (max-width: 480px) {
    .landing-container {
      padding: 12px 12px !important;
    }
    
    .landing-main-headline {
      font-size: 18px !important;
      letter-spacing: 0.3px !important;
      line-height: 1.3 !important;
      margin-bottom: 10px !important;
    }
    
    .landing-top-label {
      font-size: 12px !important;
      letter-spacing: 1px !important;
      margin-bottom: 12px !important;
    }
    
    .landing-logo-container {
      margin-top: 6px !important;
    }
    
    .landing-logo-container svg {
      width: 60px !important;
      height: auto !important;
    }
    
    .landing-button-container {
      padding: 0 12px 12px 12px !important;
    }
    
    .landing-start-button {
      padding: 14px 24px !important;
      font-size: 14px !important;
    }
  }
  
  .landing-start-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
    background-color: rgba(255, 255, 255, 0.3) !important;
  }
  
  .landing-start-button:active {
    transform: translateY(0);
  }
  
  .landing-icon-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
    background-color: rgba(255, 255, 255, 0.3) !important;
  }
  
  .landing-icon-button:active {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    .landing-button-column {
      gap: 8px !important;
    }
    
    .landing-start-button {
      font-size: 14px !important;
      padding: 16px 24px !important;
    }
    
    .landing-icon-button {
      padding: 10px 14px !important;
    }
    
    .landing-icon-button svg {
      width: 18px !important;
      height: 18px !important;
    }
    
    .landing-icon-button-text {
      font-size: 12px !important;
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
