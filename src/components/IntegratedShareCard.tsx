import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

interface IntegratedShareCardProps {
  name: string;
  cheongan: string;
  cheonganName: string;
  ohang: string;
  spectrumCode: string;
  alignmentScore: number;
  alignmentLabel: string;
  alignmentEmoji: string;
  matchedAxes: string[];
  gapAxes: string[];
  greyZoneAxes: string[];
  greyZoneCount: number;
  lifeTheme?: string;
  onClose: () => void;
}

// ═══════════ 축 코드 해석 ═══════════
const AXIS_MEANING: Record<string, { left: string; right: string; label: string }> = {
  E: { left: '', right: '외향적 에너지', label: '에너지' },
  I: { left: '내면 집중형', right: '', label: '에너지' },
  N: { left: '', right: '직관과 영감', label: '인식' },
  S: { left: '현실 감각형', right: '', label: '인식' },
  F: { left: '감성 판단형', right: '', label: '판단' },
  T: { left: '', right: '논리 분석형', label: '판단' },
  P: { left: '유연한 탐색', right: '', label: '생활' },
  J: { left: '', right: '체계적 계획', label: '생활' },
  D: { left: '신중한 실행', right: '', label: '실행' },
  A: { left: '', right: '즉각 행동형', label: '실행' },
};

function getTraitDescription(code: string): string[] {
  return code.split('').map((c) => {
    const info = AXIS_MEANING[c];
    if (!info) return c;
    return info.left || info.right;
  });
}

function findDifferences(sajuCode: string, spectrumCode: string): string[] {
  const diffs: string[] = [];
  const axisLabels = ['에너지', '인식', '판단', '생활', '실행'];
  for (let i = 0; i < Math.min(sajuCode.length, spectrumCode.length); i++) {
    if (sajuCode[i] !== spectrumCode[i]) {
      const specInfo = AXIS_MEANING[spectrumCode[i]];
      if (specInfo) {
        diffs.push(`${axisLabels[i]}: ${specInfo.left || specInfo.right}`);
      }
    }
  }
  return diffs;
}

// ═══════════ 천간 → 예상 코드 ═══════════
const CHEONGAN_EXPECTED: Record<string, string> = {
  甲: 'ENTJD',
  乙: 'INFPA',
  丙: 'ENFJD',
  丁: 'INFJA',
  戊: 'ESTJD',
  己: 'ISFJA',
  庚: 'ESTJD',
  辛: 'ISTPA',
  壬: 'ENTPD',
  癸: 'INFPA',
};

// ═══════════ 오행 컬러 ═══════════
const OHANG_GRADIENT: Record<string, string> = {
  木: 'linear-gradient(135deg, #a8e6cf 0%, #3d8b6e 50%, #1a5c3a 100%)',
  火: 'linear-gradient(135deg, #ffb3ba 0%, #e84393 50%, #b71540 100%)',
  土: 'linear-gradient(135deg, #ffeaa7 0%, #dca36d 50%, #a0764a 100%)',
  金: 'linear-gradient(135deg, #dfe6e9 0%, #b2bec3 50%, #636e72 100%)',
  水: 'linear-gradient(135deg, #c3cfe2 0%, #7c6fb0 50%, #4a3580 100%)',
};

const OHANG_ACCENT: Record<string, string> = {
  木: '#2d6a4f',
  火: '#c2185b',
  土: '#8d6e4a',
  金: '#4a5568',
  水: '#5b3e96',
};

