"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/molecules";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();
  const { locale } = useParams() || {};

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > lastScrollY && latest > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(latest);
  });
  const navItems = [
    { href: `/${locale}#about`, label: locale === "pt" ? "Sobre" : "About" },
    { href: `/${locale}#skills`, label: locale === "pt" ? "Habilidades" : "Skills" },
    // { href: `/${locale}#projects`, label: locale === "pt" ? "Projetos" : "Projects" },
    { href: `/${locale}#companies`, label: locale === "pt" ? "Empresas" : "Companies" },
    { href: `/${locale}#contact`, label: locale === "pt" ? "Contato" : "Contact" },
  ];

  // Always show navigation menu on all pages

  const blogLabel = locale === "pt" ? "Blog" : "Blog";

  const scrollToSection = (href: string) => {
    if (href.includes("#")) {
      // If we're on homepage, scroll to section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // If we're not on homepage, navigate to homepage with hash
      window.location.href = href;
    }
  };

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="top-0 z-50 fixed bg-gray-900/80 backdrop-blur-md border-white/10 border-b w-full"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <Link href={`/${locale}`}>
            <motion.div
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-bold text-transparent text-xl cursor-pointer"
            >
              Portfolio
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-medium text-gray-300 hover:text-white transition-colors duration-300"
              >
                <Link href={item.href}>{item.label}</Link>
              </motion.div>
            ))}

            {/* Vertical separator */}
            <div className="bg-white/20 w-px h-6"></div>

            <Link href={`/${locale}/blog`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-medium text-gray-300 hover:text-white transition-colors duration-300"
              >
                {blogLabel}
              </motion.div>
            </Link>
            <LanguageSwitcher />
          </div>

          <div className="md:hidden flex items-center gap-4">
            <LanguageSwitcher />
            <motion.button whileTap={{ scale: 0.95 }} className="text-gray-300 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
