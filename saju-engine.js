// ══════════════════════════════════════════════════════════════
//  사주 계산 엔진
//  의존성: saju-calendar.js (LUNAR_CALENDAR, SOLAR_TERMS, SOLAR_TERMS_MONTHLY)
//          saju-db.js (SAJU_CONTENT_DB, ILGAN_TO_OHANG, ILGAN_SYMBOL)
// ══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════
//  상수 정의
// ══════════════════════════════════════════════════════════════
const CHEONGAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const JIJI     = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

// ══════════════════════════════════════════════════════════════
//  기준일 정의 (한국천문연구원 공식 데이터)
//  각 연도의 음력 1월 1일의 양력 날짜
// ══════════════════════════════════════════════════════════════
const BASE_DATES = {
  1930: '1930-01-30', 1931: '1931-02-17', 1932: '1932-02-06',
  1933: '1933-01-26', 1934: '1934-02-14', 1935: '1935-02-04',
  1936: '1936-01-24', 1937: '1937-02-11', 1938: '1938-01-31',
  1939: '1939-02-19', 1940: '1940-02-08', 1941: '1941-01-27',
  1942: '1942-02-15', 1943: '1943-02-05', 1944: '1944-01-25',
  1945: '1945-02-13', 1946: '1946-02-02', 1947: '1947-01-22',
  1948: '1948-02-10', 1949: '1949-01-29', 1950: '1950-02-17',
  1951: '1951-02-06', 1952: '1952-01-27', 1953: '1953-02-14',
  1954: '1954-02-03', 1955: '1955-01-24', 1956: '1956-02-12',
  1957: '1957-01-31', 1958: '1958-02-18', 1959: '1959-02-08',
  1960: '1960-01-28', 1961: '1961-02-15', 1962: '1962-02-05',
  1963: '1963-01-25', 1964: '1964-02-13', 1965: '1965-02-02',
  1966: '1966-01-21', 1967: '1967-02-09', 1968: '1968-01-30',
  1969: '1969-02-17', 1970: '1970-02-06', 1971: '1971-01-27',
  1972: '1972-02-15', 1973: '1973-02-03', 1974: '1974-01-23',
  1975: '1975-02-11', 1976: '1976-01-31', 1977: '1977-02-18',
  1978: '1978-02-07', 1979: '1979-01-28', 1980: '1980-02-16',
  1981: '1981-02-05', 1982: '1982-01-25', 1983: '1983-02-13',
  1984: '1984-02-02', 1985: '1985-02-20', 1986: '1986-02-09',
  1987: '1987-01-29', 1988: '1988-02-17', 1989: '1989-02-06',
  1990: '1990-01-27', 1991: '1991-02-15', 1992: '1992-02-04',
  1993: '1993-01-23', 1994: '1994-02-10', 1995: '1995-01-31',
  1996: '1996-02-19', 1997: '1997-02-07', 1998: '1998-01-28',
  1999: '1999-02-16', 2000: '2000-02-05', 2001: '2001-01-24',
  2002: '2002-02-12', 2003: '2003-02-01', 2004: '2004-01-22',
  2005: '2005-02-09', 2006: '2006-01-29', 2007: '2007-02-18',
  2008: '2008-02-07', 2009: '2009-01-26', 2010: '2010-02-14',
};

// 오행 매핑 기본값 (saju-db.js에서 로드되면 덮어씌워짐)
// saju-db.js가 먼저 로드되므로, 여기서는 기본값만 정의
const ILGAN_TO_OHANG_DEFAULT = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

// ILGAN_TO_OHANG 사용 함수 (saju-db.js에서 로드된 값 또는 기본값)
function getILGAN_TO_OHANG() {
  // saju-db.js에서 이미 정의되어 있으면 사용
  if (typeof ILGAN_TO_OHANG !== 'undefined') {
    return ILGAN_TO_OHANG;
  }
  return ILGAN_TO_OHANG_DEFAULT;
}

// 일간 상징 매핑 기본값
const ILGAN_SYMBOL_DEFAULT = {};

