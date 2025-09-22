'use client';

import { useRouter, useSearchParams } from 'next/navigation';
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);

    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }

    const newUrl = `/${locale}/blog${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
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
      <button
        onClick={() => hasPrev && handlePageChange(currentPage - 1)}
        disabled={!hasPrev}
        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          hasPrev
            ? 'text-gray-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600'
            : 'text-gray-500 bg-slate-900 border border-slate-800 cursor-not-allowed'
        }`}
      >
        <ChevronLeftIcon className="h-4 w-4 mr-1" />
        {locale === 'pt' ? 'Anterior' : 'Previous'}
      </button>

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {/* First page + ellipsis */}
        {visiblePages[0] > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:border-slate-600 transition-colors"
            >
              1
            </button>
            {visiblePages[0] > 2 && (
              <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500">
                ...
              </span>
            )}
          </>
        )}

        {/* Visible page numbers */}
        {visiblePages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              page === currentPage
                ? 'text-white bg-blue-600 border border-blue-500'
                : 'text-gray-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Last page + ellipsis */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500">
                ...
              </span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:border-slate-600 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => hasNext && handlePageChange(currentPage + 1)}
        disabled={!hasNext}
        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          hasNext
            ? 'text-gray-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600'
            : 'text-gray-500 bg-slate-900 border border-slate-800 cursor-not-allowed'
        }`}
      >
        {locale === 'pt' ? 'Próximo' : 'Next'}
        <ChevronRightIcon className="h-4 w-4 ml-1" />
      </button>
    </nav>
  );
}