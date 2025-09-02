import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  index?: number;
  inView?: boolean;
  viewDemoText: string;
  githubText: string;
}

export default function ProjectCard({
  title,
  description,
  technologies,
  liveUrl,
  githubUrl,
  index = 0,
  inView = true,
  viewDemoText,
  githubText
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: 0.1 * index }}
    >
      <Card className="h-full flex flex-col group">
        <div className="relative mb-6 overflow-hidden rounded-lg">
          <div className="w-full h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <div className="text-4xl">🚀</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-300 mb-4 flex-grow leading-relaxed">
          {description}
        </p>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, techIndex) => (
              <Badge key={techIndex} variant="primary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-auto">
          {liveUrl && (
            <Button
              size="sm"
              onClick={() => window.open(liveUrl, '_blank')}
              className="flex-1"
            >
              {viewDemoText}
            </Button>
          )}
          {githubUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(githubUrl, '_blank')}
              className="flex-1"
            >
              {githubText}
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}