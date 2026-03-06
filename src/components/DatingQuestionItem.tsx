import React, { useEffect, useRef } from 'react';
import { DatingQuestion } from '../constants/datingQuestions';

interface DatingQuestionItemProps {
  question: DatingQuestion;
  selectedValue: number | null;
  onSelect: (value: number) => void;
  questionIndex: number;
  shouldScroll: boolean;
}

export const DatingQuestionItem: React.FC<DatingQuestionItemProps> = ({
  question,
  selectedValue,
  onSelect,
  questionIndex,
  shouldScroll,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  
  // 6점 척도: 1(전혀 그렇지 않다) ~ 6(매우 그렇다)
  const scale = [1, 2, 3, 4, 5, 6];
  const labels = ['전혀 그렇지 않다', '그렇지 않다', '약간 그렇지 않다', '약간 그렇다', '그렇다', '매우 그렇다'];
  
  // 원의 크기 계산 (중간 3,4번이 가장 작고, 양쪽으로 갈수록 커짐)
  const getCircleSize = (value: number): number => {
    // 1번: 48px, 2번: 36px, 3번: 32px, 4번: 32px, 5번: 36px, 6번: 48px
    const sizes: Record<number, number> = {
      1: 48,
      2: 36,
      3: 32,
      4: 32,
      5: 36,
      6: 48,
    };
    return sizes[value] || 40;
  };
  
  // 답변 시 다음 문항으로 스크롤
  useEffect(() => {
    if (shouldScroll && itemRef.current) {
      const timer = setTimeout(() => {
        itemRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [shouldScroll]);

  return (
    <div ref={itemRef} style={styles.container} className="dating-question-item-container">
      <div style={styles.questionHeader}>
        <span style={styles.questionNumber}>문항 {question.id}</span>
        <span style={styles.questionText} className="question-text">{question.text}</span>
      </div>

      <div style={styles.scaleContainer}>
        <div style={styles.labelsRow}>
          <span style={styles.leftLabel}>전혀 그렇지 않다</span>
          <span style={styles.rightLabel}>매우 그렇다</span>
        </div>

        <div style={styles.buttonsRow} className="buttons-row">
          {scale.map((value) => {
            const isSelected = selectedValue === value;
            const isLeft = value <= 3;
            const isRight = value >= 4;
            const circleSize = getCircleSize(value);
            
            return (
              <div key={value} style={styles.buttonWrapper}>
                <button
                  onClick={() => onSelect(value)}
                  className={`scale-button ${isSelected ? 'scale-button-selected' : ''}`}
                  style={{
                    ...styles.scaleButton,
                    width: `${circleSize}px`,
                    height: `${circleSize}px`,
                    minWidth: `${circleSize}px`,
                    minHeight: `${circleSize}px`,
                    ...(isLeft ? styles.scaleButtonLeft : {}),
                    ...(isRight ? styles.scaleButtonRight : {}),
                    ...(isSelected 
                      ? (isLeft ? styles.scaleButtonSelectedLeft 
                         : styles.scaleButtonSelectedRight)
                      : {}),
                  }}
                  title={labels[value - 1]}
                >
                  {/* 숫자 제거 - 원형 도형만 표시 */}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginBottom: '12px',
    padding: '14px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(255, 182, 193, 0.1)',
    scrollMarginTop: '80px',
    border: '1px solid #FFE5F1',
    transition: 'all 0.3s ease',
  },
  questionHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '12px',
    gap: '8px',
  },
  questionNumber: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#FFB6C1',
    backgroundColor: '#FFF5F8',
    padding: '4px 8px',
    borderRadius: '8px',
    letterSpacing: '0.3px',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  questionText: {
    fontSize: '15px',
    fontWeight: '600',
    lineHeight: '1.6',
    color: '#5A4A42',
    letterSpacing: '-0.3px',
    flex: 1,
    margin: 0,
  },
  scaleContainer: {
    marginTop: '8px',
  },
  labelsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '12px',
    color: '#8B7355',
    fontWeight: '600',
  },
  leftLabel: {
    textAlign: 'left' as const,
  },
  rightLabel: {
    textAlign: 'right' as const,
  },
  buttonsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '6px',
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1 1 0',
  },
  scaleButton: {
    flex: '0 0 auto',
    padding: '0',
    border: '2px solid #FFE5F1',
    borderRadius: '50%',
    backgroundColor: '#FFF8F5',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    touchAction: 'manipulation',
  },
  scaleButtonLeft: {
    borderColor: '#FFD6E8',
    backgroundColor: '#FFF5F8',
  },
  scaleButtonRight: {
    borderColor: '#FFD6E8',
    backgroundColor: '#FFF5F8',
  },
  scaleButtonSelectedLeft: {
    borderColor: '#FFB6C1',
    backgroundColor: '#FFB6C1',
    transform: 'scale(1.1)',
    boxShadow: '0 6px 20px rgba(255, 182, 193, 0.5)',
    zIndex: 1,
  },
  scaleButtonSelectedRight: {
    borderColor: '#FFB6C1',
    backgroundColor: '#FFB6C1',
    transform: 'scale(1.1)',
    boxShadow: '0 6px 20px rgba(255, 182, 193, 0.5)',
    zIndex: 1,
  },
};
