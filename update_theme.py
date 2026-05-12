import os

style_css_path = 'style.css'
index_html_path = 'index.html'
dashboard_css_path = 'dashboard.css'
dashboard_html_path = 'dashboard.html'

with open(style_css_path, 'r', encoding='utf-8') as f:
    style_content = f.read()

# Replace :root
old_root = """:root {
    /* Color Palette */
    --color-bg: #0A0A0A;
    --color-surface: #141414;
    --color-surface-light: #1E1E1E;

    --color-primary: #b62532;
    /* Brand Red */
    --color-primary-hover: #8c1b25;
    --color-primary-light: rgba(182, 37, 50, 0.15);

    --color-gradient-1: #b62532;
    --color-gradient-2: #8c1b25;
    --gradient-brand: linear-gradient(135deg, var(--color-gradient-1), var(--color-gradient-2));


    --color-text: #F0F0F0;
    --color-text-muted: #A0A0A0;

    /* Typography */
    --font-heading: 'Outfit', sans-serif;
    --font-body: 'Inter', sans-serif;

    /* Transitions */
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
}"""

new_root = """:root {
    /* Day Mode (Default) */
    --color-bg: #FFFFFF;
    --color-surface: #F8F9FA;
    --color-surface-light: #E9ECEF;

    --color-primary: #b62532;
    --color-primary-hover: #8c1b25;
    --color-primary-rgb: 182, 37, 50;
    --color-primary-light: rgba(var(--color-primary-rgb), 0.15);

    --color-gradient-1: #b62532;
    --color-gradient-2: #8c1b25;
    --gradient-brand: linear-gradient(135deg, var(--color-gradient-1), var(--color-gradient-2));

    --color-text: #1A1A1A;
    --color-text-muted: #6C757D;

    --nav-bg: rgba(255, 255, 255, 0.85);
    --nav-border: rgba(0, 0, 0, 0.05);
    --hero-overlay: linear-gradient(to right, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.4) 100%), radial-gradient(circle at 70% 30%, rgba(var(--color-primary-rgb), 0.1) 0%, transparent 50%);
    --glass-bg: rgba(255, 255, 255, 0.5);
    --glass-border: rgba(0, 0, 0, 0.1);
    --card-border: rgba(0, 0, 0, 0.05);
    --input-border: rgba(0, 0, 0, 0.1);
    --footer-border: rgba(0, 0, 0, 0.05);
    --case-card-bg: linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%);
    
    /* Typography */
    --font-heading: 'Outfit', sans-serif;
    --font-body: 'Inter', sans-serif;

    /* Transitions */
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
}

[data-theme="dark"] {
    /* Night Mode (Option) */
    --color-bg: #0A0A0A;
    --color-surface: #141414;
    --color-surface-light: #1E1E1E;

    --color-primary: #e65b2a;
    --color-primary-hover: #cc4d20;
    --color-primary-rgb: 230, 91, 42;
    --color-primary-light: rgba(var(--color-primary-rgb), 0.15);

    --color-gradient-1: #e65b2a;
    --color-gradient-2: #cc4d20;
    --gradient-brand: linear-gradient(135deg, var(--color-gradient-1), var(--color-gradient-2));

    --color-text: #F0F0F0;
    --color-text-muted: #A0A0A0;

    --nav-bg: rgba(10, 10, 10, 0.85);
    --nav-border: rgba(255, 255, 255, 0.05);
    --hero-overlay: linear-gradient(to right, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.4) 100%), radial-gradient(circle at 70% 30%, rgba(var(--color-primary-rgb), 0.3) 0%, transparent 50%);
    --glass-bg: rgba(30, 30, 30, 0.5);
    --glass-border: rgba(255, 255, 255, 0.1);
    --card-border: rgba(255, 255, 255, 0.05);
    --input-border: rgba(255, 255, 255, 0.1);
    --footer-border: rgba(255, 255, 255, 0.05);
    --case-card-bg: linear-gradient(135deg, #1A1A1A 0%, #111111 100%);
}"""

if old_root in style_content:
    style_content = style_content.replace(old_root, new_root)
else:
    print("Warning: old root not found in style.css")

# style.css replaces
style_replaces = [
    ('box-shadow: 0 4px 15px rgba(182, 37, 50, 0.3);', 'box-shadow: 0 4px 15px rgba(var(--color-primary-rgb), 0.3);'),
    ('box-shadow: 0 6px 20px rgba(182, 37, 50, 0.5);', 'box-shadow: 0 6px 20px rgba(var(--color-primary-rgb), 0.5);'),
    ('background: rgba(10, 10, 10, 0.85);', 'background: var(--nav-bg);'),
    ('border-bottom: 1px solid rgba(255, 255, 255, 0.05);', 'border-bottom: 1px solid var(--nav-border);'),
    ('background: linear-gradient(to right, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.4) 100%),\n        radial-gradient(circle at 70% 30%, rgba(182, 37, 50, 0.3) 0%, transparent 50%);', 'background: var(--hero-overlay);'),
    ('background: rgba(30, 30, 30, 0.5);', 'background: var(--glass-bg);'),
    ('border: 1px solid rgba(255, 255, 255, 0.1);', 'border: 1px solid var(--glass-border);'),
    ('border: 1px solid rgba(255, 255, 255, 0.05);', 'border: 1px solid var(--card-border);'),
    ('border-color: rgba(182, 37, 50, 0.3);', 'border-color: rgba(var(--color-primary-rgb), 0.3);'),
    ('border-color: rgba(230, 91, 42, 0.3);', 'border-color: rgba(var(--color-primary-rgb), 0.3);'),
    ('border-top: 1px solid rgba(255, 255, 255, 0.05);', 'border-top: 1px solid var(--footer-border);'),
]