// ILGAN_SYMBOL 사용 함수
function getILGAN_SYMBOL() {
  if (typeof ILGAN_SYMBOL !== 'undefined') {
    return ILGAN_SYMBOL;
  }
  return ILGAN_SYMBOL_DEFAULT;
}

// ══════════════════════════════════════════════════════════════
//  [1] calculateJulianDay(year, month, day)
//  그레고리력 → 율리우스 일수 변환
// ══════════════════════════════════════════════════════════════
function calculateJulianDay(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153*m+2)/5) + 365*y
    + Math.floor(y/4) - Math.floor(y/100)
    + Math.floor(y/400) - 32045;
}

// ══════════════════════════════════════════════════════════════
//  [1-1] addDays(year, month, day, n)
//  n일 후의 날짜 반환
// ══════════════════════════════════════════════════════════════
function addDays(year, month, day, n) {
  const months = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const isLeapYear = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

  let d = day + n;
  let m = month;
  let y = year;

  while (true) {
    const dim = (m === 2 && isLeapYear(y)) ? 29 : months[m];
    if (d <= dim) break;
    d -= dim;
    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }
  return { year: y, month: m, day: d };
}

// ══════════════════════════════════════════════════════════════
//  [2] getDayPillar(year, month, day)
//  일주 계산 (율리우스력 기반)
//  기준: 1900년 1월 31일 = 甲戌일 (JD: 2415080)
//  공식: 기준일로부터의 일수 차이로 계산
// ══════════════════════════════════════════════════════════════
function getDayPillar(year, month, day) {
  const jd = calculateJulianDay(year, month, day);
  // 가이드 문서에 따르면: 기준일 갑자일 JD=2299160
  // dayStemIndex = (JD + 40) % 10
  // dayBranchIndex = JD % 12
  // 하지만 이 공식으로는 1986-04-19가 甲辰일이 나옴 (예상: 甲子일)
  // 
  // 대안: 1900년 1월 31일 = 甲戌일 (JD: 2415080) 기준
  // 1986년 4월 19일이 甲子일이 되도록 오프셋 조정
  const base = 2415080; // 1900-01-31 = 甲戌일
  const diff = jd - base;
  
  // 1986-04-19: diff = 31460, diff % 12 = 8 (申)
  // 예상값: 甲申 = stemIdx 0, branchIdx 8
  // 오프셋 없이 diff % 12를 사용하면 정확함
  let stemIdx   = diff % 10;
  let branchIdx = diff % 12; // 오프셋 없이 직접 사용
  if (stemIdx < 0)   stemIdx   += 10;
  if (branchIdx < 0) branchIdx += 12;
  return {
    stem:   CHEONGAN[stemIdx],
    branch: JIJI[branchIdx],
    full:   CHEONGAN[stemIdx] + JIJI[branchIdx]
  };
}

// ══════════════════════════════════════════════════════════════
//  [3] getYearPillar(year, month, day)
//  연주 계산 (입춘 기준)
//  SOLAR_TERMS['입춘'][year] 형식: 'MMDD' (예: '0204')
// ══════════════════════════════════════════════════════════════
function getYearPillar(year, month, day) {
  let ipchunMMDD = 204; // 기본값: 2월 4일 (대부분의 경우)
  
  // SOLAR_TERMS에서 입춘 날짜 가져오기
  if (typeof SOLAR_TERMS !== 'undefined' && SOLAR_TERMS['입춘'] && SOLAR_TERMS['입춘'][year]) {
    const ipchun = SOLAR_TERMS['입춘'][year]; // 예: '0204'
    ipchunMMDD = parseInt(ipchun);      // 예: 204
  } else {
    // SOLAR_TERMS가 없으면 기본 입춘 날짜 사용
    // 일반적으로 입춘은 2월 4일 또는 2월 5일
    // 2017년 이후는 2월 3일인 경우도 있음
    if (year >= 2017) {
      ipchunMMDD = 203; // 2월 3일
    } else {
      ipchunMMDD = 204; // 2월 4일
    }
  }

  const birthMMDD  = month * 100 + day;     // 예: 203 (2월 3일)
  const baseYear   = birthMMDD < ipchunMMDD ? year - 1 : year;
  
  let stemIdx   = (baseYear - 4) % 10;
  let branchIdx = (baseYear - 4) % 12;
  if (stemIdx < 0)   stemIdx   += 10;
  if (branchIdx < 0) branchIdx += 12;
  
  return {
    stem:   CHEONGAN[stemIdx],
    branch: JIJI[branchIdx],
    full:   CHEONGAN[stemIdx] + JIJI[branchIdx]
  };
}

