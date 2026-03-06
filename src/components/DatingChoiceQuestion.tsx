import React from 'react';

interface TieBreakOption {
  label: string;
  description: string;
}

interface DatingChoiceQuestionProps {
  selectedValue: string | null;
  onSelect: (value: string) => void;
  question?: string;
  options?: TieBreakOption[];
}

export const DatingChoiceQuestion: React.FC<DatingChoiceQuestionProps> = ({
  selectedValue,
  onSelect,
  question = '다음 중 당신의 연애관과 가장 가까운 것은?',
  options,
}) => {
  // 동적 옵션이 있으면 사용, 없으면 기본 옵션
  const displayOptions = options || [
    { label: 'A', description: '사랑하면 불안해도 괜찮아. 서로의 마음을 확인하는 게 중요해.' },
    { label: 'B', description: '이 사람이 내 전부. 모든 걸 함께하고 싶어.' },
    { label: 'C', description: '처음엔 믿기 어려워. 천천히 알아가며 확신을 쌓고 싶어.' },
    { label: 'D', description: '서로 존중하고 균형을 맞추는 게 가장 중요해.' },
    { label: 'E', description: '연애도 중요하지만, 내 성장과 목표가 최우선이야.' },
    { label: 'F', description: '정신적 교감은 필수. 하지만 각자의 자유는 보장되어야 해.' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.questionHeader}>
        <span style={styles.questionNumber}>문항 31</span>
        <span style={styles.categoryLabel}>최종 결정 문항</span>
      </div>
      
      <p style={styles.questionText}>
        {question}
      </p>

      <div style={styles.optionsContainer}>
        {displayOptions.map((option, index) => {
          const optionValue = options ? option.label : String.fromCharCode(65 + index); // A, B, C...
          const isSelected = selectedValue === optionValue;
          
          return (
            <button
              key={optionValue}
              onClick={() => onSelect(optionValue)}
              style={{
                ...styles.optionButton,
                ...(isSelected ? styles.optionButtonSelected : {}),
              }}
            >
              <div style={styles.optionContent}>
                <span style={styles.optionValue}>{option.label}</span>
                <span style={styles.optionLabel}>{option.description}</span>
              </div>
            </button>
          );
        })}
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
    border: '1px solid #FFE5F1',
    transition: 'all 0.3s ease',
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    flexWrap: 'wrap' as const,
    gap: '6px',
  },
  questionNumber: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#FFB6C1',
    backgroundColor: '#FFF5F8',
    padding: '4px 10px',
    borderRadius: '10px',
    letterSpacing: '0.5px',
  },
  categoryLabel: {
    fontSize: '12px',
    color: '#C85A7A',
    fontWeight: '600',
    backgroundColor: '#FFF5F8',
    padding: '4px 10px',
    borderRadius: '10px',
  },
  questionText: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '1.6',
    marginBottom: '12px',
    color: '#5A4A42',
    letterSpacing: '-0.3px',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  optionButton: {
    width: '100%',
    padding: '12px 14px',
    border: '2px solid #FFE5F1',
    borderRadius: '10px',
    backgroundColor: '#FFF8F5',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'left' as const,
  },
  optionButtonSelected: {
    borderColor: '#FFB6C1',
    backgroundColor: '#FFB6C1',
    color: '#FFFFFF',
    transform: 'scale(1.02)',
    boxShadow: '0 6px 20px rgba(255, 182, 193, 0.5)',
  },
  optionContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  optionValue: {
    fontSize: '18px',
    fontWeight: '700',
    minWidth: '24px',
    color: 'inherit',
  },
  optionLabel: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: 'inherit',
    flex: 1,
  },
};
