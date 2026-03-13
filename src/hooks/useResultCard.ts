import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SajuCombination } from '../types/sajuCombinations';

export interface UseResultCardProps {
  cheongan: string; // 사주 계산 결과
  mbtiCode: string; // 32 Spectrum 검사 결과
}

export interface UseResultCardReturn {
  data: SajuCombination | null;
  loading: boolean;
  error: string | null;
}

/**
 * 사주와 32 Spectrum 통합 결과를 Supabase에서 가져오는 훅
 */
export const useResultCard = ({
  cheongan,
  mbtiCode,
}: UseResultCardProps): UseResultCardReturn => {
  const [data, setData] = useState<SajuCombination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      // 입력값 검증
      if (!cheongan || !mbtiCode) {
        setError(null);
        setData(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('useResultCard - 조회 시작:', { cheongan, mbtiCode });
        console.log('useResultCard - Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
        
        const { data: result, error: queryError } = await supabase
          .from('saju_combinations')
          .select('*')
          .eq('cheongan', cheongan)
          .eq('mbti_code', mbtiCode)
          .single();

        console.log('useResultCard - 조회 결과:', { 
          result, 
          resultType: typeof result,
          resultKeys: result ? Object.keys(result) : [],
          queryError 
        });

        if (queryError) {
          // 결과가 없는 경우 (PGRST116 에러 코드)
          if (queryError.code === 'PGRST116') {
            console.log('useResultCard - 결과 없음 (PGRST116)');
            setError(null); // 에러가 아닌 경우로 처리
            setData(null);
          } else {
            console.error('useResultCard - 조회 에러:', queryError);
            setError(`데이터 조회 실패: ${queryError.message}`);
            setData(null);
          }
        } else {
          // 빈 객체 체크: result가 빈 객체이거나 필수 필드가 없으면 null 처리
          if (!result || typeof result !== 'object' || Object.keys(result).length === 0) {
            console.log('useResultCard - 결과 없음 (빈 객체)');
            setError(null);
            setData(null);
          } else if (!result.cheongan || !result.mbti_code) {
            // 필수 필드가 없으면 유효하지 않은 데이터로 처리
            console.log('useResultCard - 결과 없음 (필수 필드 누락)');
            setError(null);
            setData(null);
          } else {
            console.log('useResultCard - 데이터 로드 성공');
            setData(result as SajuCombination);
            setError(null);
          }
        }
      } catch (err) {
        console.error('useResultCard - 예외 발생:', err);
        const errorMessage =
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
        setError(errorMessage);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [cheongan, mbtiCode]);

  return { data, loading, error };
};
