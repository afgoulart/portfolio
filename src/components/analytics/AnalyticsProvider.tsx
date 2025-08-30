'use client';

import { useEffect } from 'react';
import { useLocale } from '@/lib/i18n-context';
import { 
  useSessionTracking, 
  useTimeTracking, 
  useScrollTracking, 
  useInteractionTracking 
} from '@/hooks/useAnalytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export default function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const locale = useLocale();

  // Ativar todos os trackings
  useSessionTracking(locale);
  useTimeTracking(locale);
  useScrollTracking(locale);
  useInteractionTracking(locale);

  // Adicionar IDs nas seções para tracking
  useEffect(() => {
    const sections = [
      { element: document.querySelector('section[id*="hero"]'), id: 'hero' },
      { element: document.querySelector('section[id*="about"]'), id: 'about' },
      { element: document.querySelector('section[id*="skills"]'), id: 'skills' },
      { element: document.querySelector('section[id*="companies"]'), id: 'companies' },
      { element: document.querySelector('section[id*="certifications"]'), id: 'certifications' },
      { element: document.querySelector('section[id*="contact"]'), id: 'contact' },
    ];

    sections.forEach(({ element, id }) => {
      if (element && !element.getAttribute('data-analytics')) {
        element.setAttribute('data-analytics', id);
        element.setAttribute('data-locale', locale);
      }
    });
  }, [locale]);

  return <>{children}</>;
}