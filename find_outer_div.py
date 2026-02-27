"""
Track ONLY the outermost div from line 837.
Print where it closes.
"""
import re

file_path = r'd:\lumbungdanaummat.id\src\App.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

OUTER_DIV_START = 837  # 1-indexed

depth = 0
void_tags = {'input','img','br','hr','meta','link','source','area','base','col','embed','param','track','wbr'}

for i, raw in enumerate(lines):
    line_num = i + 1
    if line_num < OUTER_DIV_START:
        continue

    line = re.sub(r'//.*', '', raw)

    pos = 0
    while pos < len(line):
        m_open  = re.search(r'<div\b',  line[pos:])
        m_close = re.search(r'</div\b', line[pos:])

        o_start = m_open.start()  + pos if m_open  else len(line)
        c_start = m_close.start() + pos if m_close else len(line)

        if o_start < c_start:
            # check self-closing
            after = line[o_start + 4:]
            tag_end = after.find('>')
            raw_content = after[:tag_end] if tag_end != -1 else after
            if '/' in raw_content:
                pos = o_start + 5
                continue
            depth += 1
            pos = o_start + 4
        elif c_start < len(line):
            depth -= 1
            if depth == 0:
                print(f"Outer div (from line {OUTER_DIV_START}) CLOSES at line {line_num}")
                print(f"  {raw.rstrip()}")
                # Show next few lines
                for j in range(line_num, min(line_num + 6, len(lines))):
                    print(f"  {j+1}: {lines[j].rstrip()}")
                import sys; sys.exit(0)
            pos = c_start + 6
        else:
            break
