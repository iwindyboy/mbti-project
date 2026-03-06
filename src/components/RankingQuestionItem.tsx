import React, { useState, useEffect } from 'react';
import { RankingQuestion } from '../constants/datingQuestions';

interface RankingQuestionItemProps {
  question: RankingQuestion;
  selectedRanks: Record<string, number>; // { itemId: rank (1~6) }
  onRankChange: (itemId: string, rank: number) => void;
  questionIndex: number;
}

export const RankingQuestionItem: React.FC<RankingQuestionItemProps> = ({
  question,
  selectedRanks,
  onRankChange,
  questionIndex,
}) => {
  const [localRanks, setLocalRanks] = useState<Record<string, number>>(selectedRanks);

  useEffect(() => {
    setLocalRanks(selectedRanks);
  }, [selectedRanks]);

  const handleRankSelect = (itemId: string, rank: number) => {
    if (rank >= 1 && rank <= 6) {
      // 중복 체크: 같은 순위가 이미 있는지 확인
      const existingItemId = Object.keys(localRanks).find(
        (id) => id !== itemId && localRanks[id] === rank
      );
      
      if (existingItemId) {
        // 기존 항목의 순위를 비움
        const newRanks = { ...localRanks };
        delete newRanks[existingItemId];
        newRanks[itemId] = rank;
        setLocalRanks(newRanks);
        onRankChange(itemId, rank);
        if (existingItemId) {
          onRankChange(existingItemId, 0); // 기존 항목 순위 제거
        }
      } else {
        // 이미 같은 순위가 선택되어 있으면 제거, 아니면 설정
        if (localRanks[itemId] === rank) {
          const newRanks = { ...localRanks };
          delete newRanks[itemId];
          setLocalRanks(newRanks);
          onRankChange(itemId, 0);
        } else {
          const newRanks = { ...localRanks, [itemId]: rank };
          setLocalRanks(newRanks);
          onRankChange(itemId, rank);
        }
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.questionHeader}>
        <span style={styles.questionNumber}>R{question.id}</span>
        <span style={styles.questionText}>{question.title}</span>
      </div>
      
      <div style={styles.itemsContainer}>
        {question.items.map((item) => {
          const rank = localRanks[item.id] || 0;
          return (
            <div key={item.id} style={styles.itemRow}>
              <span style={styles.itemLabel}>{item.label}</span>
              <div style={styles.rankButtonsContainer}>
                {[1, 2, 3, 4, 5, 6].map((rankNum) => (
                  <button
                    key={rankNum}
                    type="button"
                    style={{
                      ...styles.rankButton,
                      ...(rank === rankNum ? styles.rankButtonSelected : {}),
                    }}
                    onClick={() => handleRankSelect(item.id, rankNum)}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      handleRankSelect(item.id, rankNum);
                    }}
                  >
                    {rankNum}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={styles.hint}>
        {Object.values(localRanks).filter((r) => r > 0).length === 6 ? (
          <span style={styles.hintSuccess}>✓ 모든 항목에 순위가 매겨졌습니다.</span>
        ) : (
          <span style={styles.hintWarning}>
            {6 - Object.values(localRanks).filter((r) => r > 0).length}개 항목에 순위를 매겨주세요.
          </span>
        )}
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
    color: '#5B4FCF',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  questionText: {
    fontSize: '13px',
    color: '#5A4A42',
    lineHeight: '1.4',
    flex: 1,
  },
  itemsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'flex-start', // 상단 정렬로 변경하여 줄바꿈 시에도 정렬 유지
    justifyContent: 'space-between',
    padding: '8px 10px',
    backgroundColor: '#FFF8F5',
    borderRadius: '5px',
    border: '1px solid #FFE5F1',
    gap: '12px', // 텍스트와 숫자 박스 사이 공간
  },
  itemLabel: {
    fontSize: '12px',
    color: '#5A4A42',
    flex: 1,
    lineHeight: '1.4',
    minWidth: 0, // 텍스트 오버플로우 방지
    marginRight: '8px', // 숫자 박스와의 추가 간격
    wordWrap: 'break-word', // 단어 단위 줄바꿈
    overflowWrap: 'break-word', // 긴 단어도 줄바꿈
    maxWidth: 'calc(100% - 100px)', // 숫자 박스 영역(약 100px)을 제외한 최대 너비
  },
  rankButtonsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1px', // 간격 더 최소화
    flexShrink: 0,
    justifyContent: 'flex-end',
    width: 'auto', // 자동 너비
    maxWidth: '35%', // 화면의 35% 이내로 더 제한
    marginTop: '2px', // 상단 정렬 시 약간의 여백
  },
  rankButton: {
    width: '13px', // 16px의 20% 감소 = 12.8px ≈ 13px
    height: '28px', // 높이는 유지 (터치 영역 보장)
    padding: '1px', // 내부 여백 더 최소화
    fontSize: '9px', // 폰트 크기 더 줄임
    fontWeight: '600',
    textAlign: 'center',
    border: '1.5px solid #FFE5F1',
    borderRadius: '3px',
    backgroundColor: '#FFFFFF',
    color: '#5A4A42',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '13px',
    flexShrink: 0,
    minHeight: '28px', // 최소 터치 영역 보장
  },
  rankButtonSelected: {
    borderColor: '#5B4FCF',
    backgroundColor: '#5B4FCF',
    color: '#FFFFFF',
    boxShadow: '0 2px 6px rgba(91, 79, 207, 0.3)',
  },
  hint: {
    marginTop: '6px',
    padding: '4px',
    borderRadius: '4px',
    fontSize: '10px',
    textAlign: 'center',
  },
  hintSuccess: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  hintWarning: {
    color: '#E8548A',
    fontWeight: '500',
  },
};