for old, new in style_replaces:
    style_content = style_content.replace(old, new)

# Add theme toggle button css
if '.theme-toggle-btn' not in style_content:
    style_content += """
.theme-toggle-btn {
    background: transparent;
    border: none;
    color: var(--color-text);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all var(--transition-fast);
    margin-left: auto;
}

.theme-toggle-btn:hover {
    background: var(--color-surface-light);
    color: var(--color-primary);
}
"""

with open(style_css_path, 'w', encoding='utf-8') as f:
    f.write(style_content)

print("Updated style.css")

# Update index.html
with open(index_html_path, 'r', encoding='utf-8') as f:
    index_content = f.read()

index_replaces = [
    ('#e54d3c', 'var(--color-primary)'),
    ('rgba(229, 77, 60, 0.05)', 'rgba(var(--color-primary-rgb), 0.05)'),
    ('rgba(229, 77, 60, 0.15)', 'rgba(var(--color-primary-rgb), 0.15)'),
    ('linear-gradient(135deg, #1A1A1A 0%, #111111 100%)', 'var(--case-card-bg)'),
    ('border: 1px solid rgba(255,255,255,0.05)', 'border: 1px solid var(--card-border)'),
    ('border-top: 1px solid rgba(255,255,255,0.05)', 'border-top: 1px solid var(--footer-border)'),
]

for old, new in index_replaces:
    index_content = index_content.replace(old, new)

toggle_html = """                <button id="theme-toggle" class="theme-toggle-btn" aria-label="Alternar tema">
                    <svg id="theme-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </button>
                <a href="dashboard.html" """

if 'id="theme-toggle"' not in index_content:
    index_content = index_content.replace('<a href="dashboard.html" ', toggle_html)

with open(index_html_path, 'w', encoding='utf-8') as f:
    f.write(index_content)
    
print("Updated index.html")

# Update dashboard.html
with open(dashboard_html_path, 'r', encoding='utf-8') as f:
    dash_content = f.read()

toggle_html_dash = """                <div class="user-profile" style="display: flex; align-items: center; gap: 1rem;">
                    <button id="theme-toggle" class="theme-toggle-btn" aria-label="Alternar tema" style="margin:0;">
                        <svg id="theme-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                    </button>"""

if 'id="theme-toggle"' not in dash_content:
    dash_content = dash_content.replace('<div class="user-profile" style="display: flex; align-items: center; gap: 1rem;">', toggle_html_dash)

# Fix inline styles in dashboard.html
dash_content = dash_content.replace('border-color: rgba(255,255,255,0.2)', 'border-color: var(--input-border)')
dash_content = dash_content.replace('border-top: 1px solid rgba(255,255,255,0.05)', 'border-top: 1px solid var(--footer-border)')

with open(dashboard_html_path, 'w', encoding='utf-8') as f:
    f.write(dash_content)

print("Updated dashboard.html")

# Update dashboard.css
with open(dashboard_css_path, 'r', encoding='utf-8') as f:
    dash_css_content = f.read()

dash_css_replaces = [
    ('background: rgba(10, 10, 10, 0.85);', 'background: var(--nav-bg);'),
    ('border-bottom: 1px solid rgba(255, 255, 255, 0.05);', 'border-bottom: 1px solid var(--nav-border);'),
    ('border: 1px solid rgba(255, 255, 255, 0.05);', 'border: 1px solid var(--card-border);'),
    ('border-color: rgba(182, 37, 50, 0.3);', 'border-color: rgba(var(--color-primary-rgb), 0.3);'),
    ('background: rgba(255, 255, 255, 0.02);', 'background: var(--color-surface-light);'),
    ('border-bottom: 1px solid rgba(255, 255, 255, 0.1);', 'border-bottom: 1px solid var(--glass-border);'),
    ('background: rgba(182, 37, 50, 0.05);', 'background: rgba(var(--color-primary-rgb), 0.05);'),
    ('radial-gradient(circle at 30% 70%, rgba(182, 37, 50, 0.15) 0%, transparent 50%)', 'radial-gradient(circle at 30% 70%, rgba(var(--color-primary-rgb), 0.15) 0%, transparent 50%)'),
    ('radial-gradient(circle at 70% 30%, rgba(182, 37, 50, 0.2) 0%, transparent 50%)', 'radial-gradient(circle at 70% 30%, rgba(var(--color-primary-rgb), 0.2) 0%, transparent 50%)'),
]

for old, new in dash_css_replaces:
    dash_css_content = dash_css_content.replace(old, new)

with open(dashboard_css_path, 'w', encoding='utf-8') as f:
    f.write(dash_css_content)

print("Updated dashboard.css")

