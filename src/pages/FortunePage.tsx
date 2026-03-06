import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SajuInput } from '../utils/sajuEngine';

export const FortunePage: React.FC = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState<string>('');
  const [isLunar, setIsLunar] = useState<'solar' | 'lunar' | 'leap'>('solar');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !year || !month || !day || !gender) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    const input: SajuInput = {
      name,
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: hour ? parseInt(hour) : null,
      isLunar: isLunar !== 'solar',
      gender: gender as 'male' | 'female',
    };

    // 결과 페이지로 이동 (state로 데이터 전달)
    navigate('/fortune-result', { state: { input } });
  };

  // 연도 옵션 생성 (1930~2050)
  const years = Array.from({ length: 121 }, (_, i) => 1930 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // 모바일 반응형 스타일 주입
  useEffect(() => {
    const mobileStyles = `
      @media (max-width: 768px) {
        .fortune-container {
          padding: 12px !important;
          padding-bottom: 30px !important;
        }
        .fortune-header {
          margin-bottom: 12px !important;
        }
        .fortune-title-section {
          margin-bottom: 18px !important;
        }
        .fortune-moon-icon {
          font-size: 40px !important;
          margin-bottom: 6px !important;
        }
        .fortune-title {
          font-size: 20px !important;
          margin-bottom: 4px !important;
        }
        .fortune-subtitle {
          font-size: 13px !important;
        }
        .fortune-form {
          gap: 14px !important;
        }
        .fortune-input-group {
          gap: 6px !important;
        }
        .fortune-label {
          font-size: 13px !important;
        }
        .fortune-input,
        .fortune-select {
          padding: 10px 12px !important;
          font-size: 14px !important;
        }
        .fortune-button {
          padding: 10px 12px !important;
          font-size: 13px !important;
        }
        .fortune-submit-button {
          padding: 14px 18px !important;
          font-size: 15px !important;
          margin-top: 6px !important;
        }
      }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = mobileStyles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div style={styles.container} className="fortune-container">
      <div style={styles.content}>
        {/* 헤더 */}
        <div style={styles.header} className="fortune-header">
          <button 
            style={styles.backButton}
            onClick={() => navigate('/landing')}
          >
            ← 뒤로 가기
          </button>
        </div>

        {/* 타이틀 */}
        <div style={styles.titleSection} className="fortune-title-section">
          <div style={styles.moonIcon} className="fortune-moon-icon">🌙</div>
          <h1 style={styles.title} className="fortune-title">선천적 성향 검사 (사주)</h1>
          <p style={styles.subtitle} className="fortune-subtitle">타고난 본성과 운세를 확인하세요</p>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} style={styles.form} className="fortune-form">
          {/* 이름 */}
          <div style={styles.inputGroup} className="fortune-input-group">
            <label style={styles.label} className="fortune-label">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              style={styles.input}
              className="fortune-input"
            />
          </div>

          {/* 생년월일 */}
          <div style={styles.inputGroup} className="fortune-input-group">
            <label style={styles.label} className="fortune-label">생년월일</label>
            <div style={styles.dateRow}>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                style={styles.select}
                className="fortune-select"
              >
                <option value="">연도</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}년
                  </option>
                ))}
              </select>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                style={styles.select}
                className="fortune-select"
              >
                <option value="">월</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}월
                  </option>
                ))}
              </select>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                style={styles.select}
                className="fortune-select"
              >
                <option value="">일</option>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}일
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 태어난 시간 */}
          <div style={styles.inputGroup} className="fortune-input-group">
            <label style={styles.label} className="fortune-label">태어난 시간</label>
            <select
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              style={styles.select}
              className="fortune-select"
            >
              <option value="">모름</option>
              {hours.map((h) => (
                <option key={h} value={h}>
                  {h}시~{h + 1}시
                </option>
              ))}
            </select>
          </div>

          {/* 양력/음력 선택 */}
          <div style={styles.inputGroup} className="fortune-input-group">
            <label style={styles.label} className="fortune-label">달력</label>
            <div style={styles.buttonRow}>
              <button
                type="button"
                onClick={() => setIsLunar('solar')}
                style={{
                  ...styles.calendarButton,
                  ...(isLunar === 'solar' ? styles.calendarButtonActive : {}),
                }}
                className="fortune-button"
              >
                양력
              </button>
              <button
                type="button"
                onClick={() => setIsLunar('lunar')}
                style={{
                  ...styles.calendarButton,
                  ...(isLunar === 'lunar' ? styles.calendarButtonActive : {}),
                }}
                className="fortune-button"
              >
                음력
              </button>
              <button
                type="button"
                onClick={() => setIsLunar('leap')}
                style={{
                  ...styles.calendarButton,
                  ...(isLunar === 'leap' ? styles.calendarButtonActive : {}),
                }}
                className="fortune-button"
              >
                음력윤달
              </button>
            </div>
          </div>

          {/* 성별 선택 */}
          <div style={styles.inputGroup} className="fortune-input-group">
            <label style={styles.label} className="fortune-label">성별</label>
            <div style={styles.buttonRow}>
              <button
                type="button"
                onClick={() => setGender('male')}
                style={{
                  ...styles.genderButton,
                  ...(gender === 'male' ? styles.genderButtonActive : {}),
                }}
                className="fortune-button"
              >
                남자
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                style={{
                  ...styles.genderButton,
                  ...(gender === 'female' ? styles.genderButtonActive : {}),
                }}
                className="fortune-button"
              >
                여자
              </button>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button type="submit" style={styles.submitButton} className="fortune-submit-button">
            <span style={styles.starIcon}>✦</span>
            사주 분석하기
          </button>
        </form>
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
    maxWidth: '500px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '16px',
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
    marginBottom: '24px',
  },
  moonIcon: {
    fontSize: '50px',
    marginBottom: '8px',
  },
  title: {
    fontSize: '24px',
    fontFamily: '"Nanum Myeongjo", "나눔명조", "Noto Serif KR", "Batang", "Gungsuh", serif',
    color: '#C85A7A',
    fontWeight: '700',
    marginBottom: '6px',
    letterSpacing: '1px',
  },
  subtitle: {
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#8B7355',
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontWeight: '600',
    color: '#5A4A42',
  },
  input: {
    padding: '12px 14px',
    fontSize: '15px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#5A4A42',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(200, 90, 122, 0.2)',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  dateRow: {
    display: 'flex',
    gap: '10px',
  },
  select: {
    flex: 1,
    padding: '12px 14px',
    fontSize: '15px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    color: '#5A4A42',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(200, 90, 122, 0.2)',
    borderRadius: '12px',
    outline: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
  },
  calendarButton: {
    flex: 1,
    padding: '12px 14px',
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
  calendarButtonActive: {
    backgroundColor: '#C85A7A',
    color: '#FFFFFF',
    border: '1px solid #C85A7A',
  },
  genderButton: {
    flex: 1,
    padding: '12px 14px',
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
  genderButtonActive: {
    backgroundColor: '#C85A7A',
    color: '#FFFFFF',
    border: '1px solid #C85A7A',
  },
  submitButton: {
    marginTop: '8px',
    padding: '16px 20px',
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#C85A7A',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 16px rgba(200, 90, 122, 0.3)',
  },
  starIcon: {
    fontSize: '16px',
    color: '#FFFFFF',
  },
};
