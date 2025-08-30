import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Companies from "@/components/sections/Companies";
import Certifications from "@/components/sections/Certifications";
import Contact from "@/components/sections/Contact";
import Navbar from "@/components/ui/Navbar";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export default function Home() {
  return (
    <AnalyticsProvider>
      <Navbar />
      <main className="overflow-x-hidden">
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
