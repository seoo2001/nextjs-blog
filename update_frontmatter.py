import os
import re
from datetime import datetime

def extract_date_from_filename(filename):
    # 파일 이름에서 날짜 형식 (YYYY-MM-DD) 찾기
    date_match = re.search(r'(\d{4}-\d{2}-\d{2})', filename)
    if date_match:
        return date_match.group(1)
    return None

def clean_value(value):
    # 따옴표와 공백 제거
    return value.strip().strip("'\"\"")

def update_frontmatter(content, filename):
    # frontmatter를 찾습니다
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return content

    frontmatter = match.group(1)
    lines = frontmatter.split('\n')
    new_frontmatter = {}

    # 기존 frontmatter에서 필요한 정보를 추출합니다
    for line in lines:
        if line.strip():
            key, value = [x.strip() for x in line.split(':', 1)]
            if key == 'title':
                new_frontmatter['title'] = clean_value(value)
            elif key == 'date':
                # 날짜 형식을 변환합니다
                try:
                    date_str = value.split()[0]  # 2022-12-09 17:09:00 +0900 -> 2022-12-09
                    new_frontmatter['date'] = clean_value(date_str)
                except:
                    new_frontmatter['date'] = clean_value(value)
            elif key == 'tags':
                # tags 형식을 변환합니다
                tags = re.findall(r'\[([^\]]+)\]', value)
                if tags:
                    tag_list = [clean_value(tag) for tag in tags[0].split(',')]
                else:
                    tag_list = []
                new_frontmatter['tags'] = tag_list
            elif key == 'categories':
                # categories를 tags에 추가합니다
                categories = re.findall(r'\[([^\]]+)\]', value)
                if categories:
                    if 'tags' not in new_frontmatter:
                        new_frontmatter['tags'] = []
                    new_frontmatter['tags'].extend([clean_value(cat) for cat in categories[0].split(',')])

    # 날짜가 없으면 파일 이름에서 추출
    if 'date' not in new_frontmatter:
        date_from_filename = extract_date_from_filename(filename)
        if date_from_filename:
            new_frontmatter['date'] = date_from_filename

    # 새로운 frontmatter를 생성합니다
    new_content = '---\n'
    if 'title' in new_frontmatter:
        new_content += f"title: '{new_frontmatter['title']}'\n"
    if 'date' in new_frontmatter:
        new_content += f"date: '{new_frontmatter['date']}'\n"
    if 'tags' in new_frontmatter:
        # 중복 제거
        new_frontmatter['tags'] = list(set(new_frontmatter['tags']))
        tags_str = "['" + "', '".join(new_frontmatter['tags']) + "']"
        new_content += f'tags: {tags_str}\n'
    new_content += '---\n'

    # 나머지 내용을 추가합니다
    rest_content = content[match.end():]
    return new_content + rest_content

def process_directory(directory):
    for filename in os.listdir(directory):
        if filename.endswith('.md'):
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = update_frontmatter(content, filename)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)

if __name__ == '__main__':
    posts_directory = 'src/posts'
    process_directory(posts_directory) 