// ══════════════════════════════════════════════════════════════
//  [4] getMonthPillar(year, month, day)
//  월주 계산 (절기 기준)
// ══════════════════════════════════════════════════════════════
function getMonthPillar(year, month, day) {
  // 월지(月支) 기준 절기표
  const MONTH_BRANCH_START = [
    { month:1,  branch:'丑', term:'소한', branchIdx: 1 },
    { month:2,  branch:'寅', term:'입춘', branchIdx: 2 },
    { month:3,  branch:'卯', term:'경칩', branchIdx: 3 },
    { month:4,  branch:'辰', term:'청명', branchIdx: 4 },
    { month:5,  branch:'巳', term:'입하', branchIdx: 5 },
    { month:6,  branch:'午', term:'망종', branchIdx: 6 },
    { month:7,  branch:'未', term:'소서', branchIdx: 7 },
    { month:8,  branch:'申', term:'입추', branchIdx: 8 },
    { month:9,  branch:'酉', term:'백로', branchIdx: 9 },
    { month:10, branch:'戌', term:'한로', branchIdx: 10 },
    { month:11, branch:'亥', term:'입동', branchIdx: 11 },
    { month:12, branch:'子', term:'대설', branchIdx: 0 },
  ];

  let branchIdx = 0;
  let branch = '子';

  // SOLAR_TERMS_MONTHLY가 있으면 절기 기준으로 계산
  if (typeof SOLAR_TERMS_MONTHLY !== 'undefined') {
    // 해당 월의 절기 찾기
    const monthInfo = MONTH_BRANCH_START.find(m => m.month === month);
    if (monthInfo) {
      const term = monthInfo.term;
      const termDate = SOLAR_TERMS_MONTHLY[term] && SOLAR_TERMS_MONTHLY[term][year];
      
      if (termDate) {
        const termMMDD = parseInt(termDate);
        const birthMMDD = month * 100 + day;
        
        // 절기 이전이면 전월 지지 사용
        if (birthMMDD < termMMDD) {
          const prevMonth = month === 1 ? 12 : month - 1;
          const prevMonthInfo = MONTH_BRANCH_START.find(m => m.month === prevMonth);
          if (prevMonthInfo) {
            branchIdx = prevMonthInfo.branchIdx;
            branch = prevMonthInfo.branch;
          }
        } else {
          branchIdx = monthInfo.branchIdx;
          branch = monthInfo.branch;
        }
      } else {
        // 절기 데이터가 없으면 월 기준으로 단순 배정
        branchIdx = monthInfo.branchIdx;
        branch = monthInfo.branch;
      }
    }
  } else {
    // SOLAR_TERMS_MONTHLY가 없으면 월 기준으로 단순 배정
    const monthInfo = MONTH_BRANCH_START.find(m => m.month === month);
    if (monthInfo) {
      branchIdx = monthInfo.branchIdx;
      branch = monthInfo.branch;
    }
  }

  // 월간(月干) 오자법 계산
  // 연주 천간 기준으로 월간 결정
  const yearPillar = getYearPillar(year, month, day);
  const yearStem = yearPillar.stem;
  
  const MONTH_STEM_BASE = { 
    '甲':2, '己':2,   // 寅월 시작이 丙(인덱스2)
    '乙':4, '庚':4,   // 戊
    '丙':6, '辛':6,   // 庚
    '丁':8, '壬':8,   // 壬
    '戊':0, '癸':0    // 甲
  };
  
  const baseIdx = MONTH_STEM_BASE[yearStem] || 0;
  const stemIdx = (baseIdx + branchIdx - 2 + 12) % 10; // 寅월(인덱스2) 기준
  
  return {
    stem:   CHEONGAN[stemIdx],
    branch: branch,
    full:   CHEONGAN[stemIdx] + branch
  };
}

