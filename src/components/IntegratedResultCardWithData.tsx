import React from 'react';
import { IntegratedResultCard } from './IntegratedResultCard';
import { useResultCard } from '../hooks/useResultCard';

export interface IntegratedResultCardWithDataProps {
  cheongan: string;
  mbtiCode: string;
}

/**
 * Supabase 데이터를 자동으로 가져와서 IntegratedResultCard를 렌더링하는 컴포넌트
 */
export const IntegratedResultCardWithData: React.FC<
  IntegratedResultCardWithDataProps
> = ({ cheongan, mbtiCode }) => {
  const { data, loading, error } = useResultCard({ cheongan, mbtiCode });

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto mb-4"></div>
          <p className="text-gray-600 font-serif-kr">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 font-serif-kr">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-rose-gold text-white rounded-lg hover:bg-rose-gold/90 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!data) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md text-center">
          <div className="text-4xl mb-4">📭</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 font-serif-kr">
            결과를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-4">
            {cheongan} × {mbtiCode} 조합에 대한 결과가 아직 준비되지 않았습니다.
          </p>
        </div>
      </div>
    );
  }

  // 데이터가 있는 경우 IntegratedResultCard 렌더링
  return (
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
    />
  );
};
