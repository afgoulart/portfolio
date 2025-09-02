'use client';

import { BlogPost } from '@/lib/blog';
import BlogCard from '@/components/molecules/BlogCard';
import BlogHero from '@/components/molecules/BlogHero';
import FloatingRssButton from '@/components/molecules/FloatingRssButton';
import { motion } from 'framer-motion';

interface BlogListProps {
  posts: BlogPost[];
  title: string;
  subtitle: string;
  noPosts: string;
  locale: string;
}

export default function BlogList({ posts, title, subtitle, noPosts, locale }: BlogListProps) {
  return (
    <>
      {/* Hero Section */}
      <BlogHero title={title} subtitle={subtitle} />
      
      {/* Posts Section */}
      <section className="pb-20 px-4 max-w-7xl mx-auto">

        {posts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr"
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
      </section>

      {/* Floating RSS Button */}
      <FloatingRssButton locale={locale} />
    </>
  );
}