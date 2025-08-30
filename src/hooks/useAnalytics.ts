'use client';

import { useEffect, useRef } from 'react';
import { trackEvent, trackPageView } from '@/lib/analytics';

// Hook para tracking de sessões e visualizações
export const useSessionTracking = (locale: string) => {
  const sessionStarted = useRef(false);
  const pageViewed = useRef(false);

  useEffect(() => {
    // Track session start (apenas uma vez por sessão)
    if (!sessionStarted.current) {
      trackEvent('session_start', {
        event_category: 'session',
        event_label: locale,
        page_language: locale,
        session_timestamp: Date.now(),
      });
      sessionStarted.current = true;
    }

    // Track page view com idioma
    if (!pageViewed.current) {
      trackPageView(window.location.href, document.title);
      trackEvent('page_view', {
        event_category: 'navigation',
        event_label: `page_${locale}`,
        page_language: locale,
        page_path: window.location.pathname,
      });
      pageViewed.current = true;
    }

    // Track site visit (marca visita ao site)
    trackEvent('site_visit', {
      event_category: 'engagement',
      event_label: `visit_${locale}`,
      page_language: locale,
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
    });

    // Cleanup no final da sessão
    const handleBeforeUnload = () => {
      trackEvent('session_end', {
        event_category: 'session',
        event_label: locale,
        session_duration: Date.now(),
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [locale]);
};

// Hook para tracking de visualizações de seções
export const useSectionTracking = (sectionName: string, locale: string) => {
  const hasViewed = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasViewed.current) {
            trackEvent('section_view', {
              event_category: 'sections',
              event_label: `${sectionName}_${locale}`,
              section_name: sectionName,
              page_language: locale,
              viewport_percentage: Math.round(entry.intersectionRatio * 100),
            });
            hasViewed.current = true;
          }
        });
      },
      {
        threshold: 0.5, // 50% da seção visível
        rootMargin: '0px 0px -100px 0px', // Margem para trigger
      }
    );

    const element = document.getElementById(sectionName);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sectionName, locale]);
};

// Hook para tracking de tempo na página
export const useTimeTracking = (locale: string) => {
  const startTime = useRef(Date.now());

  useEffect(() => {
    const trackTimeSpent = () => {
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      
      // Track a cada 30 segundos
      if (timeSpent > 0 && timeSpent % 30 === 0) {
        trackEvent('time_on_page', {
          event_category: 'engagement',
          event_label: `${timeSpent}s_${locale}`,
          value: timeSpent,
          page_language: locale,
        });
      }
    };

    const interval = setInterval(trackTimeSpent, 1000);
    return () => clearInterval(interval);
  }, [locale]);
};

// Hook para tracking de scroll depth
export const useScrollTracking = (locale: string) => {
  const trackedDepths = useRef(new Set<number>());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      // Track marcos importantes (25%, 50%, 75%, 100%)
      const milestones = [25, 50, 75, 90, 100];
      
      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !trackedDepths.current.has(milestone)) {
          trackedDepths.current.add(milestone);
          trackEvent('scroll_depth', {
            event_category: 'engagement',
            event_label: `${milestone}%_${locale}`,
            value: milestone,
            page_language: locale,
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [locale]);
};

// Hook para tracking de interações do usuário
export const useInteractionTracking = (locale: string) => {
  useEffect(() => {
    let isActive = true;
    let idleTimer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      if (isActive) {
        trackEvent('user_active', {
          event_category: 'engagement',
          event_label: `active_${locale}`,
          page_language: locale,
        });
        isActive = false;
      }
      
      // Reset depois de 60 segundos de inatividade
      idleTimer = setTimeout(() => {
        isActive = true;
      }, 60000);
    };

    // Eventos que indicam atividade do usuário
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetIdleTimer, { passive: true });
    });

    return () => {
      clearTimeout(idleTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [locale]);
};