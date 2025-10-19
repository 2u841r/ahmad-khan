import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const articlesDir = path.resolve(__dirname, 'articles');

let count = 0;

function renameMdxInDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively process subdirectories
      renameMdxInDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      // Rename .mdx to .md
      const newPath = fullPath.replace(/\.mdx$/, '.md');
      fs.renameSync(fullPath, newPath);
      count++;
      console.log(`✓ ${entry.name} → ${entry.name.replace('.mdx', '.md')}`);
    }
  }
}

console.log('Starting to rename .mdx files to .md...\n');
renameMdxInDirectory(articlesDir);
console.log(`\n✅ Done! Renamed ${count} files from .mdx to .md`);
console.log('VitePress can now route to your articles correctly.');

