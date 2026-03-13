import React, { useState, useEffect } from 'react';

export interface CoachingSectionProps {
  coachingSee: string;
  coachingTry: string;
  coachingGrow: string;
  mbtiCode: string;
  cheongan: string;
}

interface CoachingCardProps {
  icon: string;
  title: string;
  content: string;
  backgroundColor: string;
  darkBackgroundColor: string;
  cardKey: 'see' | 'try' | 'grow';
  isChecked: boolean;
  onToggle: () => void;
}

const CoachingCard: React.FC<CoachingCardProps> = ({
  icon,
  title,
  content,
  backgroundColor,
  darkBackgroundColor,
  cardKey,
  isChecked,
  onToggle,
}) => {
  return (
    <div
      onClick={onToggle}
      className={`rounded-2xl p-6 cursor-pointer transition-all duration-300 shadow-md ${
        isChecked ? darkBackgroundColor : backgroundColor
      } hover:shadow-lg transform hover:scale-[1.02]`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="text-3xl">{icon}</div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-gray-800 font-serif-kr">
              {title}
            </h4>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                isChecked
                  ? 'bg-rose-gold border-rose-gold'
                  : 'bg-white border-gray-300'
              }`}
            >
              {isChecked && (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>
          <div
            className={`text-gray-700 leading-relaxed whitespace-pre-line font-serif-kr ${
              cardKey === 'grow' ? 'italic' : ''
            }`}
          >
            {cardKey === 'grow' ? (
              <span className="text-lg">"{content}"</span>
            ) : (
              content
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CoachingSection: React.FC<CoachingSectionProps> = ({
  coachingSee,
  coachingTry,
  coachingGrow,
  mbtiCode,
  cheongan,
}) => {
  const storageKey = `coaching_check_${mbtiCode}_${cheongan}`;

  // 로컬 스토리지에서 체크 상태 불러오기
  const loadCheckedState = (): { see: boolean; try: boolean; grow: boolean } => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('로컬 스토리지 읽기 오류:', error);
    }
    return { see: false, try: false, grow: false };
  };

  const [checkedState, setCheckedState] = useState<{
    see: boolean;
    try: boolean;
    grow: boolean;
  }>(loadCheckedState);

  // 체크 상태를 로컬 스토리지에 저장
  const saveCheckedState = (state: {
    see: boolean;
    try: boolean;
    grow: boolean;
  }) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error('로컬 스토리지 저장 오류:', error);
    }
  };

  const toggleCheck = (cardKey: 'see' | 'try' | 'grow') => {
    const newState = {
      ...checkedState,
      [cardKey]: !checkedState[cardKey],
    };
    setCheckedState(newState);
    saveCheckedState(newState);
  };

  return (
    <div className="space-y-4">
      <CoachingCard
        icon="👁"
        title="먼저 알아차려보세요"
        content={coachingSee}
        backgroundColor="bg-lavender-light"
        darkBackgroundColor="bg-lavender-dark"
        cardKey="see"
        isChecked={checkedState.see}
        onToggle={() => toggleCheck('see')}
      />
      <CoachingCard
        icon="🧪"
        title="작은 실험 하나만"
        content={coachingTry}
        backgroundColor="bg-mint-light"
        darkBackgroundColor="bg-mint-dark"
        cardKey="try"
        isChecked={checkedState.try}
        onToggle={() => toggleCheck('try')}
      />
      <CoachingCard
        icon="🌱"
        title="이 질문을 가지고 살아보세요"
        content={coachingGrow}
        backgroundColor="bg-cream-light"
        darkBackgroundColor="bg-cream-dark"
        cardKey="grow"
        isChecked={checkedState.grow}
        onToggle={() => toggleCheck('grow')}
      />
    </div>
  );
};
