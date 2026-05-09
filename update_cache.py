import glob

for file in glob.glob('membro-*.html'):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('href="style.css"', 'href="style.css?v=2"')
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print('Done!')
