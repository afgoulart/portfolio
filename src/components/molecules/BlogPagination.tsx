'use client';

import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
}

interface BlogPaginationProps {
  pagination: PaginationInfo;
  locale: string;
  filters: {
    tag?: string;
    search?: string;
    year?: number;
    month?: number;
  };
}

export default function BlogPagination({ pagination, locale, filters }: BlogPaginationProps) {
  const { currentPage, totalPages, hasNext, hasPrev } = pagination;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    
    if (page > 1) params.set('page', page.toString());
    if (filters.tag) params.set('tag', filters.tag);
    if (filters.search) params.set('search', filters.search);
    if (filters.year) params.set('year', filters.year.toString());
    if (filters.month) params.set('month', filters.month.toString());

    return `/${locale}/blog${params.toString() ? `?${params.toString()}` : ''}`;
  };

  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 7;
    const halfVisible = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, currentPage + halfVisible);

    // Adjust if we're near the beginning or end
    if (end - start + 1 < maxVisible) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisible - 1);
      } else {
        start = Math.max(1, end - maxVisible + 1);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center space-x-2" aria-label="Pagination">
      {/* Previous */}
      {hasPrev ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:border-slate-600 transition-colors"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          {locale === 'pt' ? 'Anterior' : 'Previous'}
        </Link>
      ) : (
        <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-slate-900 border border-slate-800 rounded-lg cursor-not-allowed">
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          {locale === 'pt' ? 'Anterior' : 'Previous'}
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {/* First page + ellipsis */}
        {visiblePages[0] > 1 && (
          <>
            <Link
              href={buildUrl(1)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:border-slate-600 transition-colors"
            >
              1
            </Link>
            {visiblePages[0] > 2 && (
              <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500">
                ...
              </span>
            )}
          </>
        )}

        {/* Visible page numbers */}
        {visiblePages.map(page => (
          <Link
            key={page}
            href={buildUrl(page)}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              page === currentPage
                ? 'text-white bg-blue-600 border border-blue-500'
                : 'text-gray-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600'
            }`}
          >
            {page}
          </Link>
        ))}

        {/* Last page + ellipsis */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500">
                ...
              </span>
            )}
            <Link
              href={buildUrl(totalPages)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:border-slate-600 transition-colors"
            >
              {totalPages}
            </Link>
          </>
        )}
      </div>

      {/* Next */}
      {hasNext ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:border-slate-600 transition-colors"
        >
          {locale === 'pt' ? 'Próximo' : 'Next'}
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Link>
      ) : (
        <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-slate-900 border border-slate-800 rounded-lg cursor-not-allowed">
          {locale === 'pt' ? 'Próximo' : 'Next'}
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </span>
      )}
    </nav>
  );
}