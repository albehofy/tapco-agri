import os
import re

def rewrite_config(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Imports
    content = re.sub(r"import\s*\{\s*provideAnimationsAsync\s*\}\s*from\s*'@angular/platform-browser/animations/async';\n", "", content)
    content = re.sub(r"import\s*\{\s*providePrimeNG\s*\}\s*from\s*'primeng/config';\n", "", content)
    content = re.sub(r"import\s*Aura\s*from\s*'@primeng/themes/aura';\n", "", content)

    # Providers
    content = re.sub(r"\s*provideAnimationsAsync\(\),", "", content)
    content = re.sub(r"\s*providePrimeNG\(\{[\s\S]*?ripple:\s*(true|false)\n\s*\}\),", "", content)

    with open(filepath, 'w') as f:
        f.write(content)

rewrite_config('/run/media/devoryx/Storage/tapco/dashboard/src/app/app.config.ts')
rewrite_config('/run/media/devoryx/Storage/tapco/website/src/app/app.config.ts')

def rewrite_styles(filepath, add_select_css=False):
    with open(filepath, 'r') as f:
        content = f.read()

    content = re.sub(r'@import\s+"primeicons/primeicons\.css";\n?', "", content)

    if add_select_css:
        css = '''
.custom-select-wrap { position: relative; }
.form-select { width: 100%; padding: 0.55rem 2.25rem 0.55rem 0.75rem; border: 1px solid var(--admin-border); border-radius: var(--radius-sm); background: #fff; font-size: 0.9rem; color: var(--admin-text); appearance: none; -webkit-appearance: none; cursor: pointer; line-height: 1.4; }
.form-select:focus { outline: none; border-color: var(--admin-green-600); box-shadow: 0 0 0 3px rgba(18,67,54,0.12); }
.custom-select-wrap::after { content: ''; position: absolute; inset-inline-end: 0.75rem; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid #53645e; pointer-events: none; }
'''
        content += css

    with open(filepath, 'w') as f:
        f.write(content)

rewrite_styles('/run/media/devoryx/Storage/tapco/dashboard/src/styles.scss', add_select_css=True)
rewrite_styles('/run/media/devoryx/Storage/tapco/website/src/styles.scss', add_select_css=False)

