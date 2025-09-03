'use client';

import { PostIndex } from '@/lib/content-client';
import BlogCard from '@/components/molecules/BlogCard';
import BlogHero from '@/components/molecules/BlogHero';
import FloatingRssButton from '@/components/molecules/FloatingRssButton';
import BlogPagination from '@/components/molecules/BlogPagination';
import BlogSidebar from '@/components/molecules/BlogSidebar';
import BlogSearch from '@/components/molecules/BlogSearch';
import { motion } from 'framer-motion';

interface BlogListProps {
  posts: PostIndex[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
  };
  title: string;
  subtitle: string;
  noPosts: string;
  locale: string;
  tags: Array<{ tag: string; count: number }>;
  archive: Array<{ year: number; month: number; count: number; monthName: string }>;
  filters: {
    tag?: string;
    search?: string;
    year?: number;
    month?: number;
  };
}

export default function BlogList({ 
  posts, 
  pagination, 
  title, 
  subtitle, 
  noPosts, 
  locale, 
  tags, 
  archive, 
  filters 
}: BlogListProps) {
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
                      {locale === 'pt' ? 'Busca:' : 'Search:'} "{filters.search}"
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
            {posts.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-fr mb-12"
                >
                  {posts.map((post, index) => (
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
                {pagination.totalPages > 1 && (
                  <BlogPagination 
                    pagination={pagination} 
                    locale={locale}
                    filters={filters}
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
              tags={tags}
              archive={archive}
              locale={locale}
              currentFilters={filters}
            />
          </aside>

        </div>
      </section>

      {/* Floating RSS Button */}
      <FloatingRssButton locale={locale} />
    </>
  );
}