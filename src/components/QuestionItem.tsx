import React, { useEffect, useRef } from 'react';
import { Question } from '../constants/questions';

interface QuestionItemProps {
  question: Question;
  selectedValue: number | null;
  onSelect: (value: number) => void;
  questionIndex: number;
  shouldScroll: boolean;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  selectedValue,
  onSelect,
  questionIndex,
  shouldScroll,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  // 6단계 척도: [L3, L2, L1, R1, R2, R3] = 내부적으로 [1, 2, 3, 4, 5, 6]
  // 왼쪽 3개(1,2,3): 좌측 성향 선택, 오른쪽 3개(4,5,6): 우측 성향 선택
  // 중립(0) 버튼 제거
  const scale = [1, 2, 3, 4, 5, 6];
  
  // 버튼의 점수 값 계산 (1~3)
  // L3=3점, L2=2점, L1=1점, R1=1점, R2=2점, R3=3점
  const getButtonScore = (value: number): { leftScore: number; rightScore: number } => {
    if (value <= 3) {
      // 왼쪽 버튼(1,2,3): 좌측 성향 점수 (3점, 2점, 1점)
      return { leftScore: 4 - value, rightScore: 0 }; // 1->3, 2->2, 3->1
    } else {
      // 오른쪽 버튼(4,5,6): 우측 성향 점수 (1점, 2점, 3점)
      return { leftScore: 0, rightScore: value - 3 }; // 4->1, 5->2, 6->3
    }
  };
  
  // 점수에 따른 원의 크기 계산 (1점: 작음, 2점: 중간, 3점: 큼)
  const getCircleSize = (value: number): number => {
    const buttonScore = getButtonScore(value);
    const score = buttonScore.leftScore || buttonScore.rightScore;
    // 1점: 32px, 2점: 40px, 3점: 48px
    const sizes: Record<number, number> = {
      1: 32,
      2: 40,
      3: 48,
    };
    return sizes[score] || 40;
  };

  // 답변 시 다음 문항으로 스크롤
  useEffect(() => {
    if (shouldScroll && itemRef.current) {
      // 약간의 지연을 두어 DOM 업데이트가 완료된 후 스크롤
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
    <div ref={itemRef} style={styles.container} className="question-item-container">
      <div style={styles.questionHeader}>
        <span style={styles.questionNumber}>문항 {questionIndex + 1}</span>
        <span style={styles.questionText} className="question-text">{question.text}</span>
      </div>

      <div style={styles.scaleContainer}>
        <div style={styles.labelsRow}>
          <span style={styles.leftLabel}>
            매우 아니다
          </span>
          <span style={styles.rightLabel}>
            매우 그렇다
          </span>
        </div>

        <div style={styles.buttonsRow} className="buttons-row">
          {scale.map((value) => {
            const isLeft = value <= 3;
            const isRight = value >= 4;
            const buttonScore = getButtonScore(value);
            const scoreValue = isLeft ? buttonScore.leftScore : buttonScore.rightScore;
            const circleSize = getCircleSize(value);
            
            return (
              <button
                key={value}
                onClick={() => onSelect(value)}
                className={`scale-button ${selectedValue === value ? 'scale-button-selected' : ''}`}
                style={{
                  ...styles.scaleButton,
                  ...(isLeft ? styles.scaleButtonLeft : {}),
                  ...(isRight ? styles.scaleButtonRight : {}),
                  ...(selectedValue === value 
                    ? (isLeft ? styles.scaleButtonSelectedLeft 
                       : styles.scaleButtonSelectedRight)
                    : {}),
                  width: `${circleSize}px`,
                  height: `${circleSize}px`,
                  minWidth: `${circleSize}px`,
                  minHeight: `${circleSize}px`,
                }}
                title={isLeft ? `좌측 성향 ${scoreValue}점` : `우측 성향 ${scoreValue}점`}
              >
                {/* 숫자 제거 - 원형 도형만 표시 */}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginBottom: '10px',
    padding: '12px 14px',
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
    marginBottom: '10px',
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
    marginTop: '6px',
  },
  labelsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
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
  scaleButton: {
    flex: '0 0 auto',
    padding: '0',
    fontSize: '18px',
    fontWeight: '700',
    border: '2px solid #FFE5F1',
    borderRadius: '50%',
    backgroundColor: '#FFF8F5',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: '#8B7355',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    touchAction: 'manipulation', // 터치 최적화
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
    color: '#FFFFFF',
    transform: 'scale(1.05)',
    boxShadow: '0 6px 20px rgba(255, 182, 193, 0.5)',
    zIndex: 1,
  },
  scaleButtonSelectedRight: {
    borderColor: '#FFB6C1',
    backgroundColor: '#FFB6C1',
    color: '#FFFFFF',
    transform: 'scale(1.05)',
    boxShadow: '0 6px 20px rgba(255, 182, 193, 0.5)',
    zIndex: 1,
  },
  buttonLabel: {
    fontSize: '20px',
    fontWeight: '800',
  },
  buttonHint: {
    fontSize: '14px',
    opacity: 0.8,
  },
  labelEmoji: {
    fontSize: '18px',
    marginRight: '6px',
    marginLeft: '6px',
  },
  scoreHint: {
    marginTop: '12px',
    padding: '8px 12px',
    backgroundColor: '#f0f7ff',
    borderRadius: '6px',
    textAlign: 'center' as const,
  },
  hintText: {
    fontSize: '12px',
    color: '#666',
    lineHeight: '1.4',
  },
};
