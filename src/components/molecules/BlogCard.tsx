'use client';

import Link from 'next/link';
import { BlogPost } from '@/lib/blog';
import { Badge, Card } from '@/components/atoms';
import { motion } from 'framer-motion';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(post.locale === 'pt' ? 'pt-BR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5 }}
    >
      <Link href={`/${post.locale}/blog/${post.slug}`}>
        <Card className="h-full hover:bg-gray-800/50 transition-colors duration-300 cursor-pointer group">
          <div className="h-full p-6 flex flex-col">
            {/* Header - Fixed height */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3 flex-shrink-0">
              <time>{formatDate(post.date)}</time>
              <span>•</span>
              <span>{post.author}</span>
            </div>
            
            {/* Title - Fixed height with line clamp */}
            <h3 className="text-xl font-semibold mb-3 text-white line-clamp-2 min-h-[3.5rem] flex-shrink-0">
              {post.title}
            </h3>
            
            {/* Excerpt - Flexible height but limited */}
            {post.excerpt && (
              <p className="text-gray-300 mb-4 line-clamp-3 flex-grow">
                {post.excerpt}
              </p>
            )}
            
            {/* Tags - Fixed height at bottom */}
            <div className="flex flex-wrap gap-2 mt-auto flex-shrink-0">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}