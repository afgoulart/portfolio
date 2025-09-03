'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface BlogSearchProps {
  locale: string;
  initialSearch?: string;
  className?: string;
}

export default function BlogSearch({ locale, initialSearch = '', className = '' }: BlogSearchProps) {
  const [search, setSearch] = useState(initialSearch);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (value.trim()) {
      params.set('search', value.trim());
    } else {
      params.delete('search');
    }
    
    // Reset to first page when searching
    params.delete('page');
    
    const newUrl = `/${locale}/blog${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(search);
    }
  };

  const clearSearch = () => {
    setSearch('');
    handleSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder={locale === 'pt' ? 'Buscar posts...' : 'Search posts...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full pl-10 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-full w-full" />
          </button>
        )}
      </div>
      <button
        onClick={() => handleSearch(search)}
        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
      >
        {locale === 'pt' ? 'Buscar' : 'Search'}
      </button>
    </div>
  );
}