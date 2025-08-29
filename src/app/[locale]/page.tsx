import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Companies from '@/components/sections/Companies';
import Contact from '@/components/sections/Contact';
import Navbar from '@/components/ui/Navbar';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt' }];
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Companies />
        <Contact />
      </main>
    </>
  );
}
