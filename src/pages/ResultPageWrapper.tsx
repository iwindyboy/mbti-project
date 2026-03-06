import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResultPage } from '../components/ResultPage';
import { CalculateResult } from '../utils/calculate';
import { adMobBridge, AdMobStatus } from '../utils/admob';
import { requestShowResult } from '../utils/bridge';
import { saveScanResult } from '../utils/storage';
import { createResultCard } from '../utils/resultCard';

export const ResultPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<CalculateResult | null>(null);
  const [adShown, setAdShown] = useState(false);
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    // WebView 환경 확인
    const isRNWebView = typeof window !== 'undefined' && !!(window as any).ReactNativeWebView;
    setIsWebView(isRNWebView);

    if (isRNWebView) {
      // WebView 환경: 앱에서 결과 데이터를 받을 때까지 대기
      // 앱에서 postMessage로 결과 데이터를 전달할 예정
      console.log('[ResultPageWrapper] WebView 환경 - 앱에서 결과 대기 중');
      
      // 애드몹 광고 설정
      adMobBridge.initialize({
        adUnitId: 'ca-app-pub-3940256099942544/5224354917', // 테스트 광고 단위 ID
        isTestMode: true,
      });

      // 애드몹 이벤트 리스너
      const removeListener = adMobBridge.addEventListener((status, data) => {
        console.log('[AdMob] 상태 변경:', status, data);
        
        if (status === AdMobStatus.REWARDED) {
          setAdShown(true);
          // 광고 시청 완료 후 결과 표시 요청
          requestShowResult();
        } else if (status === AdMobStatus.FAILED) {
          // 광고 실패 시에도 결과 표시
          setAdShown(true);
          requestShowResult();
        }
      });

      // 앱에서 메시지 수신 (결과 데이터)
      const handleMessage = (event: MessageEvent) => {
        try {
          if (event.data) {
            const message = typeof event.data === 'string' 
              ? JSON.parse(event.data) 
              : event.data;
            
            if (message.type === 'RESULT_DATA') {
              const resultData = message.data as CalculateResult;
              setResult(resultData);
              
              // 결과 저장 (UUID 포함, 기본 검사 타입)
              const resultCard = createResultCard(resultData);
              saveScanResult(resultData, resultCard.typeCode, 'basic').catch(err => {
                console.error('Error saving scan result:', err);
              });
              
              // 결과 받으면 광고 로드 및 표시
              adMobBridge.loadRewardedAd().then(() => {
                adMobBridge.showRewardedAd().catch(err => {
                  console.error('[AdMob] 광고 표시 실패:', err);
                  // 실패해도 결과 표시
                  requestShowResult();
                });
              });
            }
          }
        } catch (error) {
          console.error('[ResultPageWrapper] 메시지 처리 오류:', error);
        }
      };

      window.addEventListener('message', handleMessage);

      return () => {
        removeListener();
        window.removeEventListener('message', handleMessage);
      };
    } else {
      // 일반 웹 환경: sessionStorage에서 결과 데이터 가져오기
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const storedResult = sessionStorage.getItem('scanResult');
        
        if (storedResult) {
          try {
            const parsedResult = JSON.parse(storedResult) as CalculateResult;
            setResult(parsedResult);
            
            // 결과 저장 (UUID 포함, 기본 검사 타입)
            const resultCard = createResultCard(parsedResult);
            saveScanResult(parsedResult, resultCard.typeCode, 'basic').catch(err => {
              console.error('Error saving scan result:', err);
            });
          } catch (error) {
            console.error('Error parsing stored result', error);
            navigate('/');
          }
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  const handleReset = () => {
    // sessionStorage 정리
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem('scanResult');
    }
    
    if (isWebView) {
      // WebView 환경: 앱에 리셋 신호 전송
      const { sendToNativeApp } = require('../utils/bridge');
      sendToNativeApp({ type: 'RESET_SURVEY' });
    } else {
      // 일반 웹 환경: 질문 페이지로 이동
      navigate('/');
    }
  };

  if (!result) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>
          {isWebView 
            ? '앱에서 결과를 준비하는 중...' 
            : '결과를 불러오는 중...'}
        </h2>
        {isWebView && (
          <p style={{ marginTop: '20px', color: '#666' }}>
            광고 시청 후 결과가 표시됩니다.
          </p>
        )}
      </div>
    );
  }

  return <ResultPage result={result} onReset={handleReset} />;
};
