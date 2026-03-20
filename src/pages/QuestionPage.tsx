import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GroupPage } from '../components/GroupPage';
import { questionGroups } from '../constants/questions';
import { calculateScanResult, Answer as CalculateAnswer } from '../utils/calculate';
import { saveScanResult } from '../utils/storage';
import { createResultCard } from '../utils/resultCard';

export const QuestionPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const currentGroup = questionGroups[currentGroupIndex];
  const totalGroups = questionGroups.length;
  const isLastGroup = currentGroupIndex === totalGroups - 1;

  // 답변 변경 핸들러
  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // 다음 그룹으로 이동
  const handleNext = async () => {
    if (currentGroupIndex < totalGroups - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      // 마지막 그룹이면 결과 계산 후 결과 페이지로 이동
      try {
        const allQuestions = questionGroups.flatMap((g) => g.questions);
        const calculateAnswers: CalculateAnswer[] = allQuestions.map((q) => ({
          questionId: q.id,
          score: answers[q.id] || 3,
        }));

        const result = calculateScanResult(calculateAnswers, allQuestions);
        console.log('QuestionPage - 계산된 결과:', result);

        if (!result || !result.typeCode) {
          console.error('Invalid result generated', result);
          alert('결과 생성에 실패했습니다. 다시 시도해주세요.');
          return;
        }

        // 결과 데이터를 저장 (React Native 호환을 위해)
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.setItem('scanResult', JSON.stringify(result));
          console.log('QuestionPage - sessionStorage에 저장 완료');
        }
        
        // localStorage에 결과 저장 (영구 저장)
        try {
          await saveScanResult(result, result.typeCode, 'basic');
          console.log('QuestionPage - localStorage에 저장 완료:', {
            typeCode: result.typeCode,
            scores: result.scores,
            greyZones: result.greyZones
          });
          
          // 저장 확인
          const { getLatestScanResult } = require('../utils/storage');
          const savedResult = await getLatestScanResult();
          console.log('QuestionPage - 저장 확인:', savedResult);
        } catch (error) {
          console.error('QuestionPage - 결과 저장 실패:', error);
          // 저장 실패해도 계속 진행
        }
        
        // React Native WebView 환경인지 확인
        if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
          // WebView 환경: 앱으로 결과 전송 및 광고 요청
          const { sendSurveyComplete } = require('../utils/bridge');
          sendSurveyComplete(result);
        } else {
          // 일반 웹 환경: 32 Spectrum 결과 페이지로 이동
          navigate('/scan-result');
        }
      } catch (error) {
        console.error('Error calculating result', error);
      }
    }
  };

  // 이전 그룹으로 이동
  const handlePrevious = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex(currentGroupIndex - 1);
      // 스크롤을 확실히 상단으로 이동
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0);
    }
  };

  return (
    <div style={styles.app}>
      <GroupPage
        groupNumber={currentGroup.groupNumber}
        groupName={currentGroup.groupName}
        groupSubtitle={currentGroup.groupSubtitle}
        questions={currentGroup.questions}
        answers={answers}
        onAnswerChange={handleAnswerChange}
        onNext={handleNext}
        onPrevious={handlePrevious}
        canGoPrevious={currentGroupIndex > 0}
        isLastGroup={isLastGroup}
      />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#FFF8F5',
  },
};
