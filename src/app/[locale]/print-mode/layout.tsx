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
          background: #f5f5f5;
          color: #333;
          font-family: 'Segoe UI', 'Calibri', 'Arial', sans-serif;
          font-size: 11pt;
          line-height: 1.6;
        }

        body {
          padding: 20px;
        }

        main {
          background: white;
          color: #333;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        @media print {
          body {
            background: white;
            padding: 0;
            margin: 0;
          }

          html, body {
            background: white;
            color: #333;
            font-size: 11pt;
          }

          main {
            background: white;
            color: #333;
            max-width: 100%;
            box-shadow: none;
          }

          button, nav, .no-print, [class*="social"], .navbar, .floating-button {
            display: none !important;
          }

          section {
            page-break-inside: avoid;
          }
        }

        h1, h2, h3, h4, h5, h6 {
          color: #1a1a1a;
        }

        a {
          color: #0066cc;
          text-decoration: underline;
        }
      `}</style>
      {children}
    </>
  );
}
