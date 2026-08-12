import os
import glob

files = glob.glob('src/**/*.jsx', recursive=True)
for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    content = content.replace('\\`', '`')
    content = content.replace('\\$', '$')
    content = content.replace('\\(', '(')
    content = content.replace('\\)', ')')
    
    with open(f, 'w') as file:
        file.write(content)
