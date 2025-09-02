"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/molecules";
import { base } from "framer-motion/client";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "pt";

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > lastScrollY && latest > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(latest);
  });

  const navItems = [
    { href: "#about", label: locale === "pt" ? "Sobre" : "About" },
    { href: "#skills", label: locale === "pt" ? "Habilidades" : "Skills" },
    { href: "#projects", label: locale === "pt" ? "Projetos" : "Projects" },
    { href: "#companies", label: locale === "pt" ? "Empresas" : "Companies" },
    { href: "#contact", label: locale === "pt" ? "Contato" : "Contact" },
  ];

  // Always show navigation menu on all pages
  const baseUrl = process.env.NODE_ENV === "production" ? "/portfolio" : "";
  const isOnHomePage = pathname === `/${baseUrl}/${locale}` || pathname === "/";
  const blogLabel = locale === "pt" ? "Blog" : "Blog";

  const scrollToSection = (href: string) => {
    if (isOnHomePage) {
      // If we're on homepage, scroll to section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // If we're not on homepage, navigate to homepage with hash
      window.location.href = `/${baseUrl}/${locale}${href}`;
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
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-bold text-transparent text-xl"
          >
            Portfolio
          </motion.button>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-medium text-gray-300 hover:text-white transition-colors duration-300"
              >
                {item.label}
              </motion.button>
            ))}

            {/* Vertical separator */}
            <div className="bg-white/20 w-px h-6"></div>

            <Link href={`${baseUrl}/${locale}/blog`}>
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
