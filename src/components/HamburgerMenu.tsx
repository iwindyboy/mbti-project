import React from 'react';

interface HamburgerMenuProps {
  onClick: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onClick }) => {
  return (
    <button
      style={styles.button}
      onClick={onClick}
      onTouchStart={onClick}
      aria-label="메뉴 열기"
    >
      <div style={styles.icon}>
        <span style={styles.line} />
        <span style={styles.line} />
        <span style={styles.line} />
      </div>
    </button>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  button: {
    position: 'fixed',
    top: '16px',
    right: '16px',
    width: '48px',
    height: '48px',
    backgroundColor: 'rgba(255, 182, 193, 0.9)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 998,
    boxShadow: '0 4px 16px rgba(200, 90, 122, 0.3)',
    transition: 'all 0.3s ease',
    outline: 'none',
    padding: 0,
  },
  icon: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    width: '24px',
    height: '20px',
    justifyContent: 'center',
  },
  line: {
    width: '100%',
    height: '3px',
    backgroundColor: '#5A4A42',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
};

// 모바일 터치 최적화 스타일
const mobileStyles = `
  @media (max-width: 768px) {
    .hamburger-button {
      top: 12px !important;
      right: 12px !important;
      width: 44px !important;
      height: 44px !important;
    }
  }
  
  .hamburger-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(200, 90, 122, 0.4) !important;
    background-color: rgba(255, 182, 193, 1) !important;
  }
  
  .hamburger-button:active {
    transform: scale(0.95);
  }
`;

// 스타일을 동적으로 주입
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = mobileStyles;
  document.head.appendChild(styleSheet);
}