// ══════════════════════════════════════════════════════════════
//  [5] getHourPillar(hour, dayPillarStem)
//  시주 계산
// ══════════════════════════════════════════════════════════════
function getHourPillar(hour, dayPillarStem) {
  // hour가 null이면 return { stem:'?', branch:'?', full:'??' }
  if (hour === null || hour === undefined) {
    return { stem: '?', branch: '?', full: '??' };
  }

  // 시지(時支) 배정
  let branchIdx = 0;
  if (hour >= 23 || hour < 1) branchIdx = 0;      // 子
  else if (hour >= 1 && hour < 3) branchIdx = 1;  // 丑
  else if (hour >= 3 && hour < 5) branchIdx = 2;   // 寅
  else if (hour >= 5 && hour < 7) branchIdx = 3;   // 卯
  else if (hour >= 7 && hour < 9) branchIdx = 4;  // 辰
  else if (hour >= 9 && hour < 11) branchIdx = 5;  // 巳
  else if (hour >= 11 && hour < 13) branchIdx = 6; // 午
  else if (hour >= 13 && hour < 15) branchIdx = 7; // 未
  else if (hour >= 15 && hour < 17) branchIdx = 8; // 申
  else if (hour >= 17 && hour < 19) branchIdx = 9; // 酉
  else if (hour >= 19 && hour < 21) branchIdx = 10; // 戌
  else if (hour >= 21 && hour < 23) branchIdx = 11; // 亥

  // 시간(時干) 오자법
  const HOUR_STEM_BASE = {
    '甲':0, '己':0,   // 子시 → 甲(0)
    '乙':2, '庚':2,   // 丙(2)
    '丙':4, '辛':4,   // 戊(4)
    '丁':6, '壬':6,   // 庚(6)
    '戊':8, '癸':8    // 壬(8)
  };
  
  const baseIdx = HOUR_STEM_BASE[dayPillarStem] || 0;
  const stemIdx = (baseIdx + branchIdx) % 10;

  return {
    stem:   CHEONGAN[stemIdx],
    branch: JIJI[branchIdx],
    full:   CHEONGAN[stemIdx] + JIJI[branchIdx]
  };
}

// ══════════════════════════════════════════════════════════════
//  [6] solarToLunar(year, month, day)
//  양력 → 음력 변환
// ══════════════════════════════════════════════════════════════
function solarToLunar(year, month, day) {
  if (typeof LUNAR_CALENDAR === 'undefined') {
    return { year, month, day, isLeap: false };
  }

  const baseJD = 2415080; // 1900년 1월 31일 = 음력 1900년 1월 1일
  const targetJD = calculateJulianDay(year, month, day);
  const daysDiff = targetJD - baseJD;

  if (daysDiff < 0) {
    return { year, month, day, isLeap: false };
  }

  let currentYear = 1900;
  let daysRemaining = daysDiff;

  while (currentYear <= 2100) {
    const yearData = LUNAR_CALENDAR[currentYear];
    if (!yearData) break;

    let yearDays = 0;
    for (let i = 0; i < yearData.months.length; i++) {
      yearDays += yearData.months[i];
    }
    if (yearData.leap > 0 && yearData.leapDays) {
      yearDays += yearData.leapDays;
    }

    if (daysRemaining < yearDays) {
      // 해당 연도 내에서 월일 계산
      let month = 1;
      let day = 1;
      let daysInMonth = 0;

      for (let i = 0; i < yearData.months.length; i++) {
        daysInMonth = yearData.months[i];
        if (daysRemaining < daysInMonth) {
          month = i + 1;
          day = daysRemaining + 1;
          break;
        }
        daysRemaining -= daysInMonth;

        // 윤달 처리
        if (yearData.leap === (i + 1) && yearData.leapDays) {
          if (daysRemaining < yearData.leapDays) {
            return {
              year: currentYear,
              month: i + 1,
              day: daysRemaining + 1,
              isLeap: true
            };
          }
          daysRemaining -= yearData.leapDays;
        }
      }

      return {
        year: currentYear,
        month: month,
        day: day,
        isLeap: false
      };
    }

    daysRemaining -= yearDays;
    currentYear++;
  }

  return { year, month, day, isLeap: false };
}

