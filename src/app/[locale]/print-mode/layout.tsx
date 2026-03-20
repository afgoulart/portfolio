import type { ReactNode } from "react";

export const metadata = {
  title: "Resume | My Portfolio",
  description: "Professional Resume / CV",
  robots: "noindex, nofollow",
};

export default function PrintModeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
        }

        html, body {
          background: white;
          color: black;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        @media print {
          body {
            margin: 0;
            padding: 0.5in;
          }

          html, body {
            background: white;
            color: black;
          }

          main {
            background: white;
            color: black;
            max-width: 100%;
          }

          button, nav, .no-print, [class*="social"] {
            display: none !important;
          }
        }
      `}</style>
      {children}
    </>
  );
}
