import React, { useState } from 'react';
import { CoachingSection } from './CoachingSection';

export interface IntegratedResultCardProps {
  cheongan: string;
  cheonganSymbol: string;
  mbtiCode: string;
  comboType: '일치형' | '보완형' | '갭형';
  gapTitle: string;
  situation: string;
  analysis: string;
  reason: string;
  coachingSee: string;
  coachingTry: string;
  coachingGrow: string;
  strengthCombo: string;
  /** 외부에서 별도 CoachingSection을 사용할 때 내부 COACHING 섹션을 숨길지 여부 */
  showCoaching?: boolean;
}

interface AccordionSectionProps {
  icon: string;
  title: string;
  content: string;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  icon,
  title,
  content,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-4 transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-cream/50 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-800 font-serif-kr">
            {title}
          </h3>
        </div>
        <svg
          className={`w-4 h-4 text-rose-gold transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 animate-fadeIn">
          <div className="pt-2 text-gray-700 leading-relaxed whitespace-pre-line font-serif-kr">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export const IntegratedResultCard: React.FC<IntegratedResultCardProps> = ({
  cheongan,
  cheonganSymbol,
  mbtiCode,
  comboType,
  gapTitle,
  situation,
  analysis,
  reason,
  coachingSee,
  coachingTry,
  coachingGrow,
  strengthCombo,
  showCoaching = true,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    situation: false,
    analysis: false,
    reason: false,
    coaching: false,
    strengthCombo: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getComboTypeColor = () => {
    switch (comboType) {
      case '일치형':
        return 'bg-green-100 text-green-700 border-green-300';
      case '보완형':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case '갭형':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getComboTypeIcon = () => {
    switch (comboType) {
      case '일치형':
        return '✅';
      case '보완형':
        return '💫';
      case '갭형':
        return '⚡';
      default:
        return '📌';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 상단 결과 배지 카드 */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* 천간 및 MBTI 배지 */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 rounded-full border border-green-200">
                <span className="text-2xl">🌱</span>
                <div className="text-left">
                  <div className="text-xs text-green-600 font-medium">선천 기질</div>
                  <div className="text-lg font-bold text-green-800 font-serif-kr">
                    {cheongan} · {cheonganSymbol}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 rounded-full border border-blue-200">
                <span className="text-2xl">⚡</span>
                <div className="text-left">
                  <div className="text-xs text-blue-600 font-medium">후천 성향</div>
                  <div className="text-lg font-bold text-blue-800">
                    {mbtiCode}
                  </div>
                </div>
              </div>
            </div>

            {/* combo_type 뱃지 */}
            <div
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-semibold font-serif-kr ${getComboTypeColor()}`}
            >
              <span className="text-xl">{getComboTypeIcon()}</span>
              <span>{comboType}</span>
            </div>

            {/* gap_title */}
            <div className="pt-4">
              <h2 className="text-2xl font-bold text-gray-800 leading-relaxed font-serif-kr">
                {gapTitle}
              </h2>
            </div>
          </div>
        </div>

        {/* 섹션 카드들 */}
        <div className="space-y-4">
          <AccordionSection
            icon="💬"
            title="이런 경험 있으신가요?"
            content={situation}
            isOpen={openSections.situation}
            onToggle={() => toggleSection('situation')}
          />

          <AccordionSection
            icon="🔍"
            title="나를 분석해보면"
            content={analysis}
            isOpen={openSections.analysis}
            onToggle={() => toggleSection('analysis')}
          />

          <AccordionSection
            icon="💡"
            title="이렇게 된 이유"
            content={reason}
            isOpen={openSections.reason}
            onToggle={() => toggleSection('reason')}
          />

          {/* COACHING 섹션 (옵션) */}
          {showCoaching && (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-4">
              <button
                onClick={() => toggleSection('coaching')}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-cream/50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <h3 className="text-lg font-semibold text-gray-800 font-serif-kr">
                    COACHING
                  </h3>
                </div>
                <svg
                  className={`w-4 h-4 text-rose-gold transition-transform duration-300 ${
                    openSections.coaching ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openSections.coaching && (
                <div className="px-6 pb-6 animate-fadeIn">
                  <div className="pt-4">
                    <CoachingSection
                      coachingSee={coachingSee}
                      coachingTry={coachingTry}
                      coachingGrow={coachingGrow}
                      mbtiCode={mbtiCode}
                      cheongan={cheongan}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <AccordionSection
            icon="✨"
            title="나의 강점 조합"
            content={strengthCombo}
            isOpen={openSections.strengthCombo}
            onToggle={() => toggleSection('strengthCombo')}
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;600;700&display=swap');
        .font-serif-kr {
          font-family: 'Noto Serif KR', serif;
        }
      `}</style>
    </div>
  );
};
