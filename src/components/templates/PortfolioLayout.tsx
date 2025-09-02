import { ReactNode } from 'react';
import { 
  Navbar, 
  Hero, 
  About, 
  Skills, 
  Projects, 
  Companies, 
  Certifications, 
  Contact 
} from '@/components/organisms';

interface PortfolioLayoutProps {
  children?: ReactNode;
}

export default function PortfolioLayout({ children }: PortfolioLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Companies />
        <Certifications />
        <Contact />
        {children}
      </main>
    </div>
  );
}