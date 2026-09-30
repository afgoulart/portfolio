'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from '@/lib/i18n-context';
import { ProjectCard } from '@/components/molecules';
import { Button } from '@/components/atoms';
import { projects } from '@/lib/data';

export default function Projects() {
  const t = useTranslations('projects');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="projects" className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {t('title')}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              {...project}
              index={index}
              inView={inView}
              viewDemoText={t('viewDemo')}
              githubText={t('github')}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-300 text-lg mb-6">
            {t('description')}
          </p>
          <Button
            size="lg"
            onClick={() => window.open('https://github.com/afgoulart', '_blank')}
          >
            {t('viewMore')}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}