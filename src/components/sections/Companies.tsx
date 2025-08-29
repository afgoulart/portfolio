"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useLocale } from "@/lib/i18n-context";
import Image from "next/image";

const companies = [
  {
    name: "Skopia Digital",
    description: "EclipseWorks • NScreen",
    projects: "Aviva • Incasa • Banco Master",
    logo: "/companies/skopia.svg",
    website: "https://skopiadigital.com.br",
  },
  {
    name: "Calindra",
    description: "Consultoria em Tecnologia",
    projects: "Tânia Bulhões",
    logo: "/companies/calindra.svg",
    website: "https://calindra.com",
  },
  {
    name: "Desygner",
    description: "Design Platform",
    projects: "Global Design Solutions",
    logo: "/companies/desygner.svg",
    website: "https://desygner.com",
  },
  {
    name: "Stone",
    description: "Fintech • Payments",
    projects: "Ton • Stone Banking",
    logo: "/companies/stone.svg",
    website: "https://stone.co",
  },
  {
    name: "Mosaico",
    description: "Marketplace Platform",
    projects: "E-commerce • Authentication",
    logo: "/companies/mosaico.png",
    website: "https://mosaico.com",
  },
  {
    name: "B2W Digital (Americanas S.A.)",
    description: "E-commerce Conglomerate",
    projects: "Submarino • Americanas • Shoptime • Soubarato",
    logo: "/companies/americanas_sa.png",
    website: "https://ri.americanas.io",
  },
];

export default function Companies() {
  const locale = useLocale();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const texts = {
    pt: {
      title: "Empresas em que Trabalhei",
      projects: "Projetos:",
      seeWebsite: "Ver site",
      yearsExp: "Anos de Experiência",
      companies: "Empresas",
      projectsCount: "Projetos",
      sectors: "Setores",
      description: "Experiência diversificada em e-commerce, fintech, design, consultoria e tecnologia",
    },
    en: {
      title: "Companies I've Worked With",
      projects: "Projects:",
      seeWebsite: "View website",
      yearsExp: "Years of Experience",
      companies: "Companies",
      projectsCount: "Projects",
      sectors: "Sectors",
      description: "Diverse experience in e-commerce, fintech, design, consulting and technology",
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.pt;

  return (
    <section id="companies" className="py-20 px-4 max-w-7xl mx-auto bg-gradient-to-b from-transparent to-gray-900/20">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {t.title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {companies.map((company, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col">
                {/* Logo */}
                <div className="w-full h-20 mb-4 flex items-center justify-center bg-white/40 rounded-lg group-hover:bg-white/20 transition-all duration-300 p-4">
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>

                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {company.name}
                </h3>

                <p className="text-gray-400 text-sm mb-3">{company.description}</p>

                <div className="flex-grow">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.projects}</div>
                  <p className="text-gray-300 text-sm leading-relaxed">{company.projects}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <motion.a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    {t.seeWebsite}
                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">10+</div>
            <div className="text-gray-400 text-sm">{t.yearsExp}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-1">6</div>
            <div className="text-gray-400 text-sm">{t.companies}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="text-2xl md:text-3xl font-bold text-green-400 mb-1">15+</div>
            <div className="text-gray-400 text-sm">{t.projectsCount}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="text-2xl md:text-3xl font-bold text-pink-400 mb-1">5</div>
            <div className="text-gray-400 text-sm">{t.sectors}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-300 text-lg mb-6">{t.description}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
              E-commerce
            </span>
            <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
              Fintech
            </span>
            <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
              Design Platform
            </span>
            <span className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full text-sm border border-pink-500/30">
              Consultoria
            </span>
            <span className="px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30">
              Cloud Solutions
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
