import os

file_path = r'd:\lumbungdanaummat.id\src\App.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def apply_brute_fix():
    for i in range(len(lines) - 1, -1, -1):
        if "export default App;" in lines[i]:
            target_idx = i
            while target_idx > 0:
                if ");" in lines[target_idx]:
                    break
                target_idx -= 1
            
            if target_idx > 0:
                # We want exactly 6 closings if the stack was 6.
                # Let's just try 4 first (837, 853, 966, 1140).
                new_tail = [
                    "                    </div>\n",
                    "                </div>\n",
                    "            </div>\n",
                    "        </div>\n",
                    "    );\n",
                    "};\n",
                    "\n",
                    "export default App;\n"
                ]
                
                # Check for any extra fragments or tags just before );
                start_search = target_idx - 1
                while start_search > 0 and ("</div>" in lines[start_search] or lines[start_search].strip() == ""):
                    start_search -= 1
                
                new_lines = lines[:start_search + 1] + new_tail
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.writelines(new_lines)
                print("Brute force structural fix applied.")
                return True
    return False

apply_brute_fix()
