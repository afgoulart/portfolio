"use client";

import { motion } from "framer-motion";
import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import { getEquivalentSlugClient } from "@/lib/slug-mapping-client";

export default function LanguageSwitcher() {
  const { locale, slug } = useParams();
  const pathname = usePathname();

  const languages = useMemo(() => [
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ], []);

  const alternativeLanguage = useMemo(() => {
    return languages.find((lang) => lang.code !== locale) || languages[1];
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
    <Link href={getLanguageUrl(alternativeLanguage?.code || 'en')}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-2 border border-white/20 rounded-lg transition-all duration-300"
        title={`Trocar para ${alternativeLanguage?.name}`}
      >
        <span className="text-xl">{alternativeLanguage?.flag}</span>
        <span className="hidden sm:inline font-medium text-sm">{alternativeLanguage?.name}</span>
      </motion.button>
    </Link>
  );
}
