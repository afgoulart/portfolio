'use server';

import fs from 'fs';
import path from 'path';
import { ContentIndex, PostIndex } from './content-client';

const postsDirectory = path.join(process.cwd(), 'src/contents');

async function loadContentIndex(): Promise<ContentIndex> {
  try {
    const indexPath = path.join(postsDirectory, 'content-index.json');
    const indexContent = await fs.promises.readFile(indexPath, 'utf8');
    return JSON.parse(indexContent);
  } catch (error) {
    console.error('Failed to load content index:', error);
    // Fallback empty structure
    return {
      totalPosts: 0,
      locales: [],
      years: {},
      posts: [],
      tags: {},
    };
  }
}

export async function getContentIndexAction(): Promise<ContentIndex> {
  return await loadContentIndex();
}

export async function getPaginatedPostsAction(options: {
  page?: number;
  limit?: number;
  locale?: string;
  tag?: string;
  year?: number;
  month?: number;
  search?: string;
} = {}): Promise<{
  data: PostIndex[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
  };
}> {
  const contentIndex = await loadContentIndex();
  
  const {
    page = 1,
    limit = 10,
    locale,
    tag,
    year,
    month,
    search,
  } = options;

  let posts = [...contentIndex.posts];

  // Apply filters
  if (locale) {
    posts = posts.filter(post => post.locale === locale);
  }

  if (tag) {
    posts = posts.filter(post => post.tags.includes(tag));
  }

  if (year) {
    posts = posts.filter(post => post.year === year);
  }

  if (month && year) {
    posts = posts.filter(post => post.year === year && post.month === month);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.tags.some(t => t.toLowerCase().includes(searchLower))
    );
  }

  // Calculate pagination
  const totalItems = posts.length;
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedPosts = posts.slice(startIndex, endIndex);

  return {
    data: paginatedPosts,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
      limit,
    },
  };
}

export async function getAllTagsAction(locale?: string): Promise<Array<{ tag: string; count: number }>> {
  const contentIndex = await loadContentIndex();
  
  if (!locale) {
    return Object.entries(contentIndex.tags)
      .map(([tag, data]) => ({ tag, count: data.count }))
      .sort((a, b) => b.count - a.count);
  }

  // Filter tags by locale
  const localeTags: { [tag: string]: number } = {};
  
  contentIndex.posts
    .filter(post => post.locale === locale)
    .forEach(post => {
      post.tags.forEach(tag => {
        localeTags[tag] = (localeTags[tag] || 0) + 1;
      });
    });

  return Object.entries(localeTags)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getArchiveAction(locale?: string): Promise<Array<{ year: number; month: number; count: number; monthName: string }>> {
  const contentIndex = await loadContentIndex();
  const archive: Array<{ year: number; month: number; count: number; monthName: string }> = [];
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  Object.entries(contentIndex.years).forEach(([yearStr, yearData]) => {
    const year = parseInt(yearStr);
    
    Object.entries(yearData.months).forEach(([monthStr, monthData]) => {
      const month = parseInt(monthStr);
      
      let count = monthData.count;
      if (locale) {
        count = 0;
        Object.values(monthData.days).forEach(dayData => {
          count += dayData.posts.filter(post => post.locale === locale).length;
        });
      }
      
      if (count > 0) {
        archive.push({
          year,
          month,
          count,
          monthName: monthNames[month - 1],
        });
      }
    });
  });

  return archive.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
}