"""
Track only the div opened at line 837 (the root div of the return).
Print the line & content where that specific div closes.
"""
import re

file_path = r'd:\lumbungdanaummat.id\src\App.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# We know the structure is:
#  return (
#    <div ...>   <- line 837 - root of JSX
#      <style>...</style>
#      <div ...>   <- line 853 - "inner" div
#        ... all content ...
#      </div>
#    </div>
#  );
#
# We want to find where the SECOND div (853) closes.
# Strategy: start counting from line 853 and find when the depth for that div hits 0.

INNER_DIV_START = 853  # 1-indexed

depth = 0
found_open = False
void_tags = {'input','img','br','hr','meta','link','source','area','base','col','embed','param','track','wbr'}

for i, raw in enumerate(lines):
    line_num = i + 1
    if line_num < INNER_DIV_START:
        continue

    line = re.sub(r'//.*', '', raw)   # strip line comments

    # Look for <div and </div only
    pos = 0
    while pos < len(line):
        # Check for </div>
        m_close = re.search(r'</div\b', line[pos:])
        m_open  = re.search(r'<div\b',  line[pos:])

        if m_open and (not m_close or m_open.start() < m_close.start()):
            # Check if self-closing
            after = line[pos + m_open.start() + 4:]
            tag_end = after.find('>')
            if tag_end != -1 and '/' in after[:tag_end]:
                pos += m_open.start() + 5
                continue
            depth += 1
            pos += m_open.start() + 4
        elif m_close:
            depth -= 1
            abs_pos = pos + m_close.start()
            if depth == 0:
                print(f"Inner div (from line {INNER_DIV_START}) CLOSES at line {line_num}:")
                print(f"  {raw.rstrip()}")
                # Show next 5 lines
                print("  Next lines:")
                for j in range(line_num, min(line_num + 6, len(lines))):
                    print(f"  {j+1}: {lines[j].rstrip()}")
                break  # found it
            pos += m_close.start() + 6
        else:
            break

    if depth == 0 and line_num >= INNER_DIV_START:
        break
