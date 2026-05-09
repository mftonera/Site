import glob

favicon_html = '''    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png">
'''

for file in glob.glob('membro-*.html'):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'favicon-32x32.png' not in content:
        content = content.replace('</head>', favicon_html + '</head>')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print('Added favicons to all member pages.')
