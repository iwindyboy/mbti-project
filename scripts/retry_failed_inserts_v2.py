#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""실패한 레코드 재삽입 스크립트 (v2)"""

import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 실패한 레코드 목록
failed_records = [
    {'cheongan': '甲', 'mbti_code': 'INTJD', 'combo_type': '일치형'},
    {'cheongan': '甲', 'mbti_code': 'ESTPD', 'combo_type': '갭형'},
    {'cheongan': '乙', 'mbti_code': 'INTPA', 'combo_type': '보완형'},
]

def load_environment():
    project_root = Path(__file__).parent.parent
    env_file = project_root / '.env'
    load_dotenv(env_file, encoding='utf-8')
    
    supabase_url = os.getenv('SUPABASE_URL') or os.getenv('VITE_SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_KEY') or os.getenv('VITE_SUPABASE_PUBLISHABLE_KEY')
    
    if not supabase_url or not supabase_key:
        raise ValueError('환경 변수가 설정되지 않았습니다.')
    
    return supabase_url, supabase_key

def find_record(records, cheongan, mbti_code, combo_type):
    """조건에 맞는 레코드 찾기"""
    for record in records:
        if (record.get('cheongan') == cheongan and 
            record.get('mbti_code') == mbti_code and 
            record.get('combo_type') == combo_type):
            return record
    return None

def prepare_record(record):
    """레코드 준비"""
    return {
        'cheongan': record['cheongan'],
        'cheongan_symbol': record['cheongan_symbol'],
        'mbti_code': record['mbti_code'],
        'combo_type': record['combo_type'],
        'gap_title': record['gap_title'],
        'situation': record['situation'],
        'type_label': record['type_label'],
        'analysis': record['analysis'],
        'reason': record['reason'],
        'coaching_see': record['coaching_see'],
        'coaching_try': record['coaching_try'],
        'coaching_grow': record['coaching_grow'],
        'strength_combo': record['strength_combo']
    }

def check_exists(supabase, cheongan, mbti_code, combo_type):
    """레코드가 이미 존재하는지 확인"""
    try:
        response = supabase.table('saju_combinations').select('id').eq('cheongan', cheongan).eq('mbti_code', mbti_code).eq('combo_type', combo_type).execute()
        return len(response.data) > 0
    except:
        return False

def main():
    # 환경 변수 로드
    supabase_url, supabase_key = load_environment()
    supabase = create_client(supabase_url, supabase_key)
    
    # JSON 파일 로드
    project_root = Path(__file__).parent.parent
    json_file = project_root / 'combinations.json'
    
    with open(json_file, 'r', encoding='utf-8') as f:
        all_records = json.load(f)
    
    print(f'📄 전체 레코드 로드: {len(all_records)}개')
    print(f'🔄 재삽입 대상: {len(failed_records)}개\n')
    
    success_count = 0
    error_count = 0
    exists_count = 0
    
    for i, failed in enumerate(failed_records, 1):
        # 이미 존재하는지 확인
        if check_exists(supabase, failed['cheongan'], failed['mbti_code'], failed['combo_type']):
            print(f'ℹ️  레코드 {i}: {failed["cheongan"]} × {failed["mbti_code"]} ({failed["combo_type"]}) 이미 존재함')
            exists_count += 1
            continue
        
        record = find_record(all_records, failed['cheongan'], failed['mbti_code'], failed['combo_type'])
        
        if not record:
            print(f'❌ 레코드 {i}: 찾을 수 없음 - {failed}')
            error_count += 1
            continue
        
        prepared = prepare_record(record)
        
        try:
            supabase.table('saju_combinations').insert(prepared).execute()
            print(f'✅ 레코드 {i}: {failed["cheongan"]} × {failed["mbti_code"]} ({failed["combo_type"]}) 삽입 성공')
            success_count += 1
        except Exception as e:
            print(f'❌ 레코드 {i}: {failed["cheongan"]} × {failed["mbti_code"]} 삽입 실패 - {str(e)}')
            error_count += 1
    
    print(f'\n✨ 완료!')
    print(f'   성공: {success_count}개')
    print(f'   이미 존재: {exists_count}개')
    print(f'   실패: {error_count}개')

if __name__ == '__main__':
    main()
