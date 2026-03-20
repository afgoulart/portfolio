"use client";

import {
  About,
  Skills,
  Companies,
  Certifications,
  Contact,
  ResumeHeader,
} from "@/components";

export default function PrintModeContent() {
  return (
    <main className="overflow-hidden bg-white text-black print:bg-white">
      <style>{`
        @media print {
          body { background: white; color: black; }
          main { background: white; color: black; }
        }
      `}</style>

      {/* Resume Header */}
      <ResumeHeader />

      {/* Main Content - Compact */}
      <div className="max-w-4xl mx-auto px-4 py-8 print:py-4 print:px-4">
        {/* Professional Summary */}
        <section className="mb-8 print:mb-4">
          <h2 className="text-lg font-bold text-black border-b-2 border-gray-400 pb-2 mb-4">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-sm text-gray-800 leading-relaxed">
            Experienced Full Stack Developer and Tech Lead with extensive experience building scalable web applications.
            Specialized in React, Node.js, TypeScript, and cloud technologies. Proven track record of leading technical teams
            and delivering high-impact projects for startups and enterprises across multiple industries.
          </p>
        </section>

        {/* Experience */}
        <section className="mb-8 print:mb-4">
          <h2 className="text-lg font-bold text-black border-b-2 border-gray-400 pb-2 mb-4">
            PROFESSIONAL EXPERIENCE
          </h2>
          <About />
        </section>

        {/* Skills */}
        <section className="mb-8 print:mb-4">
          <h2 className="text-lg font-bold text-black border-b-2 border-gray-400 pb-2 mb-4">
            TECHNICAL SKILLS
          </h2>
          <Skills />
        </section>

        {/* Companies */}
        <section className="mb-8 print:mb-4">
          <h2 className="text-lg font-bold text-black border-b-2 border-gray-400 pb-2 mb-4">
            COMPANIES & PROJECTS
          </h2>
          <Companies />
        </section>

        {/* Certifications */}
        <section className="mb-8 print:mb-4">
          <h2 className="text-lg font-bold text-black border-b-2 border-gray-400 pb-2 mb-4">
            CERTIFICATIONS & TRAINING
          </h2>
          <Certifications />
        </section>

        {/* Contact */}
        <section className="mb-8 print:mb-4">
          <h2 className="text-lg font-bold text-black border-b-2 border-gray-400 pb-2 mb-4">
            GET IN TOUCH
          </h2>
          <Contact />
        </section>
      </div>

      {/* Footer */}
      <div className="w-full py-4 px-4 border-t border-gray-300 text-center text-xs text-gray-500 print:py-2">
        <p>Generated from portfolio • {new Date().getFullYear()}</p>
      </div>
    </main>
  );
}
