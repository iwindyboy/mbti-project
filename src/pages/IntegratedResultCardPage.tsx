import React from 'react';
import { IntegratedResultCardWithData } from '../components/IntegratedResultCardWithData';

/**
 * 통합 결과 카드 페이지
 * Supabase에서 데이터를 가져와서 IntegratedResultCard를 렌더링합니다.
 */
export const IntegratedResultCardPage: React.FC = () => {
  // 예제: 실제로는 사주 검사 결과와 32 Spectrum 검사 결과에서 가져옴
  const cheongan = '癸';
  const mbtiCode = 'INFJD';

  return <IntegratedResultCardWithData cheongan={cheongan} mbtiCode={mbtiCode} />;
};
