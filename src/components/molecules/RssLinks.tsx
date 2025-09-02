'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface RssLinksProps {
  locale: string;
}

export default function RssLinks({ locale }: RssLinksProps) {
  const rssTexts = {
    pt: {
      title: 'RSS Feed',
      description: 'Assine nosso RSS feed para receber as últimas atualizações',
      subscribe: 'Assinar RSS'
    },
    en: {
      title: 'RSS Feed',
      description: 'Subscribe to our RSS feed to get the latest updates',
      subscribe: 'Subscribe RSS'
    }
  };

  const texts = rssTexts[locale as keyof typeof rssTexts] || rssTexts.pt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-white"
          >
            <path d="M3.429 14.001c2.344 0 4.571.915 6.226 2.57 1.655 1.655 2.57 3.882 2.57 6.226h3.085c0-6.59-5.377-11.967-11.967-11.967v3.171zm0-6.343c6.077 0 11 4.923 11 11h3.086c0-7.763-6.323-14.086-14.086-14.086v3.086zm0-6.344c9.809 0 17.742 7.933 17.742 17.742h3.086c0-11.496-9.332-20.828-20.828-20.828v3.086z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white">{texts.title}</h3>
      </div>
      
      <p className="text-gray-300 mb-4">{texts.description}</p>
      
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/rss-${locale}.xml`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-300 text-sm font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3.429 14.001c2.344 0 4.571.915 6.226 2.57 1.655 1.655 2.57 3.882 2.57 6.226h3.085c0-6.59-5.377-11.967-11.967-11.967v3.171zm0-6.343c6.077 0 11 4.923 11 11h3.086c0-7.763-6.323-14.086-14.086-14.086v3.086zm0-6.344c9.809 0 17.742 7.933 17.742 17.742h3.086c0-11.496-9.332-20.828-20.828-20.828v3.086z" />
          </svg>
          {texts.subscribe}
        </Link>
        
        <Link
          href="/rss.xml"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300 text-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          RSS Geral
        </Link>
      </div>
    </motion.div>
  );
}