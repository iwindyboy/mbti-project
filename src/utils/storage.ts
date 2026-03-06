/**
 * AsyncStorage 래퍼
 * React Native와 웹 환경 모두 지원
 */

// React Native AsyncStorage 타입 정의
interface AsyncStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

// 웹 환경용 localStorage 래퍼
class WebStorage implements AsyncStorage {
  async getItem(key: string): Promise<string | null> {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item to localStorage:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
    }
  }

  async clear(): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

// React Native AsyncStorage 가져오기 (있으면 사용, 없으면 웹 스토리지 사용)
let storage: AsyncStorage;

if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
  // React Native WebView 환경
  try {
    // @ts-ignore - React Native AsyncStorage는 동적으로 로드될 수 있음
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    storage = AsyncStorage;
  } catch (error) {
    // AsyncStorage가 없으면 웹 스토리지 사용
    storage = new WebStorage();
  }
} else {
  // 일반 웹 환경
  storage = new WebStorage();
}

export const AsyncStorage = storage;

/**
 * 검사 타입
 */
export type TestType = 'basic' | 'dating' | 'career' | 'persona';

/**
 * 설문 결과 데이터 구조
 */
export interface ScanResultData {
  id: string; // UUID
  userId: string; // 사용자 UUID
  typeCode: string; // 유형 코드 (예: "ISFJA")
  testType: TestType; // 검사 타입 (기본, 연애, 직장, 관계)
  date: string; // ISO 날짜 문자열
  result: any; // 전체 결과 데이터
}

const SCAN_RESULT_KEY = 'SCAN_RESULT';

/**
 * 설문 결과 저장 (최신 1개만 유지)
 */
export const saveScanResult = async (result: any, typeCode: string, testType: TestType = 'basic'): Promise<void> => {
  try {
    // 새 결과 생성
    const { getOrCreateUserId } = require('./uuid');
    const userId = getOrCreateUserId();
    const newResult: ScanResultData = {
      id: `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      typeCode,
      testType,
      date: new Date().toISOString(),
      result,
    };
    
    // 최신 1개만 저장 (기존 결과는 덮어쓰기)
    await AsyncStorage.setItem(SCAN_RESULT_KEY, JSON.stringify([newResult]));
  } catch (error) {
    console.error('Error saving scan result:', error);
    throw error;
  }
};

/**
 * 검사 타입별 결과 가져오기
 */
export const getScanResultsByTestType = async (testType: TestType): Promise<ScanResultData[]> => {
  try {
    const results = await getScanResults();
    return results.filter(r => r.testType === testType);
  } catch (error) {
    console.error('Error getting scan results by test type:', error);
    return [];
  }
};

/**
 * 설문 결과 목록 가져오기
 */
export const getScanResults = async (): Promise<ScanResultData[]> => {
  try {
    const data = await AsyncStorage.getItem(SCAN_RESULT_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data) as ScanResultData[];
  } catch (error) {
    console.error('Error getting scan results:', error);
    return [];
  }
};

/**
 * 특정 결과 가져오기
 */
export const getScanResult = async (id: string): Promise<ScanResultData | null> => {
  try {
    const results = await getScanResults();
    return results.find(r => r.id === id) || null;
  } catch (error) {
    console.error('Error getting scan result:', error);
    return null;
  }
};

/**
 * 결과 삭제
 */
export const deleteScanResult = async (id: string): Promise<void> => {
  try {
    const results = await getScanResults();
    const filteredResults = results.filter(r => r.id !== id);
    await AsyncStorage.setItem(SCAN_RESULT_KEY, JSON.stringify(filteredResults));
  } catch (error) {
    console.error('Error deleting scan result:', error);
    throw error;
  }
};

/**
 * 저장된 결과가 있는지 확인
 */
export const hasScanResults = async (): Promise<boolean> => {
  try {
    const results = await getScanResults();
    return results.length > 0;
  } catch (error) {
    console.error('Error checking scan results:', error);
    return false;
  }
};

// ══════════════════════════════════════════════════════════════
//  통합 분석 결과 저장
// ══════════════════════════════════════════════════════════════

export interface IntegratedResultData {
  id: string;
  userId: string;
  sajuResultId?: string; // 사주 결과 ID (참조용)
  scanResultId?: string; // 32 Spectrum 결과 ID (참조용)
  sajuData: any; // 사주 데이터 (직접 저장)
  scanData: any; // 32 Spectrum 데이터 (직접 저장)
  analysis: {
    gap: any;
    strength: any;
    coaching: any;
    [key: string]: any;
  };
  createdAt: string;
}

const INTEGRATED_RESULT_KEY = 'INTEGRATED_RESULT';

/**
 * 통합 분석 결과 저장 (최신 1개만 유지)
 */
export const saveIntegratedResult = async (
  sajuData: any,
  scanData: any,
  analysis: any
): Promise<void> => {
  try {
    const { getOrCreateUserId } = require('./uuid');
    const userId = getOrCreateUserId();
    
    const newResult: IntegratedResultData = {
      id: `integrated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      sajuData,
      scanData,
      analysis,
      createdAt: new Date().toISOString(),
    };
    
    // 최신 1개만 저장 (기존 결과는 덮어쓰기)
    await AsyncStorage.setItem(INTEGRATED_RESULT_KEY, JSON.stringify([newResult]));
  } catch (error) {
    console.error('Error saving integrated result:', error);
    throw error;
  }
};

/**
 * 통합 분석 결과 가져오기 (최신 1개)
 */
export const getIntegratedResult = async (): Promise<IntegratedResultData | null> => {
  try {
    const data = await AsyncStorage.getItem(INTEGRATED_RESULT_KEY);
    if (!data) {
      return null;
    }
    const results = JSON.parse(data) as IntegratedResultData[];
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Error getting integrated result:', error);
    return null;
  }
};

/**
 * 최신 32 Spectrum 결과 가져오기
 */
export const getLatestScanResult = async (): Promise<ScanResultData | null> => {
  try {
    const results = await getScanResults();
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Error getting latest scan result:', error);
    return null;
  }
};
