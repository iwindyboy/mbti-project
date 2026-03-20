import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { calculateSaju, SajuInput, SajuResult } from '../utils/sajuEngine';
import { SAJU_CONTENT_DB, ILGAN_SYMBOL, FortuneType } from '../data/sajuDb';
import { getLatestScanResult } from '../utils/storage';

// 일간별 32 스펙트럼 매핑 데이터
const ILGAN_SPECTRUM_MAP: Record<string, { types: string[]; reason: string }> = {
  '甲': {
    types: ['INTJD', 'ESTJD'],
    reason: '원칙과 강직함, 체계적 리더십이 닮아있어요'
  },
  '乙': {
    types: ['INFJA', 'ISFJA'],
    reason: '공감 능력과 유연한 관계력이 닮아있어요'
  },
  '丙': {
    types: ['ENFJA', 'ENTJA'],
    reason: '폭발적 에너지와 사람을 이끄는 영향력이 닮아있어요'
  },
  '丁': {
    types: ['INFJD', 'INFPD'],
    reason: '깊은 직관과 감수성, 내면의 통찰이 닮아있어요'
  },
  '戊': {
    types: ['ISTJD', 'ISFJD'],
    reason: '포용력과 흔들리지 않는 중심, 안정감이 닮아있어요'
  },
  '己': {
    types: ['ISTJA', 'ISFJA'],
    reason: '성실한 실행력과 꼼꼼한 현실 감각이 닮아있어요'
  },
  '庚': {
    types: ['ENTJD', 'ESTJD'],
    reason: '카리스마와 단호한 원칙, 강한 추진력이 닮아있어요'
  },
  '辛': {
    types: ['INTPA', 'ISFPD'],
    reason: '완벽주의와 섬세한 심미안, 예술적 감각이 닮아있어요'
  },
  '壬': {
    types: ['ENTPD', 'INTPD'],
    reason: '넓은 시야와 지적 탐구심, 자유로운 사고가 닮아있어요'
  },
  '癸': {
    types: ['INFPD', 'INFJD'],
    reason: '깊은 감성과 순수한 직관, 치유의 에너지가 닮아있어요'
  }
};

