import os

js_code = """
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    const rootHtml = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    if (currentTheme === 'dark') {
        rootHtml.setAttribute('data-theme', 'dark');
        updateThemeIcons('dark');
    }

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isDark = rootHtml.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';
            
            if (newTheme === 'dark') {
                rootHtml.setAttribute('data-theme', 'dark');
            } else {
                rootHtml.removeAttribute('data-theme');
            }
            
            localStorage.setItem('theme', newTheme);
            updateThemeIcons(newTheme);
        });
    });

    function updateThemeIcons(theme) {
        const paths = {
            light: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z', // Moon icon
            dark: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' // Sun icon
        };
        
        document.querySelectorAll('.theme-toggle-btn svg').forEach(svg => {
            if (theme === 'dark') {
                 svg.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
            } else {
                 svg.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
            }
        });
    }
});
"""

def append_if_missing(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'Theme Toggle Logic' not in content:
        with open(file_path, 'a', encoding='utf-8') as f:
            f.write(js_code)
        print(f"Appended to {file_path}")
    else:
        print(f"Already appended in {file_path}")

append_if_missing('main.js')
append_if_missing('dashboard.js')

# Wait, let's also fix the SVG initialization in html files
# Initial is light theme, so moon icon. It's already the moon icon.

# We must also apply theme early to prevent flash of wrong theme
early_script = """    <script>
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    </script>"""

def add_early_script(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'localStorage.getItem(\'theme\')' not in content:
        content = content.replace('</head>', f'{early_script}\n</head>')
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Added early script to {file_path}")

add_early_script('index.html')
add_early_script('dashboard.html')
