"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "@/lib/i18n-context";
import Card from "@/components/ui/Card";
import { experiences } from "@/lib/data";

export default function About() {
  const t = useTranslations("about");
  const tExperiences = useTranslations("experiences");
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="about" className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {t("title")}
        </h2>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-white">{t("subtitle")}</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">{t("description1")}</p>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">{t("description2")}</p>
            <p className="text-gray-300 text-lg leading-relaxed">{t("description3")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="w-80 h-80 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl rotate-6"></div>
              <div className="absolute inset-0 bg-gray-800 rounded-2xl flex items-center justify-center text-6xl">
                👨‍💻
              </div>
            </div>
          </motion.div>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-center mb-12 text-white">{t("experience")}</h3>

          <div className="space-y-8">
            {experiences.map((_: unknown, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <Card>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-1">{tExperiences(`${index}.title`)}</h4>
                      <p className="text-blue-400 font-medium">{tExperiences(`${index}.company`)}</p>
                    </div>
                    <span className="text-gray-400 text-sm md:text-base">{tExperiences(`${index}.period`)}</span>
                  </div>

                  <p className="text-gray-300 mb-4 leading-relaxed">{tExperiences(`${index}.description`)}</p>

                  <div className="flex flex-wrap gap-2">
                    {tExperiences.raw(`${index}.technologies`).map((tech: string, techIndex: number) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
