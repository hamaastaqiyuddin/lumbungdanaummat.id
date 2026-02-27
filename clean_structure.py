import os

file_path = r'd:\lumbungdanaummat.id\src\App.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def apply_cleanup():
    for i in range(len(lines) - 1, -1, -1):
        if "export default App;" in lines[i]:
            # This is the end. We want only TWO </div> before the );
            target_idx = i
            while target_idx > 0:
                if ");" in lines[target_idx]:
                    break
                target_idx -= 1
            
            if target_idx > 0:
                # Build the correct tail
                new_tail = [
                    "            </div>\n",
                    "        </div>\n",
                    "    );\n",
                    "};\n",
                    "\n",
                    "export default App;\n"
                ]
                
                # We'll replace from line 2058 or so.
                # Let's find where the last block of closings starts.
                start_search = target_idx - 1
                while start_search > 0 and ("</div>" in lines[start_search] or lines[start_search].strip() == ""):
                    start_search -= 1
                
                # start_search is now at something like " ) } "
                new_lines = lines[:start_search + 1] + new_tail
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.writelines(new_lines)
                print("Final structural cleanup applied.")
                return True
    return False

apply_cleanup()
