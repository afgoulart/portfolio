"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function LanguageSwitcher() {
  const { locale } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    const currentPath = window.location.pathname;

    const newPath = `/${langCode}${currentPath.replace(/^\/(pt|en)/, "")}`;
    window.location.href = newPath;
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-2 border border-white/20 rounded-lg transition-all duration-300"
      >
        <span className="text-xl">{currentLanguage?.flag}</span>
        <span className="hidden sm:inline font-medium text-sm">{currentLanguage?.name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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
          className="top-full right-0 z-50 absolute bg-gray-800 shadow-lg mt-2 border border-white/20 rounded-lg overflow-hidden"
        >
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              onClick={() => {
                handleLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-blue-500/10 transition-colors ${
                locale === lang.code ? "bg-blue-500/20 text-blue-400" : "text-gray-300"
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium text-sm whitespace-nowrap">{lang.name}</span>
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
