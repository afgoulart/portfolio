'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { TagIcon } from '@heroicons/react/24/outline';
import BlogArchiveTree from './BlogArchiveTree';
import { ContentIndex } from '@/lib/content-client';

interface BlogSidebarProps {
  tags: Array<{ tag: string; count: number }>;
  archive: Array<{ year: number; month: number; count: number; monthName: string }>;
  contentIndex: ContentIndex;
  locale: string;
  currentFilters: {
    tag?: string;
    search?: string;
    year?: number;
    month?: number;
  };
}

export default function BlogSidebar({ tags, archive, contentIndex, locale, currentFilters }: BlogSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams);

    // If tag is already selected, remove it (toggle behavior)
    if (currentFilters.tag === tag) {
      params.delete('tag');
    } else {
      params.set('tag', tag);
    }

    // Reset to first page when filtering
    params.delete('page');

    const newUrl = `/${locale}/blog${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  };

  const handleClearFilters = () => {
    router.push(`/${locale}/blog`, { scroll: false });
  };


  return (
    <div className="space-y-8">
      
      {/* Tags */}
      {tags.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="flex items-center text-lg font-semibold text-white mb-4">
            <TagIcon className="h-5 w-5 mr-2" />
            {locale === 'pt' ? 'Tags' : 'Tags'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 20).map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                  currentFilters.tag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white'
                }`}
              >
                {tag}
                <span className="ml-1 text-xs opacity-75">({count})</span>
              </button>
            ))}
          </div>
          {tags.length > 20 && (
            <p className="text-sm text-gray-400 mt-3">
              {locale === 'pt' 
                ? `E mais ${tags.length - 20} tags...` 
                : `And ${tags.length - 20} more tags...`
              }
            </p>
          )}
        </div>
      )}

      {/* Archive Tree */}
      <BlogArchiveTree 
        contentIndex={contentIndex}
        locale={locale}
        currentFilters={currentFilters}
      />

      {/* Clear Filters */}
      {(currentFilters.tag || currentFilters.search || currentFilters.year) && (
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {locale === 'pt' ? 'Filtros' : 'Filters'}
          </h3>
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            {locale === 'pt' ? 'Limpar Filtros' : 'Clear Filters'}
          </button>
        </div>
      )}

    </div>
  );
}

