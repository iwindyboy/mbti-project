import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { scenarioQuestions, rankingQuestions } from '../constants/datingQuestions';
import { ScenarioQuestionItem } from '../components/ScenarioQuestionItem';
import { RankingQuestionItem } from '../components/RankingQuestionItem';
import { analyzeDatingTest, generateTieBreakQuestion, DatingAnswers } from '../utils/datingCalculate';
import { saveScanResult } from '../utils/storage';

type PageType = 'scenario' | 'ranking' | 'tiebreak';

export const DatingMyTypePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<PageType>('scenario');
  
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<number, string>>({});
  const [rankingAnswers, setRankingAnswers] = useState<Record<number, Record<string, number>>>({});
  const [tieBreakAnswer, setTieBreakAnswer] = useState<string | null>(null);
  const [tieBreakOptions, setTieBreakOptions] = useState<{ question: string; options: { value: string; label: string; type: string }[] } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scenarioQuestionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const rankingQuestionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // 페이지 마운트 시 상단으로 스크롤
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  // 다음 질문으로 스크롤
  const scrollToNextQuestion = (currentIndex: number, questionType: 'scenario' | 'ranking') => {
    setTimeout(() => {
      if (questionType === 'scenario') {
        const nextIndex = currentIndex + 1;
        if (nextIndex < scenarioQuestions.length) {
          const nextQuestion = scenarioQuestions[nextIndex];
          const nextRef = scenarioQuestionRefs.current[nextQuestion.id];
          if (nextRef) {
            const offset = 100; // 상단 여백
            const elementPosition = nextRef.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
          }
        }
      } else if (questionType === 'ranking') {
        const nextIndex = currentIndex + 1;
        if (nextIndex < rankingQuestions.length) {
          const nextQuestion = rankingQuestions[nextIndex];
          const nextRef = rankingQuestionRefs.current[nextQuestion.id];
          if (nextRef) {
            const offset = 100; // 상단 여백
            const elementPosition = nextRef.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
          }
        }
      }
    }, 300); // 답변 선택 후 약간의 딜레이
  };

  // 시나리오 답변 변경
  const handleScenarioAnswer = (questionId: number, value: string, questionIndex: number) => {
    setScenarioAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [questionId]: value,
      };
      
      // 다음 질문으로 자동 스크롤
      scrollToNextQuestion(questionIndex, 'scenario');
      
      return newAnswers;
    });
  };

  // 랭킹 답변 변경
  const handleRankingAnswer = (questionId: number, itemId: string, rank: number, questionIndex: number) => {
    setRankingAnswers((prev) => {
      const questionAnswers = prev[questionId] || {};
      const newQuestionAnswers = { ...questionAnswers };
      
      if (rank === 0) {
        delete newQuestionAnswers[itemId];
      } else {
        newQuestionAnswers[itemId] = rank;
      }
      
      const updatedAnswers = {
        ...prev,
        [questionId]: newQuestionAnswers,
      };
      
      // 모든 항목에 순위가 매겨졌는지 확인
      const currentQuestion = rankingQuestions[questionIndex];
      const allRanked = currentQuestion.items.every((item) => {
        const ranks = updatedAnswers[questionId] || {};
        return ranks[item.id] && ranks[item.id] >= 1 && ranks[item.id] <= 6;
      });
      
      // 모든 항목에 순위가 매겨지면 다음 질문으로 자동 스크롤
      if (allRanked) {
        scrollToNextQuestion(questionIndex, 'ranking');
      }
      
      return updatedAnswers;
    });
  };

  // 시나리오 다음 버튼
  const handleScenarioNext = () => {
    // 모든 시나리오 질문이 답변되었는지 확인
    const allAnswered = scenarioQuestions.every((q) => scenarioAnswers[q.id] !== undefined);
    if (!allAnswered) {
      alert('모든 시나리오 질문에 답변해주세요.');
      return;
    }
    // 시나리오 완료, 랭킹으로 이동
    setCurrentPage('ranking');
  };

  // 시나리오 이전 버튼
  const handleScenarioPrevious = () => {
    navigate('/dating/intro');
  };

  // 랭킹 다음 버튼
  const handleRankingNext = () => {
    // 모든 랭킹 질문이 완료되었는지 확인
    const allRankingCompleted = rankingQuestions.every((q) => {
      const ranks = rankingAnswers[q.id] || {};
      return q.items.every((item) => ranks[item.id] && ranks[item.id] >= 1 && ranks[item.id] <= 6);
    });
    
    if (!allRankingCompleted) {
      alert('모든 랭킹 질문의 항목에 순위를 매겨주세요.');
      return;
    }

    // 랭킹 완료, 결과 계산 및 Tie-break 체크
    checkTieBreak();
  };

  // 랭킹 이전 버튼
  const handleRankingPrevious = () => {
    setCurrentPage('scenario');
  };

  // Tie-break 체크 및 결과 계산
  const checkTieBreak = () => {
    const answers: DatingAnswers = {
      scenarios: scenarioAnswers,
      rankings: rankingAnswers,
    };
    
    const result = analyzeDatingTest(answers);
    const sortedTypes = Object.entries(result.scores).sort((a, b) => b[1] - a[1]);
    const [firstType, firstScore] = sortedTypes[0];
    const [secondType, secondScore] = sortedTypes[1];
    const scoreDiff = firstScore - secondScore;

    if (scoreDiff <= 3 && scoreDiff > 0) {
      // Tie-break 질문 표시
      const tieBreak = generateTieBreakQuestion(firstType, secondType);
      setTieBreakOptions(tieBreak);
      setCurrentPage('tiebreak');
    } else {
      // 바로 결과 페이지로
      finalizeResult(result);
    }
  };

  // Tie-break 답변 후 결과 확정
  const handleTieBreakAnswer = (value: string) => {
    setTieBreakAnswer(value);
    
    const answers: DatingAnswers = {
      scenarios: scenarioAnswers,
      rankings: rankingAnswers,
    };
    
    // Tie-break 답변을 반영하여 최종 결과 계산
    const result = analyzeDatingTest(answers);
    
    // Tie-break 답변에 따라 coreType 조정
    if (tieBreakOptions) {
      result.coreType = value;
      const sortedTypes = Object.entries(result.scores).sort((a, b) => b[1] - a[1]);
      // 선택한 타입을 제외한 나머지 중 가장 높은 점수를 가진 타입을 subType으로
      const otherTypes = sortedTypes.filter(([type]) => type !== value);
      result.subType = otherTypes.length > 0 ? otherTypes[0][0] : sortedTypes[1][0];
    }
    
    finalizeResult(result);
  };

  // 결과 확정 및 저장
  const finalizeResult = (result: any) => {
    try {
      // 결과 데이터 저장
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('datingResult', JSON.stringify(result));
      }
      
      // 스토리지에 저장
      saveScanResult(result, result.coreType, 'dating').catch((err) => {
        console.error('Error saving dating result:', err);
      });
      
      // 결과 페이지로 이동
      navigate('/dating/result');
    } catch (error) {
      console.error('Error finalizing result', error);
      alert('결과 계산 중 오류가 발생했습니다.');
    }
  };

  // 진행률 계산
  const getProgress = (): number => {
    if (currentPage === 'scenario') {
      const answered = Object.keys(scenarioAnswers).length;
      return (answered / scenarioQuestions.length) * 50; // 시나리오는 50%까지
    } else if (currentPage === 'ranking') {
      const scenarioProgress = 50;
      const completedRankings = rankingQuestions.filter((q) => {
        const ranks = rankingAnswers[q.id] || {};
        return q.items.every((item) => ranks[item.id] && ranks[item.id] >= 1 && ranks[item.id] <= 6);
      }).length;
      const rankingProgress = (completedRankings / rankingQuestions.length) * 50;
      return scenarioProgress + rankingProgress;
    } else {
      return 100;
    }
  };

  // 모든 질문이 답변되었는지 확인
  const isAllAnswered = (): boolean => {
    if (currentPage === 'scenario') {
      return scenarioQuestions.every((q) => scenarioAnswers[q.id] !== undefined);
    } else if (currentPage === 'ranking') {
      return rankingQuestions.every((q) => {
        const ranks = rankingAnswers[q.id] || {};
        return q.items.every((item) => ranks[item.id] && ranks[item.id] >= 1 && ranks[item.id] <= 6);
      });
    } else {
      return tieBreakAnswer !== null;
    }
  };

  // 현재 단계 계산
  const getCurrentStep = (): number => {
    if (currentPage === 'scenario') {
      return 1;
    } else if (currentPage === 'ranking') {
      return 2;
    } else {
      return 2;
    }
  };

  const totalSteps = 2;

  return (
    <div ref={containerRef} style={styles.container}>
      {/* 진행률 바 */}
      <div style={styles.progressContainer}>
        <div style={styles.progressLabel}>
          <span style={styles.progressTitle}>나의 연애 유형 검사</span>
          <span style={styles.progressEmoji}>✨</span>
          <span style={styles.progressStep}>{getCurrentStep()} / {totalSteps} 단계</span>
        </div>
        <div style={styles.progressBarContainer}>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${getProgress()}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 타이틀 및 설명 */}
      <div style={styles.headerContainer}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>나의 연애 유형 검사</h1>
        </div>
        <div style={styles.instructionSection}>
          <p style={styles.instructionText}>
            ※ 시나리오 문항: 해당하는 선택지 1개를 고르세요.
          </p>
          <p style={styles.instructionText}>
            ※ 랭킹 문항: 본인과 가까운 순서대로 1~6위로 배열하세요.
          </p>
        </div>
      </div>

      <div style={styles.content}>
        {/* 시나리오 질문 - 모든 질문 한 번에 표시 */}
        {currentPage === 'scenario' && (
          <>
            <div style={styles.questionsContainer}>
              {scenarioQuestions.map((question, index) => (
                <div
                  key={question.id}
                  ref={(el) => {
                    scenarioQuestionRefs.current[question.id] = el;
                  }}
                >
                  <ScenarioQuestionItem
                    question={question}
                    selectedValue={scenarioAnswers[question.id] || null}
                    onSelect={(value) => handleScenarioAnswer(question.id, value, index)}
                    questionIndex={index}
                  />
                </div>
              ))}
            </div>
            
            <div style={styles.footer}>
              <button
                style={styles.previousButton}
                onClick={handleScenarioPrevious}
              >
                이전
              </button>
              <button
                style={{
                  ...styles.nextButton,
                  ...(isAllAnswered() ? {} : styles.nextButtonDisabled),
                }}
                onClick={handleScenarioNext}
                disabled={!isAllAnswered()}
              >
                다음
              </button>
            </div>
          </>
        )}

        {/* 랭킹 질문 - 모든 질문 한 번에 표시 */}
        {currentPage === 'ranking' && (
          <>
            <div style={styles.questionsContainer}>
              {rankingQuestions.map((question, index) => (
                <div
                  key={question.id}
                  ref={(el) => {
                    rankingQuestionRefs.current[question.id] = el;
                  }}
                >
                  <RankingQuestionItem
                    question={question}
                    selectedRanks={rankingAnswers[question.id] || {}}
                    onRankChange={(itemId, rank) => handleRankingAnswer(question.id, itemId, rank, index)}
                    questionIndex={index}
                  />
                </div>
              ))}
            </div>
            
            <div style={styles.footer}>
              <button
                style={styles.previousButton}
                onClick={handleRankingPrevious}
              >
                이전
              </button>
              <button
                style={{
                  ...styles.nextButton,
                  ...(isAllAnswered() ? {} : styles.nextButtonDisabled),
                }}
                onClick={handleRankingNext}
                disabled={!isAllAnswered()}
              >
                결과 확인
              </button>
            </div>
          </>
        )}

        {/* Tie-break 질문 */}
        {currentPage === 'tiebreak' && tieBreakOptions && (
          <>
            <div style={styles.tieBreakContainer}>
              <h3 style={styles.tieBreakTitle}>{tieBreakOptions.question}</h3>
              <div style={styles.tieBreakOptions}>
                {tieBreakOptions.options.map((option) => (
                  <button
                    key={option.value}
                    style={{
                      ...styles.tieBreakButton,
                      ...(tieBreakAnswer === option.value ? styles.tieBreakButtonSelected : {}),
                    }}
                    onClick={() => handleTieBreakAnswer(option.value)}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      handleTieBreakAnswer(option.value);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#FFF8F5',
  },
  progressContainer: {
    padding: '12px 16px',
    backgroundColor: '#FFFFFF',
    borderBottom: '2px solid #FFE5F1',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 12px rgba(255, 182, 193, 0.1)',
  },
  progressLabel: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#C85A7A',
    marginBottom: '10px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  progressTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#C85A7A',
  },
  progressEmoji: {
    fontSize: '18px',
    marginRight: '0px',
  },
  progressStep: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#C85A7A',
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBar: {
    width: '100%',
    height: '12px',
    backgroundColor: '#FFE5F1',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: 'inset 0 2px 4px rgba(255, 182, 193, 0.2)',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #FFB6C1 0%, #FF9BB3 100%)',
    borderRadius: '20px',
    transition: 'width 0.5s ease',
    boxShadow: '0 2px 8px rgba(255, 182, 193, 0.4)',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #FFE5F1',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  titleSection: {
    padding: '16px 16px 8px',
    textAlign: 'center',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#E8548A',
    margin: 0,
    lineHeight: '1.3',
  },
  instructionSection: {
    padding: '0 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  instructionText: {
    fontSize: '13px',
    color: '#8B7355',
    margin: 0,
    lineHeight: '1.5',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '10px 12px',
  },
  questionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '12px',
  },
  footer: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    paddingBottom: '12px',
    position: 'sticky',
    bottom: 0,
    backgroundColor: '#FFF8F5',
    zIndex: 1000,
  },
  previousButton: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: '#E8D5C4',
    color: '#5A4A42',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 2px 6px rgba(232, 213, 196, 0.3)',
  },
  nextButton: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: '#E8548A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 3px 10px rgba(232, 84, 138, 0.4)',
  },
  nextButtonDisabled: {
    backgroundColor: '#E0E0E0',
    color: '#BDBDBD',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  tieBreakContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    border: '2px solid #5B4FCF',
  },
  tieBreakTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#5B4FCF',
    margin: '0 0 20px 0',
    textAlign: 'center',
  },
  tieBreakOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  tieBreakButton: {
    padding: '16px',
    fontSize: '15px',
    fontWeight: '500',
    backgroundColor: '#FFF8F5',
    color: '#5A4A42',
    border: '2px solid #FFE5F1',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  },
  tieBreakButtonSelected: {
    backgroundColor: '#F3F0FF',
    borderColor: '#5B4FCF',
    color: '#5B4FCF',
    fontWeight: '600',
  },
};
