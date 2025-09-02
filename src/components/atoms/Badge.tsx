import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
}

export default function Badge({ 
  children, 
  variant = 'default', 
  className = '' 
}: BadgeProps) {
  const variants = {
    default: 'bg-white/10 text-gray-300',
    primary: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    secondary: 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
  };

  return (
    <span className={`px-2 py-1 rounded text-sm ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}