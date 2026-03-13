#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
중복 정리 및 재삽입 스크립트
테이블을 비우고 320개 레코드를 다시 삽입합니다.
"""

import json
import os
import sys
from pathlib import Path
from typing import List, Dict, Any
from dotenv import load_dotenv
from supabase import create_client, Client

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
        load_dotenv(env_file, encoding='utf-8')
        print(f'✅ .env 파일 로드 완료: {env_file}\n')
    else:
        print(f'⚠️  .env 파일을 찾을 수 없습니다: {env_file}\n')
    
    supabase_url = os.getenv('SUPABASE_URL') or os.getenv('VITE_SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_KEY') or os.getenv('VITE_SUPABASE_PUBLISHABLE_KEY')
    
    if not supabase_url:
        raise ValueError('SUPABASE_URL 또는 VITE_SUPABASE_URL 환경 변수가 설정되지 않았습니다.')
    if not supabase_key:
        raise ValueError('SUPABASE_KEY, VITE_SUPABASE_PUBLISHABLE_KEY 또는 SUPABASE_ANON_KEY 환경 변수가 설정되지 않았습니다.')
    
    return supabase_url, supabase_key


def load_combinations_json() -> List[Dict[str, Any]]:
    """combinations.json 파일 로드"""
    project_root = Path(__file__).parent.parent
    json_file = project_root / 'combinations.json'
    
    if not json_file.exists():
        raise FileNotFoundError(f'combinations.json 파일을 찾을 수 없습니다: {json_file}')
    
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f'✅ JSON 파일 로드 완료: {len(data)}개 레코드')
    return data


def validate_record(record: Dict[str, Any]) -> bool:
    """레코드 유효성 검증"""
    required_fields = [
        'cheongan', 'cheongan_symbol', 'mbti_code', 'combo_type',
        'gap_title', 'situation', 'type_label', 'analysis', 'reason',
        'coaching_see', 'coaching_try', 'coaching_grow', 'strength_combo'
    ]
    
    for field in required_fields:
        if field not in record:
            return False
    
    valid_combo_types = ['일치형', '보완형', '갭형']
    if record['combo_type'] not in valid_combo_types:
        return False
    
    return True


def prepare_record(record: Dict[str, Any]) -> Dict[str, Any]:
    """레코드를 Supabase 테이블 구조에 맞게 준비"""
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


def delete_all_records(supabase: Client):
    """테이블의 모든 레코드 삭제"""
    print('\n🗑️  기존 레코드 삭제 중...')
    try:
        # 모든 레코드 조회
        response = supabase.table('saju_combinations').select('id').execute()
        total_count = len(response.data) if response.data else 0
        
        if total_count == 0:
            print('   ℹ️  삭제할 레코드가 없습니다.')
            return
        
        print(f'   발견된 레코드: {total_count}개')
        
        # 모든 레코드 삭제 (Supabase는 DELETE 쿼리를 직접 지원하지 않으므로)
        # 각 레코드를 개별 삭제하거나, SQL을 사용해야 함
        # 여기서는 모든 ID를 가져와서 삭제
        
        deleted = 0
        batch_size = 100
        
        # ID 목록을 배치로 나눠서 삭제
        ids = [record['id'] for record in response.data]
        
        for i in range(0, len(ids), batch_size):
            batch_ids = ids[i:i+batch_size]
            for record_id in batch_ids:
                try:
                    supabase.table('saju_combinations').delete().eq('id', record_id).execute()
                    deleted += 1
                except Exception as e:
                    print(f'   ⚠️  레코드 {record_id} 삭제 실패: {str(e)}')
            
            print(f'   진행률: {min(i+batch_size, len(ids))}/{len(ids)}')
        
        print(f'✅ {deleted}개 레코드 삭제 완료')
        
    except Exception as e:
        print(f'❌ 삭제 중 오류 발생: {str(e)}')
        # SQL을 사용한 삭제 시도
        print('   SQL 삭제를 시도합니다...')
        try:
            # Supabase Python 클라이언트로는 직접 SQL 실행이 어려우므로
            # RPC 함수를 사용하거나, 모든 레코드를 다시 조회해서 삭제
            response = supabase.table('saju_combinations').select('id').execute()
            if response.data:
                for record in response.data:
                    supabase.table('saju_combinations').delete().eq('id', record['id']).execute()
                print('✅ SQL 삭제 완료')
        except Exception as e2:
            print(f'❌ SQL 삭제도 실패: {str(e2)}')
            print('   ⚠️  수동으로 Supabase 대시보드에서 테이블을 비워주세요.')
            raise


def insert_batch(
    supabase: Client,
    batch: List[Dict[str, Any]],
    batch_num: int,
    total_batches: int
) -> tuple[int, List[Dict[str, Any]]]:
    """배치 단위로 데이터 삽입"""
    errors = []
    
    try:
        response = supabase.table('saju_combinations').insert(batch).execute()
        
        if hasattr(response, 'data') and response.data:
            inserted_count = len(response.data)
        else:
            inserted_count = len(batch)
        
        print(f'✅ 배치 {batch_num}/{total_batches} 완료: {inserted_count}개 레코드 삽입')
        
        return inserted_count, errors
        
    except Exception as e:
        error_msg = str(e)
        print(f'❌ 배치 {batch_num}/{total_batches} 실패: {error_msg}')
        print(f'   개별 레코드 삽입 시도 중...')
        
        for i, record in enumerate(batch):
            try:
                supabase.table('saju_combinations').insert(record).execute()
            except Exception as record_error:
                error_info = {
                    'batch_num': batch_num,
                    'record_index': i,
                    'record': {
                        'cheongan': record.get('cheongan'),
                        'mbti_code': record.get('mbti_code'),
                        'combo_type': record.get('combo_type')
                    },
                    'error': str(record_error)
                }
                errors.append(error_info)
                print(f'   ❌ 레코드 {i+1}/{len(batch)} 삽입 실패:')
                print(f'      천간: {record.get("cheongan")}, MBTI: {record.get("mbti_code")}, 타입: {record.get("combo_type")}')
                print(f'      에러: {str(record_error)}')
        
        inserted_count = len(batch) - len(errors)
        if inserted_count > 0:
            print(f'   ✅ {inserted_count}개 레코드 개별 삽입 성공')
        
        return inserted_count, errors


def main():
    """메인 함수"""
    try:
        # 환경 변수 로드
        print('🔧 환경 변수 로드 중...')
        supabase_url, supabase_key = load_environment()
        
        # Supabase 클라이언트 생성
        print('🔌 Supabase 클라이언트 연결 중...')
        supabase: Client = create_client(supabase_url, supabase_key)
        print('✅ Supabase 연결 성공')
        
        # 기존 레코드 삭제
        delete_all_records(supabase)
        
        # JSON 파일 로드
        print('\n📄 JSON 파일 로드 중...')
        records = load_combinations_json()
        
        # 레코드 검증
        print('\n🔍 레코드 검증 중...')
        valid_records = []
        invalid_count = 0
        
        for i, record in enumerate(records):
            if validate_record(record):
                prepared = prepare_record(record)
                valid_records.append(prepared)
            else:
                invalid_count += 1
                print(f'❌ 레코드 {i+1} 검증 실패:')
                print(f'   천간: {record.get("cheongan")}, MBTI: {record.get("mbti_code")}')
        
        if invalid_count > 0:
            print(f'\n⚠️  {invalid_count}개 레코드가 검증에 실패했습니다.')
            response = input('계속 진행하시겠습니까? (y/n): ')
            if response.lower() != 'y':
                print('작업을 취소했습니다.')
                return
        
        print(f'✅ {len(valid_records)}개 레코드 검증 완료')
        
        # 배치 단위로 삽입
        batch_size = 100
        total_records = len(valid_records)
        total_batches = (total_records + batch_size - 1) // batch_size
        
        print(f'\n📤 데이터 삽입 시작 (배치 크기: {batch_size}, 총 배치: {total_batches})')
        print('=' * 60)
        
        total_inserted = 0
        all_errors = []
        
        for batch_num in range(total_batches):
            start_idx = batch_num * batch_size
            end_idx = min(start_idx + batch_size, total_records)
            batch = valid_records[start_idx:end_idx]
            
            inserted, errors = insert_batch(
                supabase,
                batch,
                batch_num + 1,
                total_batches
            )
            
            total_inserted += inserted
            all_errors.extend(errors)
            
            # 진행률 출력
            progress = (batch_num + 1) / total_batches * 100
            print(f'   진행률: {progress:.1f}% ({total_inserted}/{total_records})')
        
        print('=' * 60)
        print(f'\n✨ 삽입 완료!')
        print(f'   총 삽입: {total_inserted}개')
        
        if all_errors:
            print(f'\n⚠️  {len(all_errors)}개 레코드 삽입 실패:')
            for error in all_errors:
                print(f'   - 배치 {error["batch_num"]}, 레코드 {error["record_index"]+1}:')
                print(f'     {error["record"]}')
                print(f'     에러: {error["error"]}')
        
        # 테이블 검증
        print('\n🔍 테이블 레코드 수 검증 중...')
        try:
            response = supabase.table('saju_combinations').select('id', count='exact').execute()
            table_count = response.count if hasattr(response, 'count') else len(response.data)
            
            if table_count >= 0:
                print(f'✅ 테이블 총 레코드 수: {table_count}개')
                if table_count == total_records:
                    print('✅ 예상 레코드 수와 일치합니다!')
                else:
                    print(f'⚠️  예상 레코드 수({total_records})와 다릅니다.')
        except Exception as e:
            print(f'⚠️  레코드 수를 확인할 수 없습니다: {str(e)}')
        
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
