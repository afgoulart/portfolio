'use client';

import { useLocale } from '@/lib/i18n-context';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale);

  const handleLanguageChange = (langCode: string) => {
    const currentPath = window.location.pathname;
    const segments = currentPath.split('/');
    
    if (segments[1] === 'en' || segments[1] === 'pt') {
      segments[1] = langCode;
    } else {
      segments.splice(1, 0, langCode);
    }
    
    const newPath = segments.join('/') || `/${langCode}`;
    window.location.href = newPath;
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300"
      >
        <span className="text-xl">{currentLanguage?.flag}</span>
        <span className="hidden sm:inline text-sm font-medium">
          {currentLanguage?.name}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full right-0 mt-2 bg-gray-800 border border-white/20 rounded-lg shadow-lg overflow-hidden z-50"
        >
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              onClick={() => {
                handleLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-blue-500/10 transition-colors ${
                locale === lang.code ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm font-medium whitespace-nowrap">{lang.name}</span>
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}