// Quick feature check script
const fs = require('fs');
const path = require('path');

console.log('=== OpenDocs Feature Check ===\n');

// Check which blocks are implemented
const blocksDir = path.join(__dirname, 'src/components/blocks');
const files = fs.readdirSync(blocksDir);

console.log('📦 IMPLEMENTED BLOCKS:');
files.forEach(f => {
  if (f.endsWith('.tsx') && !f.includes('types')) {
    const name = f.replace('.tsx', '').replace('View', '');
    console.log(`  • ${name}`);
  }
});

// Check store for features
const storePath = path.join(__dirname, 'src/store/useDocsStore.ts');
const storeContent = fs.readFileSync(storePath, 'utf8');

console.log('\n🔍 STORE FEATURES DETECTED:');
const features = [
  { name: 'AI Command Execution', pattern: /executeCommand/ },
  { name: 'Database Views', pattern: /DatabaseBlockView/ },
  { name: 'n8n Integration', pattern: /N8nBlockView/ },
  { name: 'Block Drag & Drop', pattern: /moveBlock/ },
  { name: 'Icon Management', pattern: /updatePageIcon|updateFolderIcon/ },
  { name: 'Hard Locks', pattern: /hardLock/ },
  { name: 'Theme Management', pattern: /setTheme/ },
];

features.forEach(feat => {
  if (feat.pattern.test(storeContent)) {
    console.log(`  ✅ ${feat.name}`);
  } else {
    console.log(`  ❌ ${feat.name} (MISSING)`);
  }
});

// Check for slash menu implementation
const appPath = path.join(__dirname, 'src/App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');

console.log('\n🎯 SLASH MENU CHECK:');
if (appContent.includes('SlashMenu') || appContent.includes('slashMenu')) {
  console.log('  ✅ Slash Menu implemented');
} else {
  console.log('  ❌ Slash Menu missing');
}

console.log('\n=== MANUAL CHECKLIST ===');
console.log('Open http://localhost:5173/ and verify:');
console.log('1. Type "/" - does slash menu appear?');
console.log('2. Try to create AI Block with "/ai"');
console.log('3. Try to drag blocks - is drag handle visible?');
console.log('4. Check if BlockToolbar shows AI Wand icon');
console.log('5. Try creating Database Block');
console.log('6. Check if n8n blocks can connect visually');
console.log('7. Test theme toggle (top right)');
console.log('8. Try changing page/folder icons');