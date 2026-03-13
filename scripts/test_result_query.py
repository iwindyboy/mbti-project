#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""테스트 케이스 데이터 존재 확인"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

project_root = Path(__file__).parent.parent
env_file = project_root / '.env'
load_dotenv(env_file, encoding='utf-8')

supabase_url = os.getenv('VITE_SUPABASE_URL') or os.getenv('SUPABASE_URL')
supabase_key = os.getenv('VITE_SUPABASE_PUBLISHABLE_KEY') or os.getenv('SUPABASE_KEY')

if not supabase_url or not supabase_key:
    print('❌ 환경 변수가 설정되지 않았습니다.')
    sys.exit(1)

supabase = create_client(supabase_url, supabase_key)

# 테스트 케이스들
test_cases = [
    ('癸', 'INFJD', '일치형'),
    ('甲', 'INTJD', '보완형'),
    ('壬', 'ISTJD', '갭형'),
]

print('=' * 60)
print('테스트 케이스 데이터 존재 확인')
print('=' * 60)

for cheongan, mbti_code, expected_type in test_cases:
    try:
        result = supabase.table('saju_combinations').select('*').eq('cheongan', cheongan).eq('mbti_code', mbti_code).single().execute()
        
        if result.data:
            combo_type = result.data.get('combo_type', 'N/A')
            gap_title = result.data.get('gap_title', 'N/A')[:50] + '...' if result.data.get('gap_title') else 'N/A'
            print(f'\n✅ {cheongan} × {mbti_code}')
            print(f'   combo_type: {combo_type} (예상: {expected_type})')
            print(f'   gap_title: {gap_title}')
        else:
            print(f'\n❌ {cheongan} × {mbti_code} - 데이터 없음')
    except Exception as e:
        error_msg = str(e)
        if 'PGRST116' in error_msg or 'No rows' in error_msg:
            print(f'\n❌ {cheongan} × {mbti_code} - 데이터 없음')
        else:
            print(f'\n⚠️  {cheongan} × {mbti_code} - 오류: {error_msg}')

print('\n' + '=' * 60)
