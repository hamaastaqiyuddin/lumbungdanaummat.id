"""
This script fixes the tail of App.jsx.

The floating Ramadhan button ends at line ~2058 (</button>).
After that we need:
  )    <- closes the ternary: showRamadhanExists && (
  }    <- closes the { expression block
  </div>  <- closes <div className="min-h-screen ...">  (line 853)
  </div>  <- closes <div className={`${isDarkMode ...`}>  (line 837)
  );   <- closes return (
};   <- closes const App
export default App;
"""

file_path = r'd:\lumbungdanaummat.id\src\App.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the line with </button> that closes the floating Ramadhan button
# It should be around line 2058 (index 2057)
# We'll search backwards for </button> near the end
cut_idx = None
for i in range(len(lines) - 1, max(len(lines) - 30, 0), -1):
    if '</button>' in lines[i]:
        cut_idx = i
        break

if cut_idx is None:
    print("ERROR: Could not find </button> near end of file.")
    exit(1)

print(f"Found </button> at line {cut_idx + 1}")

# Build the correct tail
correct_tail = [
    '                    </button>\n',
    '                )\n',
    '            }\n',
    '        </div>\n',
    '    </div>\n',
    '    );\n',
    '};\n',
    '\n',
    'export default App;\n',
]

new_lines = lines[:cut_idx] + correct_tail

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Done. File now has {len(new_lines)} lines.")
