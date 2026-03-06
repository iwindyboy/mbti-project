#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
사주 10천간과 32 Spectrum 조합 마크다운 파일 파싱 스크립트
320개 조합 데이터를 JSON으로 변환
"""

import re
import json
import os
from pathlib import Path
from typing import Dict, List, Optional

# 천간 목록
CHEONGAN_LIST = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

# 천간 상징 매핑 (파일에서 추출)
CHEONGAN_SYMBOL_MAP = {
    '甲': '큰 소나무',
    '乙': '넝쿨',
    '丙': '태양',
    '丁': '촛불',
    '戊': '큰 산',
    '己': '논밭',
    '庚': '큰 바위',
    '辛': '보석',
    '壬': '큰 강',
    '癸': '이슬비'
}


def extract_cheongan_symbol(content: str, cheongan: str) -> str:
    """파일 내용에서 천간 상징 추출"""
    # 상징 패턴 찾기
    pattern = rf'- 상징: (.+?)(?:\n|$)'
    match = re.search(pattern, content)
    if match:
        symbol = match.group(1).strip()
        # 긴 설명에서 첫 번째 핵심 단어 추출
        # 예: "하늘을 향해 곧게 자라는 큰 소나무" -> "큰 소나무"
        # 예: "바람에 흔들려도 꺾이지 않는 넝쿨" -> "넝쿨"
        if '·' in symbol:
            symbol = symbol.split('·')[0].strip()
        # 간단한 형태로 변환
        simple_symbols = {
            '하늘을 향해 곧게 자라는 큰 소나무': '큰 소나무',
            '바람에 흔들려도 꺾이지 않는 넝쿨': '넝쿨',
            '하늘의 태양 · 세상을 고루 비추는 빛': '태양',
            '촛불 · 등불 · 화롯불 — 작지만 꺼지지 않는 빛': '촛불',
            '큰 산 · 대지 — 묵직하고 흔들리지 않는 중심': '큰 산',
            '논밭 · 경작지 · 텃밭 — 생명을 키우는 비옥한 흙': '논밭',
            '큰 바위 · 철광석 · 날카로운 검 — 강인하고 단단하며 예리한 금속': '큰 바위',
            '보석 · 장신구 · 예리한 바늘 — 섬세하고 날카로우며 아름다움을 품은 금속': '보석',
            '큰 강 · 바다 · 깊고 넓게 흐르는 물 — 모든 것을 담고 유연하게 흘러가는 물': '큰 강',
            '이슬비 · 샘물 · 지하수 — 작고 섬세하게 스며드는 물': '이슬비'
        }
        return simple_symbols.get(symbol, symbol)
    return CHEONGAN_SYMBOL_MAP.get(cheongan, '')


def parse_section(content: str, cheongan: str, cheongan_symbol: str) -> List[Dict]:
    """마크다운 파일 내용을 파싱하여 조합 리스트 반환"""
    results = []
    
    # 섹션 패턴: ## ① 甲 × INTJD | 일치형
    # 섹션 번호는 ①②③... ㉛㉜까지 포함
    section_pattern = r'##\s*[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜\d]+\s+' + re.escape(cheongan) + r'\s*×\s*([A-Z]+)\s*\|\s*([^\n]+)'
    
    sections = list(re.finditer(section_pattern, content))
    
    for i, section_match in enumerate(sections):
        section_start = section_match.start()
        
        # 다음 섹션까지의 내용 추출
        if i + 1 < len(sections):
            next_start = sections[i + 1].start()
            section_content = content[section_start:next_start]
        else:
            section_content = content[section_start:]
        
        # MBTI 코드와 combo_type 추출
        mbti_code = section_match.group(1).strip()
        combo_type = section_match.group(2).strip()
        
        # 각 필드 파싱
        gap_title = extract_field(section_content, 'gapTitle')
        situation = extract_field(section_content, 'situation')
        type_label = extract_field(section_content, 'typeLabel')
        analysis = extract_field(section_content, 'analysis')
        reason = extract_field(section_content, 'reason')
        strength_combo = extract_field(section_content, 'strengthCombo')
        
        # coaching 필드 파싱 (SEE, TRY, GROW 분리)
        coaching_see, coaching_try, coaching_grow = parse_coaching(section_content)
        
        result = {
            'cheongan': cheongan,
            'cheongan_symbol': cheongan_symbol,
            'mbti_code': mbti_code,
            'combo_type': combo_type,
            'gap_title': gap_title,
            'situation': situation,
            'type_label': type_label,
            'analysis': analysis,
            'reason': reason,
            'coaching_see': coaching_see,
            'coaching_try': coaching_try,
            'coaching_grow': coaching_grow,
            'strength_combo': strength_combo
        }
        
        results.append(result)
    
    return results


def extract_field(content: str, field_name: str) -> str:
    """특정 필드의 내용 추출"""
    # **fieldName** 패턴 찾기
    pattern = rf'\*\*{field_name}\*\*\s*\n(.*?)(?=\n\*\*|\n---|\Z)'
    match = re.search(pattern, content, re.DOTALL)
    
    if match:
        text = match.group(1).strip()
        # 빈 줄 제거 및 정리
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        return '\n'.join(lines)
    
    return ''


def parse_coaching(content: str) -> tuple[str, str, str]:
    """coaching 섹션에서 SEE, TRY, GROW 추출"""
    coaching_see = ''
    coaching_try = ''
    coaching_grow = ''
    
    # coaching 섹션 찾기
    coaching_pattern = r'\*\*coaching\*\*\s*\n(.*?)(?=\n\*\*|\n---|\Z)'
    coaching_match = re.search(coaching_pattern, content, re.DOTALL)
    
    if coaching_match:
        coaching_text = coaching_match.group(1)
        
        # SEE 추출
        see_pattern = r'👁\s*SEE\s*·\s*(.*?)(?=🧪|🌱|\Z)'
        see_match = re.search(see_pattern, coaching_text, re.DOTALL)
        if see_match:
            coaching_see = see_match.group(1).strip()
        
        # TRY 추출
        try_pattern = r'🧪\s*TRY\s*·\s*(.*?)(?=🌱|\Z)'
        try_match = re.search(try_pattern, coaching_text, re.DOTALL)
        if try_match:
            coaching_try = try_match.group(1).strip()
        
        # GROW 추출
        grow_pattern = r'🌱\s*GROW\s*·\s*(.*?)(?=\Z)'
        grow_match = re.search(grow_pattern, coaching_text, re.DOTALL)
        if grow_match:
            coaching_grow = grow_match.group(1).strip()
    
    return coaching_see, coaching_try, coaching_grow


def main():
    """메인 함수"""
    # Windows 환경 인코딩 설정
    import sys
    if sys.platform == 'win32':
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
    
    # 프로젝트 루트 디렉토리
    project_root = Path(__file__).parent.parent
    output_file = project_root / 'combinations.json'
    
    all_results = []
    
    # 각 천간 파일 처리
    data_dir = project_root / 'saju-project' / 'data'
    if not data_dir.exists():
        # 루트에 직접 있는 경우
        data_dir = project_root
    
    for cheongan in CHEONGAN_LIST:
        filename = f'{cheongan}_갭분석_SEE_TRY_GROW_32개.md'
        filepath = data_dir / filename
        
        if not filepath.exists():
            print(f'⚠️  파일을 찾을 수 없습니다: {filename}')
            continue
        
        print(f'📄 처리 중: {filename}')
        
        # 파일 읽기
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 천간 상징 추출
        cheongan_symbol = extract_cheongan_symbol(content, cheongan)
        
        # 섹션 파싱
        results = parse_section(content, cheongan, cheongan_symbol)
        
        print(f'   ✅ {len(results)}개 조합 파싱 완료')
        all_results.extend(results)
    
    # JSON 파일로 저장
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    
    print(f'\n✨ 총 {len(all_results)}개 레코드 파싱 완료')
    print(f'📁 저장 위치: {output_file}')
    
    # 320개인지 확인
    if len(all_results) == 320:
        print('✅ 정확히 320개 레코드가 파싱되었습니다!')
    else:
        print(f'⚠️  예상과 다릅니다. 예상: 320개, 실제: {len(all_results)}개')
    
    # 샘플 출력
    if all_results:
        print(f'\n📋 샘플 데이터 (첫 번째 레코드):')
        sample = all_results[0]
        print(f'   천간: {sample["cheongan"]} ({sample["cheongan_symbol"]})')
        print(f'   MBTI: {sample["mbti_code"]}')
        print(f'   조합 타입: {sample["combo_type"]}')
        print(f'   Gap Title: {sample["gap_title"][:50]}...')


if __name__ == '__main__':
    main()
