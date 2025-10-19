import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Hardcoded category order
const CATEGORY_ORDER = [
  'সেলফ-ইম্প্রুভমেন্ট-ও-বয়েজ-ইস্যু',
  'রোমান্স-ও-রিলেশনশীপ',
  'ফেমিনিজম',
  'সমরাস্ত্র-ও-যুদ্ধকৌশল',
  'বিদেশী-পলিটিক্স',
  'ভারত-ও-হিন্দুত্ববাদ',
  'সোশ্যাল-ইস্যু',
  'টেকনোলজি',
  'দেশী-পলিটিক্স',
  'জুলাই-অভ্যুত্থান'
];

interface SidebarItem {
  text: string;
  link?: string;
  collapsed?: boolean;
  items?: (SidebarItem | SidebarGroup)[];
}

interface SidebarGroup {
  text: string;
  collapsed: boolean;
  items: (SidebarItem | SidebarGroup)[];
}

interface ArticleData {
  title: string;
  slug?: string;
  category?: string;
}

function formatCategoryName(name: string): string {
  // Remove number prefix (e.g., "১-" or "1-") and replace hyphens with spaces
  const withoutNumberPrefix = name.replace(/^[০-৯\d]+-/, '');
  return withoutNumberPrefix.replace(/-/g, ' ');
}

function getCategoryOrder(name: string): number {
  // Remove numeric prefix to get the actual category name
  const categoryName = name.replace(/^[০-৯\d]+-/, '');
  const index = CATEGORY_ORDER.indexOf(categoryName);
  return index >= 0 ? index : Infinity;
}

function extractSortOrder(name: string): number {
  // Extract numeric prefix for sorting (supports both Bengali and English numerals)
  const bengaliNumerals = '০১২৩৪৫৬৭৮৯';
  const match = name.match(/^[০-৯\d]+/);

  if (match) {
    const numStr = match[0];
    // Convert Bengali numerals to English if needed
    let converted = '';
    for (const char of numStr) {
      const bengaliIndex = bengaliNumerals.indexOf(char);
      converted += bengaliIndex >= 0 ? bengaliIndex.toString() : char;
    }
    return parseInt(converted, 10);
  }

  return Infinity; // Items without numbers go to the end
}

function extractArticleData(filePath: string): ArticleData {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);
    const basename = path.basename(filePath, path.extname(filePath));
    return {
      title: data.title || formatCategoryName(basename),
      slug: data.slug,
      category: data.category
    };
  } catch (error) {
    const basename = path.basename(filePath, path.extname(filePath));
    return {
      title: formatCategoryName(basename)
    };
  }
}

function processDirectory(dirPath: string, baseUrlPath: string = ''): (SidebarItem | SidebarGroup)[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const itemsWithOriginalName: Array<{ item: SidebarItem | SidebarGroup, originalName: string }> = [];

  // Separate files and directories
  const files = entries.filter(entry => entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')));
  const directories = entries.filter(entry => entry.isDirectory());

  // Process files
  for (const file of files) {
    const filePath = path.join(dirPath, file.name);
    const articleData = extractArticleData(filePath);
    const fileName = file.name.replace(/\.(md|mdx)$/, '');
    const link = `${baseUrlPath}/${fileName}`;

    itemsWithOriginalName.push({
      item: {
        text: articleData.title,
        link: link
      },
      originalName: fileName
    });
  }

  // Process subdirectories (nested groups)
  for (const dir of directories) {
    const subDirPath = path.join(dirPath, dir.name);
    const subUrlPath = `${baseUrlPath}/${dir.name}`;
    const subItems = processDirectory(subDirPath, subUrlPath);

    if (subItems.length > 0) {
      itemsWithOriginalName.push({
        item: {
          text: formatCategoryName(dir.name),
          collapsed: true,
          items: subItems
        },
        originalName: dir.name
      });
    }
  }

  // Sort items: directories first, then by numeric order/alphabetically
  itemsWithOriginalName.sort((a, b) => {
    const aIsGroup = 'items' in a.item && !('link' in a.item);
    const bIsGroup = 'items' in b.item && !('link' in b.item);

    if (aIsGroup && !bIsGroup) return -1;
    if (!aIsGroup && bIsGroup) return 1;

    // Both are same type, check for numeric ordering
    const orderA = extractSortOrder(a.originalName);
    const orderB = extractSortOrder(b.originalName);

    if (orderA !== Infinity && orderB !== Infinity && orderA !== orderB) {
      return orderA - orderB;
    }

    // Fall back to alphabetical sorting
    return a.item.text.localeCompare(b.item.text);
  });

  return itemsWithOriginalName.map(x => x.item);
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

  // Sort categories by hardcoded order
  categories.sort((a, b) => {
    const orderA = getCategoryOrder(a);
    const orderB = getCategoryOrder(b);

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // If both have same order or no order, sort alphabetically
    return a.localeCompare(b);
  });

  // Process each category
  for (const category of categories) {
    const categoryPath = path.join(articlesDir, category);
    const items = processDirectory(categoryPath, `/${category}`);

    if (items.length === 0) continue;

    sidebar.push({
      text: formatCategoryName(category),
      collapsed: true,
      items: items
    });
  }

  return sidebar;
}

