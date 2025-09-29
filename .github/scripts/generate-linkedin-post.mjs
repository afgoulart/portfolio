// .github/scripts/generate-linkedin-post.mjs
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function getLatestBlogPost() {
  const contentsDir = path.join(__dirname, '../../src/contents');
  const locales = ['pt', 'en'];
  let latestPost = null;
  let latestDate = new Date(0);

  for (const locale of locales) {
    const localeDir = path.join(contentsDir, locale);
    if (!fs.existsSync(localeDir)) continue;

    const files = fs.readdirSync(localeDir)
      .filter(file => file.endsWith('.md'))
      .sort()
      .reverse(); // Mais recentes primeiro

    for (const file of files) {
      const filePath = path.join(localeDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter } = matter(content);

      const postDate = new Date(frontmatter.date);
      if (postDate > latestDate) {
        latestDate = postDate;
        latestPost = {
          ...frontmatter,
          locale,
          slug: file.replace('.md', ''),
          content
        };
      }
    }
  }

  return latestPost;
}

async function generateLinkedInPost(blogPost) {
  const prompt = `
Você é um especialista em marketing de conteúdo e LinkedIn. Crie um post envolvente para LinkedIn baseado no seguinte post de blog:

**Título:** ${blogPost.title}
**Resumo:** ${blogPost.excerpt}
**Tags:** ${blogPost.tags.join(', ')}
**Idioma original:** ${blogPost.locale}

**REQUISITOS ESPECÍFICOS:**
1. Escreva TANTO em português quanto em inglês no mesmo post (bilíngue)
2. Comece com português, depois inglês
3. Use separador visual entre os idiomas (como "---" ou "🇧🇷/🇺🇸")
4. NÃO pareça gerado por IA - use tom pessoal e natural
5. Inclua hashtags APENAS no final, misture português e inglês naturalmente
6. Máximo 1300 caracteres total
7. Foque em compartilhar valor e insights pessoais
8. Use primeira pessoa e experiência pessoal
9. Inclua call-to-action sutil para ler o post completo
10. Use emojis moderadamente para humanizar

**ESTRUTURA SUGERIDA:**
- Hook inicial (PT)
- Insight/experiência pessoal (PT)
- [Separador visual]
- Hook inicial (EN)
- Insight/experiência pessoal (EN)
- Call-to-action para blog
- Hashtags misturadas

**EXEMPLO DE TOM:**
"Recentemente descobri algo interessante sobre..."
"Este projeto me ensinou que..."
"Na minha experiência com..."

Gere APENAS o texto do post, sem explicações adicionais.
`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }]
  });

  return response.content[0].text.trim();
}

async function main() {
  try {
    console.log('🔍 Buscando post mais recente...');
    const latestPost = await getLatestBlogPost();

    if (!latestPost) {
      console.log('❌ Nenhum post encontrado');
      process.exit(1);
    }

    // Verifica se o post foi criado hoje (para evitar posts antigos)
    const today = new Date();
    const postDate = new Date(latestPost.date);
    const daysDifference = Math.floor((today - postDate) / (1000 * 60 * 60 * 24));

    if (daysDifference > 1) {
      console.log(`⏰ Post mais recente é de ${daysDifference} dias atrás. Não gerando post do LinkedIn.`);
      process.exit(0);
    }

    console.log(`📝 Gerando post do LinkedIn para: "${latestPost.title}"`);

    const linkedInPost = await generateLinkedInPost(latestPost);

    // Salvar o post gerado em um arquivo para revisão/uso manual
    const outputDir = path.join(__dirname, '../../generated');
    await fs.ensureDir(outputDir);

    const outputFile = path.join(outputDir, `linkedin-post-${latestPost.slug}.txt`);

    const fullOutput = `# LinkedIn Post - ${latestPost.title}
Gerado em: ${new Date().toISOString()}
Post original: ${latestPost.locale}/blog/${latestPost.slug}

---

${linkedInPost}

---

## Informações do Post Original:
- Título: ${latestPost.title}
- Data: ${latestPost.date}
- Tags: ${latestPost.tags.join(', ')}
- Idioma: ${latestPost.locale}
`;

    await fs.writeFile(outputFile, fullOutput, 'utf8');

    console.log('✅ Post do LinkedIn gerado com sucesso!');
    console.log(`📁 Arquivo salvo em: ${outputFile}`);
    console.log('\n--- POST GERADO ---');
    console.log(linkedInPost);
    console.log('--- FIM DO POST ---\n');

    // Exportar para variável de ambiente do GitHub Actions se disponível
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `linkedin_post<<EOF\n${linkedInPost}\nEOF\n`);
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `post_title=${latestPost.title}\n`);
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `post_slug=${latestPost.slug}\n`);
    }

  } catch (error) {
    console.error('❌ Erro ao gerar post do LinkedIn:', error);
    process.exit(1);
  }
}

// Permitir override via variáveis de ambiente para testes
if (process.env.LINKEDIN_SLUG) {
  console.log(`🎯 Modo de teste: gerando post para slug específico: ${process.env.LINKEDIN_SLUG}`);
}

main();