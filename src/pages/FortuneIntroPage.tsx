import React from 'react';
import { useNavigate } from 'react-router-dom';

export const FortuneIntroPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
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
          <p style={styles.meaningDefinition}>
            운명(運命)이란<br />
            타고난 본질을 내가 직접 만들어가는 것이에요.
          </p>
        </section>

        {/* 본문 섹션 2 - 질문 */}
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

        {/* 사주는 점술이 아니에요 */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>사주는 점술이 아니에요</h2>
          <p style={styles.descriptionText}>
            미래를 예언하지도 않아요.<br />
            태어난 순간의 에너지 속에 담긴<br />
            나라는 사람의 본질을 읽는 도구예요.
          </p>
          
          <div style={styles.featureBox}>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}>💭</div>
              <div style={styles.featureText}>어떤 방식으로 생각하는지</div>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}>⚡</div>
              <div style={styles.featureText}>무엇에 힘이 나고 무엇에 지치는지</div>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}>🔄</div>
              <div style={styles.featureText}>관계에서 반복되는 나만의 패턴</div>
            </div>
          </div>
        </section>

        {/* 2,000년의 시간 */}
        <section style={styles.section}>
          <div style={styles.historyBox}>
            <p style={styles.historyText}>
              2,000년의 시간 동안<br />
              수많은 사람들이 사주에서 자신을 발견했어요.
            </p>
          </div>
        </section>

        {/* 나를 이해해야 */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>나를 이해해야</h2>
          <p style={styles.descriptionText}>
            내 방식으로 살아갈 수 있어요.<br />
            그게 운명을 운(運)하는 방법이에요.
          </p>
        </section>

        {/* CTA 섹션 */}
        <section style={styles.ctaSection}>
          <div style={styles.ctaBox}>
            <div style={styles.ctaTime}>소요 시간: 약 1분</div>
            <p style={styles.ctaText}>
              생년월일만 있으면 바로 시작할 수 있어요.
            </p>
            <button
              style={styles.ctaButton}
              onClick={() => navigate('/fortune')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              나의 선천적 성향 확인하기 →
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
    padding: '16px',
    paddingBottom: '40px',
  },
  content: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '24px',
    paddingTop: '12px',
  },
  mainHeadline: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2D1B40',
    lineHeight: '1.5',
    fontFamily: '"Nanum Myeongjo", "나눔명조", "Noto Serif KR", "Batang", "Gungsuh", serif',
  },
  section: {
    marginBottom: '28px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#2D1B40',
    marginBottom: '12px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  meaningBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  },
  meaningRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '12px',
  },
  meaningChar: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#8B3A8B',
    fontFamily: '"Nanum Myeongjo", "나눔명조", "Noto Serif KR", "Batang", "Gungsuh", serif',
    minWidth: '60px',
  },
  meaningText: {
    fontSize: '18px',
    color: '#5A4A42',
    fontWeight: '600',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  meaningDefinition: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#2D1B40',
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  introText: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#5A4A42',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  descriptionText: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#5A4A42',
    marginBottom: '12px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  featureBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    padding: '20px',
    marginTop: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  featureIcon: {
    fontSize: '24px',
    minWidth: '32px',
  },
  featureText: {
    fontSize: '16px',
    color: '#5A4A42',
    lineHeight: '1.5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  historyBox: {
    backgroundColor: 'rgba(139, 58, 139, 0.1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '2px solid rgba(139, 58, 139, 0.2)',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  },
  historyText: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#8B3A8B',
    fontWeight: '600',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  ctaSection: {
    marginTop: '32px',
    marginBottom: '24px',
  },
  ctaBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '2px solid rgba(139, 58, 139, 0.3)',
    borderRadius: '20px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
  ctaTime: {
    fontSize: '14px',
    color: '#8B3A8B',
    fontWeight: '600',
    marginBottom: '12px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  ctaText: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#5A4A42',
    marginBottom: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  ctaButton: {
    width: '100%',
    height: '56px',
    background: 'linear-gradient(135deg, #8B3A8B 0%, #1A0A2E 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '16px',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 12px rgba(139, 58, 139, 0.3)',
  },
};
