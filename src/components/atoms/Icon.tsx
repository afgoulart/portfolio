interface IconProps {
  emoji: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Icon({ emoji, size = 'md', className = '' }: IconProps) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  return (
    <span className={`${sizes[size]} ${className}`}>
      {emoji}
    </span>
  );
}