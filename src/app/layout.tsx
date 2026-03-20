import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "André Filipe de Moraes Goulart - Senior Software Engineer",
  description: "Senior Software Engineer with 10+ years of experience in web development, specializing in React, Vue, Node.js, and TypeScript",
  keywords: "software engineer, react, vue, nodejs, typescript, frontend, backend, fullstack developer",
  authors: [{ name: "André Filipe de Moraes Goulart", url: "https://www.linkedin.com/in/afgoulart" }],
  openGraph: {
    title: "André Filipe de Moraes Goulart - Senior Software Engineer",
    description: "Senior Software Engineer with 10+ years of experience in web development",
    type: "website",
    locale: "pt_BR",
    alternateLocale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-gray-900 text-white`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}