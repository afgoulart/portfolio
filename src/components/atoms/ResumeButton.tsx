'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n-context';

export default function ResumeButton() {
  const locale = useLocale();

  return (
    <Link
      href={`/${locale}/print-mode`}
      className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 no-print"
      title="View resume/CV"
      aria-label="View resume"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="text-lg">📄</span>
      <span className="hidden sm:inline">Resume</span>
    </Link>
  );
}
