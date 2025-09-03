"use client";

import { motion } from "framer-motion";
import { useParams, usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { getEquivalentSlugClient } from "@/lib/slug-mapping-client";

export default function LanguageSwitcher() {
  const { locale, slug } = useParams();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const languages = useMemo(() => [
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ], []);

  const currentLanguage = useMemo(() => {
    return languages.find((lang) => lang.code === locale) || languages[0];
  }, [locale, languages]);

  const getLanguageUrl = (langCode: string) => {
    let newPath = pathname.replace(/^\/(pt|en)/, `/${langCode}`);

    // Special handling for blog posts
    if (pathname.includes("/blog/") && slug && typeof slug === "string") {
      const currentLocale = typeof locale === "string" ? locale : "pt";
      const equivalentSlug = getEquivalentSlugClient(slug, currentLocale, langCode);

      if (equivalentSlug && equivalentSlug !== slug) {
        newPath = `/${langCode}/blog/${equivalentSlug}`;
      }
    }

    // Add search params if they exist (client-side only)
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const searchString = searchParams.toString();
      const hash = window.location.hash;

      return newPath + (searchString ? `?${searchString}` : "") + hash;
    }

    return newPath;
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
            <Link
              key={lang.code}
              href={getLanguageUrl(lang.code)}
              onClick={() => setIsOpen(false)}
              className={`w-full px-4 py-3 text-left hover:bg-blue-500/10 transition-colors block ${
                locale === lang.code ? "bg-blue-500/20 text-blue-400" : "text-gray-300"
              }`}
            >
              <motion.div
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                className="flex items-center gap-3 w-full"
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium text-sm whitespace-nowrap">{lang.name}</span>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  );
}
