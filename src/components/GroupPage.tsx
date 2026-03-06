import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../constants/questions';
import { ProgressBar } from './ProgressBar';
import { QuestionItem } from './QuestionItem';

interface GroupPageProps {
  groupNumber: number;
  groupName: string;
  groupSubtitle: string;
  questions: Question[];
  answers: Record<string, number>;
  onAnswerChange: (questionId: string, value: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoPrevious: boolean;
  isLastGroup: boolean;
}

export const GroupPage: React.FC<GroupPageProps> = ({
  groupNumber,
  groupName,
  groupSubtitle,
  questions,
  answers,
  onAnswerChange,
  onNext,
  onPrevious,
  canGoPrevious,
  isLastGroup,
}) => {
  const [scrollTarget, setScrollTarget] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 페이지가 마운트되거나 그룹이 변경될 때 상단으로 스크롤
  useEffect(() => {
    // 스크롤을 확실히 상단으로 이동
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    }, 0);
  }, [groupNumber]);

  // 현재 그룹의 답변 확인
  const currentAnswers = questions.map((q) => answers[q.id] ?? null);
  const allAnswered = currentAnswers.every((ans) => ans !== null);

  // 답변 선택 핸들러
  const handleSelect = (questionIndex: number, value: number) => {
    const question = questions[questionIndex];
    onAnswerChange(question.id, value);
    
    // 다음 문항으로 스크롤할지 결정
    if (questionIndex < questions.length - 1) {
      setScrollTarget(questionIndex + 1);
    }
  };

  // 스크롤 타겟 리셋
  useEffect(() => {
    if (scrollTarget !== null) {
      setTimeout(() => setScrollTarget(null), 500);
    }
  }, [scrollTarget]);

  // 그룹별 이미지/아이콘 매핑
  const getGroupIcon = (groupNum: number): string => {
    const icons: Record<number, string> = {
      1: '⚡', // 에너지 방향
      2: '🔍', // 정보 수집 방식
      3: '💭', // 의사결정 방식
      4: '📅', // 생활 패턴
      5: '🎯', // 행동 패턴
    };
    return icons[groupNum] || '✨';
  };

  // 그룹별 배경 그라데이션 색상
  const getGroupGradient = (groupNum: number): string => {
    const gradients: Record<number, string> = {
      1: 'linear-gradient(135deg, #FFE5F1 0%, #FFC1E3 100%)', // 핑크
      2: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)', // 민트
      3: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)', // 스카이블루
      4: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)', // 피치
      5: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)', // 라벤더
    };
    return gradients[groupNum] || 'linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%)';
  };

  return (
    <div ref={containerRef} style={styles.container}>
      <ProgressBar currentStep={groupNumber} totalSteps={5} />
      
      <div style={styles.content} className="group-page-content">
        {/* 헤더 섹션 with 이미지 */}
        <div style={{
          ...styles.header,
          background: getGroupGradient(groupNumber),
        }}>
          <div style={styles.headerIconContainer}>
            <div style={styles.headerIcon}>{getGroupIcon(groupNumber)}</div>
          </div>
          <h1 style={styles.groupTitle}>{groupName}</h1>
          <p style={styles.groupSubtitle}>{groupSubtitle}</p>
        </div>

        <div style={styles.instructionBox}>
          <p style={styles.instructionText}>
            직관적인 답변이 가장 정확한 데이터일 수 있습니다.<br />
            너무 깊게 생각하지 마시고, 첫 느낌으로 체크해 주세요!
          </p>
        </div>

        <div style={styles.questionsContainer}>
          {questions.map((question, index) => (
            <QuestionItem
              key={question.id}
              question={question}
              selectedValue={answers[question.id] ?? null}
              onSelect={(value) => handleSelect(index, value)}
              questionIndex={index}
              shouldScroll={scrollTarget === index}
            />
          ))}
        </div>

        <div style={styles.footer}>
          <div style={styles.buttonRow}>
            {canGoPrevious && (
              <button
                onClick={onPrevious}
                style={styles.previousButton}
                className="previousButton"
              >
                이전
              </button>
            )}
            <button
              onClick={onNext}
              disabled={!allAnswered}
              className="nextButton"
              style={{
                ...styles.nextButton,
                ...(!allAnswered ? styles.nextButtonDisabled : {}),
                ...(!canGoPrevious ? { width: '100%' } : {}),
              }}
            >
              {isLastGroup ? '결과 보기' : '다음 단계'}
            </button>
          </div>
          
          {!allAnswered && (
            <p style={styles.hint}>
              이 그룹의 모든 문항에 답변해주세요 ({currentAnswers.filter(a => a !== null).length}/6)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#FFF8F5', // 부드러운 크림색 배경
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '10px 14px',
    paddingBottom: '16px',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '12px',
    paddingTop: '14px',
    paddingBottom: '14px',
    borderRadius: '12px',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  },
  headerIconContainer: {
    marginBottom: '6px',
  },
  headerIcon: {
    fontSize: '40px',
    display: 'inline-block',
    animation: 'float 3s ease-in-out infinite',
  },
  groupTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#5A4A42', // 부드러운 브라운
    marginBottom: '2px',
    letterSpacing: '-0.5px',
  },
  groupSubtitle: {
    fontSize: '14px',
    color: '#8B7355',
    margin: 0,
    fontWeight: '500',
  },
  instructionBox: {
    backgroundColor: '#FFF5F8',
    border: '2px solid #FFE5F1',
    borderRadius: '12px',
    padding: '10px',
    marginBottom: '12px',
    boxShadow: '0 2px 12px rgba(255, 182, 193, 0.15)',
  },
  instructionText: {
    fontSize: '13px',
    color: '#C85A7A',
    margin: 0,
    lineHeight: '1.5',
    textAlign: 'center' as const,
    fontWeight: '500',
  },
  questionsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    marginBottom: '12px',
  },
  footer: {
    position: 'sticky' as const,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    padding: '12px 14px',
    borderRadius: '12px',
    boxShadow: '0 -2px 12px rgba(0, 0, 0, 0.08)',
    marginTop: '12px',
    border: '1px solid #FFE5F1',
    zIndex: 1000,
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '4px',
  },
  previousButton: {
    flex: 1,
    padding: '14px 20px',
    fontSize: '15px',
    fontWeight: '600',
    backgroundColor: '#E8D5C4',
    color: '#5A4A42',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 2px 8px rgba(232, 213, 196, 0.3)',
    minHeight: '48px', // 터치 영역 최적화
  },
  nextButton: {
    flex: 1,
    padding: '14px 20px',
    fontSize: '15px',
    fontWeight: '600',
    backgroundColor: '#FFB6C1',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(255, 182, 193, 0.4)',
    minHeight: '48px', // 터치 영역 최적화
  },
  nextButtonDisabled: {
    backgroundColor: '#E0E0E0',
    color: '#BDBDBD',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  hint: {
    fontSize: '13px',
    color: '#C85A7A',
    textAlign: 'center' as const,
    margin: 0,
    marginTop: '8px',
    fontWeight: '500',
  },
};
