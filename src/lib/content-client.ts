// Client-side version of content library - no fs dependency

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
      posts: string[]; // slugs
    };
  };
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  locale?: string;
  tag?: string;
  year?: number;
  month?: number;
  search?: string;
}

export interface PaginatedResult<T> {
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

// This will be populated by getStaticProps or getServerSideProps
let cachedContentIndex: ContentIndex | null = null;

export function setContentIndex(contentIndex: ContentIndex): void {
  cachedContentIndex = contentIndex;
}

export function getContentIndex(): ContentIndex {
  if (cachedContentIndex) {
    return cachedContentIndex;
  }

  // Fallback empty structure for client-side
  return {
    totalPosts: 0,
    locales: [],
    years: {},
    posts: [],
    tags: {},
  };
}

export function getPaginatedPosts(options: PaginationOptions = {}): PaginatedResult<PostIndex> {
  const {
    page = 1,
    limit = 10,
    locale,
    tag,
    year,
    month,
    search,
  } = options;

  const contentIndex = getContentIndex();
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

export function getPostsByDate(year: number, month?: number, day?: number, locale?: string): PostIndex[] {
  const contentIndex = getContentIndex();
  
  const yearData = contentIndex.years[year.toString()];
  if (!yearData) return [];

  if (!month) {
    // Return all posts for the year
    let yearPosts: PostIndex[] = [];
    Object.values(yearData.months).forEach(monthData => {
      Object.values(monthData.days).forEach(dayData => {
        yearPosts = yearPosts.concat(dayData.posts);
      });
    });
    
    if (locale) {
      yearPosts = yearPosts.filter(post => post.locale === locale);
    }
    
    return yearPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  const monthStr = month.toString().padStart(2, '0');
  const monthData = yearData.months[monthStr];
  if (!monthData) return [];

  if (!day) {
    // Return all posts for the month
    let monthPosts: PostIndex[] = [];
    Object.values(monthData.days).forEach(dayData => {
      monthPosts = monthPosts.concat(dayData.posts);
    });
    
    if (locale) {
      monthPosts = monthPosts.filter(post => post.locale === locale);
    }
    
    return monthPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  const dayStr = day.toString().padStart(2, '0');
  const dayData = monthData.days[dayStr];
  if (!dayData) return [];

  let dayPosts = dayData.posts;
  if (locale) {
    dayPosts = dayPosts.filter(post => post.locale === locale);
  }

  return dayPosts;
}

export function getPostsByTag(tag: string, locale?: string): PostIndex[] {
  const contentIndex = getContentIndex();
  
  const tagData = contentIndex.tags[tag];
  if (!tagData) return [];

  const posts = contentIndex.posts.filter(post => 
    tagData.posts.includes(post.slug) && (!locale || post.locale === locale)
  );

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllTags(locale?: string): Array<{ tag: string; count: number }> {
  const contentIndex = getContentIndex();
  
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

export function getArchive(locale?: string): Array<{ year: number; month: number; count: number; monthName: string }> {
  const contentIndex = getContentIndex();
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

// Clear cache when needed (useful for development)
export function clearContentCache(): void {
  cachedContentIndex = null;
}