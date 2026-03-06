import React from 'react';
import { ScenarioQuestion } from '../constants/datingQuestions';

interface ScenarioQuestionItemProps {
  question: ScenarioQuestion;
  selectedValue: string | null;
  onSelect: (value: string) => void;
  questionIndex: number;
}

export const ScenarioQuestionItem: React.FC<ScenarioQuestionItemProps> = ({
  question,
  selectedValue,
  onSelect,
  questionIndex,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.questionHeader}>
        <span style={styles.questionNumber}>Q{question.id}</span>
        <span style={styles.questionText}>{question.text}</span>
      </div>
      
      <div style={styles.optionsContainer}>
        {question.options.map((option, index) => {
          const isSelected = selectedValue === option.value;
          return (
            <label
              key={option.value}
              style={{
                ...styles.optionLabel,
                ...(isSelected ? styles.optionLabelSelected : {}),
              }}
              onClick={() => onSelect(option.value)}
              onTouchEnd={(e) => {
                e.preventDefault();
                onSelect(option.value);
              }}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.value}
                checked={isSelected}
                onChange={() => onSelect(option.value)}
                style={styles.radioButton}
              />
              <span style={styles.optionText}>{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '10px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    border: '1px solid #FFE5F1',
  },
  questionHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '6px',
    gap: '4px',
  },
  questionNumber: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#E8548A',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  questionText: {
    fontSize: '13px',
    color: '#5A4A42',
    lineHeight: '1.4',
    flex: 1,
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  optionLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '6px 8px',
    backgroundColor: 'transparent',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    width: '100%',
    gap: '6px',
  },
  optionLabelSelected: {
    backgroundColor: '#FFF8F5',
  },
  radioButton: {
    marginTop: '1px',
    cursor: 'pointer',
    flexShrink: 0,
    width: '16px',
    height: '16px',
    accentColor: '#E8548A',
  },
  optionText: {
    fontSize: '12px',
    color: '#5A4A42',
    lineHeight: '1.3',
    flex: 1,
  },
};
