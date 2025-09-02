import { motion } from 'framer-motion';

interface StarRatingProps {
  rating: number; // 0-5
  animate?: boolean;
  delay?: number;
  className?: string;
}

export default function StarRating({ 
  rating, 
  animate = true, 
  delay = 0, 
  className = '' 
}: StarRatingProps) {
  return (
    <motion.div
      initial={animate ? { scale: 0 } : { scale: 1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={`flex ${className}`}
    >
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`${
            i < rating ? 'text-yellow-400' : 'text-gray-600'
          }`}
        >
          ★
        </span>
      ))}
    </motion.div>
  );
}