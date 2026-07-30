const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');
const appFile = path.join(__dirname, 'src', 'App.tsx');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove hardcoded background colors that override theme variables
  content = content.replace(/\bbg-slate-(800|900|950)(\/\d+)?\b/g, '');
  content = content.replace(/\bbg-\[#0B0F17\]\b/g, '');
  content = content.replace(/\bbg-\[#0F172A\]\b/g, '');
  
  // Replace text-white with a more neutral text class or let it inherit var(--text-primary)
  // Actually, let's keep text-white for buttons, but maybe remove it from glass-card headers
  // For safety, let's replace text-white with theme-text if we had a utility class for it, 
  // but we can just leave it or let body handle it. We will leave text-white alone for now, 
  // just fixing backgrounds is 90% of the theme issue.

  // Also replace hardcoded border colors that override glass-card
  content = content.replace(/\bborder-white\/\d+\b/g, '');
  
  // Clean up double spaces created by removals
  content = content.replace(/  +/g, ' ');

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
      processFile(fullPath);
    }
  }
}

// Process App.tsx
if (fs.existsSync(appFile)) processFile(appFile);

// Process all components
walkDir(componentsDir);

console.log('Done fixing themes!');
