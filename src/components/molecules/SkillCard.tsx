import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ProgressBar from '@/components/atoms/ProgressBar';
import StarRating from '@/components/atoms/StarRating';

interface SkillCardProps {
  name: string;
  level: number;
  category: string;
  index?: number;
  inView?: boolean;
}

export default function SkillCard({
  name,
  level,
  category,
  index = 0,
  inView = true
}: SkillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: 0.1 * index }}
    >
      <Card hover={false} className="group hover:bg-white/15 transition-all duration-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <span className="text-blue-400 font-bold">{level}%</span>
        </div>
        
        <ProgressBar 
          progress={level} 
          animate={inView}
          delay={0.2 + index * 0.1}
          className="mb-4"
        />

        <div className="flex justify-between text-sm text-gray-400">
          <span className="capitalize">{category}</span>
          <StarRating 
            rating={Math.floor(level / 20)} 
            animate={inView}
            delay={0.3 + index * 0.1}
          />
        </div>
      </Card>
    </motion.div>
  );
}