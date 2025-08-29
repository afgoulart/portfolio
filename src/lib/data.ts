import { Experience, Skill, Project, ContactInfo } from '@/types';

export const experiences: Experience[] = [
  {
    title: "Especialista Fullstack Engineer | AWS Architect",
    company: "Skopia (EclipseWork/NScreen)",
    period: "Dezembro 2024 - presente",
    description: "Faço parte de uma consultoria, alocado no cliente Aviva Incasa Residencial clube, onde proponho ideias e crio soluções para melhorar o site de reservas para o clube residencial da empresa. Manutenção e sustentação nos projetos de front e back relacionados ao Cliente.",
    technologies: ["React", "Node.js", "AWS", "TypeScript", "Vue.js"]
  },
  {
    title: "Senior Frontend Engineer",
    company: "Calindra",
    period: "Julho 2024 - Novembro 2024",
    description: "Atuei como parte de uma consultoria, alocado no cliente Tania Bulhões, onde propus ideias e criei soluções para melhorar o site de e-commerce da empresa. Colaborei diretamente com o cliente para entender suas necessidades e entregar soluções técnicas impactantes para otimizar a experiência do usuário e o desempenho do site.",
    technologies: ["React", "Vue.js", "TypeScript", "E-commerce", "UX/UI"]
  },
  {
    title: "Senior Frontend Engineer",
    company: "Desygner",
    period: "Dezembro 2023 - Maio 2024",
    description: "Desenvolvi interfaces modernas e responsivas usando React, Vue, Node.js, TypeScript, Styled-components, Storybook e Nx. Melhorei continuamente o código e criei componentes reutilizáveis, colaborando com designers e gerentes de produto para transformar conceitos em soluções funcionais.",
    technologies: ["React", "Vue.js", "Node.js", "TypeScript", "Styled-components", "Storybook", "Nx"]
  },
  {
    title: "Staff Software Engineer",
    company: "Stone",
    period: "Julho 2023 - Dezembro 2023",
    description: "Desenvolvi interfaces modernas e responsivas usando Vue.js, Next.js, React e Tailwind CSS.",
    technologies: ["Vue.js", "Next.js", "React", "Tailwind CSS"]
  },
  {
    title: "Tech Lead",
    company: "Mosaico",
    period: "Janeiro 2022 - Janeiro 2023",
    description: "Liderei a equipe responsável pelo desenvolvimento de sistemas de autenticação e áreas logadas. Promovi melhorias nos processos e funcionalidades por meio da colaboração interdepartamental. Fui referência técnica para duas equipes, oferecendo suporte e orientação para aprimorar as habilidades técnicas dos desenvolvedores.",
    technologies: ["React", "Node.js", "TypeScript", "Autenticação", "Liderança Técnica"]
  },
  {
    title: "Full Stack Engineer",
    company: "Mosaico",
    period: "Agosto 2019 - Janeiro 2022",
    description: "Participei da reengenharia do sistema de checkout do marketplace usando Next.js e React. Desenvolvi um painel financeiro para relatórios de lojas, utilizando NodeJS + Express em TypeScript para a API e React para o front-end.",
    technologies: ["Next.js", "React", "Node.js", "Express", "TypeScript"]
  },
  {
    title: "Tech Lead / Full Stack Developer Senior",
    company: "B2W Digital",
    period: "Outubro 2017 - Julho 2019",
    description: "Assumi à liderança técnica de três projetos, Spacey (CMS para publicações do marketing) e gerenciador de promoções. Trabalhei no projeto Submarino usando JAVA, HTML, CSS, JavaScript e jQuery.",
    technologies: ["React", "Node.js", "Java", "JavaScript", "jQuery", "HTML", "CSS"]
  }
];

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
  { name: "Testes Automatizados", level: 85, category: 'tools' }
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