// 32 스펙트럼 유형 소개 데이터
const SPECTRUM_TYPE_INFO: Record<string, { hashtag: string; nickname: string; intro: string }> = {
  'INTJD': {
    hashtag: '#미래설계 #심층분석',
    nickname: '고요한 전략가',
    intro: '보이지 않는 수 많은 수 뒤의 미래를 설계해요. 냉철한 논리로 최적의 해답을 찾고, 남들이 보지 못하는 핵심을 짚어내요.'
  },
  'ESTJD': {
    hashtag: '#조직지휘관 #질서창조',
    nickname: '질서의 지휘관',
    intro: '혼돈 속에서 질서를 창조해요. 흩어진 자원과 인력을 하나의 목표로 정렬시키는 천부적인 능력이 있어요.'
  },
  'INFJA': {
    hashtag: '#이상적혁신 #성장멘토',
    nickname: '성장 멘토',
    intro: '꿈꾸던 미래를 현실의 지도로 그려내요. 선한 가치를 구체적인 계획으로 만들고, 주변 사람을 성장시키는 힘이 있어요.'
  },
  'ISFJA': {
    hashtag: '#일상의해결사 #실무의기동대',
    nickname: '일상의 해결사',
    intro: '모두가 편안할 수 있도록 공간과 마음을 매만져요. 사람들의 필요를 먼저 알아채고 조용히 챙기는 따뜻한 실행가예요.'
  },
  'ENFJA': {
    hashtag: '#긍정의불꽃 #비전가속기',
    nickname: '긍정의 불꽃',
    intro: '사람들의 가슴에 변화의 불꽃을 지펴요. 확신에 찬 비전과 폭발적인 에너지로 사람들을 움직이게 만들어요.'
  },
  'ENTJA': {
    hashtag: '#폭발적실행 #비전메이커',
    nickname: '실행의 엔진',
    intro: '비전을 현실로 바꾸는 폭발적인 실행가예요. 결정된 목표를 향해 주저 없이 뛰어들고, 어떻게든 되게 하는 방법을 찾아요.'
  },
  'INFJD': {
    hashtag: '#영혼의통찰 #고요한예언자',
    nickname: '고요한 예언자',
    intro: '깊은 내면의 목소리를 따라 세상을 치유해요. 겉으로 드러나는 현상보다 그 이면의 본질을 꿰뚫어 보는 통찰이 있어요.'
  },
  'INFPD': {
    hashtag: '#독창적미학 #영혼의여행자',
    nickname: '영혼의 여행자',
    intro: '자신만의 고요한 숲속에서 진실을 찾아요. 세상의 소음에서 벗어나 내면세계를 탐험하고, 독창적인 방식으로 표현해요.'
  },
  'ISTJD': {
    hashtag: '#신뢰의기둥 #무결점실무',
    nickname: '신뢰의 기둥',
    intro: '어떤 상황에서도 변치 않는 단단한 뿌리예요. 맡은 바를 완벽하게 해내는 무결점 실행력으로 주변의 신뢰를 얻어요.'
  },
  'ISFJD': {
    hashtag: '#신뢰의수호자 #기억력의달인',
    nickname: '은은한 등불',
    intro: '보이지 않는 곳에서 모두를 비추는 존재예요. 주변 사람들의 필요를 누구보다 먼저 알아차리고 조용히 채워줘요.'
  },
  'ISTJA': {
    hashtag: '#미션해결사 #실전기동력',
    nickname: '미션 해결사',
    intro: '가장 빠르고 정확하게 정답지에 도달해요. 목표가 정해지는 순간 달성 방법을 즉각 파악하고 실행하는 능력이 탁월해요.'
  },
  'ENTJD': {
    hashtag: '#거시적리더 #전략운용',
    nickname: '거시적 사령관',
    intro: '거시적인 안목으로 조직의 승리를 이끌어요. 전체 흐름을 한눈에 읽고 수많은 자원과 인력을 하나의 목표로 정렬시켜요.'
  },
  'INTPA': {
    hashtag: '#지적응용 #솔루션센터',
    nickname: '지능적 실천가',
    intro: '새로운 지식을 즉시 도구로 바꾸는 실천가예요. 새로운 개념을 배우는 즉시 어떻게 활용할지 파악하는 능력이 남달라요.'
  },
  'ISFPD': {
    hashtag: '#심미안 #조용한예술가',
    nickname: '조용한 예술가',
    intro: '일상 속의 작은 아름다움을 발견해요. 남들이 무심히 지나치는 순간에서 특별한 아름다움을 포착하는 섬세한 감각이 있어요.'
  },
  'ENTPD': {
    hashtag: '#다면적변수 #토론의달인',
    nickname: '지적 팔색조',
    intro: '가능성의 지도를 그리는 전략가예요. 하나의 사안을 수십 가지 관점에서 바라보며 발생할 수 있는 모든 변수를 계산해요.'
  },
  'INTPD': {
    hashtag: '#본질탐구 #지적모험가',
    nickname: '지적 모험가',
    intro: '세상의 숨겨진 원리를 파헤쳐요. 남들이 당연하게 여기는 현상 이면의 근본적인 이유를 끝없이 탐구하는 지식 탐험가예요.'
  }
};

