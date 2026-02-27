"""
Find where the 'outer' div stack first hits zero while there is still
content below — that is where the root containers close too early and
everything after them becomes a sibling of the root div, causing
'Adjacent JSX elements must be wrapped in an enclosing tag'.
"""
import re

file_path = r'd:\lumbungdanaummat.id\src\App.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

depth = 0        # tracks outermost div stack
void_tags = {'input','img','br','hr','meta','link','source','area','base','col','embed','param','track','wbr'}

for i, raw in enumerate(lines):
    line_num = i + 1
    line = re.sub(r'//.*', '', raw)          # strip line comments

    opens  = re.findall(r'<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*/>', line)  # self-closing
    # Count traditional open tags (not self-closing, not void)
    for m in re.finditer(r'<([a-zA-Z][a-zA-Z0-9]*)\b', line):
        name = m.group(1).lower()
        if name not in void_tags:
            # peek ahead: is there a matching /> on same line?
            after = line[m.end():]
            if '/>' in after.split('>')[0]:
                continue  # self-closing
            depth += 1

    for m in re.finditer(r'</([a-zA-Z][a-zA-Z0-9]*)\b', line):
        name = m.group(1).lower()
        if name not in void_tags:
            depth -= 1
            if depth < 0:
                print(f"LINE {line_num}: stack went NEGATIVE ({depth}) -- extra close tag here!")
                depth = 0

    # Report when depth first hits 0 while we are past the opening lines
    if depth == 0 and line_num > 860:
        print(f"LINE {line_num}: depth=0 (possible premature root close) | line: {raw.rstrip()[:80]}")
        # Stop after first hit to keep output clean
        break

print(f"Scan stopped at line {line_num}, final depth: {depth}")
