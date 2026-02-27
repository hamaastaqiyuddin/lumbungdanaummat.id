"""
Clean up the end of App.jsx:
1. Fix any </div > or </div  > (div with space before >) tags
2. Ensure the return ends with correct 2 closing divs
"""
file_path = r'd:\lumbungdanaummat.id\src\App.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix malformed </div > (space before >) anywhere in file
import re
content = re.sub(r'</div\s+>', '</div>', content)
content = re.sub(r'<div\s+>', '<div>', content)  # also fix <div > if any

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed malformed div tags.")

# Verify the end of file
lines = content.split('\n')
print("Last 10 lines:")
for i, line in enumerate(lines[-10:]):
    print(f"  {len(lines)-10+i+1}: {repr(line)}")