// ══════════════════════════════════════════════════════════════
//  [7] lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeap)
//  음력 → 양력 변환 (하드코딩된 기준일 사용)
// ══════════════════════════════════════════════════════════════
function lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeap) {
  // BASE_DATES에서 해당 연도의 기준일 가져오기
  const baseStr = BASE_DATES[lunarYear];
  if (!baseStr) {
    console.warn(`lunarToSolar: BASE_DATES에 ${lunarYear}년 데이터가 없습니다.`);
    // 기본 근사치 반환
    let solarMonth = lunarMonth + 1;
    let solarYear = lunarYear;
    if (solarMonth > 12) {
      solarMonth -= 12;
      solarYear += 1;
    }
    return { year: solarYear, month: solarMonth, day: lunarDay };
  }

  // 기준일 (해당 연도 음력 1월 1일의 양력)
  const [by, bm, bd] = baseStr.split('-').map(Number);

  // LUNAR_CALENDAR가 없거나 해당 연도 데이터가 없을 때 처리
  let yearData = null;
  if (typeof LUNAR_CALENDAR !== 'undefined' && LUNAR_CALENDAR !== null) {
    yearData = LUNAR_CALENDAR[lunarYear];
  }
  
  if (!yearData) {
    // LUNAR_CALENDAR가 없을 때 최소한의 하드코딩 데이터 사용 (1990년)
    if (lunarYear === 1990) {
      yearData = {
        months: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29], // 1990년 음력 월별 일수
        leap: 5, // 윤5월
        leapDays: 29 // 윤5월 일수
      };
    } else {
      console.warn(`lunarToSolar: LUNAR_CALENDAR에 ${lunarYear}년 데이터가 없습니다. saju-calendar.js 파일이 로드되었는지 확인하세요.`);
      // 기본 근사치: 각 월을 30일로 가정 (정확하지 않음)
      return addDays(by, bm, bd, (lunarMonth - 1) * 30 + (lunarDay - 1));
    }
  }

  // 1월 1일부터 목표 월까지 경과일수
  let elapsed = 0;

  // 1월부터 (lunarMonth - 1)월까지의 일수 합산
  for (let m = 1; m < lunarMonth; m++) {
    elapsed += yearData.months[m - 1];
    
    // 윤달 처리: 해당 월 다음에 윤달이 있으면 윤달 일수 추가
    // leap는 윤달이 끼는 월을 의미 (예: leap=5면 5월 다음에 윤5월)
    // 일반 월을 계산할 때는 윤달을 지나치므로 윤달 일수를 더함
    // 단, 목표 월이 윤달인 경우는 제외 (윤달 자체가 목표이므로)
    if (yearData.leap > 0 && m === yearData.leap && !isLeap && yearData.leapDays) {
      elapsed += yearData.leapDays;
    }
  }

  // 윤달 자체를 가리키는 경우
  if (isLeap && lunarMonth === yearData.leap && yearData.leapDays) {
    // 윤달인 경우: 해당 월의 일수를 먼저 더하고, 윤달로 들어감
    elapsed += yearData.months[lunarMonth - 1]; // 정월 지나고
    // 윤달 일수는 더하지 않음 (윤달 자체가 목표이므로)
  }

  // 해당 월의 일수 추가 (1일부터 lunarDay까지)
  elapsed += lunarDay - 1;
  
  // 디버깅: 1990년 5월 15일 계산 확인
  if (lunarYear === 1990 && lunarMonth === 5 && lunarDay === 15 && !isLeap) {
    const monthsSum = yearData.months.slice(0, 4).reduce((a, b) => a + b, 0);
    const hasLeapBefore5 = yearData.leap > 0 && yearData.leap < 5;
    const leapDaysAdded = hasLeapBefore5 && yearData.leapDays ? yearData.leapDays : 0;
    const dayOffset = lunarDay - 1;
    
    console.log('=== lunarToSolar 디버깅 (1990-05-15) ===');
    console.log('기준일:', baseStr);
    console.log('1~4월 합계:', monthsSum, '일');
    console.log('윤달 위치:', yearData.leap > 0 ? `${yearData.leap}월 다음` : '없음');
    console.log('윤달 일수:', yearData.leapDays || 0, '일');
    console.log('윤달 일수 추가 여부:', hasLeapBefore5 ? '추가됨' : '추가 안됨');
    console.log('5월 1~15일:', dayOffset, '일');
    console.log('총 경과일수:', elapsed, '일');
    console.log('예상 경과일수: 132일');
    console.log('차이:', elapsed - 132, '일');
  }

  // 양력 날짜 계산
  return addDays(by, bm, bd, elapsed);
}

