import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface SidebarItem {
  text: string;
  link: string;
}

interface SidebarGroup {
  text: string;
  collapsed: boolean;
  items: SidebarItem[];
}

interface ArticleData {
  title: string;
  slug?: string;
  category?: string;
}

function extractArticleData(filePath: string): ArticleData {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);
    const basename = path.basename(filePath, path.extname(filePath));
    return {
      title: data.title || basename,
      slug: data.slug,
      category: data.category
    };
  } catch (error) {
    const basename = path.basename(filePath, path.extname(filePath));
    return {
      title: basename
    };
  }
}

export function generateSidebar(): SidebarGroup[] {
  const articlesDir = path.resolve(__dirname, '../articles');
  const sidebar: SidebarGroup[] = [];

  // Read all directories in articles folder
  const entries = fs.readdirSync(articlesDir, { withFileTypes: true });
  
  // Filter to get only directories, excluding 'all' folder
  const categories = entries
    .filter(entry => entry.isDirectory() && entry.name !== 'all')
    .map(entry => entry.name);

  // Sort categories alphabetically
  categories.sort();

  // Process each category
  for (const category of categories) {
    const categoryPath = path.join(articlesDir, category);
    const files = fs.readdirSync(categoryPath);
    
    // Filter only .md and .mdx files (for backward compatibility)
    const mdFiles = files.filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
    
    if (mdFiles.length === 0) continue;

    const items: SidebarItem[] = [];

    // Process each file in the category
    for (const file of mdFiles) {
      const filePath = path.join(categoryPath, file);
      const articleData = extractArticleData(filePath);
      // Keep the original Bengali filename for URL
      const fileName = file.replace(/\.(md|mdx)$/, '');
      const link = `/${category}/${fileName}`;
      
      items.push({
        text: articleData.title,
        link: link
      });
    }

    // Sort items by title
    items.sort((a, b) => a.text.localeCompare(b.text));

    sidebar.push({
      text: category,
      collapsed: true,
      items: items
    });
  }

  return sidebar;
}

