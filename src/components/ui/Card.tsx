import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={hover ? { y: -10, scale: 1.02 } : undefined}
      className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  );
}