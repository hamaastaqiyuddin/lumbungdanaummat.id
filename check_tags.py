import re

def get_tags(content):
    pattern = re.compile(r'<(/?)([a-zA-Z0-9]+)\b')
    tags = []
    void_tags = {'input', 'img', 'br', 'hr', 'meta', 'link', 'source', 'area', 'base', 'col', 'embed', 'param', 'track', 'wbr'}
    
    in_string = False
    string_char = ''
    i = 0
    while i < len(content):
        if content[i] in ["'", '"', '`']:
            if not in_string:
                in_string = True
                string_char = content[i]
            elif content[i] == string_char:
                if content[i-1] != '\\':
                    in_string = False
        
        if not in_string and content[i] == '<':
            match = pattern.match(content[i:])
            if match:
                is_close = match.group(1) == '/'
                name = match.group(2).lower()
                
                end_pos = content.find('>', i)
                is_self = False
                if end_pos != -1:
                    if content[end_pos-1] == '/' or name in void_tags:
                        is_self = True
                
                tags.append({
                    'name': name,
                    'close': is_close,
                    'self': is_self,
                    'line': content.count('\n', 0, i) + 1
                })
                i = end_pos + 1 if end_pos != -1 else i + len(match.group(0))
                continue
        i += 1
    return tags

file_path = r'd:\lumbungdanaummat.id\src\App.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

tags = get_tags(content)
stack = []
for t in tags:
    if t['self']: continue
    if t['close']:
        if stack:
            last = stack.pop()
            if last['name'] != t['name']:
                # Backtrack stack to find the correct opening
                found = False
                temp_stack = [last]
                while stack:
                    next_last = stack.pop()
                    if next_last['name'] == t['name']:
                        found = True
                        break
                    temp_stack.append(next_last)
                
                if found:
                    print(f"Structural leak: <{', '.join(x['name'] for x in temp_stack)}> around line {temp_stack[0]['line']} are unclosed (found </{t['name']}> at {t['line']})")
                else:
                    # Restore stack
                    stack.extend(reversed(temp_stack))
                    print(f"Extra closing </{t['name']}> at {t['line']}")
        else:
            print(f"Extra closing </{t['name']}> at {t['line']}")
    else:
        stack.append(t)

print(f"Final stack size: {len(stack)}")
for s in stack:
    print(f"Unclosed <{s['name']}> from line {s['line']}")
