"use client";

import { useTranslations } from "@/lib/i18n-context";
import { contactInfo } from "@/lib/data";

export default function ResumeHeader() {
  const t = useTranslations("hero");

  return (
    <div className="w-full py-6 px-4 border-b-2 border-gray-300 print:py-3 print:px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-black mb-1">{t("name")}</h1>
        <p className="text-gray-700 text-sm mb-3">{t("subtitle")}</p>

        {/* Contact Info */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600 print:gap-3 print:text-9pt">
          {contactInfo.email && (
            <div className="flex items-center gap-1">
              <span>📧</span>
              <a href={`mailto:${contactInfo.email}`} className="text-blue-600 no-underline">
                {contactInfo.email}
              </a>
            </div>
          )}
          {contactInfo.phone && (
            <div className="flex items-center gap-1">
              <span>📱</span>
              <span>{contactInfo.phone}</span>
            </div>
          )}
          {contactInfo.location && (
            <div className="flex items-center gap-1">
              <span>📍</span>
              <span>{contactInfo.location}</span>
            </div>
          )}
          {contactInfo.linkedin && (
            <div className="flex items-center gap-1">
              <span>🔗</span>
              <a href={contactInfo.linkedin} className="text-blue-600 no-underline" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          )}
          {contactInfo.github && (
            <div className="flex items-center gap-1">
              <span>🐙</span>
              <a href={contactInfo.github} className="text-blue-600 no-underline" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
