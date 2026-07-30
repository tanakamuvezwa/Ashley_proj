const fs = require('fs');
const path = require('path');

function replaceInlineStyles(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix Navbar specific ternaries
  if (filePath.endsWith('Navbar.tsx')) {
    content = content.replace(/const isLight = theme === 'theme-light';\s*\n?/g, '');
    content = content.replace(/\$\{isLight \? 'bg-slate-100\/80' : ''\}/g, '');
    // This regex catches: : isLight ? '...' : '...'
    content = content.replace(/\s*:\s*isLight\s*\?\s*'[^']+'\s*:\s*'([^']+)'/g, ' : \'$1\'');
  }

  // Replace style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
  // by appending theme-surface theme-text to the className that precedes it.
  // Wait, regex for this is complex. Let's just do simple string replacements for the known instances.
  content = content.replace(/className="([^"]+)"\s*style=\{\{\s*background:\s*'var\(--bg-surface\)',\s*color:\s*'var\(--text-primary\)'\s*\}\}/g, 'className="$1 theme-surface theme-text"');
  content = content.replace(/className=\{`([^`]+)`\}\s*style=\{\{\s*background:\s*'var\(--bg-surface\)',\s*color:\s*'var\(--text-primary\)'\s*\}\}/g, 'className={`$1 theme-surface theme-text`}');

  content = content.replace(/className="([^"]+)"\s*style=\{\{\s*background:\s*'var\(--bg-surface\)'\s*\}\}/g, 'className="$1 theme-surface"');
  content = content.replace(/className=\{`([^`]+)`\}\s*style=\{\{\s*background:\s*'var\(--bg-surface\)'\s*\}\}/g, 'className={`$1 theme-surface`}');

  // InsurancePage.tsx static rgba backgrounds
  if (filePath.endsWith('InsurancePage.tsx')) {
    content = content.replace(/style=\{\{\s*background:\s*'rgba\(16,185,129,0\.1\)'\s*\}\}/g, '');
    content = content.replace(/style=\{\{\s*background:\s*'rgba\(255,255,255,0\.05\)'\s*\}\}/g, '');
    content = content.replace(/bg-current\/10 bg-opacity-10/g, 'bg-[var(--accent-soft)]');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed: ${filePath}`);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      replaceInlineStyles(fullPath);
    }
  }
}

const componentsDir = path.join(__dirname, 'src', 'components');
walkDir(componentsDir);
