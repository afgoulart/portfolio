/**
 * Client-side slug mapping with fallback strategies
 * This version uses local data and doesn't require server calls
 */

// Simple mappings for common slug patterns
const SLUG_MAPPINGS: { [key: string]: string } = {
  // AI/Programming content
  'ai-coders-como-github-copilot-chatgpt-claude-e-amazon-q-estao-revolucionando-o-desenvolvimento-de-software': 'ai-coders-how-github-copilot-chatgpt-claude-and-amazon-q-are-revolutionizing-software-development',
  'ai-coders-how-github-copilot-chatgpt-claude-and-amazon-q-are-revolutionizing-software-development': 'ai-coders-como-github-copilot-chatgpt-claude-e-amazon-q-estao-revolucionando-o-desenvolvimento-de-software',
  
  // Design patterns
  'design-patterns-guide': 'design-patterns-guide',
  
  // Big Data
  'big-data-analytics-business': 'big-data-analytics-business',
  
  // AI Coding assistants
  'ai-coding-assistants': 'ai-coding-assistants',
  
  // Automated testing
  'automated-testing-guide': 'automated-testing-guide',
  
  // Claude content
  'claude-code-revolucionando-o-desenvolvimento-com-ia-guia-completo-dos-ai-assistants': 'claude-code-revolutionizing-development-with-ai-complete-guide-to-ai-assistants',
  'claude-code-revolutionizing-development-with-ai-complete-guide-to-ai-assistants': 'claude-code-revolucionando-o-desenvolvimento-com-ia-guia-completo-dos-ai-assistants',
};

// Topic-based fallback patterns
const TOPIC_PATTERNS = [
  {
    keywords: ['ai-coders', 'copilot', 'chatgpt', 'claude', 'amazon-q', 'ai-coding'],
    ptSlug: 'ai-coders-como-github-copilot-chatgpt-claude-e-amazon-q-estao-revolucionando-o-desenvolvimento-de-software',
    enSlug: 'ai-coders-how-github-copilot-chatgpt-claude-and-amazon-q-are-revolutionizing-software-development',
  },
  {
    keywords: ['design-patterns', 'patterns', 'padroes'],
    ptSlug: 'design-patterns-guide',
    enSlug: 'design-patterns-guide',
  },
  {
    keywords: ['big-data', 'analytics', 'dados'],
    ptSlug: 'big-data-analytics-business',
    enSlug: 'big-data-analytics-business',
  },
  {
    keywords: ['automated-testing', 'testing', 'testes'],
    ptSlug: 'automated-testing-guide',
    enSlug: 'automated-testing-guide',
  },
  {
    keywords: ['claude-code', 'claude', 'ai-assistants'],
    ptSlug: 'claude-code-revolucionando-o-desenvolvimento-com-ia-guia-completo-dos-ai-assistants',
    enSlug: 'claude-code-revolutionizing-development-with-ai-complete-guide-to-ai-assistants',
  }
];

/**
 * Find equivalent slug in another language for blog posts (client-side)
 */
export function getEquivalentSlugClient(currentSlug: string, currentLocale: string, targetLocale: string): string | null {
  // Strategy 1: Direct mapping
  const directMapping = SLUG_MAPPINGS[currentSlug];
  if (directMapping) {
    return directMapping;
  }

  // Strategy 2: Same slug if it's a shared one
  const sharedSlugs = ['design-patterns-guide', 'big-data-analytics-business', 'ai-coding-assistants', 'automated-testing-guide'];
  if (sharedSlugs.includes(currentSlug)) {
    return currentSlug;
  }

  // Strategy 3: Topic-based mapping
  for (const pattern of TOPIC_PATTERNS) {
    if (pattern.keywords.some(keyword => currentSlug.includes(keyword))) {
      return targetLocale === 'pt' ? pattern.ptSlug : pattern.enSlug;
    }
  }

  // Strategy 4: Fallback - return same slug and let server handle 404 gracefully
  return currentSlug;
}

/**
 * Check if a slug likely exists in the target language
 */
export function hasEquivalentContent(currentSlug: string): boolean {
  // Check if we have a mapping or it's a shared slug
  return !!(SLUG_MAPPINGS[currentSlug] || 
           ['design-patterns-guide', 'big-data-analytics-business', 'ai-coding-assistants', 'automated-testing-guide'].includes(currentSlug) ||
           TOPIC_PATTERNS.some(pattern => pattern.keywords.some(keyword => currentSlug.includes(keyword))));
}