import os

file_path = r'd:\lumbungdanaummat.id\src\App.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# We want to replace the last set of closings (2060-2065) or just append.
# Actually, let's find the line with "export default App;" and work backwards.

def apply_fix():
    for i in range(len(lines) - 1, -1, -1):
        if "export default App;" in lines[i]:
            # This is the last line. Go up to find the return closing.
            # We will replace from the last ); we find.
            target_idx = i
            while target_idx > 0:
                if ");" in lines[target_idx]:
                    # Found it. We want to insert our 4 </div> before this );
                    # But wait, we already have some </div> there.
                    # Let's just REPLACE everything from line 2060 onwards.
                    break
                target_idx -= 1
            
            if target_idx > 0:
                # We'll replace from line 2060 (index 2059) to target_idx+1
                new_block = [
                    "                    </div>\n",
                    "                </div>\n",
                    "            </div>\n",
                    "        </div>\n",
                    "    );\n",
                    "};\n",
                    "\n",
                    "export default App;\n"
                ]
                
                # Find where line 2060 starts.
                # Actually, I'll just use the line number I saw.
                start_idx = 2059 # Line 2060
                
                # Check line content to be safe
                if "</div>" in lines[start_idx]:
                    new_lines = lines[:start_idx] + new_block
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.writelines(new_lines)
                    print("Structural fix applied successfully.")
                    return True
    return False

if not apply_fix():
    print("Could not find the target section to apply the fix.")
