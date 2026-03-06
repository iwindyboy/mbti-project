/**
 * Supabase 데이터베이스 타입 정의
 */

// ============================================
// 테이블 타입 정의
// ============================================

export interface UserSession {
  id: string; // UUID
  session_id: string; // 기기 고유 ID
  device_info?: {
    os?: string;
    browser?: string;
    model?: string;
    [key: string]: any;
  };
  last_active_at: string; // ISO timestamp
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface TestResult {
  id: string; // UUID
  session_id: string; // 기기 고유 ID
  test_type: 'basic' | 'dating' | 'career' | 'persona';
  type_code: string; // 유형 코드 (예: 'INTJD', '확인형')
  scores: {
    // SCAN 검사 (basic)
    EI?: number;
    SN?: number;
    FT?: number;
    PJ?: number;
    DA?: number;
    // 연애 검사 (dating)
    확인형?: number;
    몰입형?: number;
    신중형?: number;
    균형형?: number;
    기준형?: number;
    자유공감형?: number;
    // 기타 검사 타입
    [key: string]: number | undefined;
  };
  result_data: {
    // SCAN 검사 결과
    typeCode?: string;
    scores?: Record<string, number>;
    leftSums?: Record<string, number>;
    rightSums?: Record<string, number>;
    greyZones?: Array<{ axis: string; score: number }>;
    badge?: string | null;
    // 연애 검사 결과
    coreType?: string;
    subType?: string;
    confidence?: number;
    radarData?: number[];
    maxScore?: number;
    // 기타 필드
    [key: string]: any;
  };
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface ShareLink {
  id: string; // UUID
  share_code: string; // 공유 코드 (고유)
  session_id: string; // 생성한 사용자의 session_id
  test_type: 'basic' | 'dating' | 'career' | 'persona';
  result_data: {
    // 공유할 결과 데이터 (TestResult.result_data와 동일 구조)
    [key: string]: any;
  };
  expires_at?: string | null; // ISO timestamp (null이면 만료 없음)
  view_count: number; // 조회 수
  created_at: string; // ISO timestamp
}

// ============================================
// API 요청/응답 타입
// ============================================

export interface CreateUserSessionRequest {
  session_id: string;
  device_info?: UserSession['device_info'];
}

export interface CreateTestResultRequest {
  session_id: string;
  test_type: TestResult['test_type'];
  type_code: string;
  scores: TestResult['scores'];
  result_data: TestResult['result_data'];
}

export interface CreateShareLinkRequest {
  session_id: string;
  test_type: ShareLink['test_type'];
  result_data: ShareLink['result_data'];
  expires_at?: string | null; // ISO timestamp
}

export interface UpdateShareLinkRequest {
  view_count?: number;
  expires_at?: string | null;
}

// ============================================
// 쿼리 결과 타입
// ============================================

export interface UserLatestResults {
  id: string;
  session_id: string;
  test_type: TestResult['test_type'];
  type_code: string;
  scores: TestResult['scores'];
  result_data: TestResult['result_data'];
  created_at: string;
}

export interface ShareLinkStats {
  test_type: TestResult['test_type'];
  total_links: number;
  active_links: number;
  total_views: number;
  avg_views: number;
}

// ============================================
// 유틸리티 타입
// ============================================

export type TestType = 'basic' | 'dating' | 'career' | 'persona';

export interface SupabaseError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}
