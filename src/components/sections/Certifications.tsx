"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "@/lib/i18n-context";
import Card from "@/components/ui/Card";

export default function Certifications() {
  const t = useTranslations("certifications");
  const tCerts = useTranslations("certificationsList");

  const certifications = [
    "aws_cloud_practitioner",
    "javascript_intermediate",
    "sql_advanced",
    "software_engineer",
    "frontend_react",
    // 'ef_set_english',
    "architecting_aws",
    "angularjs_coursera",
    "html_css_js_coursera",
    "nodejs_coursera",
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="certifications" className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          {t("title")}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <Card>
                <div className="h-full flex flex-col">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div className="text-center flex-grow">
                    <h3 className="text-lg font-semibold text-white mb-2">{tCerts(`${cert}.title`)}</h3>

                    <p className="text-blue-400 text-sm mb-2 font-medium">{tCerts(`${cert}.instituicao`)}</p>

                    <p className="text-gray-400 text-sm mb-3">{tCerts(`${cert}.data`)}</p>

                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{tCerts(`${cert}.descricao`)}</p>
                  </div>

                  <div className="mt-auto pt-4">
                    {tCerts(`${cert}.link`) && (
                      <motion.a
                        href={tCerts(`${cert}.link`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200"
                      >
                        {t("viewCertificate")}
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </motion.a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-300 text-lg mb-6">{t("description")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400 mb-1">10</div>
              <div className="text-gray-400 text-sm">{t("totalCerts")}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400 mb-1">AWS</div>
              <div className="text-gray-400 text-sm">{t("cloudFocus")}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400 mb-1">2025</div>
              <div className="text-gray-400 text-sm">{t("latestYear")}</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
