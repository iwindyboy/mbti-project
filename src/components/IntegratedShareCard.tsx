import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

interface IntegratedShareCardProps {
  name: string;
  cheongan: string;
  cheonganName: string;
  spectrumCode: string;
  alignmentScore: number;
  alignmentLabel: string;
  alignmentEmoji: string;
  matchedAxes: string[];
  greyZoneCount: number;
  onClose: () => void;
}

export const IntegratedShareCard: React.FC<IntegratedShareCardProps> = ({
  name,
  cheongan,
  cheonganName,
  spectrumCode,
  alignmentScore,
  alignmentLabel,
  alignmentEmoji,
  matchedAxes,
  greyZoneCount,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 이미지 저장
  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setDownloading(true);
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        width: 360,
        height: 640,
        backgroundColor: null,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `SCANME_${name}_${spectrumCode}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setMessage('이미지가 저장되었어요! 인스타 스토리에 올려보세요 ✨');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('이미지 저장 실패:', err);
      setMessage('이미지 저장에 실패했어요. 다시 시도해주세요.');
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setDownloading(false);
    }
  };

  // 링크 복사
  const handleCopyLink = async () => {
    const shareText = `${name}님의 SCAN ME 결과 🔮\n선천: ${cheonganName}(${cheongan}) × 후천: ${spectrumCode}\n일치도: ${alignmentScore}% ${alignmentEmoji} ${alignmentLabel}\n\n나도 해보기 👉 https://scan-me.app`;
    try {
      await navigator.clipboard.writeText(shareText);
      setMessage('복사 완료! 카카오톡이나 메신저에 붙여넣기 해보세요 💬');
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage('복사에 실패했어요. 다시 시도해주세요.');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Web Share API (모바일)
  const handleWebShare = async () => {
    const shareData = {
      title: 'SCAN ME - 나의 선천 × 후천 성향분석',
      text: `${name}님의 결과: ${cheonganName}(${cheongan}) × ${spectrumCode} | 일치도 ${alignmentScore}% ${alignmentLabel}`,
      url: 'https://scan-me.app',
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await handleCopyLink();
      }
    } catch (err) {
      // 사용자가 공유 취소한 경우
      // eslint-disable-next-line no-console
      console.log('공유 취소:', err);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* 닫기 버튼 */}
        <button onClick={onClose} style={closeButtonStyle}>
          ✕
        </button>

        {/* 공유 카드 (이미지로 저장될 영역) */}
        <div ref={cardRef} style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={brandStyle}>SCAN ME</span>
            <span style={subBrandStyle}>선천 × 후천 성향분석</span>
          </div>

          <div style={nameStyle}>{name}님의 분석 결과</div>

          <div style={comboStyle}>
            <div style={comboItemStyle}>
              <span style={comboLabelStyle}>선천</span>
              <span style={comboValueStyle}>
                {cheonganName}({cheongan})
              </span>
            </div>
            <span style={comboArrowStyle}>×</span>
            <div style={comboItemStyle}>
              <span style={comboLabelStyle}>후천</span>
              <span style={comboValueStyle}>{spectrumCode}</span>
            </div>
          </div>

          <div style={scoreContainerStyle}>
            <div style={scoreStyle}>{alignmentScore}%</div>
            <div style={scoreLabelStyle}>일치도</div>
            <div style={scoreBarBgStyle}>
              <div style={{ ...scoreBarFillStyle, width: `${alignmentScore}%` }} />
            </div>
          </div>

          <div style={labelBadgeStyle}>
            {alignmentEmoji} {alignmentLabel}
          </div>

          {matchedAxes.length > 0 && <div style={matchStyle}>일치 영역: {matchedAxes.join(', ')}</div>}

          {greyZoneCount > 0 && <div style={greyStyle}>유연 영역: {greyZoneCount}개 축</div>}

          <div style={footerStyle}>scan-me.app</div>
        </div>

        {/* 메시지 */}
        {message && <div style={messageStyle}>{message}</div>}

        {/* 공유 버튼들 */}
        <div style={buttonsContainerStyle}>
          <button onClick={handleDownload} style={actionButtonStyle} disabled={downloading}>
            {downloading ? '저장 중...' : '📸 이미지 저장'}
          </button>
          <button onClick={handleCopyLink} style={actionButtonStyle}>
            📋 텍스트 복사
          </button>
          <button onClick={handleWebShare} style={actionButtonPrimaryStyle}>
            📤 공유하기
          </button>
        </div>
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
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  padding: '20px',
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '20px',
  padding: '24px',
  maxWidth: '400px',
  width: '100%',
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative',
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '16px',
  right: '16px',
  background: 'none',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
  color: '#999',
};

const cardStyle: React.CSSProperties = {
  width: '360px',
  height: '640px',
  margin: '0 auto',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '32px 24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: '#fff',
  boxSizing: 'border-box',
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
};

const brandStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 800,
  letterSpacing: '3px',
};

const subBrandStyle: React.CSSProperties = {
  fontSize: '12px',
  opacity: 0.8,
  letterSpacing: '1px',
};

const nameStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 600,
  opacity: 0.9,
};

const comboStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const comboItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
};

const comboLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  opacity: 0.7,
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const comboValueStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
};

const comboArrowStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 300,
  opacity: 0.6,
};

const scoreContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
};

const scoreStyle: React.CSSProperties = {
  fontSize: '56px',
  fontWeight: 800,
};

const scoreLabelStyle: React.CSSProperties = {
  fontSize: '14px',
  opacity: 0.7,
  letterSpacing: '2px',
};

const scoreBarBgStyle: React.CSSProperties = {
  width: '80%',
  height: '6px',
  backgroundColor: 'rgba(255,255,255,0.2)',
  borderRadius: '3px',
  overflow: 'hidden',
};

const scoreBarFillStyle: React.CSSProperties = {
  height: '100%',
  backgroundColor: '#fff',
  borderRadius: '3px',
  transition: 'width 0.3s',
};

const labelBadgeStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 600,
  backgroundColor: 'rgba(255,255,255,0.15)',
  padding: '8px 20px',
  borderRadius: '20px',
};

const matchStyle: React.CSSProperties = {
  fontSize: '13px',
  opacity: 0.8,
  textAlign: 'center',
};

const greyStyle: React.CSSProperties = {
  fontSize: '13px',
  opacity: 0.7,
  textAlign: 'center',
};

const footerStyle: React.CSSProperties = {
  fontSize: '12px',
  opacity: 0.5,
  letterSpacing: '1px',
};

const messageStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '12px',
  margin: '12px 0',
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#1e40af',
};

const buttonsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: '16px',
};

const actionButtonStyle: React.CSSProperties = {
  padding: '14px',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  backgroundColor: '#fff',
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
  textAlign: 'center',
};

const actionButtonPrimaryStyle: React.CSSProperties = {
  padding: '14px',
  borderRadius: '12px',
  border: 'none',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
  textAlign: 'center',
};

