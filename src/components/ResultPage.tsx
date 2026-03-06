import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalculateResult } from '../utils/calculate';
import { getTypeName } from '../utils/typeNames';
import { generatePremiumReport } from '../utils/premiumMessages';
import { SCAN_TYPE_DETAILS } from '../data/scanResultData';

interface ResultPageProps {
  result: CalculateResult;
  onReset: () => void;
}

interface PaymentPopupProps {
  onClose: () => void;
  result: CalculateResult;
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({ onClose, result }) => {
  const premiumReport = generatePremiumReport(result);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div style={paymentPopupStyles.overlay} onClick={onClose}>
      <div style={paymentPopupStyles.container} onClick={(e) => e.stopPropagation()}>
        <div style={paymentPopupStyles.popupHeader}>
          <h2 style={paymentPopupStyles.title}>정밀 분석 상품</h2>
          <button style={paymentPopupStyles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div style={paymentPopupStyles.content}>
          <div style={paymentPopupStyles.priceBox}>
            <div style={paymentPopupStyles.priceLabel}>정밀 분석 가격</div>
            <div style={paymentPopupStyles.price}>₩9,900</div>
          </div>
          
          {/* 프리미엄 리포트 미리보기 */}
          {showPreview && (
            <div style={paymentPopupStyles.previewSection}>
              <h3 style={paymentPopupStyles.previewTitle}>프리미엄 리포트 미리보기</h3>
              {premiumReport.axes
                .filter((axis) => axis.isGreyZone)
                .map((axis) => (
                  <div key={axis.axis} style={paymentPopupStyles.previewItem}>
                    <div style={paymentPopupStyles.previewLabel}>{axis.label}</div>
                    <div style={paymentPopupStyles.previewBasic}>
                      <strong>베이직:</strong> {axis.basic}
                    </div>
                    <div style={paymentPopupStyles.previewPremium}>
                      <strong>프리미엄:</strong> {axis.premium}
                    </div>
                  </div>
                ))}
              {premiumReport.axes.filter((axis) => axis.isGreyZone).length === 0 && (
                <p style={paymentPopupStyles.noGreyZone}>
                  Grey Zone이 감지되지 않았습니다. 프리미엄 리포트에서는 모든 축에 대한 상세 분석을 제공합니다.
                </p>
              )}
            </div>
          )}

          <ul style={paymentPopupStyles.features}>
            <li>상세 성향 분석 리포트</li>
            <li>강점 및 약점 분석</li>
            <li>맞춤형 성장 가이드</li>
            <li>커리어 추천</li>
            <li>관계 시너지 분석</li>
            {result.greyZones.length > 0 && (
              <li style={paymentPopupStyles.highlightFeature}>
                ✨ Grey Zone 특별 분석 ({result.greyZones.length}개 축)
              </li>
            )}
          </ul>

          <button
            style={paymentPopupStyles.previewButton}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? '미리보기 숨기기' : '프리미엄 리포트 미리보기'}
          </button>

          <button style={paymentPopupStyles.payButton}>
            결제하기
          </button>
          <button style={paymentPopupStyles.cancelButton} onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export const ResultPage: React.FC<ResultPageProps> = ({ result, onReset }) => {
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<Error | null>(null);

  // 결과 페이지가 마운트될 때 상단으로 스크롤
  useEffect(() => {
    try {
      console.log('ResultPage: Component mounted');
      console.log('ResultPage: result =', result);
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    } catch (err) {
      console.error('ResultPage: Error in useEffect', err);
      setError(err instanceof Error ? err : new Error('알 수 없는 오류'));
    }
  }, []);

  // result 검증
  if (!result) {
    console.error('ResultPage: result is null or undefined');
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>결과 데이터를 불러올 수 없습니다.</h2>
        <button onClick={onReset} style={{ marginTop: '20px', padding: '10px 20px' }}>
          다시 검사하기
        </button>
      </div>
    );
  }

  if (!result.typeCode) {
    console.error('ResultPage: result.typeCode is null or undefined', result);
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>유형 코드를 생성할 수 없습니다.</h2>
        <p>답변 데이터를 확인해주세요.</p>
        <button onClick={onReset} style={{ marginTop: '20px', padding: '10px 20px' }}>
          다시 검사하기
        </button>
      </div>
    );
  }

