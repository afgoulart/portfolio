'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContentIndex, setContentIndex, getPaginatedPosts, getAllTags, getArchive } from '@/lib/content-client';
import BlogCard from '@/components/molecules/BlogCard';
import BlogHero from '@/components/molecules/BlogHero';
import FloatingRssButton from '@/components/molecules/FloatingRssButton';
import BlogPagination from '@/components/molecules/BlogPagination';
import BlogSidebar from '@/components/molecules/BlogSidebar';
import BlogSearch from '@/components/molecules/BlogSearch';
import { motion } from 'framer-motion';

interface BlogListClientProps {
  contentIndex: ContentIndex;
  title: string;
  subtitle: string;
  noPosts: string;
  locale: string;
  tags: Array<{ tag: string; count: number }>;
  archive: Array<{ year: number; month: number; count: number; monthName: string }>;
}

export default function BlogListClient({ 
  contentIndex,
  title, 
  subtitle, 
  noPosts, 
  locale, 
  tags: initialTags, 
  archive: initialArchive 
}: BlogListClientProps) {
  const searchParams = useSearchParams();

  // Set content index for client-side functions immediately
  useMemo(() => {
    setContentIndex(contentIndex);
  }, [contentIndex]);

  // Get current filters from URL
  const filters = useMemo(() => ({
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    tag: searchParams.get('tag') || undefined,
    search: searchParams.get('search') || undefined,
    year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
    month: searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined,
  }), [searchParams]);

  // Get paginated posts based on current filters with fallback
  const paginatedResult = useMemo(() => {
    // Ensure content index is set
    setContentIndex(contentIndex);
    
    console.log('BlogListClient - contentIndex:', contentIndex.totalPosts);
    console.log('BlogListClient - locale:', locale);
    console.log('BlogListClient - filters:', filters);
    
    // If no filters are applied, show initial posts directly from contentIndex
    if (!filters.tag && !filters.search && !filters.year && filters.page === 1) {
      const localePosts = contentIndex.posts
        .filter(post => post.locale === locale)
        .slice(0, 10);
      
      console.log('BlogListClient - localePosts:', localePosts.length);
      
      return {
        data: localePosts,
        pagination: {
          currentPage: 1,
          totalPages: Math.ceil(contentIndex.posts.filter(post => post.locale === locale).length / 10),
          totalItems: contentIndex.posts.filter(post => post.locale === locale).length,
          hasNext: contentIndex.posts.filter(post => post.locale === locale).length > 10,
          hasPrev: false,
          limit: 10,
        },
      };
    }
    
    // Otherwise use the client-side filtering
    return getPaginatedPosts({
      page: filters.page,
      limit: 10,
      locale,
      tag: filters.tag,
      search: filters.search,
      year: filters.year,
      month: filters.month,
    });
  }, [filters, locale, contentIndex]);

  // Get filtered sidebar data based on current filters
  const sidebarData = useMemo(() => {
    if (filters.search || filters.tag || filters.year) {
      // Recalculate tags and archive based on current filter context
      return {
        tags: getAllTags(locale),
        archive: getArchive(locale),
      };
    }
    return {
      tags: initialTags,
      archive: initialArchive,
    };
  }, [filters, locale, initialTags, initialArchive]);

  return (
    <>
      {/* Hero Section */}
      <BlogHero title={title} subtitle={subtitle} />
      
      {/* Main Content */}
      <section className="pb-20 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Posts Area */}
          <div className="flex-1 lg:w-2/3">
            
            {/* Search */}
            <BlogSearch 
              locale={locale} 
              initialSearch={filters.search}
              className="mb-8"
            />

            {/* Active Filters */}
            {(filters.tag || filters.search || filters.year) && (
              <div className="mb-8 p-4 bg-slate-800 rounded-lg">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  {locale === 'pt' ? 'Filtros ativos:' : 'Active filters:'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filters.tag && (
                    <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                      {locale === 'pt' ? 'Tag:' : 'Tag:'} {filters.tag}
                    </span>
                  )}
                  {filters.search && (
                    <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                      {locale === 'pt' ? 'Busca:' : 'Search:'} &ldquo;{filters.search}&rdquo;
                    </span>
                  )}
                  {filters.year && (
                    <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                      {locale === 'pt' ? 'Ano:' : 'Year:'} {filters.year}
                      {filters.month && `/${filters.month.toString().padStart(2, '0')}`}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Posts Grid */}
            {paginatedResult.data.length > 0 ? (
              <>
                <motion.div
                  key={`${filters.page}-${filters.tag}-${filters.search}-${filters.year}-${filters.month}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-fr mb-12"
                >
                  {paginatedResult.data.map((post, index) => (
                    <motion.div
                      key={post.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.6 }}
                      className="h-full"
                    >
                      <BlogCard post={post} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {paginatedResult.pagination.totalPages > 1 && (
                  <BlogPagination 
                    pagination={paginatedResult.pagination} 
                    locale={locale}
                    filters={{
                      tag: filters.tag,
                      search: filters.search,
                      year: filters.year,
                      month: filters.month,
                    }}
                  />
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center py-16"
              >
                <p className="text-xl text-gray-400">{noPosts}</p>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <BlogSidebar 
              tags={sidebarData.tags}
              archive={sidebarData.archive}
              contentIndex={contentIndex}
              locale={locale}
              currentFilters={{
                tag: filters.tag,
                search: filters.search,
                year: filters.year,
                month: filters.month,
              }}
            />
          </aside>

        </div>
      </section>

      {/* Floating RSS Button */}
      <FloatingRssButton locale={locale} />
    </>
  );
}