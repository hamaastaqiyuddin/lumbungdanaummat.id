"""
Remove the orphaned </div> at line 1990 of App.jsx.
"""
file_path = r'd:\lumbungdanaummat.id\src\App.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

TARGET_LINE = 1990  # 1-indexed
idx = TARGET_LINE - 1

print(f"Line {TARGET_LINE}: {repr(lines[idx].rstrip())}")
print(f"Context around it:")
for i in range(max(0, idx-3), min(len(lines), idx+4)):
    marker = ">>>" if i == idx else "   "
    print(f"  {marker} {i+1}: {lines[i].rstrip()}")

# Only remove if it's a </div>
if '</div>' in lines[idx] and lines[idx].strip() == '</div>':
    del lines[idx]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print(f"\nRemoved line {TARGET_LINE}. File now has {len(lines)} lines.")
else:
    print(f"\nLine {TARGET_LINE} didn't match expected content, no changes made.")
