import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDirectory = path.join(process.cwd(), 'src/contents');

function generateFriendlySlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplos
    .trim()
    .replace(/^-|-$/g, ''); // Remove hífens do início e fim
}

// Mapear tópicos similares para usar o mesmo slug
const topicMappings = {
  'ai-coders-copilot-chatgpt-claude-code-amazon-q': 'ai-coding-assistants',
  'ai-coding-assistants-revolution-complete-guide-to-copilot-chatgpt-claude-and-amazon-q': 'ai-coding-assistants',
  'claude-code-e-ai-assistants': 'claude-code-ai-assistants',
  'design-patterns-o-guia-completo-para-revolucionar-seu-desenvolvimento-de-software': 'design-patterns-guide',
  'design-patterns-o-guia-definitivo-para-padroes-de-projeto-em-desenvolvimento-de-software': 'design-patterns-guide',
  'big-data-e-analytics-como-transformar-dados-em-decisoes-estrategicas-para-o-seu-negocio': 'big-data-analytics-business',
  'big-data-e-analytics-como-transformar-dados-em-vantagem-competitiva-em-2024': 'big-data-analytics-business',
  'automated-testing-the-complete-guide-to-building-bulletproof-software-in-2024': 'automated-testing-guide',
};

async function addFriendlySlugs() {
  const locales = ['pt', 'en'];
  
  for (const locale of locales) {
    const localeDirectory = path.join(postsDirectory, locale);
    
    if (!await fs.pathExists(localeDirectory)) {
      console.log(`Directory ${localeDirectory} does not exist`);
      continue;
    }

    const files = await fs.readdir(localeDirectory);

    for (const fileName of files) {
      if (fileName.endsWith('.md')) {
        const fullPath = path.join(localeDirectory, fileName);
        const fileContents = await fs.readFile(fullPath, 'utf8');
        const parsed = matter(fileContents);

        // Se já tem slug, pular
        if (parsed.data.slug) {
          console.log(`⏩ ${fileName} já tem slug: ${parsed.data.slug}`);
          continue;
        }

        // Gerar slug amigável baseado no título
        let friendlySlug = generateFriendlySlug(parsed.data.title);
        
        // Aplicar mapeamentos para tópicos similares
        const mappedSlug = Object.keys(topicMappings).find(key => 
          friendlySlug.includes(key) || key.includes(friendlySlug.substring(0, 30))
        );
        
        if (mappedSlug) {
          friendlySlug = topicMappings[mappedSlug];
          console.log(`🔄 Mapped slug: ${friendlySlug} for ${fileName}`);
        }

        // Adicionar slug ao front matter
        parsed.data.slug = friendlySlug;

        // Reescrever arquivo
        const updatedContent = matter.stringify(parsed.content, parsed.data);
        await fs.writeFile(fullPath, updatedContent, 'utf8');

        console.log(`✅ Added slug "${friendlySlug}" to ${fileName}`);
      }
    }
  }

  console.log('🎉 Finished adding friendly slugs to all posts');
}

addFriendlySlugs().catch(console.error);