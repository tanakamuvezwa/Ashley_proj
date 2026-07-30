const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'Navbar.tsx');
let content = fs.readFileSync(file, 'utf8');

// Remove isLight definition
content = content.replace(/const isLight = theme === 'theme-light';\s*\n?/g, '');

// Fix nav background ternary
content = content.replace(/\$\{isLight \? 'bg-slate-100\/80' : ''\}/g, '');

// Fix hover logic ternaries:
// : isLight ? 'theme-muted hover:theme-text hover:bg-slate-200/60' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
content = content.replace(/\s*:\s*isLight\s*\?\s*'[^']+'\s*:\s*'([^']+)'/g, ' : \'$1\'');

// Fix theme switcher inline styles
content = content.replace(/style=\{\{\s*background:\s*'var\(--bg-surface\)'\s*,\s*color:\s*'var\(--text-primary\)'\s*\}\}/g, 'className="theme-surface theme-text"');
content = content.replace(/style=\{\{\s*background:\s*'var\(--bg-surface\)'\s*\}\}/g, 'className="theme-surface"');
content = content.replace(/className="theme-surface"/g, ''); // wait, it might conflict if it's outside. Let's just remove the style block and add `theme-surface` manually via replace

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed Navbar ternaries.');
