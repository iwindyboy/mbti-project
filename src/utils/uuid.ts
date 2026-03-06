import { v4 as uuidv4 } from 'uuid';

const USER_ID_KEY = 'SCAN_USER_ID';

/**
 * 사용자 고유 ID를 가져오거나 생성
 * 로컬 스토리지에 저장되어 있으면 반환, 없으면 새로 생성
 */
export const getOrCreateUserId = (): string => {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 임시 ID 반환
    return 'temp-' + Date.now();
  }

  try {
    // 로컬 스토리지에서 기존 ID 확인
    const existingId = localStorage.getItem(USER_ID_KEY);
    if (existingId) {
      return existingId;
    }

    // 새 UUID 생성 및 저장
    const newId = uuidv4();
    localStorage.setItem(USER_ID_KEY, newId);
    return newId;
  } catch (error) {
    console.error('Error getting/creating user ID:', error);
    // 에러 발생 시 임시 ID 반환
    return 'temp-' + Date.now();
  }
};

/**
 * 사용자 ID 가져오기 (생성하지 않음)
 */
export const getUserId = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return localStorage.getItem(USER_ID_KEY);
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};
