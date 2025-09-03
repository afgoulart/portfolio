import { getContentIndexAction } from './content-actions';

/**
 * Find equivalent slug in another language for blog posts
 */
export async function getEquivalentSlug(currentSlug: string, currentLocale: string, targetLocale: string): Promise<string | null> {
  const contentIndex = await getContentIndexAction();
  
  // Find the current post
  const currentPost = contentIndex.posts.find(
    post => post.slug === currentSlug && post.locale === currentLocale
  );
  
  if (!currentPost) {
    return null;
  }

  // Look for a post with shared slug patterns or topic mappings
  const equivalentPost = findEquivalentPost(currentPost, targetLocale, contentIndex);
  
  return equivalentPost ? equivalentPost.slug : null;
}

function findEquivalentPost(currentPost: any, targetLocale: string, contentIndex: any): any {
  // Strategy 1: Look for exact slug match in target locale
  const exactMatch = contentIndex.posts.find(
    (post: any) => post.slug === currentPost.slug && post.locale === targetLocale
  );
  
  if (exactMatch) {
    return exactMatch;
  }

  // Strategy 2: Look for posts with similar tags and same date
  const similarPosts = contentIndex.posts.filter((post: any) => 
    post.locale === targetLocale && 
    post.date === currentPost.date &&
    hasCommonTags(post.tags, currentPost.tags)
  );

  if (similarPosts.length > 0) {
    // Return the one with most similar tags
    return similarPosts.reduce((best: any, current: any) => {
      const bestScore = calculateTagSimilarity(best.tags, currentPost.tags);
      const currentScore = calculateTagSimilarity(current.tags, currentPost.tags);
      return currentScore > bestScore ? current : best;
    });
  }

  // Strategy 3: Topic mapping based on known patterns
  const topicMatch = findByTopicMapping(currentPost, targetLocale, contentIndex);
  if (topicMatch) {
    return topicMatch;
  }

  return null;
}

function hasCommonTags(tags1: string[], tags2: string[]): boolean {
  return tags1.some(tag => tags2.includes(tag)) || 
         tags1.some(tag => tags2.some(t => tagSimilarity(tag, t) > 0.7));
}

function calculateTagSimilarity(tags1: string[], tags2: string[]): number {
  let totalSimilarity = 0;
  let comparisons = 0;

  for (const tag1 of tags1) {
    for (const tag2 of tags2) {
      totalSimilarity += tagSimilarity(tag1, tag2);
      comparisons++;
    }
  }

  return comparisons > 0 ? totalSimilarity / comparisons : 0;
}

function tagSimilarity(tag1: string, tag2: string): number {
  // Exact match
  if (tag1 === tag2) return 1;
  
  // Language-specific tag mapping
  const tagMappings: { [key: string]: string[] } = {
    'artificial-intelligence': ['inteligencia-artificial', 'ai', 'ia'],
    'inteligencia-artificial': ['artificial-intelligence', 'ai', 'ia'],
    'software-development': ['desenvolvimento-software', 'desenvolvimento'],
    'desenvolvimento-software': ['software-development', 'development'],
    'programming': ['programacao'],
    'programacao': ['programming'],
    'design-patterns': ['padroes-projeto', 'patterns'],
    'big-data': ['dados', 'data'],
    'analytics': ['analitica'],
    'chatgpt': ['gpt', 'openai'],
    'copilot': ['github-copilot'],
    'claude': ['anthropic'],
  };

  const normalizedTag1 = tag1.toLowerCase().replace(/-/g, '');
  const normalizedTag2 = tag2.toLowerCase().replace(/-/g, '');

  // Check mappings
  const mappings1 = tagMappings[tag1] || [];
  const mappings2 = tagMappings[tag2] || [];

  if (mappings1.includes(tag2) || mappings2.includes(tag1)) return 0.9;

  // Substring similarity
  if (normalizedTag1.includes(normalizedTag2) || normalizedTag2.includes(normalizedTag1)) {
    return 0.6;
  }

  return 0;
}

function findByTopicMapping(currentPost: any, targetLocale: string, contentIndex: any): any {
  // Known topic patterns that should map to same content
  const topicPatterns = [
    {
      keywords: ['ai-coders', 'copilot', 'chatgpt', 'claude', 'amazon-q'],
      slugPattern: /ai.*cod|copilot|chatgpt|claude.*code/i,
    },
    {
      keywords: ['design-patterns', 'patterns', 'padroes'],
      slugPattern: /design.*pattern|pattern.*design/i,
    },
    {
      keywords: ['big-data', 'analytics', 'dados'],
      slugPattern: /big.*data|analytics|dados/i,
    },
    {
      keywords: ['automated-testing', 'testing', 'testes'],
      slugPattern: /test|automated.*test/i,
    }
  ];

  for (const pattern of topicPatterns) {
    // Check if current post matches this pattern
    const matchesKeywords = pattern.keywords.some(keyword => 
      currentPost.tags.some((tag: string) => tag.includes(keyword)) ||
      currentPost.title.toLowerCase().includes(keyword) ||
      currentPost.slug.includes(keyword)
    );

    const matchesSlugPattern = pattern.slugPattern.test(currentPost.slug) || 
                              pattern.slugPattern.test(currentPost.title);

    if (matchesKeywords || matchesSlugPattern) {
      // Find equivalent post in target locale
      const equivalentPost = contentIndex.posts.find((post: any) => 
        post.locale === targetLocale &&
        (pattern.keywords.some(keyword => 
          post.tags.some((tag: string) => tag.includes(keyword)) ||
          post.title.toLowerCase().includes(keyword) ||
          post.slug.includes(keyword)
        ) ||
        pattern.slugPattern.test(post.slug) ||
        pattern.slugPattern.test(post.title))
      );

      if (equivalentPost) {
        return equivalentPost;
      }
    }
  }

  return null;
}