  // 에러 발생 시 표시
  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>오류가 발생했습니다.</h2>
        <p>{error.message}</p>
        <button onClick={onReset} style={{ marginTop: '20px', padding: '10px 20px' }}>
          다시 검사하기
        </button>
      </div>
    );
  }

  // 디버깅: result와 typeCode 확인
  useEffect(() => {
    if (!result) {
      console.error('ResultPage: result is undefined');
      return;
    }
    if (!result.typeCode) {
      console.error('ResultPage: result.typeCode is undefined', result);
      return;
    }
    
    // SCAN_TYPE_DETAILS가 정의되어 있는지 확인
    if (typeof SCAN_TYPE_DETAILS === 'undefined') {
      console.error('ResultPage: SCAN_TYPE_DETAILS is not defined');
      console.error('ResultPage: Check import path and module export');
      return;
    }
    
    console.log('ResultPage: typeCode =', result.typeCode);
    console.log('ResultPage: SCAN_TYPE_DETAILS keys =', Object.keys(SCAN_TYPE_DETAILS));
    console.log('ResultPage: SCAN_TYPE_DETAILS[typeCode] =', SCAN_TYPE_DETAILS[result.typeCode]);
    
    if (!SCAN_TYPE_DETAILS[result.typeCode]) {
      console.warn('ResultPage: typeCode not found in SCAN_TYPE_DETAILS', result.typeCode);
      console.warn('ResultPage: Available typeCodes =', Object.keys(SCAN_TYPE_DETAILS));
    }
  }, [result]);

  const axes = [
    { key: 'EI', label: '에너지', left: 'I 내향', right: 'E 외향', color: 'Green' },
    { key: 'SN', label: '인식', left: 'S 감각', right: 'N 직관', color: 'Yellow' },
    { key: 'FT', label: '판단', left: 'F 감정', right: 'T 논리', color: 'Purple' },
    { key: 'PJ', label: '생활', left: 'P 유연', right: 'J 계획', color: 'Blue' },
    { key: 'DA', label: '실행', left: 'D 신중', right: 'A 즉시', color: 'Red' },
  ];

  // 각 축별 색상 매핑 (파스텔 톤)
  // 한 개의 그래프에 하나의 색상 계열 사용, %가 높은 쪽은 더 진하게
  const axisColors: Record<string, { 
    light: string;  // 연한 색상 (비율이 낮은 쪽)
    dark: string;   // 진한 색상 (비율이 높은 쪽)
    label: string 
  }> = {
    'EI': {
      light: '#A8E6CF', // 연한 파스텔 그린
      dark: '#7DD3A0',  // 진한 파스텔 그린
      label: 'Green',
    },
    'SN': {
      light: '#FFE082', // 연한 파스텔 옐로우
      dark: '#FFD54F',  // 진한 파스텔 옐로우
      label: 'Yellow',
    },
    'FT': {
      light: '#E1BEE7', // 연한 파스텔 퍼플
      dark: '#CE93D8',   // 진한 파스텔 퍼플
      label: 'Purple',
    },
    'PJ': {
      light: '#90CAF9', // 연한 파스텔 블루
      dark: '#64B5F6',  // 진한 파스텔 블루
      label: 'Blue',
    },
    'DA': {
      light: '#FFAB91', // 연한 파스텔 오렌지
      dark: '#FF8A65',  // 진한 파스텔 오렌지
      label: 'Red',
    },
  };

  // 퍼센트 계산 함수
  const calculatePercentages = (leftSum: number, rightSum: number) => {
    const total = leftSum + rightSum;
    if (total === 0) {
      return { leftPercent: 50, rightPercent: 50 };
    }
    const leftPercent = Math.round((leftSum / total) * 100);
    const rightPercent = Math.round((rightSum / total) * 100);
    return { leftPercent, rightPercent };
  };

  // 퍼센트 기반 그래프 스타일 계산 함수
  // 0%에서 100%까지 꽉 차게 표시 (양끝 공간 없음)
  const getAxisBarStyles = (
    leftPercent: number,
    rightPercent: number,
    axisKey: string,
    isGreyZone: boolean
  ) => {
    const colors = axisColors[axisKey] || axisColors['EI'];
    
    // 비율이 높은 쪽에 진한 색상, 낮은 쪽에 연한 색상 적용
    // 한 개의 그래프에 하나의 색상 계열 사용
    const leftColor = leftPercent > rightPercent ? colors.dark : colors.light;
    const rightColor = rightPercent > leftPercent ? colors.dark : colors.light;
    
    // 왼쪽 막대: 0%에서 시작하여 leftPercent%까지
    const leftBarStyle = {
      left: '0%',
      width: `${leftPercent}%`,
      backgroundColor: leftColor,
      background: `linear-gradient(90deg, ${leftColor} 0%, ${leftColor} 100%)`,
    };
    
    // 오른쪽 막대: leftPercent%에서 시작하여 rightPercent%까지
    const rightBarStyle = {
      left: `${leftPercent}%`,
      width: `${rightPercent}%`,
      backgroundColor: rightColor,
      background: `linear-gradient(90deg, ${rightColor} 0%, ${rightColor} 100%)`,
    };
    
    return {
      leftBar: leftBarStyle,
      rightBar: rightBarStyle,
    };
  };

  // 상위 백분위 계산 (간단한 시뮬레이션)
  const percentile = Math.floor(Math.random() * 20) + 75; // 75-95% 범위

  // 매칭 라인에서 유형 코드를 추출하고 링크로 변환하는 함수
  const parseMatchingLine = (line: string) => {
    if (!line) return null;
    
    // 유형 코드 패턴: 5자리 대문자 (예: ENTJD, ISFPD, ESFPA)
    // 공백이나 대괄호 앞에 올 수 있음
    const typeCodeMatch = line.match(/([A-Z]{5})(?=\s|\[|$)/);
    if (typeCodeMatch) {
      const typeCode = typeCodeMatch[1];
      // SCAN_TYPE_DETAILS에 해당 유형이 있는지 확인
      if (SCAN_TYPE_DETAILS[typeCode]) {
        const index = line.indexOf(typeCode);
        return {
          before: line.substring(0, index),
          typeCode: typeCode,
          after: line.substring(index + typeCode.length),
        };
      } else {
        console.warn('유형 코드를 찾았지만 SCAN_TYPE_DETAILS에 없습니다:', typeCode);
      }
    } else {
      console.log('유형 코드를 찾을 수 없습니다. 라인:', line);
    }
    return null;
  };

  // 매칭 라인 렌더링 함수
  const renderMatchingLine = (line: string) => {
    if (!line) {
      console.log('renderMatchingLine: line이 비어있음');
      return <span></span>;
    }
    
    console.log('renderMatchingLine 호출됨, 라인:', line);
    const parsed = parseMatchingLine(line);
    console.log('parseMatchingLine 결과:', parsed);
    
    if (parsed) {
      console.log('링크 생성됨:', parsed.typeCode);
      return (
        <span>
          {parsed.before}
          <span
            style={{
              color: '#C85A7A',
              fontWeight: '700',
              textDecoration: 'underline',
              cursor: 'pointer',
              transition: 'color 0.2s',
              display: 'inline',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '0',
              margin: '0',
              position: 'relative',
              zIndex: 10,
              pointerEvents: 'auto',
            } as React.CSSProperties}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // 별도 페이지로 이동
              navigate(`/type/${parsed.typeCode}`);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FF6B9D';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#C85A7A';
            }}
            title={`${parsed.typeCode} 유형 정보 보기`}
            className="type-code-link"
          >
            {parsed.typeCode}
          </span>
          {parsed.after}
        </span>
      );
    }
    console.log('링크 생성 실패, 원본 텍스트 반환');
    return <span>{line}</span>;
  };

  // SCAN_TYPE_DETAILS가 정의되어 있는지 확인
  if (typeof SCAN_TYPE_DETAILS === 'undefined') {
    console.error('ResultPage: SCAN_TYPE_DETAILS is not defined. Check import path.');
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>데이터를 불러올 수 없습니다.</h2>
        <p style={{ color: '#d32f2f', marginTop: '10px' }}>
          SCAN_TYPE_DETAILS 모듈을 불러오는 중 오류가 발생했습니다.
        </p>
        <button onClick={onReset} style={{ marginTop: '20px', padding: '10px 20px' }}>
          다시 검사하기
        </button>
      </div>
    );
  }

  try {
    return (
      <div ref={containerRef} style={styles.container}>
      <div style={styles.content}>
        {/* 유형 코드 및 네이밍 */}
        <div style={styles.header}>
          <div style={styles.typeCode}>{result.typeCode}</div>
          <div style={styles.typeNameContainer}>
            <h1 style={styles.typeName}>{getTypeName(result.typeCode)}</h1>
            {result.badge && (
              <span style={styles.badge}>[{result.badge}]</span>
            )}
          </div>
          {result.greyZones.length > 0 && (
            <div style={styles.greyZoneInfo}>
              <p style={styles.greyZoneTitle}>Grey Zone 감지</p>
              <p style={styles.greyZoneDescription}>
                {result.greyZones.length}개 축에서 중립적 성향이 감지되었습니다.
                이는 해당 영역에서 두 성향의 특징을 모두 가지는 유연한 적응력을 보인다는 의미입니다.
              </p>
            </div>
          )}
        </div>

        {/* 축별 점수 시각화 */}
        <div style={styles.scoresSection}>
          <h2 style={styles.sectionTitle}>📊 성향 분석 결과</h2>
          {axes.map((axis) => {
            const totalDiff = result.scores[axis.key];
            const leftSum = result.leftSums[axis.key] || 0;
            const rightSum = result.rightSums[axis.key] || 0;
            
            // 퍼센트 계산
            const { leftPercent, rightPercent } = calculatePercentages(leftSum, rightSum);
            
            // Grey Zone 여부 확인 (편차 절댓값 <= 3)
            const isGreyZone = result.isGrayZone[axis.key] || false;
            const colors = axisColors[axis.key] || axisColors['EI'];

            // 막대 스타일 계산
            const barStyles = getAxisBarStyles(leftPercent, rightPercent, axis.key, isGreyZone);

            return (
              <div 
                key={axis.key} 
                style={{
                  ...styles.axisContainer,
                  ...(isGreyZone ? styles.axisContainerGreyZone : {}),
                }}
              >
                {/* 축 명칭과 Grey Zone */}
                <div style={styles.axisHeaderRow}>
                  <span style={styles.axisLabel}>{axis.label}</span>
                  {isGreyZone && (
                    <span style={styles.greyZoneBadge}>
                      Grey Zone
                    </span>
                  )}
                </div>
                
                {/* 그래프 위 레이블 (I내향 45%  55% E외향) */}
                <div style={styles.graphLabelRow}>
                  <div style={{
                    ...styles.graphLabelLeft,
                    color: !isGreyZone && leftPercent > rightPercent ? '#FF4444' : styles.graphLabelLeft.color,
                    fontWeight: !isGreyZone && leftPercent > rightPercent ? '700' : styles.graphLabelLeft.fontWeight,
                  }}>
                    {axis.left} {leftPercent}%
                  </div>
                  <div style={{
                    ...styles.graphLabelRight,
                    color: !isGreyZone && rightPercent > leftPercent ? '#FF4444' : styles.graphLabelRight.color,
                    fontWeight: !isGreyZone && rightPercent > leftPercent ? '700' : styles.graphLabelRight.fontWeight,
                  }}>
                    {rightPercent}% {axis.right}
                  </div>
                </div>
                
                {/* 시각적 그래프 */}
                <div style={styles.axisGraphColumn}>
                  <div style={styles.progressBarWrapper}>
                    <div style={styles.progressBarBackground} className="progress-bar-background">
                      {/* 왼쪽 막대 */}
                      <div
                        style={{
                          ...styles.progressBarFill,
                          left: barStyles.leftBar.left,
                          width: barStyles.leftBar.width,
                          backgroundColor: barStyles.leftBar.backgroundColor,
                          background: barStyles.leftBar.background,
                          right: 'auto',
                        }}
                      ></div>
                      {/* 오른쪽 막대 */}
                      <div
                        style={{
                          ...styles.progressBarFill,
                          left: barStyles.rightBar.left,
                          width: barStyles.rightBar.width,
                          backgroundColor: barStyles.rightBar.backgroundColor,
                          background: barStyles.rightBar.background,
                          right: 'auto',
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 베이직 리포트 섹션 */}
        <div style={styles.basicReportSection}>
          <h2 style={styles.basicReportTitle}>📋 베이직 리포트</h2>
          <div style={styles.basicReportContent}>
            {result.typeCode && typeof SCAN_TYPE_DETAILS !== 'undefined' && SCAN_TYPE_DETAILS[result.typeCode] && (
              <>
                {/* 성향 요약 */}
                <div style={styles.basicReportCardSummary}>
                  <h3 style={styles.basicReportCardTitle}>
                    <span style={styles.cardIcon}>✨</span>
                    성향 요약
                  </h3>
                  <div style={styles.basicReportCardContent}>
                    <p style={styles.basicReportText}>
                      {SCAN_TYPE_DETAILS[result.typeCode].summary || SCAN_TYPE_DETAILS[result.typeCode].title}
                    </p>
                  </div>
                </div>

                {/* 강점 */}
                <div style={styles.basicReportCardStrength}>
                  <h3 style={styles.basicReportCardTitle}>
                    <span style={styles.cardIcon}>💪</span>
                    강점
                  </h3>
                  <div style={styles.basicReportCardContent}>
                    <p style={styles.basicReportText}>
                      {SCAN_TYPE_DETAILS[result.typeCode].strength}
                    </p>
                  </div>
                </div>

                {/* 약점 */}
                <div style={styles.basicReportCardWeakness}>
                  <h3 style={styles.basicReportCardTitle}>
                    <span style={styles.cardIcon}>🌱</span>
                    약점
                  </h3>
                  <div style={styles.basicReportCardContent}>
                    <p style={styles.basicReportText}>
                      {SCAN_TYPE_DETAILS[result.typeCode].weakness}
                    </p>
                  </div>
                </div>

                {/* 당신을 위한 조언 */}
                <div style={styles.basicReportCardAdvice}>
                  <h3 style={styles.basicReportCardTitle}>
                    <span style={styles.cardIcon}>💡</span>
                    당신을 위한 조언
                  </h3>
                  <div style={styles.basicReportCardContent}>
                    <p style={styles.basicReportText}>
                      {SCAN_TYPE_DETAILS[result.typeCode].advice}
                    </p>
                  </div>
                </div>

                {/* 인간관계 유형 */}
                {SCAN_TYPE_DETAILS[result.typeCode].relationship && (
                  <div style={styles.basicReportCardRelationship}>
                    <h3 style={styles.basicReportCardTitle}>
                      <span style={styles.cardIcon}>💕</span>
                      인간관계 유형
                    </h3>
                    <div style={styles.basicReportCardContent}>
                      <p style={styles.basicReportText}>
                        {SCAN_TYPE_DETAILS[result.typeCode].relationship}
                      </p>
                    </div>
                  </div>
                )}

                {/* 커리어 적합 유형 */}
                {SCAN_TYPE_DETAILS[result.typeCode].career && (
                  <div style={styles.basicReportCardCareer}>
                    <h3 style={styles.basicReportCardTitle}>
                      <span style={styles.cardIcon}>🚀</span>
                      커리어 적합 유형
                    </h3>
                    <div style={styles.basicReportCardContent}>
                      <p style={styles.basicReportText}>
                        {SCAN_TYPE_DETAILS[result.typeCode].career}
                      </p>
                    </div>
                  </div>
                )}

                {/* BEST & WORST 매칭 유형 */}
                {SCAN_TYPE_DETAILS[result.typeCode].matching && (
                  <div style={styles.basicReportCardMatching}>
                    <h3 style={styles.basicReportCardTitle}>
                      <span style={styles.cardIcon}>💫</span>
                      BEST & WORST 매칭 유형
                    </h3>
                    <div style={styles.basicReportCardContent}>
                      <div style={styles.matchingSection}>
                        <h4 style={styles.matchingSubtitle}>💼 직장 매칭</h4>
                        <div style={styles.matchingList}>
                          <div style={styles.matchingCategory}>▷ BEST 매칭</div>
                          <div style={styles.matchingLine}>{renderMatchingLine(SCAN_TYPE_DETAILS[result.typeCode].matching.workplace.best1)}</div>
                          <div style={styles.matchingLine}>{renderMatchingLine(SCAN_TYPE_DETAILS[result.typeCode].matching.workplace.best2)}</div>
                          <div style={styles.matchingCategory}>▷ WORST 매칭</div>
                          <div style={styles.matchingLine}>{renderMatchingLine(SCAN_TYPE_DETAILS[result.typeCode].matching.workplace.worst1)}</div>
                          <div style={styles.matchingLine}>{renderMatchingLine(SCAN_TYPE_DETAILS[result.typeCode].matching.workplace.worst2)}</div>
                        </div>
                      </div>

                      <div style={styles.matchingSection}>
                        <h4 style={styles.matchingSubtitle}>💼 사업 매칭</h4>
                        <div style={styles.matchingList}>
                          <div style={styles.matchingCategory}>▷ BEST 매칭</div>
                          <div style={styles.matchingLine}>{renderMatchingLine(SCAN_TYPE_DETAILS[result.typeCode].matching.business.best1)}</div>
                          <div style={styles.matchingLine}>{renderMatchingLine(SCAN_TYPE_DETAILS[result.typeCode].matching.business.best2)}</div>
                          <div style={styles.matchingCategory}>▷ WORST 매칭</div>
                          <div style={styles.matchingLine}>{renderMatchingLine(SCAN_TYPE_DETAILS[result.typeCode].matching.business.worst1)}</div>
                          <div style={styles.matchingLine}>{renderMatchingLine(SCAN_TYPE_DETAILS[result.typeCode].matching.business.worst2)}</div>
                        </div>
                      </div>

                      <div style={styles.matchingSection}>
                        <h4 style={styles.matchingSubtitle}>💕 연애 매칭</h4>
                        <div style={styles.matchingList}>
                          <div style={styles.matchingCategory}>▷ BEST 매칭</div>
                          <div style={styles.matchingLine}>{renderMatchingLine(SCAN_TYPE_DETAILS[result.typeCode].matching.dating.best1)}</div>
                          <div style={styles.matchingLine}>{renderMatchingLine(SCAN_TYPE_DETAILS[result.typeCode].matching.dating.best2)}</div>
                          <div style={styles.matchingCategory}>▷ WORST 매칭</div>
                          <div style={styles.matchingLine}>{renderMatchingLine(SCAN_TYPE_DETAILS[result.typeCode].matching.dating.worst1)}</div>
                          <div style={styles.matchingLine}>{renderMatchingLine(SCAN_TYPE_DETAILS[result.typeCode].matching.dating.worst2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 프리미엄 리포트 섹션 */}
        <div 
          className="premium-upgrade-section"
          style={styles.premiumUpgradeSection}
        >
          <div style={styles.premiumUpgradeHeader}>
            <h2 style={styles.premiumUpgradeTitle}>
              프리미엄 리포트로 더 깊이 알아보기
            </h2>
            <p style={styles.premiumUpgradeSubtitle}>
              더 상세하고 전문적인 분석 결과를 확인하세요
            </p>
          </div>
          
          <div style={styles.premiumBenefitsGrid}>
            <div className="premium-benefit-card" style={styles.premiumBenefitCard}>
              <div style={styles.premiumBenefitIcon}>📊</div>
              <h3 style={styles.premiumBenefitTitle}>SCAN 5대 성향 축 분석</h3>
              <p style={styles.premiumBenefitDescription}>
                5가지 성향 축에 대한 심층 분석
              </p>
            </div>
            
            <div className="premium-benefit-card" style={styles.premiumBenefitCard}>
              <div style={styles.premiumBenefitIcon}>🎬</div>
              <h3 style={styles.premiumBenefitTitle}>당신의 일상에서 자주 나타나는 장면</h3>
              <p style={styles.premiumBenefitDescription}>
                일상생활에서 반복되는 패턴과 행동 분석
              </p>
            </div>
            
            <div className="premium-benefit-card" style={styles.premiumBenefitCard}>
              <div style={styles.premiumBenefitIcon}>⚡</div>
              <h3 style={styles.premiumBenefitTitle}>이 성향이 잘 쓰일 때 / 힘들어질 때</h3>
              <p style={styles.premiumBenefitDescription}>
                성향의 강점과 약점이 드러나는 상황 분석
              </p>
            </div>
            
            <div className="premium-benefit-card" style={styles.premiumBenefitCard}>
              <div style={styles.premiumBenefitIcon}>💡</div>
              <h3 style={styles.premiumBenefitTitle}>당신을 위한 현실적인 팁</h3>
              <p style={styles.premiumBenefitDescription}>
                Coaching Tip - 실생활에 바로 적용 가능한 조언
              </p>
            </div>
            
            <div className="premium-benefit-card" style={styles.premiumBenefitCard}>
              <div style={styles.premiumBenefitIcon}>✨</div>
              <h3 style={styles.premiumBenefitTitle}>시너지 해석</h3>
              <p style={styles.premiumBenefitDescription}>
                <span style={{ fontWeight: '600' }}>Premium · Deep Dive</span>
                <br />
                관계 시너지, 커리어 시너지, 라이프 시너지
                <br />
                BEST & WORST 매칭 유형별 세부 정보 보기
              </p>
            </div>
          </div>

          <button
            className="premium-upgrade-button"
            style={styles.premiumUpgradeButton}
            onClick={() => setShowPayment(true)}
          >
            상위 {percentile}% 정밀 분석 확인하기
          </button>
        </div>

        {/* 통합 리포트 배너 */}
        <div style={styles.integratedBanner}>
          <div style={styles.bannerContent}>
            <div style={styles.bannerTitle}>🔮 통합 분석 리포트</div>
            <div style={styles.bannerDescription}>
              사주(선천적 성향) 검사 결과와 함께 보면 더 깊은 인사이트를 얻을 수 있어요
            </div>
            <button
              style={styles.bannerButton}
              onClick={() => {
                // localStorage에서 사주 결과 확인
                const sajuResult = localStorage.getItem('saju_result');
                if (sajuResult) {
                  try {
                    const parsed = JSON.parse(sajuResult);
                    navigate('/integrated-report', {
                      state: {
                        sajuResult: parsed.saju,
                        scanResult: result,
                        name: parsed.name || '사용자'
                      }
                    });
                  } catch (e) {
                    alert('사주 검사 결과를 불러올 수 없습니다. 먼저 사주 검사를 완료해주세요.');
                    navigate('/fortune');
                  }
                } else {
                  alert('사주 검사 결과가 없습니다. 먼저 사주 검사를 완료해주세요.');
                  navigate('/fortune');
                }
              }}
            >
              통합 리포트 보기 →
            </button>
          </div>
        </div>

        {/* 다시 시작 버튼 */}
        <button style={styles.resetButton} onClick={onReset}>
          다시 검사하기
        </button>
      </div>

      {/* 결제 팝업 */}
      {showPayment && <PaymentPopup onClose={() => setShowPayment(false)} result={result} />}

    </div>
    );
  } catch (err) {
    console.error('ResultPage: Error rendering component', err);
    const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>결과 페이지를 불러오는 중 오류가 발생했습니다.</h2>
        <p style={{ color: '#d32f2f', marginTop: '10px' }}>{errorMessage}</p>
        <button onClick={onReset} style={{ marginTop: '20px', padding: '10px 20px' }}>
          다시 검사하기
        </button>
      </div>
    );
  }
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#FFF8F5', // 부드러운 크림색 배경
    padding: '12px',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 8px 32px rgba(255, 182, 193, 0.15)',
    border: '1px solid #FFE5F1',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
    paddingBottom: '20px',
    borderBottom: '2px solid #FFE5F1',
    background: 'linear-gradient(135deg, #FFF5F8 0%, #FFE5F1 100%)',
    borderRadius: '16px',
    padding: '20px',
  },
  typeCode: {
    fontSize: '36px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #FFB6C1 0%, #FF9BB3 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '12px',
    letterSpacing: '4px',
    textShadow: '0 2px 8px rgba(255, 182, 193, 0.2)',
  },
  typeNameContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '12px',
  },
  typeName: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#5A4A42',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  badge: {
    display: 'inline-block',
    padding: '8px 20px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#C85A7A',
    backgroundColor: '#FFF5F8',
    borderRadius: '24px',
    border: '2px solid #FFB6C1',
    boxShadow: '0 2px 8px rgba(255, 182, 193, 0.3)',
  },
  greyZoneInfo: {
    marginTop: '24px',
    padding: '20px',
    backgroundColor: '#FFF5F8',
    borderRadius: '16px',
    border: '1px solid #FFE5F1',
    boxShadow: '0 2px 12px rgba(255, 182, 193, 0.2)',
  },
  greyZoneTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#C85A7A',
    margin: '0 0 10px 0',
  },
  greyZoneDescription: {
    fontSize: '13px',
    color: '#8B7355',
    margin: 0,
    lineHeight: '1.6',
    fontWeight: '500',
  },
  scoresSection: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#5A4A42',
    marginBottom: '16px',
    marginTop: '24px',
    letterSpacing: '-0.5px',
    paddingBottom: '12px',
    borderBottom: '2px solid #FFE5F1',
  },
  axisContainer: {
    marginBottom: '4px',
    padding: '20px',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    backgroundColor: '#FFFFFF',
    border: '1px solid #FFE5F1',
    boxShadow: '0 2px 8px rgba(255, 182, 193, 0.1)',
  },
  axisContainerGreyZone: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #FFE5F1',
    boxShadow: '0 2px 8px rgba(255, 182, 193, 0.1)',
  },
  axisHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  axisLabel: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#5A4A42',
    letterSpacing: '-0.3px',
  },
  greyZoneBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#C85A7A',
    backgroundColor: '#FFF5F8',
    borderRadius: '12px',
    border: '1px solid #FFB6C1',
    width: 'fit-content',
    boxShadow: '0 2px 6px rgba(255, 182, 193, 0.3)',
  },
  graphLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  graphLabelLeft: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#5A4A42',
  },
  graphLabelRight: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#5A4A42',
  },
  axisGraphColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  progressBarWrapper: {
    position: 'relative',
    width: '100%',
  },
  progressBarBackground: {
    width: '100%',
    height: '28px',
    backgroundColor: '#F5F5F5',
    borderRadius: '14px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.1)',
  },
  progressBarFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: '100%',
    transition: 'left 0.5s ease, width 0.5s ease, background-color 0.3s ease',
  },
  // 베이직 리포트 섹션
  basicReportSection: {
    marginBottom: '28px',
    padding: '0px',
    backgroundColor: 'transparent',
    borderRadius: '0px',
    border: 'none',
    boxShadow: 'none',
  },
  basicReportTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#5A4A42',
    marginBottom: '16px',
    marginTop: '24px',
    paddingBottom: '12px',
    borderBottom: '2px solid #FFE5F1',
    letterSpacing: '-0.5px',
  },
  basicReportContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginTop: '8px',
  },
  typeTitleCard: {
    padding: '24px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    textAlign: 'center',
  },
  typeTitle: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#007bff',
    margin: 0,
  },
  // 분석 카드 그리드
  analysisGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  // 장점 카드 - 파스텔 그린
  analysisCardStrength: {
    padding: '24px',
    backgroundColor: '#f0f9f4',
    borderRadius: '12px',
    border: '2px solid #a8e6cf',
    boxShadow: '0 2px 8px rgba(168, 230, 207, 0.2)',
  },
  // 단점 카드 - 파스텔 레드
  analysisCardWeakness: {
    padding: '24px',
    backgroundColor: '#fff5f5',
    borderRadius: '12px',
    border: '2px solid #ffb3ba',
    boxShadow: '0 2px 8px rgba(255, 179, 186, 0.2)',
  },
  // 조언 카드 - 파스텔 블루
  analysisCardAdvice: {
    padding: '24px',
    backgroundColor: '#f0f7ff',
    borderRadius: '12px',
    border: '2px solid #b3d9ff',
    boxShadow: '0 2px 8px rgba(179, 217, 255, 0.2)',
  },
  analysisCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  analysisCardIcon: {
    fontSize: '24px',
  },
  analysisCardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  analysisCardText: {
    fontSize: '15px',
    lineHeight: '1.8',
    color: '#555',
    margin: 0,
  },
  basicFeaturesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  basicFeatureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '15px',
    color: '#666',
  },
  basicFeatureIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
  },
  // 새로운 베이직 리포트 카드 스타일 - 부드러운 파스텔 컬러
  basicReportCardSummary: {
    backgroundColor: '#F8E8FF', // 연한 라벤더
    borderRadius: '12px',
    padding: '0px',
    marginBottom: '10px',
    border: '1px solid #E8D5F2',
    boxShadow: '0 2px 8px rgba(248, 232, 255, 0.3)',
  },
  basicReportCardStrength: {
    backgroundColor: '#E8F5E9', // 연한 민트 그린
    borderRadius: '12px',
    padding: '0px',
    marginBottom: '10px',
    border: '1px solid #C8E6C9',
    boxShadow: '0 2px 8px rgba(232, 245, 233, 0.3)',
  },
  basicReportCardWeakness: {
    backgroundColor: '#FFF3E0', // 연한 피치
    borderRadius: '12px',
    padding: '0px',
    marginBottom: '10px',
    border: '1px solid #FFE0B2',
    boxShadow: '0 2px 8px rgba(255, 243, 224, 0.3)',
  },
  basicReportCardAdvice: {
    backgroundColor: '#E3F2FD', // 연한 스카이 블루
    borderRadius: '12px',
    padding: '0px',
    marginBottom: '10px',
    border: '1px solid #BBDEFB',
    boxShadow: '0 2px 8px rgba(227, 242, 253, 0.3)',
  },
  basicReportCardRelationship: {
    backgroundColor: '#FCE4EC', // 연한 로즈 핑크
    borderRadius: '12px',
    padding: '0px',
    marginBottom: '10px',
    border: '1px solid #F8BBD0',
    boxShadow: '0 2px 8px rgba(252, 228, 236, 0.3)',
  },
  basicReportCardCareer: {
    backgroundColor: '#F1F8E9', // 연한 라임
    borderRadius: '12px',
    padding: '0px',
    marginBottom: '10px',
    border: '1px solid #DCEDC8',
    boxShadow: '0 2px 8px rgba(241, 248, 233, 0.3)',
  },
  basicReportCardMatching: {
    backgroundColor: '#FFF9C4', // 연한 옐로우
    borderRadius: '12px',
    padding: '0px',
    marginBottom: '10px',
    border: '1px solid #FFF59D',
    boxShadow: '0 2px 8px rgba(255, 249, 196, 0.3)',
  },
  basicReportCardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    margin: 0,
    marginBottom: '12px',
    color: '#5A5A5A',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 16px 0 16px',
  },
  cardIcon: {
    fontSize: '24px',
  },
  basicReportCardContent: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#4A4A4A',
    padding: '0 16px 16px 16px',
  },
  basicReportText: {
    margin: 0,
    fontSize: '13px',
    whiteSpace: 'pre-line' as const,
    color: '#4A4A4A',
    lineHeight: '1.6',
  },
  matchingSection: {
    marginBottom: '12px',
  },
  matchingSubtitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '10px',
    color: '#5A5A5A',
  },
  matchingList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  matchingCategory: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#C85A7A',
    marginTop: '4px',
    marginBottom: '2px',
  },
  matchingLine: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#4A4A4A',
    paddingLeft: '8px',
    position: 'relative',
    pointerEvents: 'auto',
  },
  // typeCodeLink가 matchingLine 내부에서도 작동하도록
  'matchingLine typeCodeLink': {
    color: '#C85A7A !important',
    fontWeight: '700 !important',
    textDecoration: 'underline !important',
    cursor: 'pointer !important',
    transition: 'color 0.2s',
  },
  // 프리미엄 업그레이드 섹션
  premiumUpgradeSection: {
    marginBottom: '28px',
    padding: '24px',
    background: 'linear-gradient(135deg, #FFB6C1 0%, #FF9BB3 50%, #A8E6CF 100%)',
    borderRadius: '20px',
    border: '2px solid #FFE5F1',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 8px 32px rgba(255, 182, 193, 0.3)',
  },
  premiumUpgradeSectionBefore: {
    content: '""',
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '16px',
    padding: '2px',
    background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
  },
  premiumUpgradeHeader: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  premiumUpgradeTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '6px',
  },
  premiumUpgradeSubtitle: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.9)',
    margin: 0,
  },
  premiumBenefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
    marginBottom: '20px',
  },
  premiumBenefitCard: {
    padding: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '16px',
    textAlign: 'center',
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 4px 16px rgba(255, 182, 193, 0.2)',
    cursor: 'default',
    border: '1px solid rgba(255, 182, 193, 0.3)',
  },
  premiumBenefitIcon: {
    fontSize: '36px',
    marginBottom: '12px',
  },
  premiumBenefitTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#5A4A42',
    marginBottom: '8px',
    letterSpacing: '-0.3px',
  },
  premiumBenefitDescription: {
    fontSize: '13px',
    color: '#8B7355',
    lineHeight: '1.7',
    margin: 0,
    fontWeight: '500',
  },
  premiumUpgradeButton: {
    width: '100%',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '700',
    backgroundColor: '#FFFFFF',
    color: '#C85A7A',
    border: '2px solid #FFB6C1',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 16px rgba(255, 182, 193, 0.3)',
    minHeight: '48px', // 터치 영역 최적화
  },
  resetButton: {
    width: '100%',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '700',
    backgroundColor: '#E8D5C4',
    color: '#5A4A42',
    border: '2px solid #D4C4B0',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 16px rgba(232, 213, 196, 0.3)',
    minHeight: '48px', // 터치 영역 최적화
  },
  integratedBanner: {
    backgroundColor: '#F5F0FF',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
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
};

const paymentPopupStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  },
  popupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '32px',
    color: '#999',
    cursor: 'pointer',
    padding: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  priceBox: {
    textAlign: 'center',
    padding: '24px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  priceLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  price: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#ff6b6b',
  },
  features: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  payButton: {
    padding: '16px 24px',
    fontSize: '18px',
    fontWeight: '600',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  cancelButton: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '500',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  previewButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: '#fff3cd',
    color: '#856404',
    border: '1px solid #ffc107',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    width: '100%',
    marginBottom: '12px',
  },
  previewSection: {
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '16px',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  previewTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 12px 0',
  },
  previewItem: {
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #dee2e6',
  },
  previewItemLast: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottom: 'none',
  },
  previewLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#007bff',
    marginBottom: '8px',
  },
  previewBasic: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '8px',
    padding: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
  },
  previewPremium: {
    fontSize: '13px',
    color: '#333',
    padding: '8px',
    backgroundColor: '#FFF5F8',
    borderRadius: '4px',
    border: '1px solid #FFB6C1',
  },
  noGreyZone: {
    fontSize: '13px',
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '16px',
  },
  highlightFeature: {
    color: '#ff9800',
    fontWeight: '600',
  },
  // 유형 코드 링크 스타일
  typeCodeLink: {
    color: '#C85A7A !important',
    fontWeight: '700 !important',
    textDecoration: 'underline !important',
    cursor: 'pointer !important',
    transition: 'color 0.2s',
    display: 'inline',
    padding: '0 2px',
  },
};
