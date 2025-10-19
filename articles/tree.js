import fs from 'fs';
import path from 'path';

function printTree(dir, prefix = '') {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    if (item.name === 'all') continue; // skip "all" folder

    const fullPath = path.join(dir, item.name);
    console.log(prefix + '├── ' + item.name);

    if (item.isDirectory()) {
      printTree(fullPath, prefix + '│   ');
    }
  }
}

// Change this to your root directory
const rootDir = './';
printTree(rootDir);
