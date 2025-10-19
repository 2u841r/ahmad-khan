import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateSidebar } from './sidebar.mts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function generateMarkdownIndex() {
  const sidebar = generateSidebar();

  let md = `---
aside: false
---
## সূচীপত্র

`;

  for (const category of sidebar) {
    // Top-level category
    md += `### ${category.text}\n\n`;

    // Append only direct articles
    for (const item of category.items) {
      if (item.link) {
        md += `##### [${item.text}](${item.link})\n`;
      }
    }

    // Append subcategories as independent H3
    for (const item of category.items) {
      if (item.items) {
        md += `\n### ${item.text}\n\n`;
        for (const sub of item.items) {
          if (sub.link) {
            md += `##### [${sub.text}](${sub.link})\n`;
          }
        }
      }
    }

    md += '\n';
  }

  const outputPath = path.resolve(__dirname, '../articles/index.md');
  fs.writeFileSync(outputPath, md, 'utf-8');
  console.log(`✅ Generated index.md at ${outputPath}`);
}

generateMarkdownIndex();
