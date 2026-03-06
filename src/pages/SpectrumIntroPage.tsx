import React from 'react';
import { useNavigate } from 'react-router-dom';

export const SpectrumIntroPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* 메인 헤드라인 */}
        <div style={styles.headerSection}>
          <h1 style={styles.mainHeadline}>
            사주가 '원래의 나'라면,<br />
            32 스펙트럼은 '지금의 나'예요
          </h1>
        </div>

        {/* 본문 섹션 1 */}
        <section style={styles.section}>
          <p style={styles.introText}>
            혹시 이런 생각 해본 적 있나요?<br />
            분명히 열심히 사는데 뭔가 어긋나는 느낌.<br />
            나다운 게 뭔지 모르겠는 순간들.<br />
            그 이유가 나를 정확하게 몰랐기 때문일 수 있어요.
          </p>
        </section>

        {/* 사주 vs 32 스펙트럼 비교 */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>사주 vs 32 스펙트럼</h2>
          <div style={styles.comparisonTable}>
            <div style={styles.comparisonRow}>
              <div style={styles.comparisonCell}>
                <div style={styles.comparisonLabel}>사주</div>
              </div>
              <div style={styles.comparisonCell}>
                <div style={styles.comparisonLabel}>32 스펙트럼</div>
              </div>
            </div>
            <div style={styles.comparisonRow}>
              <div style={styles.comparisonCell}>
                <div style={styles.comparisonText}>태어날 때 정해진 것</div>
              </div>
              <div style={styles.comparisonCell}>
                <div style={styles.comparisonText}>살면서 형성된 것</div>
              </div>
            </div>
            <div style={styles.comparisonRow}>
              <div style={styles.comparisonCell}>
                <div style={styles.comparisonText}>변하지 않는 본질</div>
              </div>
              <div style={styles.comparisonCell}>
                <div style={styles.comparisonText}>환경에 따라 달라지는 성향</div>
              </div>
            </div>
            <div style={styles.comparisonRow}>
              <div style={styles.comparisonCell}>
                <div style={styles.comparisonText}>"원래 나는 이런 사람"</div>
              </div>
              <div style={styles.comparisonCell}>
                <div style={styles.comparisonText}>"지금 나는 이런 사람"</div>
              </div>
            </div>
          </div>
          <p style={styles.comparisonNote}>
            두 개는 중복이 아니에요.<br />
            함께 볼 때 비로소 내가 완전하게 보여요.
          </p>
        </section>

        {/* 32 스펙트럼이란? */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>32 스펙트럼이란?</h2>
          <p style={styles.descriptionText}>
            MBTI보다 한 단계 더 깊은 분석이에요.<br />
            기존 MBTI 16가지에<br />
            지금 내가 어떻게 살아가는지 축을 하나 더 추가해서<br />
            32가지로 더 정밀하게 분석해요.
          </p>
          
          <div style={styles.exampleBox}>
            <div style={styles.exampleRow}>
              <div style={styles.exampleLabel}>MBTI</div>
              <div style={styles.exampleArrow}>→</div>
              <div style={styles.exampleValue}>INTJ</div>
            </div>
            <div style={styles.exampleRow}>
              <div style={styles.exampleLabel}>32 스펙트럼</div>
              <div style={styles.exampleArrow}>→</div>
              <div style={styles.exampleValues}>
                <div style={styles.exampleValueItem}>INTJD (주도적으로 살아가는 나)</div>
                <div style={styles.exampleValueItem}>INTJA (적응적으로 살아가는 나)</div>
              </div>
            </div>
          </div>
          
          <p style={styles.descriptionText}>
            같은 INTJ라도 완전히 다른 삶을 살 수 있어요.<br />
            그 차이까지 포착하는 게 32 스펙트럼이에요.
          </p>
        </section>

        {/* 두 개를 합치면? */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>두 개를 합치면?</h2>
          <div style={styles.flowBox}>
            <div style={styles.flowItem}>
              <div style={styles.flowLabel}>원래의 나 (사주)</div>
            </div>
            <div style={styles.flowArrow}>+</div>
            <div style={styles.flowItem}>
              <div style={styles.flowLabel}>지금의 나 (32 스펙트럼)</div>
            </div>
            <div style={styles.flowArrow}>↓</div>
            <div style={styles.flowItem}>
              <div style={styles.flowLabel}>갭(Gap) 발견</div>
            </div>
            <div style={styles.flowArrow}>↓</div>
            <div style={styles.flowItem}>
              <div style={styles.flowLabel}>"왜 힘들었는지" 보이기 시작</div>
            </div>
            <div style={styles.flowArrow}>↓</div>
            <div style={styles.flowItem}>
              <div style={styles.flowLabel}>더 나다운 삶으로 가는 방향</div>
            </div>
          </div>
          <p style={styles.descriptionText}>
            타고난 기질과 지금의 성향 사이의 갭이<br />
            나를 반복적으로 힘들게 하는 패턴의 원인이 될 수 있어요.<br />
            그 갭을 발견하는 순간,<br />
            막연했던 것들이 선명하게 이해되기 시작해요.
          </p>
        </section>

        {/* 검사로 알 수 있는 것 */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>검사로 알 수 있는 것</h2>
          <div style={styles.checklist}>
            <div style={styles.checkItem}>✅ 지금 나의 진짜 성향</div>
            <div style={styles.checkItem}>✅ 반복되는 힘든 패턴의 이유</div>
            <div style={styles.checkItem}>✅ 나와 잘 맞는 사람 / 충돌하는 사람</div>
            <div style={styles.checkItem}>✅ 나에게 맞는 커리어 방향</div>
            <div style={styles.checkItem}>✅ 사주와의 갭 분석 → 통합 코칭</div>
          </div>
        </section>

        {/* 분석에서 끝나지 않아요 */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>분석에서 끝나지 않아요</h2>
          <p style={styles.descriptionText}>
            많은 테스트가 "당신은 이런 사람이에요"에서 끝나요.<br />
            하지만 정작 필요한 건<br />
            "그래서 나는 어떻게 살면 되는 건데?" 예요.<br />
            사주 + 32 스펙트럼 통합 분석은<br />
            단순한 결과 확인이 아니라 코칭의 시작점이에요.
          </p>
        </section>

        {/* CTA 섹션 */}
        <section style={styles.ctaSection}>
          <div style={styles.ctaBox}>
            <div style={styles.ctaTime}>검사 시간: 약 3~5분</div>
            <p style={styles.ctaText}>
              사주로 '원래의 나'를 확인했다면,<br />
              이제 '지금의 나'를 만날 차례예요.<br />
              두 개가 만나는 순간,<br />
              지금껏 설명되지 않았던 나의 많은 것들이<br />
              비로소 이해되기 시작할 거예요.
            </p>
            <button
              style={styles.ctaButton}
              onClick={() => navigate('/survey')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              32 스펙트럼 검사 시작하기 →
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
  introText: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#5A4A42',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  comparisonTable: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  },
  comparisonRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '8px',
  },
  comparisonCell: {
    padding: '8px',
  },
  comparisonLabel: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#8B3A8B',
    marginBottom: '6px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  comparisonText: {
    fontSize: '15px',
    color: '#5A4A42',
    lineHeight: '1.5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  comparisonNote: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#6B2FA0',
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  descriptionText: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#5A4A42',
    marginBottom: '12px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  exampleBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  },
  exampleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
  },
  exampleLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#8B3A8B',
    minWidth: '100px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  exampleArrow: {
    fontSize: '18px',
    color: '#8B3A8B',
    fontWeight: '700',
  },
  exampleValue: {
    fontSize: '16px',
    color: '#2D1B40',
    fontWeight: '600',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  exampleValues: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  exampleValueItem: {
    fontSize: '15px',
    color: '#5A4A42',
    lineHeight: '1.5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  flowBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  },
  flowItem: {
    marginBottom: '8px',
  },
  flowLabel: {
    fontSize: '15px',
    color: '#5A4A42',
    lineHeight: '1.5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  flowArrow: {
    fontSize: '20px',
    color: '#8B3A8B',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '6px',
  },
  checklist: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  },
  checkItem: {
    fontSize: '16px',
    color: '#5A4A42',
    lineHeight: '1.5',
    marginBottom: '8px',
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
