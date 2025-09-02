import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  className?: string;
  animate?: boolean;
  delay?: number;
}

export default function ProgressBar({ 
  progress, 
  className = '', 
  animate = true, 
  delay = 0 
}: ProgressBarProps) {
  return (
    <div className={`w-full bg-gray-700 rounded-full h-2 ${className}`}>
      <motion.div
        initial={animate ? { width: 0 } : { width: `${progress}%` }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.5, delay }}
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
      />
    </div>
  );
}