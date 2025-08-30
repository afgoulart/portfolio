// Google Analytics 4 Utilities
// Utility functions for custom event tracking

declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void;
  }
}

// Track custom events
export const trackEvent = (
  eventName: string,
  parameters?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: string | number | boolean | undefined;
  }
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Google Analytics ID - same as component
const GA_MEASUREMENT_ID = 'G-BMNNNCFNNV';

// Track page views (useful for SPA navigation)
export const trackPageView = (url: string, title: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: title,
      page_location: url,
    });
  }
};

// Track contact form submissions
export const trackContactForm = (method: string = 'email') => {
  trackEvent('contact_form_submit', {
    event_category: 'engagement',
    event_label: method,
  });
};

// Track project link clicks
export const trackProjectClick = (projectName: string, linkType: 'demo' | 'github') => {
  trackEvent('project_click', {
    event_category: 'projects',
    event_label: `${projectName}_${linkType}`,
  });
};

// Track certificate link clicks
export const trackCertificateClick = (certName: string) => {
  trackEvent('certificate_click', {
    event_category: 'certifications',
    event_label: certName,
  });
};

// Track social media clicks
export const trackSocialClick = (platform: string) => {
  trackEvent('social_click', {
    event_category: 'social',
    event_label: platform,
  });
};

// Track CV/Resume downloads
export const trackResumeDownload = (language: string = 'pt') => {
  trackEvent('resume_download', {
    event_category: 'engagement',
    event_label: language,
  });
};

// Track scroll depth
export const trackScrollDepth = (percentage: number) => {
  trackEvent('scroll_depth', {
    event_category: 'engagement',
    event_label: `${percentage}%`,
    value: percentage,
  });
};

// Track language switch
export const trackLanguageSwitch = (fromLang: string, toLang: string) => {
  trackEvent('language_switch', {
    event_category: 'navigation',
    event_label: `${fromLang}_to_${toLang}`,
  });
};

// Track page language
export const trackPageLanguage = (language: string) => {
  trackEvent('page_language', {
    event_category: 'localization',
    event_label: language,
    page_language: language,
    custom_parameter_language: language,
  });
};

// Track section visualizations with detailed info
export const trackSectionView = (
  sectionName: string, 
  language: string, 
  timeSpent?: number,
  scrollDepth?: number
) => {
  trackEvent('section_viewed', {
    event_category: 'sections',
    event_label: `${sectionName}_${language}`,
    section_name: sectionName,
    page_language: language,
    time_spent: timeSpent,
    scroll_depth: scrollDepth,
  });
};

// Track user engagement metrics
export const trackEngagementMetrics = (
  language: string,
  sessionDuration: number,
  pagesViewed: number,
  sectionsViewed: number
) => {
  trackEvent('engagement_summary', {
    event_category: 'engagement',
    event_label: `session_${language}`,
    page_language: language,
    session_duration: sessionDuration,
    pages_viewed: pagesViewed,
    sections_viewed: sectionsViewed,
  });
};

// Track site visits with detailed info
export const trackSiteVisit = (language: string, isReturningUser: boolean = false) => {
  trackEvent('site_visit_detailed', {
    event_category: 'traffic',
    event_label: `visit_${language}`,
    page_language: language,
    user_type: isReturningUser ? 'returning' : 'new',
    visit_timestamp: new Date().toISOString(),
    browser_language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
};