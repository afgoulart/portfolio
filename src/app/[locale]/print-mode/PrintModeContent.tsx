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
    <main className="bg-white text-gray-900 print:bg-white">
      {/* Document-style background */}
      <div className="min-h-screen bg-white">
        {/* Resume Header */}
        <ResumeHeader />

        {/* Main Content - Document Style */}
        <div className="max-w-4xl mx-auto px-8 py-12 print:py-8 print:px-6">
          {/* Professional Summary */}
          <section className="mb-8 pb-8 border-b border-gray-300">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
              Professional Summary
            </h2>
            <p className="text-gray-800 leading-relaxed text-justify">
              Experienced Full Stack Developer and Tech Lead with extensive experience building scalable web applications.
              Specialized in React, Node.js, TypeScript, and cloud technologies. Proven track record of leading technical teams
              and delivering high-impact projects for startups and enterprises across multiple industries.
            </p>
          </section>

          {/* Experience */}
          <section className="mb-8 pb-8 border-b border-gray-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
              Professional Experience
            </h2>
            <About />
          </section>

          {/* Skills */}
          <section className="mb-8 pb-8 border-b border-gray-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
              Technical Skills
            </h2>
            <Skills />
          </section>

          {/* Companies */}
          <section className="mb-8 pb-8 border-b border-gray-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
              Companies & Projects
            </h2>
            <Companies />
          </section>

          {/* Certifications */}
          <section className="mb-8 pb-8 border-b border-gray-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
              Certifications & Training
            </h2>
            <Certifications />
          </section>

          {/* Contact */}
          <section className="mb-0">
            <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
              Contact
            </h2>
            <Contact />
          </section>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 py-4 px-8 text-center text-xs text-gray-600 print:py-2">
          <p>Professional Resume • Generated from Portfolio</p>
        </div>
      </div>
    </main>
  );
}