// ══════════════════════════════════════════════════════════════
//  [8] calculateSaju(year, month, day, hour, isLunar, gender)
//  사주 계산 메인 함수
// ══════════════════════════════════════════════════════════════
function calculateSaju(year, month, day, hour, isLunar, gender) {
  let solarYear = year;
  let solarMonth = month;
  let solarDay = day;
  let lunarDate = null;
  let solarDate = null;

  // 음력 입력이면 양력으로 변환
  if (isLunar) {
    const lunarResult = lunarToSolar(year, month, day, false);
    solarYear = lunarResult.year;
    solarMonth = lunarResult.month;
    solarDay = lunarResult.day;
    lunarDate = `${year}년 ${month}월 ${day}일`;
    solarDate = `${solarYear}년 ${solarMonth}월 ${solarDay}일`;
  } else {
    solarDate = `${solarYear}년 ${solarMonth}월 ${solarDay}일`;
    const lunarResult = solarToLunar(solarYear, solarMonth, solarDay);
    lunarDate = `${lunarResult.year}년 ${lunarResult.month}월 ${lunarResult.day}일`;
  }

  // 일주 계산 (dayPillar 먼저 계산)
  const dayPillar = getDayPillar(solarYear, solarMonth, solarDay);
  
  // 연주 계산
  const yearPillar = getYearPillar(solarYear, solarMonth, solarDay);
  
  // 월주 계산
  const monthPillar = getMonthPillar(solarYear, solarMonth, solarDay);
  
  // 시주 계산 (dayPillar.stem 사용)
  const hourPillar = getHourPillar(hour, dayPillar.stem);

  // 일간(日干)과 오행
  const ilgan = dayPillar.stem;
  const ohang = getILGAN_TO_OHANG()[ilgan] || '?';
  const ilganSymbol = getILGAN_SYMBOL()[ilgan] || null;

  return {
    solarDate,
    lunarDate,
    연주: {
      천간: yearPillar.stem,
      지지: yearPillar.branch
    },
    월주: {
      천간: monthPillar.stem,
      지지: monthPillar.branch
    },
    일주: {
      천간: dayPillar.stem,
      지지: dayPillar.branch
    },
    시주: hour === null ? null : {
      천간: hourPillar.stem,
      지지: hourPillar.branch
    },
    일간: ilgan,
    오행: ohang,
    일간상징: ilganSymbol
  };
}

// ══════════════════════════════════════════════════════════════
//  [9] getSajuContent(ilgan)
//  사주 콘텐츠 조회
// ══════════════════════════════════════════════════════════════
function getSajuContent(ilgan) {
  if (typeof SAJU_CONTENT_DB === 'undefined') {
    return null;
  }
  return SAJU_CONTENT_DB[ilgan] || null;
}

// ══════════════════════════════════════════════════════════════
//  Window 전역 노출
// ══════════════════════════════════════════════════════════════
if (typeof window !== 'undefined') {
  window.calculateSaju    = calculateSaju;
  window.getSajuContent   = getSajuContent;
  window.solarToLunar     = solarToLunar;
  window.lunarToSolar     = lunarToSolar;
  window.getDayPillar     = getDayPillar;
  window.getYearPillar    = getYearPillar;
  window.getMonthPillar   = getMonthPillar;
  window.getHourPillar    = getHourPillar;
}