export const FortuneResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<SajuResult | null>(null);
  const [activeTab, setActiveTab] = useState<FortuneType | '선천적 성향'>('선천적 성향');
  const [contentOpacity, setContentOpacity] = useState(1);

  useEffect(() => {
    // location.state에서 input을 가져오거나, localStorage에서 결과를 가져오기
    const input = location.state?.input as SajuInput;
    
    if (input) {
      // 새로운 검사 결과
      const calculatedResult = calculateSaju(input);
      setResult(calculatedResult);

      // localStorage에 사주 결과 저장 (index-saju.html과 호환)
      try {
        const 일간 = calculatedResult.일간;
        const content = SAJU_CONTENT_DB[일간] || {};
        
        const sajuResultData = {
          name: input.name,
          input: input,
          result: calculatedResult,
          content: content,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('saju_result', JSON.stringify(sajuResultData));
        
        // 전역 변수로도 저장 (index-saju.html 호환)
        if (typeof window !== 'undefined') {
          (window as any).currentName = input.name;
          (window as any).currentSajuData = calculatedResult;
          (window as any).currentContentData = content;
        }
      } catch (error) {
        console.error('사주 결과 저장 실패:', error);
      }
    } else {
      // localStorage에서 저장된 결과 가져오기
      try {
        const sajuResultData = localStorage.getItem('saju_result');
        if (sajuResultData) {
          const parsed = JSON.parse(sajuResultData);
          if (parsed.result && parsed.content) {
            setResult(parsed.result);
            
            // 전역 변수로도 저장 (index-saju.html 호환)
            if (typeof window !== 'undefined') {
              (window as any).currentName = parsed.name || '당신';
              (window as any).currentSajuData = parsed.result;
              (window as any).currentContentData = parsed.content;
            }
          }
        }
      } catch (error) {
        console.error('사주 결과 불러오기 오류:', error);
      }
    }
  }, [location, navigate]);

  if (!result) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  const { 일간, 오행 } = result;
  const symbol = ILGAN_SYMBOL[일간];
  
  // content는 localStorage에서 가져온 것이거나, DB에서 가져온 것
  let content = SAJU_CONTENT_DB[일간];
  let input: SajuInput | null = null;
  
  // localStorage에서 저장된 데이터 확인
  try {
    const sajuResultData = localStorage.getItem('saju_result');
    if (sajuResultData) {
      const parsed = JSON.parse(sajuResultData);
      if (parsed.content) {
        content = parsed.content;
      }
      if (parsed.input) {
        input = parsed.input;
      }
    }
  } catch (error) {
    // localStorage 읽기 실패 시 DB에서 가져온 content 사용
  }
  
  // input이 없으면 기본값 사용
  const displayName = input?.name || (typeof window !== 'undefined' ? (window as any).currentName : '당신') || '당신';

  const fortuneTypes: FortuneType[] = ['재물운', '애정운', '직업운', '성격운', '건강운', '가족운'];

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* 헤더 */}
        <div style={styles.header}>
          <button 
            style={styles.backButton}
            onClick={() => navigate('/fortune')}
          >
            ← 다시 하기
          </button>
        </div>

        {/* 타이틀, 사주 8글자, 오행 결과 - 선천적 성향 탭에서만 표시 */}
        {activeTab === '선천적 성향' && (
          <>
            {/* 타이틀 */}
            <div style={styles.titleSection}>
              <h1 style={styles.title}>{displayName}님의 사주팔자</h1>
            </div>

            {/* 사주 8글자 */}
            <div style={styles.sajuCards}>
              <div style={styles.sajuCard}>
                <div style={styles.sajuLabel}>연주</div>
                <div style={styles.sajuText}>
                  {result.연주.천간}{result.연주.지지}
                </div>
              </div>
              <div style={styles.sajuCard}>
                <div style={styles.sajuLabel}>월주</div>
                <div style={styles.sajuText}>
                  {result.월주.천간}{result.월주.지지}
                </div>
              </div>
              <div style={styles.sajuCard}>
                <div style={styles.sajuLabel}>일주</div>
                <div style={styles.sajuText}>
                  {result.일주.천간}{result.일주.지지}
                </div>
              </div>
              {result.시주 && (
                <div style={styles.sajuCard}>
                  <div style={styles.sajuLabel}>시주</div>
                  <div style={styles.sajuText}>
                    {result.시주.천간}{result.시주.지지}
                  </div>
                </div>
              )}
            </div>

            {/* 오행 결과 */}
            <div style={styles.ohangCard}>
              <div style={styles.ohangEmoji}>{symbol.emoji}</div>
              <div style={styles.ohangInfo}>
                <div style={styles.ohangName}>{symbol.name} ({일간})</div>
                <div style={styles.ohangSymbol}>{symbol.symbol} 기운</div>
                <div style={styles.ohangKeyword}>{symbol.keyword}</div>
              </div>
            </div>
          </>
        )}

        {/* 운세 탭 */}
        <div style={styles.tabContainer}>
          {/* 선천적 성향 탭 (맨 앞) */}
          <button
            key="선천적 성향"
            onClick={() => {
              setContentOpacity(0);
              setTimeout(() => {
                setActiveTab('선천적 성향');
                setContentOpacity(1);
              }, 100);
            }}
            style={{
              ...styles.tab,
              ...(activeTab === '선천적 성향' ? styles.tabActive : {}),
            }}
          >
            선천적 성향
          </button>
          {/* 기존 6개 탭 */}
          {fortuneTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                setContentOpacity(0);
                setTimeout(() => {
                  setActiveTab(type);
                  setContentOpacity(1);
                }, 100);
              }}
              style={{
                ...styles.tab,
                ...(activeTab === type ? styles.tabActive : {}),
              }}
            >
              {type.replace('운', '')}
            </button>
          ))}
        </div>

        {/* 운세 내용 */}
        {activeTab === '선천적 성향' && content && content['전체개관'] && (
          <div style={{...styles.fortuneContent, opacity: contentOpacity}}>
            {/* 파트 1 - 전체개관 */}
            <h2 style={styles.overviewMainTitle}>선천적 성향 핵심 요약</h2>
            <div style={styles.overviewSubtitle}>{content['전체개관'].subtitle}</div>
            
            <div style={styles.overviewText}>
              {content['전체개관'].content.split('\n\n').map((para, idx) => (
                <p key={idx} style={styles.overviewParagraph}>
                  {para.trim()}
                </p>
              ))}
            </div>

            {/* 키워드 뱃지 */}
            {content['전체개관'].keywords && (
              <div style={styles.overviewKeywords}>
                {content['전체개관'].keywords.map((keyword, idx) => (
                  <span key={idx} style={styles.keywordBadge}>
                    {keyword}
                  </span>
                ))}
              </div>
            )}

            {/* 인생 테마 */}
            {content['전체개관'].lifeTheme && (
              <div style={styles.lifeThemeBox}>
                🎯 인생 테마: {content['전체개관'].lifeTheme}
              </div>
            )}

            {/* 강점/주의점 카드 */}
            <div style={styles.strengthCautionGrid}>
              <div style={styles.strengthCard}>
                <div style={styles.strengthLabel}>💪 강점</div>
                <div style={styles.strengthText}>{content['전체개관'].strength}</div>
              </div>
              <div style={styles.cautionCard}>
                <div style={styles.cautionLabel}>⚠️ 주의점</div>
                <div style={styles.cautionText}>{content['전체개관'].caution}</div>
              </div>
            </div>

            {/* 구분선 */}
            <hr style={styles.divider} />

            {/* 파트 2 - 총운정리 */}
            {content['총운정리'] && (
              <>
                <h2 style={styles.summaryTitle}>🌟 당신에게 전하는 말</h2>
                
                <div style={styles.summaryText}>
                  {content['총운정리'].content.split('\n\n').map((para, idx) => (
                    <p key={idx} style={styles.summaryParagraph}>
                      {para.trim()}
                    </p>
                  ))}
                </div>

                {/* 핵심 메시지 */}
                {content['총운정리'].finalMessage && (
                  <div style={styles.finalMessageBox}>
                    ❝ {content['총운정리'].finalMessage} ❞
                  </div>
                )}

                {/* 행운 정보 3열 */}
                <div style={styles.luckyInfoGrid}>
                  <div style={styles.luckyItem}>
                    <div style={styles.luckyIcon}>🎨</div>
                    <div style={styles.luckyValue}>{content['총운정리'].luckyColor || '-'}</div>
                    <div style={styles.luckyLabel}>행운 색상</div>
                  </div>
                  <div style={styles.luckyItem}>
                    <div style={styles.luckyIcon}>🔢</div>
                    <div style={styles.luckyValue}>{content['총운정리'].luckyNumber || '-'}</div>
                    <div style={styles.luckyLabel}>행운 숫자</div>
                  </div>
                  <div style={styles.luckyItem}>
                    <div style={styles.luckyIcon}>🧭</div>
                    <div style={styles.luckyValue}>{content['총운정리'].goodDirection || '-'}</div>
                    <div style={styles.luckyLabel}>좋은 방향</div>
                  </div>
                </div>
              </>
            )}

            {/* 32 스펙트럼 연결 섹션 */}
            {ILGAN_SPECTRUM_MAP[일간] && (
              <>
                <hr style={styles.divider} />
                
                <div style={styles.spectrumSection}>
                  <h2 style={styles.spectrumHeader}>🔗 32 스펙트럼과 연결되는 지점</h2>
                  
                  <div style={styles.spectrumDescription}>
                    선천적 기질을 기준으로 보면,<br />
                    {displayName}님은 32 스펙트럼에서<br />
                    아래 유형에 가까울 가능성이 높아요.
                  </div>

                  {/* 유형 카드 2개 */}
                  <div style={styles.spectrumCardsGrid}>
                    {ILGAN_SPECTRUM_MAP[일간].types.map((typeCode, idx) => {
                      const typeInfo = SPECTRUM_TYPE_INFO[typeCode];
                      if (!typeInfo) return null;
                      
                      return (
                        <div key={idx} style={styles.spectrumCard}>
                          <div style={styles.spectrumTypeCode}>{typeCode}</div>
                          <div style={styles.spectrumHashtag}>{typeInfo.hashtag}</div>
                          <hr style={styles.spectrumDivider} />
                          <div style={styles.spectrumNickname}>{typeInfo.nickname}</div>
                          <div style={styles.spectrumIntro}>{typeInfo.intro}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 공통 연결 이유 */}
                  <div style={styles.spectrumReasonBox}>
                    💡 {ILGAN_SPECTRUM_MAP[일간].reason}
                  </div>

                  {/* 주의 문구 */}
                  <div style={styles.spectrumWarning}>
                    ⚠️ 이는 선천적 기질 기준이에요.<br />
                    지금 현재의 내 모습은 환경과 경험에 따라 다를 수 있어요.
                  </div>
                </div>
              </>
            )}

            {/* 32 스펙트럼 검사 CTA 섹션 */}
            <div style={styles.spectrumCTASection}>
              <h3 style={styles.spectrumCTATitle}>🔍 지금의 나는 어떤 모습?</h3>
              <p style={styles.spectrumCTAText}>
                사주로 원래의 나를 확인했다면,<br />
                이제 지금의 나를 만날 차례예요.
              </p>
              <button
                style={styles.spectrumCTAButtonBottom}
                onClick={() => navigate('/spectrum-intro')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                32 스펙트럼 검사하기 →
              </button>
            </div>
          </div>
        )}

        {/* 기존 운세 탭 내용 */}
        {activeTab !== '선천적 성향' && content && content[activeTab] && (
          <div style={{...styles.fortuneContent, opacity: contentOpacity}}>
            <h2 style={styles.fortuneTitle}>
              {content[activeTab].title}
            </h2>
            <div style={styles.fortuneText}>
              {content[activeTab].content.split('\n').map((line, idx) => (
                <p key={idx} style={styles.fortuneParagraph}>
                  {line}
                </p>
              ))}
            </div>

            {/* 실천 팁 */}
            <div style={styles.tipsSection}>
              <h3 style={styles.tipsTitle}>실천 팁</h3>
              <div style={styles.tipsList}>
                {content[activeTab].tips.map((tip, idx) => (
                  <div key={idx} style={styles.tipItem}>
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            {/* 격려 메시지 */}
            <div style={styles.quoteBox}>
              <p style={styles.quoteText}>
                {content[activeTab].quote}
              </p>
            </div>

            {/* 32 스펙트럼 검사 CTA 섹션 */}
            <div style={styles.spectrumCTASection}>
              <h3 style={styles.spectrumCTATitle}>🔍 지금의 나는 어떤 모습?</h3>
              <p style={styles.spectrumCTAText}>
                사주로 원래의 나를 확인했다면,<br />
                이제 지금의 나를 만날 차례예요.
              </p>
              <button
                style={styles.spectrumCTAButtonBottom}
                onClick={() => navigate('/spectrum-intro')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                32 스펙트럼 검사하기 →
              </button>
            </div>

            {/* 통합 리포트 CTA 섹션 */}
            <div style={styles.integratedCTASection}>
              <h3 style={styles.integratedCTATitle}>🔮 통합 분석 리포트</h3>
              <p style={styles.integratedCTAText}>
                사주와 32 스펙트럼을 함께 분석하면<br />
                더 깊이 있는 인사이트를 얻을 수 있어요.
              </p>
              <button
                style={styles.integratedCTAButton}
                onClick={async () => {
                  try {
                    // 32 Spectrum 결과 확인
                    const scanResultData = await getLatestScanResult();
                    
                    // sessionStorage에서도 확인
                    let scanResult = scanResultData?.result;
                    if (!scanResult && typeof window !== 'undefined' && window.sessionStorage) {
                      const sessionData = window.sessionStorage.getItem('scanResult');
                      if (sessionData) {
                        scanResult = JSON.parse(sessionData);
                      }
                    }

                    if (!scanResult) {
                      alert('32 Spectrum 검사를 먼저 완료해주세요.');
                      navigate('/spectrum-intro');
                      return;
                    }

                    // 통합 리포트 페이지로 이동 (데이터는 IntegratedReportPage에서 로드)
                    navigate('/integrated-report');
                  } catch (error) {
                    console.error('통합 리포트 이동 오류:', error);
                    alert('통합 리포트를 불러오는 중 오류가 발생했습니다.');
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 58, 139, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 58, 139, 0.3)';
                }}
              >
                통합 리포트 보기 →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F9F7F2 0%, #F5F3ED 50%, #F1EFE8 100%)',
    padding: '16px',
    paddingBottom: '40px',
  },
  content: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#8B7355',
  },
  header: {
    marginBottom: '20px',
  },
  backButton: {
    padding: '10px 16px',
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontWeight: '500',
    color: '#5A4A42',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  titleSection: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontFamily: '"Nanum Myeongjo", "나눔명조", "Noto Serif KR", "Batang", "Gungsuh", serif',
    color: '#5A4A42',
    fontWeight: '700',
    marginBottom: '8px',
  },
  sajuCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '16px',
  },
  sajuCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    padding: '14px',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  },
  sajuLabel: {
    fontSize: '13px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#8B7355',
    marginBottom: '8px',
  },
  sajuText: {
    fontSize: '24px',
    fontFamily: '"Nanum Myeongjo", "나눔명조", "Noto Serif KR", "Batang", "Gungsuh", serif',
    color: '#C85A7A',
    fontWeight: '700',
  },
  ohangCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  },
  ohangEmoji: {
    fontSize: '48px',
  },
  ohangInfo: {
    flex: 1,
  },
  ohangName: {
    fontSize: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontWeight: '700',
    color: '#5A4A42',
    marginBottom: '4px',
  },
  ohangSymbol: {
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#C85A7A',
    marginBottom: '4px',
  },
  ohangKeyword: {
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#8B7355',
  },
  tabContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '10px 16px',
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontWeight: '500',
    color: '#5A4A42',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(200, 90, 122, 0.2)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  tabActive: {
    backgroundColor: '#C85A7A',
    color: '#FFFFFF',
    border: '1px solid #C85A7A',
  },
  fortuneContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    padding: '18px 16px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
    opacity: 1,
    transition: 'opacity 0.2s ease',
  },
  fortuneTitle: {
    fontSize: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontWeight: '700',
    color: '#C85A7A',
    marginBottom: '12px',
  },
  fortuneText: {
    marginBottom: '18px',
  },
  fortuneParagraph: {
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#5A4A42',
    lineHeight: '1.6',
    marginBottom: '10px',
  },
  tipsSection: {
    marginBottom: '18px',
  },
  tipsTitle: {
    fontSize: '18px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontWeight: '600',
    color: '#5A4A42',
    marginBottom: '10px',
  },
  tipsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  tipItem: {
    fontSize: '15px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#5A4A42',
    lineHeight: '1.6',
    padding: '12px',
    backgroundColor: 'rgba(200, 90, 122, 0.1)',
    borderRadius: '8px',
  },
  quoteBox: {
    backgroundColor: 'rgba(200, 90, 122, 0.1)',
    borderRadius: '12px',
    padding: '18px',
    textAlign: 'center',
  },
  quoteText: {
    fontSize: '16px',
    fontFamily: '"Nanum Myeongjo", "나눔명조", "Noto Serif KR", "Batang", "Gungsuh", serif',
    color: '#5A4A42',
    fontStyle: 'italic',
    lineHeight: '1.6',
  },
  integratedBanner: {
    backgroundColor: '#F5F0FF',
    borderRadius: '16px',
    padding: '18px',
    marginBottom: '16px',
    borderLeft: '4px solid #8B3A8B',
  },
  bannerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  bannerTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1A0A2E',
    marginBottom: '4px',
  },
  bannerDescription: {
    fontSize: '14px',
    color: '#7B6B8A',
    lineHeight: '1.6',
  },
  bannerButton: {
    marginTop: '8px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#FFFFFF',
    background: 'linear-gradient(135deg, #8B3A8B 0%, #C8956C 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  // 선천적 성향 탭 스타일
  overviewMainTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2D1B40',
    marginBottom: '8px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  overviewSubtitle: {
    fontSize: '14px',
    color: '#8B3A8B',
    marginBottom: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  overviewText: {
    marginBottom: '14px',
  },
  overviewParagraph: {
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#3D2B1F',
    lineHeight: '1.6',
    marginBottom: '12px',
  },
  overviewKeywords: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '14px',
  },
  keywordBadge: {
    padding: '6px 14px',
    backgroundColor: '#F0E6FF',
    color: '#6B2FA0',
    borderRadius: '50px',
    fontSize: '13px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  lifeThemeBox: {
    backgroundColor: '#FAF5FF',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#6B2FA0',
    marginBottom: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  strengthCautionGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  strengthCard: {
    backgroundColor: '#F0FFF4',
    borderLeft: '4px solid #2E8B57',
    borderRadius: '12px',
    padding: '16px',
  },
  strengthLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#276749',
    marginBottom: '8px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  strengthText: {
    fontSize: '14px',
    color: '#276749',
    lineHeight: '1.6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  cautionCard: {
    backgroundColor: '#FFF8F0',
    borderLeft: '4px solid #CD853F',
    borderRadius: '12px',
    padding: '16px',
  },
  cautionLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#9C4221',
    marginBottom: '8px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  cautionText: {
    fontSize: '14px',
    color: '#9C4221',
    lineHeight: '1.6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  divider: {
    margin: '20px 0',
    border: 'none',
    borderTop: '2px dashed #E8D5F0',
  },
  summaryTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2D1B40',
    marginBottom: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  summaryText: {
    marginBottom: '18px',
  },
  summaryParagraph: {
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#3D2B1F',
    lineHeight: '1.6',
    marginBottom: '12px',
  },
  finalMessageBox: {
    backgroundColor: '#F5F0FF',
    borderRadius: '16px',
    padding: '16px 20px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#6B2FA0',
    textAlign: 'center',
    marginBottom: '18px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  luckyInfoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  luckyItem: {
    backgroundColor: '#F8F4FF',
    borderRadius: '12px',
    padding: '14px 8px',
    textAlign: 'center',
  },
  luckyIcon: {
    fontSize: '20px',
    marginBottom: '8px',
  },
  luckyValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2D1B40',
    marginBottom: '4px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  luckyLabel: {
    fontSize: '12px',
    color: '#8B6BAE',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  // 32 스펙트럼 연결 섹션 스타일
  spectrumSection: {
    marginTop: '0',
  },
  spectrumHeader: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2D1B40',
    marginBottom: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  spectrumDescription: {
    fontSize: '14px',
    color: '#5A4A6A',
    lineHeight: '1.6',
    marginBottom: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  spectrumCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '14px',
  },
  spectrumCard: {
    backgroundColor: '#FAFAFE',
    border: '1.5px solid #D4B8E0',
    borderRadius: '16px',
    padding: '16px',
  },
  spectrumTypeCode: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#6B2FA0',
    marginBottom: '6px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  spectrumHashtag: {
    fontSize: '12px',
    color: '#9B6BC4',
    marginBottom: '12px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  spectrumDivider: {
    border: 'none',
    borderTop: '1px solid #E8D5F0',
    margin: '12px 0',
  },
  spectrumNickname: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#2D1B40',
    marginBottom: '12px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  spectrumIntro: {
    fontSize: '13px',
    color: '#5A4A6A',
    lineHeight: '1.7',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  spectrumReasonBox: {
    backgroundColor: '#F5F0FF',
    borderLeft: '3px solid #8B3A8B',
    borderRadius: '0 12px 12px 0',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#6B2FA0',
    marginBottom: '12px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  spectrumWarning: {
    fontSize: '12px',
    color: '#9B8AAA',
    textAlign: 'center',
    marginTop: '10px',
    marginBottom: '12px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  spectrumCTAButton: {
    width: '100%',
    height: '48px',
    background: 'linear-gradient(135deg, #8B3A8B 0%, #1A0A2E 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    transition: 'transform 0.2s ease',
  },
  // 하단 32 스펙트럼 검사 CTA 섹션
  spectrumCTASection: {
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '2px dashed #E8D5F0',
    textAlign: 'center',
  },
  spectrumCTATitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2D1B40',
    marginBottom: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  spectrumCTAText: {
    fontSize: '15px',
    color: '#5A4A42',
    lineHeight: '1.8',
    marginBottom: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  spectrumCTAButtonBottom: {
    width: '100%',
    height: '52px',
    background: 'linear-gradient(135deg, #8B3A8B 0%, #1A0A2E 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 12px rgba(139, 58, 139, 0.3)',
  },
  // 통합 리포트 CTA 섹션
  integratedCTASection: {
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '2px dashed #E8D5F0',
    textAlign: 'center',
    backgroundColor: '#F5F0FF',
    borderRadius: '16px',
    padding: '24px',
  },
  integratedCTATitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2D1B40',
    marginBottom: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  integratedCTAText: {
    fontSize: '15px',
    color: '#5A4A42',
    lineHeight: '1.8',
    marginBottom: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  integratedCTAButton: {
    width: '100%',
    height: '52px',
    background: 'linear-gradient(135deg, #8B3A8B 0%, #C8956C 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 12px rgba(139, 58, 139, 0.3)',
  },
};
