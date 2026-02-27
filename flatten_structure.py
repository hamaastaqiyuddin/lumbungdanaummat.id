import os
import re

file_path = r'd:\lumbungdanaummat.id\src\App.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

def balance_tags(text):
    # This is a VERY simple balancer for a single block of JSX
    # It counts <div vs </div> and adds missing ones at the end.
    
    # Simple regex (ignoring self-closing for now as div rarely is in this file)
    opens = len(re.findall(r'<div\b', text))
    closes = len(re.findall(r'</div\b', text))
    
    diff = opens - closes
    if diff > 0:
        text += '\n' + ('    </div>' * diff)
    elif diff < 0:
        # This shouldn't happen unless we cut wrong.
        pass
    return text

# We will reconstruct the return statement.
# Part 1: Start to 1459
parts = content.split("{activePage === 'admin' && (")
if len(parts) != 2:
    print("Could not split by admin block.")
    exit(1)

pre_admin = parts[0]
post_admin = parts[1]

# Part 2: Split Admin from NewsDetail
parts = post_admin.split("activePage === 'news-detail' && (")
if len(parts) != 2:
    print("Could not split by news-detail block.")
    exit(1)

admin_content = parts[0]
post_news = parts[1]

# Part 3: Split NewsDetail from ProjectDetail
parts = post_news.split("activePage === 'project-detail' && (")
if len(parts) != 2:
    print("Could not split by project-detail block.")
    exit(1)

news_detail_content = parts[0]
post_project = parts[1]

# Part 4: Split ProjectDetail from Footer
parts = post_project.split("{/* Footer */}")
if len(parts) != 2:
    print("Could not split by footer.")
    exit(1)

project_detail_content = parts[0]
final_content = parts[1]

# Now we rebuild:
# Each block should be clean.
def clean_block(text, start_marker, end_marker):
    # Strip existing messy closings from the end of the content
    text = text.rstrip()
    while text.endswith('}') or text.endswith(')') or text.endswith('</div>') or text.endswith('div>') or text.endswith('>'):
        # This is too aggressive. Let's just use tag counting.
        break
    
    # We want to find the LAST useful closing and then balance from there.
    return balance_tags(text)

new_content = pre_admin + "{activePage === 'admin' && (\n" + balance_tags(admin_content) + "\n                )}\n\n"
new_content += "                {activePage === 'news-detail' && (\n" + balance_tags(news_detail_content) + "\n                )}\n\n"
new_content += "                {activePage === 'project-detail' && (\n" + balance_tags(project_detail_content) + "\n                )}\n\n"
new_content += "                {/* Footer */}\n" + final_content

# Final check: root balance
# (We already have root closings at the end of final_content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Flattening and balancing complete.")
