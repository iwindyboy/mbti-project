import React from 'react';
import { useNavigate } from 'react-router-dom';

export const DatingPage: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: '나의 연애 유형 검사',
      subtitle: '내가 몰랐던 나의 연애 스타일은?',
      comingSoon: false,
      path: '/dating/intro',
      gradient: 'linear-gradient(135deg, #FFD6E8 0%, #FFB6D1 100%)',
      borderColor: 'rgba(200, 90, 122, 0.4)',
    },
    {
      title: '찰떡궁합 탐구소',
      subtitle: '우리 둘의 좌표는 얼마나 가까울까?',
      comingSoon: true,
      path: '/dating/compatibility',
      gradient: 'linear-gradient(135deg, #E8D5FF 0%, #D4B5FF 100%)',
      borderColor: 'rgba(168, 120, 200, 0.3)',
    },
    {
      title: '오피스 로맨스 테스트',
      subtitle: '일터에서 만난 나의 연애 스타일은?',
      comingSoon: true,
      path: '/dating/office-romance',
      gradient: 'linear-gradient(135deg, #FFE5D9 0%, #FFD4C4 100%)',
      borderColor: 'rgba(255, 150, 120, 0.3)',
    },
    {
      title: '이별 회복 탄력성 검사',
      subtitle: '나는 이별 후 어떻게 다시 일어서는 사람인가?',
      comingSoon: true,
      path: '/dating/breakup-recovery',
      gradient: 'linear-gradient(135deg, #D5F5E8 0%, #B8E6D3 100%)',
      borderColor: 'rgba(120, 200, 168, 0.3)',
    },
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (!item.comingSoon) {
      navigate(item.path);
    }
  };

  return (
    <>
      <style>{`
        .dating-menu-item:not(.disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12) !important;
          border-color: rgba(200, 90, 122, 0.5) !important;
        }
      `}</style>
      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.title}>
            <span style={styles.icon}>💕</span>
            두근두근 연애 검사
          </h1>
          <p style={styles.introDescription}>
            단순히 '누구를 좋아하는지'를 넘어, 연애라는 상황 속에서 당신의 심리가 어떻게 작동하는지 분석하고 조언을 받아보세요.
          </p>
          <div style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={item.comingSoon ? 'dating-menu-item disabled' : 'dating-menu-item'}
                style={{
                  ...styles.menuItem,
                  background: item.comingSoon 
                    ? 'linear-gradient(135deg, #E8E0E5 0%, #D8D0D5 100%)'
                    : item.gradient,
                  borderColor: item.comingSoon 
                    ? 'rgba(180, 170, 175, 0.3)'
                    : item.borderColor,
                  ...(item.comingSoon ? styles.menuItemDisabled : {}),
                }}
                onClick={() => handleMenuClick(item)}
              >
                <div style={styles.menuItemContent}>
                  <div style={styles.titleRow}>
                    <h3 style={styles.menuItemTitle}>{item.title}</h3>
                    {item.comingSoon && (
                      <span style={styles.comingSoon}>[Coming Soon]</span>
                    )}
                  </div>
                  <p style={styles.menuItemSubtitle}>{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
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
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#5A4A42',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  icon: {
    fontSize: '36px',
  },
  introDescription: {
    fontSize: '16px',
    color: '#8B7355',
    lineHeight: '1.6',
    marginBottom: '40px',
    textAlign: 'center',
  },
  menuContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '20px',
  },
  menuItem: {
    border: '1px solid',
    borderRadius: '12px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'left',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    minHeight: '85px',
    height: '85px',
    display: 'flex',
    flexDirection: 'column',
  },
  menuItemDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
    filter: 'grayscale(20%)',
  },
  menuItemContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    justifyContent: 'space-between',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  menuItemTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#5A4A42',
    margin: 0,
  },
  menuItemSubtitle: {
    fontSize: '14px',
    color: '#8B7355',
    margin: 0,
    lineHeight: '1.4',
  },
  comingSoon: {
    fontSize: '12px',
    color: '#C85A7A',
    fontWeight: '500',
    fontStyle: 'italic',
  },
};
