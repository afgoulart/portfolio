'use client';

import Script from 'next/script';

// Google Analytics ID - hardcoded for static export
const GA_MEASUREMENT_ID = 'G-BMNNNCFNNV';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export default function GoogleAnalytics({ 
  measurementId = GA_MEASUREMENT_ID 
}: GoogleAnalyticsProps) {
  // Always load GA4 if measurement ID exists (will be controlled by hostname in runtime)
  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          // Only initialize GA4 in production (not localhost)
          if (window.location.hostname !== 'localhost' && 
              window.location.hostname !== '127.0.0.1') {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          }
        `}
      </Script>
    </>
  );
}