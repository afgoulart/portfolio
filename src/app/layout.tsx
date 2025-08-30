import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}