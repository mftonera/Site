import glob

files = glob.glob('membro-*.html')

for file in files:
    if 'matheus' in file:
        continue
        
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace default # hrefs with generic links
    # The first # is LinkedIn, the second is Instagram
    if 'href="#" target="_blank" class="social-icon-link" title="LinkedIn"' in content:
        content = content.replace('href="#" target="_blank" class="social-icon-link" title="LinkedIn"', 'href="https://www.linkedin.com/company/sinc-jr" target="_blank" class="social-icon-link" title="LinkedIn"')
    
    if 'href="#" target="_blank" class="social-icon-link" title="Instagram"' in content:
        content = content.replace('href="#" target="_blank" class="social-icon-link" title="Instagram"', 'href="https://www.instagram.com/sinc.jr" target="_blank" class="social-icon-link" title="Instagram"')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
print('Updated default links for other members.')
