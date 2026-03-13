import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IntegratedResultCard } from '../../components/IntegratedResultCard';
import { CoachingSection } from '../../components/CoachingSection';
import { ShareCard } from '../../components/ShareCard';
import { useResultCard } from '../../hooks/useResultCard';
import { getTypeName } from '../../utils/typeNames';

const useQueryParams = () => {
  const location = useLocation();
  return useMemo(() => new URLSearchParams(location.search), [location.search]);
};

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = useQueryParams();
  const shareRef = useRef<HTMLDivElement | null>(null);

  // URL 파라미터 디코딩 (한글 처리)
  // URLSearchParams는 이미 디코딩된 값을 반환하므로 추가 디코딩 불필요
  const cheongan = query.get('cheongan') || '';
  const mbtiCode = query.get('mbti') || '';

  const [fadeIn, setFadeIn] = useState(false);

  const hasParams = cheongan !== '' && mbtiCode !== '';

  // 디버깅 로그
  useEffect(() => {
    console.log('ResultPage - URL 파라미터:', { 
      rawCheongan: query.get('cheongan'),
      cheongan, 
      rawMbti: query.get('mbti'),
      mbtiCode, 
      hasParams,
      fullQuery: location.search
    });
  }, [cheongan, mbtiCode, hasParams, query, location.search]);

  const { data, loading, error } = useResultCard(
    hasParams ? { cheongan, mbtiCode } : { cheongan: '', mbtiCode: '' },
  );

  // 데이터 로딩 상태 로그
  useEffect(() => {
    console.log('ResultPage - 상태:', { loading, error, hasData: !!data });
    if (error) {
      console.error('ResultPage - 에러 상세:', error);
    }
  }, [loading, error, data]);

  const mbtiNickname = useMemo(() => getTypeName(mbtiCode), [mbtiCode]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setFadeIn(true), 50);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleScrollToShare = () => {
    if (shareRef.current) {
      shareRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRetry = () => {
    navigate('/spectrum-intro');
  };

  // 파라미터 없을 때 안내
  if (!hasParams) {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <header className="px-4 py-4 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur">
          <button
            type="button"
            onClick={handleBack}
            className="text-sm text-slate-700 hover:text-slate-900"
          >
            ← 뒤로가기
          </button>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-md text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 font-serif-kr">
              검사 결과가 필요합니다
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              URL에 천간(cheongan)과 MBTI 코드(mbti) 파라미터가 필요합니다.
              <br />
              예: /result?cheongan=癸&mbti=INFJD
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="px-6 py-2.5 rounded-full bg-rose-gold text-white text-sm font-semibold shadow hover:bg-rose-gold/90 transition-colors"
            >
              검사하러 가기
            </button>
          </div>
        </main>
      </div>
    );
  }

  // 로딩 스켈레톤
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
        {/* 헤더 스켈레톤 */}
        <header className="px-4 py-4 flex items-center justify-between border-b border-slate-100 bg-white/70 backdrop-blur">
          <div className="w-24 h-8 rounded-full bg-slate-200 animate-pulse" />
          <div className="w-16 h-8 rounded-full bg-slate-200 animate-pulse" />
        </header>
        {/* 본문 스켈레톤 */}
        <main className="flex-1 px-4 py-6 max-w-3xl mx-auto space-y-4">
          <div className="h-64 rounded-2xl bg-slate-200/70 animate-pulse" />
          <div className="h-40 rounded-2xl bg-slate-200/60 animate-pulse" />
          <div className="h-32 rounded-2xl bg-slate-200/50 animate-pulse" />
        </main>
      </div>
    );
  }

  // 에러 상태 (로딩 완료 후 에러 발생)
  if (!loading && error) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
        <header className="px-4 py-4 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur">
          <button
            type="button"
            onClick={handleBack}
            className="text-sm text-slate-700 hover:text-slate-900"
          >
            ← 뒤로가기
          </button>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-md text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 font-serif-kr">
              오류가 발생했습니다
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {error}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="px-6 py-2.5 rounded-full bg-rose-gold text-white text-sm font-semibold shadow hover:bg-rose-gold/90 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </main>
      </div>
    );
  }

  // 데이터 없음 상태 (로딩 완료 후 데이터 없음)
  if (!loading && !error && !data && hasParams) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
        <header className="px-4 py-4 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur">
          <button
            type="button"
            onClick={handleBack}
            className="text-sm text-slate-700 hover:text-slate-900"
          >
            ← 뒤로가기
          </button>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-md text-center">
            <div className="text-4xl mb-3">📭</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 font-serif-kr">
              결과를 찾을 수 없습니다
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {cheongan} × {mbtiCode} 조합에 대한 결과가 아직 준비되지 않았습니다.
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="px-6 py-2.5 rounded-full bg-rose-gold text-white text-sm font-semibold shadow hover:bg-rose-gold/90 transition-colors"
            >
              다시 검사하기
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      {/* 상단 헤더 */}
      <header className="px-4 py-4 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur sticky top-0 z-20">
        <button
          type="button"
          onClick={handleBack}
          className="text-sm text-slate-700 hover:text-slate-900"
        >
          ← 뒤로가기
        </button>
        <button
          type="button"
          onClick={handleScrollToShare}
          className="text-sm px-4 py-1.5 rounded-full border border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-white transition-colors"
        >
          공유하기
        </button>
      </header>

      {/* 본문 */}
      <main
        className={`flex-1 px-4 py-6 max-w-3xl mx-auto space-y-6 transition-opacity duration-500 ${
          fadeIn ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* 2. ResultCard (메인 결과) */}
        <IntegratedResultCard
          cheongan={data.cheongan}
          cheonganSymbol={data.cheongan_symbol}
          mbtiCode={data.mbti_code}
          comboType={data.combo_type}
          gapTitle={data.gap_title}
          situation={data.situation}
          analysis={data.analysis}
          reason={data.reason}
          coachingSee={data.coaching_see}
          coachingTry={data.coaching_try}
          coachingGrow={data.coaching_grow}
          strengthCombo={data.strength_combo}
          showCoaching={false}
        />

        {/* 3. CoachingSection */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3 font-serif-kr">
            오늘, 여기서부터 시작해볼까요?
          </h2>
          <CoachingSection
            coachingSee={data.coaching_see}
            coachingTry={data.coaching_try}
            coachingGrow={data.coaching_grow}
            mbtiCode={data.mbti_code}
            cheongan={data.cheongan}
          />
        </section>

        {/* 4. ShareCard 미리보기 */}
        <section ref={shareRef} className="mt-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-3 font-serif-kr">
            인스타그램 스토리로 공유하기
          </h2>
          <ShareCard
            cheongan={data.cheongan}
            cheonganSymbol={data.cheongan_symbol}
            mbtiCode={data.mbti_code}
            mbtiNickname={mbtiNickname}
            comboType={data.combo_type}
            gapTitle={data.gap_title}
            shareUrl="https://scan-app.com"
          />
        </section>
      </main>
    </div>
  );
};

export default ResultPage;

