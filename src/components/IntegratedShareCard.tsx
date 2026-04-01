import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

interface IntegratedShareCardProps {
  name: string;
  cheongan: string;
  cheonganName: string;
  metaphor?: string;
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
  '甲': 'ENTJD',
  '乙': 'INFPA',
  '丙': 'ENFJD',
  '丁': 'INFJA',
  '戊': 'ESTJD',
  '己': 'ISFJA',
  '庚': 'ESTJD',
  '辛': 'ISTPA',
  '壬': 'ENTPD',
  '癸': 'INFPA',
};

// ═══════════ 오행 컬러 ═══════════
const OHANG_GRADIENT: Record<string, string> = {
  '木': 'linear-gradient(135deg, #a8e6cf 0%, #3d8b6e 50%, #1a5c3a 100%)',
  '火': 'linear-gradient(135deg, #ffb3ba 0%, #e84393 50%, #b71540 100%)',
  '土': 'linear-gradient(135deg, #ffeaa7 0%, #dca36d 50%, #a0764a 100%)',
  '金': 'linear-gradient(135deg, #dfe6e9 0%, #b2bec3 50%, #636e72 100%)',
  '水': 'linear-gradient(135deg, #c3cfe2 0%, #7c6fb0 50%, #4a3580 100%)',
};

const OHANG_ACCENT: Record<string, string> = {
  '木': '#2d6a4f',
  '火': '#c2185b',
  '土': '#8d6e4a',
  '金': '#4a5568',
  '水': '#5b3e96',
};

export const IntegratedShareCard: React.FC<IntegratedShareCardProps> = ({
  name,
  cheongan,
  cheonganName,
  metaphor,
  ohang,
  spectrumCode,
  alignmentScore,
  alignmentLabel,
  alignmentEmoji,
  matchedAxes,
  gapAxes: _gapAxes,
  greyZoneAxes: _greyZoneAxes,
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

  const shareText = `✨ ${name}님의 SCAN ME 결과\n\n🌙 선천: ${cheonganName}(${cheongan}) · ${expectedCode}${metaphor ? ` — ${metaphor}` : ''}\n⚡ 후천: ${spectrumCode}\n📊 일치도: ${alignmentScore}% ${alignmentEmoji} ${alignmentLabel}\n${
    lifeTheme ? `\n🌟 인생 테마: ${lifeTheme}\n` : ''
  }${
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

              {/* 천간 메타포 */}
              {metaphor && (
                <div style={metaphorArea}>
                  {cheonganName} — {metaphor}
                </div>
              )}

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

              {/* 인생 테마 */}
              {lifeTheme && (
                <div style={themeArea}>
                  <div style={themeLabel}>✨ 나의 인생 테마</div>
                  <div style={themeText}>{lifeTheme}</div>
                </div>
              )}

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
                <div style={{ ...channelIcon, backgroundColor: '#FEE500' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.53-.96 3.4-.99 3.62 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.44 4.28-2.86.56.08 1.14.12 1.72.12 5.52 0 10-3.58 10-7.94S17.52 3 12 3z" fill="#3C1E1E"/>
                  </svg>
                </div>
                <span style={channelName}>카카오톡</span>
              </button>

              {/* 인스타그램 */}
              <button onClick={handleInstagram} style={channelBtn}>
                <div style={{ ...channelIcon, background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="6" stroke="#fff" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="2"/>
                    <circle cx="17.5" cy="6.5" r="1.5" fill="#fff"/>
                  </svg>
                </div>
                <span style={channelName}>인스타그램</span>
              </button>

              {/* X */}
              <button onClick={handleTwitter} style={channelBtn}>
                <div style={{ ...channelIcon, backgroundColor: '#000' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#fff"/>
                  </svg>
                </div>
                <span style={channelName}>X</span>
              </button>

              {/* WhatsApp */}
              <button onClick={handleWhatsApp} style={channelBtn}>
                <div style={{ ...channelIcon, backgroundColor: '#25D366' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#fff"/>
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.108-1.128l-.292-.174-2.6.774.774-2.6-.174-.292A8 8 0 1112 20z" fill="#fff"/>
                  </svg>
                </div>
                <span style={channelName}>WhatsApp</span>
              </button>

              {/* 텍스트 복사 */}
              <button onClick={handleCopyText} style={channelBtn}>
                <div style={{ ...channelIcon, backgroundColor: '#6B7280' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="8" y="8" width="12" height="12" rx="2" stroke="#fff" strokeWidth="2"/>
                    <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" stroke="#fff" strokeWidth="2"/>
                  </svg>
                </div>
                <span style={channelName}>텍스트 복사</span>
              </button>

              {/* 더보기 */}
              <button onClick={handleWebShare} style={channelBtn}>
                <div style={{ ...channelIcon, backgroundColor: '#8B5CF6' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="18" cy="5" r="3" stroke="#fff" strokeWidth="2"/>
                    <circle cx="6" cy="12" r="3" stroke="#fff" strokeWidth="2"/>
                    <circle cx="18" cy="19" r="3" stroke="#fff" strokeWidth="2"/>
                    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="#fff" strokeWidth="2"/>
                  </svg>
                </div>
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
  justifyContent: 'center',
  gap: '8px',
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

const metaphorArea: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  opacity: 0.9,
  backgroundColor: 'rgba(255,255,255,0.15)',
  padding: '6px 16px',
  borderRadius: '20px',
  letterSpacing: '0.5px',
  backdropFilter: 'blur(4px)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1.25,
};

const nameArea: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 600,
  opacity: 0.9,
};

const comparisonBox: React.CSSProperties = {
  display: 'flex',
  alignItems: 'stretch',
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
  justifyContent: 'center',
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
  padding: '4px 8px',
  borderRadius: '8px',
  whiteSpace: 'nowrap',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
  minHeight: '20px',
  height: '20px',
  boxSizing: 'border-box',
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
  alignSelf: 'center',
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
  alignItems: 'center',
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
  display: 'flex',
  alignItems: 'center',
  lineHeight: 1,
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

const themeArea: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.12)',
  borderRadius: '10px',
  padding: '10px 14px',
  width: '100%',
  boxSizing: 'border-box',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const themeLabel: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  marginBottom: '4px',
  opacity: 0.85,
};

const themeText: React.CSSProperties = {
  fontSize: '11px',
  lineHeight: 1.6,
  opacity: 0.9,
  wordBreak: 'keep-all',
};

const changeBox: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.12)',
  borderRadius: '10px',
  padding: '10px 14px',
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
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
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  flexWrap: 'wrap',
};

const tagMatch: React.CSSProperties = {
  fontSize: '10px',
  backgroundColor: 'rgba(255,255,255,0.2)',
  padding: '5px 10px',
  borderRadius: '10px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1.25,
};

const tagGrey: React.CSSProperties = {
  fontSize: '10px',
  backgroundColor: 'rgba(255,255,255,0.15)',
  padding: '5px 10px',
  borderRadius: '10px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1.25,
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
