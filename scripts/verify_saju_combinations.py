#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Supabase saju_combinations 테이블 검증 스크립트
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client
from tabulate import tabulate

# Windows 환경 인코딩 설정
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')


def load_environment():
    """환경 변수 로드"""
    project_root = Path(__file__).parent.parent
    env_file = project_root / '.env'
    
    if env_file.exists():
        try:
            load_dotenv(env_file, encoding='utf-8')
            print(f'✅ .env 파일 로드 완료: {env_file}\n')
        except Exception as e:
            # UTF-8 실패 시 다른 인코딩 시도
            try:
                load_dotenv(env_file, encoding='cp949')
                print(f'✅ .env 파일 로드 완료 (cp949): {env_file}\n')
            except:
                load_dotenv(env_file)
                print(f'✅ .env 파일 로드 완료 (기본 인코딩): {env_file}\n')
    else:
        print(f'⚠️  .env 파일을 찾을 수 없습니다: {env_file}\n')
        print('환경 변수를 직접 설정하거나 .env 파일을 생성해주세요.')
    
    # SUPABASE_URL 또는 VITE_SUPABASE_URL 확인
    supabase_url = os.getenv('SUPABASE_URL') or os.getenv('VITE_SUPABASE_URL')
    # SUPABASE_KEY 또는 VITE_SUPABASE_PUBLISHABLE_KEY 확인
    supabase_key = os.getenv('SUPABASE_KEY') or os.getenv('VITE_SUPABASE_PUBLISHABLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
    
    if not supabase_url:
        raise ValueError('SUPABASE_URL 또는 VITE_SUPABASE_URL 환경 변수가 설정되지 않았습니다.')
    if not supabase_key:
        raise ValueError('SUPABASE_KEY, VITE_SUPABASE_PUBLISHABLE_KEY 또는 SUPABASE_ANON_KEY 환경 변수가 설정되지 않았습니다.')
    
    return supabase_url, supabase_key


def verify_total_count(supabase: Client) -> int:
    """1. 전체 레코드 수 검증"""
    print('=' * 60)
    print('1. 전체 레코드 수 검증')
    print('=' * 60)
    
    try:
        response = supabase.table('saju_combinations').select('id', count='exact').execute()
        count = response.count if hasattr(response, 'count') else len(response.data)
        
        expected = 320
        status = '✅' if count == expected else '❌'
        
        print(f'\n{status} 전체 레코드 수: {count}개')
        print(f'   예상: {expected}개')
        
        if count != expected:
            print(f'   ⚠️  차이: {count - expected}개')
        
        return count
    except Exception as e:
        print(f'❌ 오류 발생: {str(e)}')
        return -1


def verify_cheongan_distribution(supabase: Client):
    """2. 천간별 레코드 수 검증"""
    print('\n' + '=' * 60)
    print('2. 천간별 레코드 수 검증')
    print('=' * 60)
    
    try:
        # 모든 레코드 가져오기
        response = supabase.table('saju_combinations').select('cheongan').execute()
        records = response.data
        
        # 천간별 카운트
        cheongan_count = {}
        for record in records:
            cheongan = record.get('cheongan', 'NULL')
            cheongan_count[cheongan] = cheongan_count.get(cheongan, 0) + 1
        
        # 테이블 형태로 출력
        table_data = []
        all_correct = True
        
        expected_cheongans = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
        
        for cheongan in expected_cheongans:
            count = cheongan_count.get(cheongan, 0)
            expected = 32
            status = '✅' if count == expected else '❌'
            if count != expected:
                all_correct = False
            table_data.append([cheongan, count, expected, status])
        
        # 예상치 못한 천간이 있는지 확인
        for cheongan, count in cheongan_count.items():
            if cheongan not in expected_cheongans:
                table_data.append([f'{cheongan} (예상치 못함)', count, 0, '⚠️'])
                all_correct = False
        
        print('\n' + tabulate(
            table_data,
            headers=['천간', '실제 레코드 수', '예상 레코드 수', '상태'],
            tablefmt='grid',
            stralign='center'
        ))
        
        if all_correct:
            print('\n✅ 모든 천간이 예상대로 32개씩 있습니다.')
        else:
            print('\n⚠️  일부 천간의 레코드 수가 예상과 다릅니다.')
        
        return cheongan_count
        
    except Exception as e:
        print(f'❌ 오류 발생: {str(e)}')
        return {}


def verify_combo_type_distribution(supabase: Client):
    """3. combo_type별 분포 검증"""
    print('\n' + '=' * 60)
    print('3. combo_type별 분포 검증')
    print('=' * 60)
    
    try:
        # 모든 레코드 가져오기
        response = supabase.table('saju_combinations').select('combo_type').execute()
        records = response.data
        
        # combo_type별 카운트
        combo_type_count = {}
        for record in records:
            combo_type = record.get('combo_type', 'NULL')
            combo_type_count[combo_type] = combo_type_count.get(combo_type, 0) + 1
        
        total = len(records)
        
        # 테이블 형태로 출력
        table_data = []
        for combo_type in ['일치형', '보완형', '갭형']:
            count = combo_type_count.get(combo_type, 0)
            percentage = (count / total * 100) if total > 0 else 0
            table_data.append([combo_type, count, f'{percentage:.1f}%'])
        
        # 예상치 못한 타입이 있는지 확인
        for combo_type, count in combo_type_count.items():
            if combo_type not in ['일치형', '보완형', '갭형']:
                percentage = (count / total * 100) if total > 0 else 0
                table_data.append([f'{combo_type} (예상치 못함)', count, f'{percentage:.1f}%'])
        
        print('\n' + tabulate(
            table_data,
            headers=['combo_type', '레코드 수', '비율'],
            tablefmt='grid',
            stralign='center'
        ))
        
        print(f'\n총 레코드 수: {total}개')
        
        return combo_type_count
        
    except Exception as e:
        print(f'❌ 오류 발생: {str(e)}')
        return {}


def verify_null_values(supabase: Client):
    """4. NULL 값이 있는 레코드 찾기"""
    print('\n' + '=' * 60)
    print('4. NULL 값이 있는 레코드 검증')
    print('=' * 60)
    
    try:
        # 모든 필수 필드 확인
        required_fields = [
            'cheongan', 'cheongan_symbol', 'mbti_code', 'combo_type',
            'gap_title', 'situation', 'type_label', 'analysis', 'reason',
            'coaching_see', 'coaching_try', 'coaching_grow', 'strength_combo'
        ]
        
        # 모든 레코드 가져오기
        response = supabase.table('saju_combinations').select('*').execute()
        records = response.data
        
        null_records = []
        
        for record in records:
            record_id = record.get('id', 'N/A')
            null_fields = []
            
            for field in required_fields:
                value = record.get(field)
                if value is None or (isinstance(value, str) and value.strip() == ''):
                    null_fields.append(field)
            
            if null_fields:
                null_records.append({
                    'id': record_id,
                    'cheongan': record.get('cheongan', 'NULL'),
                    'mbti_code': record.get('mbti_code', 'NULL'),
                    'null_fields': ', '.join(null_fields)
                })
        
        if null_records:
            print(f'\n⚠️  NULL 값이 있는 레코드: {len(null_records)}개\n')
            
            table_data = []
            for record in null_records:
                table_data.append([
                    str(record['id'])[:8] + '...',  # ID 일부만 표시
                    record['cheongan'],
                    record['mbti_code'],
                    record['null_fields']
                ])
            
            print(tabulate(
                table_data,
                headers=['ID', '천간', 'MBTI 코드', 'NULL 필드'],
                tablefmt='grid',
                stralign='left'
            ))
        else:
            print('\n✅ NULL 값이 있는 레코드가 없습니다.')
        
        return null_records
        
    except Exception as e:
        print(f'❌ 오류 발생: {str(e)}')
        import traceback
        traceback.print_exc()
        return []


def main():
    """메인 함수"""
    try:
        # 환경 변수 로드
        print('🔧 환경 변수 로드 중...')
        supabase_url, supabase_key = load_environment()
        
        # Supabase 클라이언트 생성
        print('🔌 Supabase 클라이언트 연결 중...')
        supabase: Client = create_client(supabase_url, supabase_key)
        print('✅ Supabase 연결 성공\n')
        
        # 검증 실행
        total_count = verify_total_count(supabase)
        cheongan_dist = verify_cheongan_distribution(supabase)
        combo_type_dist = verify_combo_type_distribution(supabase)
        null_records = verify_null_values(supabase)
        
        # 최종 요약
        print('\n' + '=' * 60)
        print('📊 검증 요약')
        print('=' * 60)
        
        summary = []
        summary.append(['전체 레코드 수', f'{total_count}개', '✅' if total_count == 320 else '❌'])
        summary.append(['천간별 분포', '10개 천간', '✅' if len(cheongan_dist) == 10 else '❌'])
        summary.append(['combo_type 분포', '3개 타입', '✅' if len(combo_type_dist) == 3 else '❌'])
        summary.append(['NULL 값 레코드', f'{len(null_records)}개', '✅' if len(null_records) == 0 else '⚠️'])
        
        print('\n' + tabulate(
            summary,
            headers=['검증 항목', '결과', '상태'],
            tablefmt='grid',
            stralign='center'
        ))
        
        print('\n✨ 검증 완료!')
        
    except FileNotFoundError as e:
        print(f'❌ 파일 오류: {e}')
        sys.exit(1)
    except ValueError as e:
        print(f'❌ 설정 오류: {e}')
        sys.exit(1)
    except Exception as e:
        print(f'❌ 예상치 못한 오류: {e}')
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
