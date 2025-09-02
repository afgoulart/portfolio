'use client';

import { BlogPost as BlogPostType } from '@/lib/blog';
import { Badge } from '@/components/atoms';
import { motion } from 'framer-motion';

interface BlogPostProps {
  post: BlogPostType;
}

export default function BlogPost({ post }: BlogPostProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(post.locale === 'pt' ? 'pt-BR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-4 py-20"
    >
      <header className="mb-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight"
        >
          {post.title}
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-300 mb-6"
        >
          <span className="text-lg">{post.author}</span>
          <span className="hidden sm:block">•</span>
          <time className="text-lg">{formatDate(post.date)}</time>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </motion.div>

        {post.excerpt && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
          >
            {post.excerpt}
          </motion.p>
        )}
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="prose prose-lg prose-invert prose-blue max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </motion.article>
  );
}