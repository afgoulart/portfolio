import {
  Hero,
  About,
  Skills,
  Projects,
  Companies,
  Certifications,
  Contact,
  Navbar,
  AnalyticsProvider,
} from "@/components";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export default function Home() {
  return (
    <AnalyticsProvider>
      <Navbar />
      <main className="overflow-hidden">
        <Hero />
        <About />
        <Skills />
        {/* <Projects /> */}
        <Companies />
        <Certifications />
        <Contact />
      </main>
    </AnalyticsProvider>
  );
}
