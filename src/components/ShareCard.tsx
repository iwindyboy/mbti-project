import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { ScanLogo } from './ScanLogo';

export interface ShareCardProps {
  cheongan: string;
  cheonganSymbol: string;
  mbtiCode: string;
  mbtiNickname: string;
  comboType: '일치형' | '보완형' | '갭형';
  gapTitle: string;
  shareUrl?: string;
}

const getComboTypeClasses = (comboType: ShareCardProps['comboType']) => {
  switch (comboType) {
    case '일치형':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case '보완형':
      return 'bg-sky-100 text-sky-800 border-sky-300';
    case '갭형':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
};

export const ShareCard: React.FC<ShareCardProps> = ({
  cheongan,
  cheonganSymbol,
  mbtiCode,
  mbtiNickname,
  comboType,
  gapTitle,
  shareUrl = 'https://scan-app.com',
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;

    try {
      setDownloading(true);

      const width = 360; // 렌더링 기준 width
      const height = 640; // 렌더링 기준 height (9:16 비율)
      const scale = 3; // 360x640 * 3 = 1080x1920

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale,
        width,
        height,
        windowWidth: width,
        windowHeight: height,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `scan-share-${cheongan}-${mbtiCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert('이미지를 저장하는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyMessage('링크가 클립보드에 복사되었습니다.');
      setTimeout(() => setCopyMessage(null), 2000);
    } catch (error) {
      console.error('링크 복사 실패:', error);
      setCopyMessage('링크 복사에 실패했습니다. 직접 복사해주세요.');
      setTimeout(() => setCopyMessage(null), 2000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 py-6 bg-slate-900/60">
      {/* 캡처 대상 카드 */}
      <div
        ref={cardRef}
        className="relative w-[360px] h-[640px] rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background:
            'radial-gradient(circle at top, #2b2b52 0, #1a1a2e 35%, #16213e 65%, #0f3460 100%)',
        }}
      >
        {/* 별 파티클 레이어 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.6) 0, transparent 50%),' +
              'radial-gradient(1px 1px at 80% 10%, rgba(255,255,255,0.4) 0, transparent 50%),' +
              'radial-gradient(1.5px 1.5px at 30% 70%, rgba(255,255,255,0.5) 0, transparent 50%),' +
              'radial-gradient(1px 1px at 60% 40%, rgba(255,255,255,0.4) 0, transparent 50%)',
          }}
        />

        {/* 상단 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/40" />

        {/* 콘텐츠 */}
        <div className="relative z-10 flex flex-col h-full text-white px-8 py-8">
          {/* 로고 영역 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ScanLogo size={90} />
            </div>
          </div>

          {/* 본문 영역 */}
          <div className="flex-1 flex flex-col items-center text-center mt-2">
            {/* 선천 기질 */}
            <div className="text-sm tracking-[0.25em] uppercase text-slate-200 mb-4">
              선천 기질
            </div>
            <div className="text-2xl font-semibold mb-6 font-serif-kr">
              <span className="text-3xl mr-1">🌱</span>
              {cheongan}水 · {cheonganSymbol}
            </div>

            {/* 구분 장식 */}
            <div className="flex items-center justify-center mb-6">
              <span className="text-slate-200 text-xl">✦</span>
            </div>

            {/* 후천 성향 */}
            <div className="text-sm tracking-[0.25em] uppercase text-slate-200 mb-2">
              후천 성향
            </div>
            <div className="text-3xl font-bold mb-1">{mbtiCode}</div>
            <div className="text-base text-slate-200 mb-5 font-serif-kr">
              {mbtiNickname}
            </div>

            {/* combo_type 뱃지 */}
            <div
              className={`inline-flex items-center justify-center px-5 py-1.5 rounded-full border text-sm font-semibold mb-6 ${getComboTypeClasses(
                comboType,
              )}`}
            >
              {comboType}
            </div>

            {/* gap_title */}
            <div className="mt-2 px-2">
              <p className="text-lg leading-relaxed text-slate-100 font-serif-kr">
                “{gapTitle}”
              </p>
            </div>
          </div>

          {/* 하단 CTA */}
          <div className="mt-6">
            <button
              type="button"
              className="w-full py-3 rounded-full bg-rose-gold text-slate-900 font-semibold text-sm tracking-wide shadow-md hover:bg-rose-gold/90 transition-colors mb-2"
            >
              나도 해보기 →
            </button>
            <div className="text-center text-xs text-slate-300">
              {shareUrl.replace(/^https?:\/\//, '')}
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼 영역 */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={downloading}
            className="px-5 py-2 rounded-full bg-white text-slate-900 text-sm font-medium shadow hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {downloading ? '이미지 생성 중...' : '이미지로 저장'}
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-5 py-2 rounded-full bg-slate-800 text-slate-100 text-sm font-medium shadow hover:bg-slate-700"
          >
            링크 복사
          </button>
        </div>
        {copyMessage && (
          <div className="text-xs text-slate-100 mt-1">{copyMessage}</div>
        )}
      </div>
    </div>
  );
};

