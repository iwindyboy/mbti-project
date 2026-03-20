import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { hasScanResults } from '../utils/storage';
// import { useI18n } from '../utils/i18n';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubMenuItem {
  id: string;
  label: string;
  path: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  { id: 'main', label: '홈', icon: '🏠', path: '/landing' },
  { id: 'intro', label: 'SCAN ME 소개', icon: '■', path: '/intro' },
  {
    id: 'tests',
    label: '성향 검사 하기',
    icon: '📊',
    subItems: [
      { id: 'fortune', label: '선천적 성향 (사주)', path: '/saju-intro' },
      { id: 'scan32', label: '후천적 성향 (32 Spectrum)', path: '/spectrum-intro' },
      { id: 'other', label: '기타 성향 검사', path: '/career' },
    ],
  },
  {
    id: 'results',
    label: '나의 분석 결과 보기',
    icon: '✨',
    subItems: [
      { id: 'fortune-report', label: '선천적 성향 (사주)', path: '/fortune-report' },
      { id: 'scan32-report', label: '후천적 성향 (32 Spectrum)', path: '/scan-result' },
      { id: 'integrated', label: '성향 분석 통합', path: '/integrated-result' },
      { id: 'other-reports', label: '기타 성향 분석', path: '/other-reports' },
      { id: 'ai-coaching', label: '코칭', path: '/ai-coaching' },
    ],
  },
  { id: 'share', label: '친구 초대하기', icon: '👥', path: '/share' },
  { id: 'language', label: '언어', icon: '＠', path: '/language' },
];

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // const { t } = useI18n();
  const t = (key: string) => {
    const menuMap: Record<string, string> = {
      'menu.main': '홈',
      'menu.intro': 'SCAN 소개',
      'menu.tests': '성향 검사 하기',
      'menu.results': '나의 분석 결과 보기',
      'menu.share': '친구 초대하기',
      'menu.language': '언어',
      'menu.myResults': '지난 나의 결과 보기',
    };
    return menuMap[key] || key;
  };
  const [hasResults, setHasResults] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 저장된 결과가 있는지 확인
    hasScanResults().then(setHasResults);
    
    // 현재 경로에 따라 하위 메뉴 자동 확장
    const currentPath = location.pathname;
    menuItems.forEach((item) => {
      if (item.subItems) {
        const hasActiveSubItem = item.subItems.some((subItem) => subItem.path === currentPath);
        if (hasActiveSubItem) {
          setExpandedMenus((prev) => new Set(prev).add(item.id));
        }
      }
    });
  }, [location.pathname]);

  const handleMenuClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const toggleSubMenu = (menuId: string) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  const isSubMenuActive = (subItems?: SubMenuItem[]): boolean => {
    if (!subItems) return false;
    return subItems.some((subItem) => subItem.path === location.pathname);
  };

  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div
          style={styles.overlay}
          onClick={onClose}
          onTouchStart={onClose}
        />
      )}

      {/* 사이드 메뉴 */}
      <div
        style={{
          ...styles.sideMenu,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* 메뉴 헤더 */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <span style={styles.logoText}>SCAN</span>
          </div>
          <button
            style={styles.closeButton}
            onClick={onClose}
            onTouchStart={onClose}
            aria-label="메뉴 닫기"
          >
            ✕
          </button>
        </div>

        {/* 메뉴 리스트 */}
        <div style={styles.menuList}>
          {menuItems.map((item) => {
            const isActive = item.path ? location.pathname === item.path : false;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenus.has(item.id);
            const isSubActive = isSubMenuActive(item.subItems);

            return (
              <div key={item.id}>
                <button
                  className="side-menu-item"
                  style={{
                    ...styles.menuItem,
                    ...(isActive || isSubActive ? styles.menuItemActive : {}),
                  }}
                  onClick={() => {
                    if (hasSubItems) {
                      toggleSubMenu(item.id);
                    } else if (item.path) {
                      handleMenuClick(item.path);
                    }
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    if (hasSubItems) {
                      toggleSubMenu(item.id);
                    } else if (item.path) {
                      handleMenuClick(item.path);
                    }
                  }}
                >
                  <span style={styles.menuIcon}>{item.icon}</span>
                  <span style={styles.menuLabel}>{item.label}</span>
                  {hasSubItems && (
                    <span style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
                  )}
                  {(isActive || isSubActive) && !hasSubItems && (
                    <span style={styles.activeIndicator}>●</span>
                  )}
                </button>

                {/* 하위 메뉴 */}
                {hasSubItems && isExpanded && (
                  <div style={styles.subMenuContainer}>
                    {item.subItems!.map((subItem) => {
                      const isSubActive = location.pathname === subItem.path;
                      return (
                        <button
                          key={subItem.id}
                          className="side-menu-item"
                          style={{
                            ...styles.subMenuItem,
                            ...(isSubActive ? styles.subMenuItemActive : {}),
                          }}
                          onClick={() => handleMenuClick(subItem.path)}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            handleMenuClick(subItem.path);
                          }}
                        >
                          <span style={styles.subMenuPrefix}>├─</span>
                          <span style={styles.subMenuLabel}>{subItem.label}</span>
                          {isSubActive && <span style={styles.activeIndicator}>●</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    transition: 'opacity 0.3s ease',
  },
  sideMenu: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '300px',
    maxWidth: '85vw',
    height: '100vh',
    backgroundColor: '#5A4A42',
    boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
    transition: 'transform 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '20px',
    backgroundColor: '#4A3A32',
    borderBottom: '2px solid rgba(255, 182, 193, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#FFB6C1',
    letterSpacing: '2px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    color: '#FFF8F5',
    cursor: 'pointer',
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
  },
  menuList: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 0',
    WebkitOverflowScrolling: 'touch',
  },
  menuItem: {
    width: '100%',
    padding: '8px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'transparent',
    border: 'none',
    borderLeft: '4px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#FFF8F5',
    fontSize: '16px',
    textAlign: 'left',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    WebkitTapHighlightColor: 'transparent',
    outline: 'none',
  },
  menuItemActive: {
    backgroundColor: 'rgba(255, 182, 193, 0.15)',
    borderLeft: '4px solid #FFB6C1',
    fontWeight: '600',
  },
  menuIcon: {
    fontSize: '20px',
    width: '24px',
    textAlign: 'center',
  },
  menuLabel: {
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  activeIndicator: {
    color: '#FFB6C1',
    fontSize: '12px',
  },
  expandIcon: {
    color: '#FFF8F5',
    fontSize: '10px',
    marginLeft: 'auto',
    transition: 'transform 0.2s ease',
  },
  subMenuContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderLeft: '2px solid rgba(255, 182, 193, 0.3)',
    marginLeft: '20px',
  },
  subMenuItem: {
    width: '100%',
    padding: '6px 20px 6px 8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderLeft: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#FFF8F5',
    fontSize: '13px',
    textAlign: 'left',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    WebkitTapHighlightColor: 'transparent',
    outline: 'none',
    minWidth: 0, // flexbox에서 텍스트 오버플로우를 허용
  },
  subMenuItemActive: {
    backgroundColor: 'rgba(255, 182, 193, 0.1)',
    borderLeft: '2px solid #FFB6C1',
    fontWeight: '500',
  },
  subMenuPrefix: {
    color: 'rgba(255, 182, 193, 0.6)',
    fontSize: '12px',
    width: '24px',
    textAlign: 'center',
  },
  subMenuLabel: {
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

// 모바일 터치 최적화 스타일
const mobileStyles = `
  @media (max-width: 768px) {
    .side-menu-overlay {
      background-color: rgba(0, 0, 0, 0.6) !important;
    }
    
    .side-menu {
      width: 75vw !important;
    }
    
    .side-menu-item {
      padding: 9px 20px !important;
      font-size: 15px !important;
      min-height: 40px !important;
    }
  }
  
  .side-menu-item {
    -webkit-tap-highlight-color: transparent !important;
    tap-highlight-color: transparent !important;
  }
  
  .side-menu-item:hover {
    background-color: rgba(255, 182, 193, 0.1) !important;
  }
  
  .side-menu-item:active {
    background-color: transparent !important;
  }
  
  .side-menu-item:focus {
    background-color: transparent !important;
    outline: none !important;
  }
  
  .side-menu-item:focus-visible {
    background-color: transparent !important;
    outline: none !important;
  }
`;

// 스타일을 동적으로 주입
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = mobileStyles;
  document.head.appendChild(styleSheet);
}
