import { motion } from 'framer-motion';
import Icon from '@/components/atoms/Icon';

interface SocialLinkProps {
  href: string;
  icon: string;
  label?: string;
  className?: string;
}

export default function SocialLink({ href, icon, label, className = '' }: SocialLinkProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${className}`}
      aria-label={label}
    >
      <Icon emoji={icon} />
    </motion.a>
  );
}