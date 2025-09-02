import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'src/contents');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  excerpt: string;
  content: string;
  locale: string;
}

export function getAllPosts(locale: string = 'pt'): BlogPost[] {
  const localeDirectory = path.join(postsDirectory, locale);
  
  if (!fs.existsSync(localeDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(localeDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(localeDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        locale,
        title: matterResult.data.title,
        date: matterResult.data.date,
        author: matterResult.data.author,
        tags: matterResult.data.tags || [],
        excerpt: matterResult.data.excerpt,
        content: matterResult.content,
      } as BlogPost;
    });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostBySlug(slug: string, locale: string = 'pt'): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, locale, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      locale,
      title: matterResult.data.title,
      date: matterResult.data.date,
      author: matterResult.data.author,
      tags: matterResult.data.tags || [],
      excerpt: matterResult.data.excerpt,
      content: contentHtml,
    };
  } catch {
    return null;
  }
}

export function getPostSlugs(locale: string = 'pt'): string[] {
  const localeDirectory = path.join(postsDirectory, locale);
  
  if (!fs.existsSync(localeDirectory)) {
    return [];
  }

  return fs
    .readdirSync(localeDirectory)
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''));
}