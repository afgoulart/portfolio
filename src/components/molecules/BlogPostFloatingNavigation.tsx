'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { PostMetadata } from '@/lib/blog';

interface BlogPostFloatingNavigationProps {
  locale: string;
  prevPost: PostMetadata | null;
  nextPost: PostMetadata | null;
}

export default function BlogPostFloatingNavigation({
  locale,
  prevPost,
  nextPost,
}: BlogPostFloatingNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show the navigation after scrolling 200px
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!prevPost && !nextPost) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50"
        >
          {/* Toggle Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-lg border border-slate-700 transition-all duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </motion.button>

          {/* Navigation Panel */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 bottom-full mb-3 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-4"
              >
                <h3 className="text-sm font-semibold text-gray-300 mb-4 text-center">
                  {locale === 'pt' ? 'Navegação entre Posts' : 'Post Navigation'}
                </h3>

                <div className="space-y-3">
                  {/* Previous Post */}
                  {prevPost ? (
                    <Link
                      href={`/${locale}/blog/${prevPost.slug}`}
                      className="flex items-start gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex-shrink-0 p-1 bg-blue-600 rounded-full group-hover:bg-blue-500 transition-colors">
                        <ChevronLeftIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-400 mb-1">
                          {locale === 'pt' ? 'Post Anterior' : 'Previous Post'}
                        </div>
                        <div className="text-sm font-medium text-white leading-tight overflow-hidden"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}>
                          {prevPost.title}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(prevPost.date).toLocaleDateString(
                            locale === 'pt' ? 'pt-BR' : 'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg opacity-50">
                      <div className="flex-shrink-0 p-1 bg-gray-600 rounded-full">
                        <ChevronLeftIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-sm text-gray-500">
                        {locale === 'pt' ? 'Primeiro post' : 'First post'}
                      </div>
                    </div>
                  )}

                  {/* Next Post */}
                  {nextPost ? (
                    <Link
                      href={`/${locale}/blog/${nextPost.slug}`}
                      className="flex items-start gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex-shrink-0 p-1 bg-blue-600 rounded-full group-hover:bg-blue-500 transition-colors">
                        <ChevronRightIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-400 mb-1">
                          {locale === 'pt' ? 'Próximo Post' : 'Next Post'}
                        </div>
                        <div className="text-sm font-medium text-white leading-tight overflow-hidden"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}>
                          {nextPost.title}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(nextPost.date).toLocaleDateString(
                            locale === 'pt' ? 'pt-BR' : 'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg opacity-50">
                      <div className="flex-shrink-0 p-1 bg-gray-600 rounded-full">
                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-sm text-gray-500">
                        {locale === 'pt' ? 'Último post' : 'Last post'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Back to Blog List */}
                <div className="mt-4 pt-3 border-t border-slate-600">
                  <Link
                    href={`/${locale}/blog`}
                    className="block text-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {locale === 'pt' ? '← Voltar ao Blog' : '← Back to Blog'}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}