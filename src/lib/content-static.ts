// Static content library - reads from pre-generated JSON files
import type { PostIndex, ContentIndex, PaginationOptions, PaginatedResult } from './content-client';
import contentIndexData from '@/contents/content-index.json';

// Cast the imported JSON to our TypeScript types
const contentIndex: ContentIndex = contentIndexData as ContentIndex;

/**
 * Get paginated posts with filtering support
 */
export function getPaginatedPosts({
  page = 1,
  limit = 10,
  locale,
  tag,
  search,
  year,
  month,
  day
}: PaginationOptions): PaginatedResult {
  let filteredPosts = contentIndex.posts.filter(post => post.locale === locale);

  // Apply filters
  if (tag) {
    filteredPosts = filteredPosts.filter(post => 
      post.tags.some(postTag => postTag.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter(post =>
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  if (year) {
    filteredPosts = filteredPosts.filter(post => post.year === year);
  }

  if (month) {
    filteredPosts = filteredPosts.filter(post => post.month === month);
  }

  if (day) {
    filteredPosts = filteredPosts.filter(post => post.day === day);
  }

  // Sort by date (newest first)
  filteredPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate pagination
  const totalItems = filteredPosts.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return {
    data: paginatedPosts,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      limit,
    },
  };
}

/**
 * Get all unique tags with their counts for a specific locale
 */
export function getAllTags(locale: string): Array<{ tag: string; count: number }> {
  const tagCounts = new Map<string, number>();
  
  const localePosts = contentIndex.posts.filter(post => post.locale === locale);
  
  localePosts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get archive data (years/months/days) for a specific locale
 */
export function getArchive(locale: string): Array<{ year: number; month: number; count: number; monthName: string }> {
  const archiveMap = new Map<string, number>();
  
  const localePosts = contentIndex.posts.filter(post => post.locale === locale);
  
  localePosts.forEach(post => {
    const key = `${post.year}-${post.month}`;
    archiveMap.set(key, (archiveMap.get(key) || 0) + 1);
  });

  const monthNames = locale === 'pt' 
    ? ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    : ['January', 'February', 'March', 'April', 'May', 'June',
       'July', 'August', 'September', 'October', 'November', 'December'];

  return Array.from(archiveMap.entries())
    .map(([key, count]) => {
      const [year, month] = key.split('-').map(Number);
      return {
        year,
        month,
        count,
        monthName: monthNames[month - 1],
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
}

/**
 * Get a single post by slug and locale
 */
export function getPostBySlug(slug: string, locale: string): PostIndex | null {
  return contentIndex.posts.find(post => 
    post.slug === slug && post.locale === locale
  ) || null;
}

/**
 * Get the full content index
 */
export function getContentIndex(): ContentIndex {
  return contentIndex;
}

/**
 * Get all posts for a specific locale
 */
export function getPostsByLocale(locale: string): PostIndex[] {
  return contentIndex.posts
    .filter(post => post.locale === locale)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Search posts across title, excerpt, and tags
 */
export function searchPosts(query: string, locale: string, limit: number = 10): PostIndex[] {
  const searchLower = query.toLowerCase();
  
  return contentIndex.posts
    .filter(post => post.locale === locale)
    .filter(post =>
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}