export const IntegratedShareCard: React.FC<IntegratedShareCardProps> = ({
  name,
  cheongan,
  cheonganName,
  ohang,
  spectrumCode,
  alignmentScore,
  alignmentLabel,
  alignmentEmoji,
  matchedAxes,
  gapAxes,
  greyZoneAxes,
  greyZoneCount,
  lifeTheme,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'card' | 'channels'>('card');

  const gradient = OHANG_GRADIENT[ohang] || OHANG_GRADIENT['水'];
  const accent = OHANG_ACCENT[ohang] || OHANG_ACCENT['水'];
  const expectedCode = CHEONGAN_EXPECTED[cheongan] || 'INFPA';
  const sajuTraits = getTraitDescription(expectedCode);
  const spectrumTraits = getTraitDescription(spectrumCode);
  const differences = findDifferences(expectedCode, spectrumCode);

  const shareText = `✨ ${name}님의 SCAN ME 결과\n\n🌙 선천: ${cheonganName}(${cheongan})\n⚡ 후천: ${spectrumCode}\n📊 일치도: ${alignmentScore}% ${alignmentEmoji} ${alignmentLabel}\n${
    differences.length > 0
      ? `\n🔄 후천적으로 발달한 성향:\n${differences.map((d) => `  · ${d}`).join('\n')}`
      : ''
  }\n\n나도 해보기 👉 https://scan-me.app`;

  const shareUrl = 'https://scan-me.app';

  // ═══════════ 핸들러 ═══════════

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3500);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setDownloading(true);
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `SCANME_${name}_${spectrumCode}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showMessage('이미지가 저장됐어요! 📸 인스타 스토리에 올려보세요');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      showMessage('저장에 실패했어요. 다시 시도해주세요 😢');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      showMessage('복사 완료! 💬 카톡이나 메신저에 붙여넣기 하세요');
    } catch {
      showMessage('복사에 실패했어요. 다시 시도해주세요');
    }
  };

  const handleKakao = () => {
    const kakaoUrl = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(kakaoUrl, '_blank', 'width=500,height=600');
  };

  const handleInstagram = async () => {
    // 이미지 저장 후 인스타 안내
    await handleDownload();
    showMessage('이미지를 저장했어요! 📷 인스타그램 앱에서 스토리에 올려주세요');
  };

  const handleTwitter = () => {
    const twitterText = `✨ 나의 SCAN ME 결과: ${cheonganName} × ${spectrumCode} | 일치도 ${alignmentScore}% ${alignmentLabel}\n\n나도 해보기 👉`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      twitterText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=500,height=400');
  };

  const handleWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  const handleWebShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'SCAN ME - 나의 선천 × 후천 성향분석',
          text: shareText,
          url: shareUrl,
        });
      } else {
        handleCopyText();
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('공유 취소:', err);
    }
  };

  // ═══════════ 렌더 ═══════════

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={closeBtn}>
          ✕
        </button>

        {/* 탭 */}
        <div style={tabRow}>
          <button
            style={activeTab === 'card' ? tabActive : tabInactive}
            onClick={() => setActiveTab('card')}
          >
            미리보기
          </button>
          <button
            style={activeTab === 'channels' ? tabActive : tabInactive}
            onClick={() => setActiveTab('channels')}
          >
            공유하기
          </button>
        </div>

        {activeTab === 'card' && (
          <>
            {/* ═══ 공유 카드 ═══ */}
            <div ref={cardRef} style={{ ...cardBase, background: gradient }}>
              {/* 브랜드 */}
              <div style={brandArea}>
                <span style={brandText}>SCAN ME</span>
                <span style={brandSub}>선천 × 후천 성향분석</span>
              </div>

              {/* 이름 */}
              <div style={nameArea}>{name}님의 성향 리포트</div>

              {/* 선천 / 후천 비교 */}
              <div style={comparisonBox}>
                <div style={sideBox}>
                  <div style={sideLabel}>🌙 선천적 성향</div>
                  <div style={sideCode}>{expectedCode}</div>
                  <div style={sideName}>
                    {cheonganName}({cheongan})
                  </div>
                  <div style={traitList}>
                    {sajuTraits.map((t, i) => (
                      <span key={i} style={traitChip}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={vsCircle}>VS</div>

                <div style={sideBox}>
                  <div style={sideLabel}>⚡ 후천적 성향</div>
                  <div style={sideCode}>{spectrumCode}</div>
                  <div style={sideName}>현재의 나</div>
                  <div style={traitList}>
                    {spectrumTraits.map((t, i) => (
                      <span key={i} style={traitChip}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 일치도 */}
              <div style={scoreArea}>
                <div style={scoreRow}>
                  <span style={scoreBig}>{alignmentScore}%</span>
                  <span style={scoreBadge}>
                    {alignmentEmoji} {alignmentLabel}
                  </span>
                </div>
                <div style={barBg}>
                  <div style={{ ...barFill, width: `${alignmentScore}%` }} />
                </div>
              </div>

              {/* 변화 포인트 */}
              {differences.length > 0 && (
                <div style={changeBox}>
                  <div style={changeTitle}>🔄 후천적으로 발달한 성향</div>
                  {differences.map((d, i) => (
                    <div key={i} style={changeItem}>
                      · {d}
                    </div>
                  ))}
                </div>
              )}

              {/* 일치 & Grey Zone */}
              <div style={tagRow}>
                {matchedAxes.length > 0 && (
                  <span style={tagMatch}>✅ 일치 {matchedAxes.length}개 축</span>
                )}
                {greyZoneCount > 0 && (
                  <span style={tagGrey}>🔮 유연 {greyZoneCount}개 축</span>
                )}
              </div>

              {/* 푸터 */}
              <div style={footerArea}>scan-me.app</div>
            </div>

            {/* 메시지 */}
            {message && <div style={msgBox}>{message}</div>}

            {/* 카드 탭 하단 버튼 */}
            <div style={btnCol}>
              <button onClick={handleDownload} style={btnOutline} disabled={downloading}>
                {downloading ? '⏳ 저장 중...' : '📸 이미지 저장'}
              </button>
              <button onClick={handleCopyText} style={btnOutline}>
                📋 텍스트 복사
              </button>
              <button
                onClick={() => setActiveTab('channels')}
                style={btnPrimary(accent)}
              >
                📤 공유 채널 선택
              </button>
            </div>
          </>
        )}

        {activeTab === 'channels' && (
          <>
            {/* 메시지 */}
            {message && <div style={msgBox}>{message}</div>}

            {/* ═══ 공유 채널 ═══ */}
            <div style={channelGrid}>
              {/* 카카오톡 */}
              <button onClick={handleKakao} style={channelBtn}>
                <div style={{ ...channelIcon, backgroundColor: '#FEE500' }}>💬</div>
                <span style={channelName}>카카오톡</span>
              </button>

              {/* 인스타그램 */}
              <button onClick={handleInstagram} style={channelBtn}>
                <div
                  style={{
                    ...channelIcon,
                    background:
                      'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                  }}
                >
                  📷
                </div>
                <span style={channelName}>인스타그램</span>
              </button>

              {/* X (트위터) */}
              <button onClick={handleTwitter} style={channelBtn}>
                <div style={{ ...channelIcon, backgroundColor: '#000' }}>𝕏</div>
                <span style={channelName}>X (트위터)</span>
              </button>

              {/* 왓츠앱 */}
              <button onClick={handleWhatsApp} style={channelBtn}>
                <div style={{ ...channelIcon, backgroundColor: '#25D366' }}>💚</div>
                <span style={channelName}>WhatsApp</span>
              </button>

              {/* 텍스트 복사 */}
              <button onClick={handleCopyText} style={channelBtn}>
                <div style={{ ...channelIcon, backgroundColor: '#e5e7eb' }}>📋</div>
                <span style={channelName}>텍스트 복사</span>
              </button>

              {/* 기타 공유 */}
              <button onClick={handleWebShare} style={channelBtn}>
                <div style={{ ...channelIcon, backgroundColor: '#ddd6fe' }}>📤</div>
                <span style={channelName}>더보기</span>
              </button>
            </div>

            <button
              onClick={() => setActiveTab('card')}
              style={{ ...btnOutline, marginTop: '12px' }}
            >
              ← 카드 미리보기
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ═══════════ 스타일 ═══════════

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.55)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  padding: '16px',
  backdropFilter: 'blur(4px)',
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '24px',
  padding: '20px',
  maxWidth: '420px',
  width: '100%',
  maxHeight: '92vh',
  overflowY: 'auto',
  position: 'relative',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
};

const closeBtn: React.CSSProperties = {
  position: 'absolute',
  top: '14px',
  right: '14px',
  background: 'none',
  border: 'none',
  fontSize: '18px',
  cursor: 'pointer',
  color: '#aaa',
  zIndex: 10,
};

const tabRow: React.CSSProperties = {
  display: 'flex',
  gap: '4px',
  marginBottom: '16px',
  backgroundColor: '#f3f4f6',
  borderRadius: '12px',
  padding: '4px',
};

const tabActive: React.CSSProperties = {
  flex: 1,
  padding: '10px',
  borderRadius: '10px',
  backgroundColor: '#fff',
  border: 'none',
  fontWeight: 700,
  fontSize: '14px',
  cursor: 'pointer',
  color: '#1f2937',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
};

const tabInactive: React.CSSProperties = {
  flex: 1,
  padding: '10px',
  borderRadius: '10px',
  backgroundColor: 'transparent',
  border: 'none',
  fontWeight: 500,
  fontSize: '14px',
  cursor: 'pointer',
  color: '#9ca3af',
};

// ═══ 카드 스타일 ═══

const cardBase: React.CSSProperties = {
  width: '100%',
  aspectRatio: '9/16',
  borderRadius: '16px',
  padding: '24px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: '#fff',
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'hidden',
};

const brandArea: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px',
};

const brandText: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 800,
  letterSpacing: '4px',
  textShadow: '0 2px 8px rgba(0,0,0,0.2)',
};

const brandSub: React.CSSProperties = {
  fontSize: '10px',
  opacity: 0.75,
  letterSpacing: '1.5px',
};

const nameArea: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 600,
  opacity: 0.9,
};

const comparisonBox: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
};

const sideBox: React.CSSProperties = {
  flex: 1,
  backgroundColor: 'rgba(255,255,255,0.15)',
  borderRadius: '12px',
  padding: '12px 8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  backdropFilter: 'blur(4px)',
};

const sideLabel: React.CSSProperties = {
  fontSize: '10px',
  opacity: 0.85,
  fontWeight: 600,
};

const sideCode: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 800,
  letterSpacing: '2px',
};

const sideName: React.CSSProperties = {
  fontSize: '11px',
  opacity: 0.8,
};

const traitList: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '3px',
  justifyContent: 'center',
  marginTop: '4px',
};

const traitChip: React.CSSProperties = {
  fontSize: '8px',
  backgroundColor: 'rgba(255,255,255,0.2)',
  padding: '2px 6px',
  borderRadius: '8px',
  whiteSpace: 'nowrap',
};

const vsCircle: React.CSSProperties = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '10px',
  fontWeight: 800,
  flexShrink: 0,
};

const scoreArea: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px',
  width: '100%',
};

const scoreRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '10px',
};

const scoreBig: React.CSSProperties = {
  fontSize: '40px',
  fontWeight: 800,
  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
};

const scoreBadge: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  backgroundColor: 'rgba(255,255,255,0.2)',
  padding: '4px 12px',
  borderRadius: '16px',
};

const barBg: React.CSSProperties = {
  width: '75%',
  height: '5px',
  backgroundColor: 'rgba(255,255,255,0.2)',
  borderRadius: '3px',
  overflow: 'hidden',
};

const barFill: React.CSSProperties = {
  height: '100%',
  backgroundColor: '#fff',
  borderRadius: '3px',
  transition: 'width 0.5s ease',
};

const changeBox: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.12)',
  borderRadius: '10px',
  padding: '10px 14px',
  width: '100%',
  boxSizing: 'border-box',
};

const changeTitle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  marginBottom: '4px',
};

const changeItem: React.CSSProperties = {
  fontSize: '10px',
  opacity: 0.9,
  lineHeight: 1.5,
};

const tagRow: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
};

const tagMatch: React.CSSProperties = {
  fontSize: '10px',
  backgroundColor: 'rgba(255,255,255,0.2)',
  padding: '4px 10px',
  borderRadius: '10px',
};

const tagGrey: React.CSSProperties = {
  fontSize: '10px',
  backgroundColor: 'rgba(255,255,255,0.15)',
  padding: '4px 10px',
  borderRadius: '10px',
};

const footerArea: React.CSSProperties = {
  fontSize: '10px',
  opacity: 0.4,
  letterSpacing: '1.5px',
};

// ═══ 공통 스타일 ═══

const msgBox: React.CSSProperties = {
  textAlign: 'center',
  padding: '10px 14px',
  margin: '10px 0',
  backgroundColor: '#f0f9ff',
  borderRadius: '10px',
  fontSize: '13px',
  color: '#1e40af',
  fontWeight: 500,
};

const btnCol: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: '14px',
};

const btnOutline: React.CSSProperties = {
  padding: '13px',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  backgroundColor: '#fff',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  textAlign: 'center',
  color: '#374151',
  transition: 'background 0.2s',
};

const btnPrimary = (color: string): React.CSSProperties => ({
  padding: '13px',
  borderRadius: '12px',
  border: 'none',
  backgroundColor: color,
  color: '#fff',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'opacity 0.2s',
});

// ═══ 채널 스타일 ═══

const channelGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '12px',
  padding: '8px 0',
};

const channelBtn: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  padding: '16px 8px',
  borderRadius: '16px',
  border: '1px solid #f3f4f6',
  backgroundColor: '#fafafa',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const channelIcon: React.CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '22px',
  color: '#fff',
  fontWeight: 700,
};

const channelName: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: '#4b5563',
};

