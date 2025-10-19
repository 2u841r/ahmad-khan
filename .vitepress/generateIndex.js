import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { generateSidebar } from './sidebar.mts'; // assuming your existing file is sidebar.js

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function generateMarkdownIndex() {
  const sidebar = generateSidebar();
  let md = `---
aside: false
---
## সূচীপত্র

`;

  for (const category of sidebar) {
    md += `### ${category.text}\n\n`;

    for (const item of category.items) {
      appendItems(item);
    }

    md += '\n';
  }

  function appendItems(item, depth = 5) {
    if (item.link) {
      md += `${'#'.repeat(depth)} [${item.text}](${item.link})\n`;
    } else if (item.items) {
      // Nested folders inside a category
      md += `\n${'#'.repeat(depth - 1)} ${item.text}\n`;
      for (const sub of item.items) {
        appendItems(sub, depth);
      }
    }
  }

  const outputPath = path.resolve(__dirname, '../articles/index.md');
  fs.writeFileSync(outputPath, md, 'utf-8');
  console.log(`✅ Generated index.md at ${outputPath}`);
}

generateMarkdownIndex();
