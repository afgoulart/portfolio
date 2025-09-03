// Client-side content library that delegates to static content
// This maintains backward compatibility while using static JSON data

export interface PostIndex {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  excerpt: string;
  filename: string;
  locale: string;
  year: number;
  month: number;
  day: number;
}

export interface ContentIndex {
  totalPosts: number;
  locales: string[];
  years: {
    [year: string]: {
      months: {
        [month: string]: {
          days: {
            [day: string]: {
              count: number;
              posts: PostIndex[];
            };
          };
          count: number;
        };
      };
      count: number;
    };
  };
  posts: PostIndex[];
  tags: {
    [tag: string]: {
      count: number;
      posts: string[];
    };
  };
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  locale?: string;
  tag?: string;
  search?: string;
  year?: number;
  month?: number;
  day?: number;
}

export interface PaginatedResult<T = PostIndex> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
  };
}

// Import static functions
import * as staticContent from './content-static';

// Delegate all functions to static content
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function setContentIndex(_contentIndex: ContentIndex): void {
  // No-op since we're using static content
  console.log('setContentIndex called but using static content');
}

export function getContentIndex(): ContentIndex {
  return staticContent.getContentIndex();
}

export function getPaginatedPosts(options: PaginationOptions = {}): PaginatedResult<PostIndex> {
  return staticContent.getPaginatedPosts(options);
}

export function getAllTags(locale: string): Array<{ tag: string; count: number }> {
  return staticContent.getAllTags(locale);
}

export function getArchive(locale: string): Array<{ year: number; month: number; count: number; monthName: string }> {
  return staticContent.getArchive(locale);
}

export function getPostBySlug(slug: string, locale: string): PostIndex | null {
  return staticContent.getPostBySlug(slug, locale);
}

export function getPostsByLocale(locale: string): PostIndex[] {
  return staticContent.getPostsByLocale(locale);
}

export function searchPosts(query: string, locale: string, limit: number = 10): PostIndex[] {
  return staticContent.searchPosts(query, locale, limit);
}