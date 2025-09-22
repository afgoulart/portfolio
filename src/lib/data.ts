import {  Skill, Project, ContactInfo } from '@/types';




export const skills: Skill[] = [
  { name: "React.js", level: 95, category: 'frontend' },
  { name: "TypeScript", level: 90, category: 'frontend' },
  { name: "Vue.js", level: 85, category: 'frontend' },
  { name: "JavaScript", level: 95, category: 'frontend' },
  { name: "Next.js", level: 88, category: 'frontend' },
  { name: "Tailwind CSS", level: 85, category: 'frontend' },
  { name: "HTML", level: 95, category: 'frontend' },
  { name: "CSS", level: 95, category: 'frontend' },
  { name: "Angular", level: 75, category: 'frontend' },
  { name: "Styled-components", level: 85, category: 'frontend' },
  { name: "Node.js", level: 88, category: 'backend' },
  { name: "Express", level: 90, category: 'backend' },
  { name: "AWS", level: 80, category: 'backend' },
  { name: "Git", level: 90, category: 'tools' },
  { name: "CI/CD", level: 85, category: 'tools' },
  { name: "Storybook", level: 80, category: 'tools' },
  { name: "Nx", level: 75, category: 'tools' },
  { name: "Testes Automatizados", level: 85, category: 'tools' },
  { name: "Claude Code", level: 80, category: 'other' },
  { name: "Amazon Q", level: 80, category: 'other' },
  { name: "GitHub Copilot", level: 80, category: 'other' },
  { name: "ML & AI Programming", level: 80, category: 'other' }
];

export const projects: Project[] = [
  {
    title: "Sistema de Reservas - Aviva Incasa",
    description: "Desenvolvimento de soluções para sistema de reservas de clube residencial, com foco em melhorias de UX e performance.",
    image: "/projects/aviva.jpg",
    technologies: ["React", "Node.js", "AWS", "TypeScript"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example"
  },
  {
    title: "E-commerce Tania Bulhões",
    description: "Otimização e melhorias em plataforma de e-commerce, focando na experiência do usuário e performance do site.",
    image: "/projects/ecommerce.jpg",
    technologies: ["React", "Vue.js", "TypeScript", "E-commerce"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example"
  },
  {
    title: "Marketplace Checkout System",
    description: "Reengenharia completa do sistema de checkout de marketplace usando tecnologias modernas.",
    image: "/projects/checkout.jpg",
    technologies: ["Next.js", "React", "Node.js", "Express", "TypeScript"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example"
  },
  {
    title: "CMS Spacey - B2W Digital",
    description: "Sistema de gerenciamento de conteúdo para publicações de marketing e gerenciador de promoções.",
    image: "/projects/cms.jpg",
    technologies: ["React", "Node.js", "Java", "JavaScript"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example"
  }
];

export const contactInfo: ContactInfo = {
  email: "afgoulart.rj@gmail.com",
  phone: "+55 (21) 98536-4597",
  location: "Rio de Janeiro, Brasil",
  linkedin: "https://www.linkedin.com/in/afgoulart",
  github: "https://github.com/afgoulart"
};