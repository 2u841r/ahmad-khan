import fs from 'fs';
import path from 'path';

function generateTree(dir, prefix = '') {
  let result = '';
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    if (item.name === 'all') continue; // skip "all" folder

    const fullPath = path.join(dir, item.name);
    result += prefix + '├── ' + item.name + '\n';

    if (item.isDirectory()) {
      result += generateTree(fullPath, prefix + '│   ');
    }
  }
  return result;
}

// Change this to your root directory
const rootDir = './';
const tree = generateTree(rootDir);

// Save to text file
fs.writeFileSync('tree.txt', tree, 'utf8');

console.log('✅ File tree saved to tree.txt');
