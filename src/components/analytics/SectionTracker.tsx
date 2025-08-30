'use client';

import { useSectionTracking } from '@/hooks/useAnalytics';
import { useLocale } from '@/lib/i18n-context';

interface SectionTrackerProps {
  sectionName: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function SectionTracker({ 
  sectionName, 
  children, 
  className = '',
  id 
}: SectionTrackerProps) {
  const locale = useLocale();
  
  // Usar o tracking de seção
  useSectionTracking(sectionName, locale);

  return (
    <div 
      id={id || sectionName} 
      className={className}
      data-section={sectionName}
    >
      {children}
    </div>
  );
}