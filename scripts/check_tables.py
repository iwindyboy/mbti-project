#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Supabase 테이블 목록 확인"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

project_root = Path(__file__).parent.parent
env_file = project_root / '.env'
load_dotenv(env_file, encoding='utf-8')

supabase_url = os.getenv('SUPABASE_URL') or os.getenv('VITE_SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_KEY') or os.getenv('VITE_SUPABASE_PUBLISHABLE_KEY')

if not supabase_url or not supabase_key:
    print("❌ 환경 변수가 설정되지 않았습니다.")
    sys.exit(1)

supabase = create_client(supabase_url, supabase_key)

# 직접 SQL 쿼리는 Supabase Python 클라이언트로는 제한적이므로
# 테이블 접근 시도로 확인
try:
    # saju_combinations 테이블 접근 시도
    response = supabase.table('saju_combinations').select('id', count='exact').limit(1).execute()
    print("✅ saju_combinations 테이블이 존재합니다!")
    print(f"   레코드 수: {response.count if hasattr(response, 'count') else 'N/A'}")
except Exception as e:
    print(f"❌ saju_combinations 테이블을 찾을 수 없습니다.")
    print(f"   오류: {e}")
    print("\n⚠️  마이그레이션을 먼저 실행해야 합니다:")
    print("   supabase/migrations/002_create_saju_combinations.sql 파일을")
    print("   Supabase 대시보드의 SQL Editor에서 실행하세요.")
