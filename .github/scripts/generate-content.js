// .github/scripts/generate-content.js
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function getCurrentTechTrends() {
  // Simulação de busca por trending topics
  // Na prática, você pode integrar com APIs como Google Trends, Hacker News, etc.
  const trendingSources = [
    'https://news.ycombinator.com/rss',
    // Adicione outras fontes RSS se necessário
  ];

  // Para este exemplo, vamos usar tópicos pré-definidos
  const techTopics = [
    'Inteligência Artificial e Machine Learning',
    'Testes Automatizados',
    'React e JavaScript',
    'patterns de design',
    'inovações em IA',
    'Claude code',
    'AI Coders, Copilot, ChatGPT, Claude Code, Amazon Q',
    'Desenvolvimento Web e Frameworks',
    'DevOps e Cloud Computing',
    'Big Data e Analytics',
    "Automação de desenvolvimento de software",
  ];

  // // Exemplo: integração com Hacker News API
  const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json').then(res => res.json());
  const topStoryIds = response.slice(0, 10);
  const topStories = await Promise.all(topStoryIds.map(async id => {
    const story = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json());
    return story.title;
  }));
  // console.log('Títulos principais do Hacker News:', topStories);
  // // Retornar um tópico aleatório da lista
  techTopics.push(...topStories);

  return techTopics[Math.floor(Math.random() * techTopics.length)];
}

async function generateBaseBlogPost(topic) {
  const customTopic = process.env.CUSTOM_TOPIC;
  const finalTopic = customTopic || topic;

  const prompt = `
Como um especialista em tecnologia e redator de blog, crie um artigo completo sobre "${finalTopic}".

O artigo deve conter:
1. Um título atrativo e otimizado para SEO
2. Uma introdução que contextualize o tema
3. Pelo menos 3 seções principais com subtítulos
4. Informações técnicas precisas mas acessíveis
5. Exemplos práticos ou casos de uso
6. Uma conclusão que resuma os pontos principais
7. 3-5 tags relevantes para categorização

Formato de resposta em Markdown com front matter:
---
title: "Título do Artigo"
date: "YYYY-MM-DD"
author: "Tech Blog Bot"
tags: ["tag1", "tag2", "tag3"]
excerpt: "Breve descrição do artigo"
---

# Título do Artigo

Conteúdo do artigo em markdown...

O artigo deve ter entre 800-1200 palavras e ser informativo, atual e envolvente.

Escreva em português brasileiro.

Incluir fontes de pesquisa e links relevantes no final do artigo.
`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 5000,
    messages: [{ role: 'user', content: prompt, }]
  });

  console.log(`✅ Artigo base gerado com sucesso.`);
  return response.content[0].text;
}

async function translateBlogPost(baseContent, targetLanguage) {
  if (targetLanguage === 'pt') {
    return baseContent; // Já está em português
  }

  const prompt = `
Traduza o seguinte artigo de blog de português para inglês, mantendo EXATAMENTE a mesma estrutura, formatação markdown e front matter.

IMPORTANTE:
- Mantenha o mesmo formato de front matter
- Traduza title, tags e excerpt
- Mantenha author e date inalterados
- Traduza todo o conteúdo markdown mantendo a formatação
- Mantenha os links e referências originais
- Traduza os títulos das seções mantendo a hierarquia (# ## ###)

Artigo original em português:

${baseContent}

Responda APENAS com o artigo traduzido completo, sem explicações adicionais.
`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 5000,
    messages: [{ role: 'user', content: prompt, }]
  });

  console.log(`✅ Artigo traduzido com sucesso para ${targetLanguage}.`);
  return response.content[0].text;
}

function generateSlugFromTopic(topic) {
  return topic
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplos
    .trim();
}

async function savePost(content, language = 'pt', baseSlug = null) {
  // Extrair front matter e conteúdo
  const parsed = matter(content);
  const { data, content: postContent } = parsed;

  // Gerar nome do arquivo baseado na data e slug base (se fornecido)
  const date = new Date().toISOString().split('T')[0];
  const slug = baseSlug || data.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplos
    .trim();

  const filename = `${date}-${slug}.md`;

  // Atualizar data no front matter
  data.date = date;

  // Recriar o arquivo com front matter atualizado
  const finalContent = matter.stringify(postContent, data);

  // Criar diretório se não existir
  const postsDir = path.join(process.cwd(), 'src', 'contents', language);
  await fs.ensureDir(postsDir);

  // Salvar o arquivo
  const filePath = path.join(postsDir, filename);
  await fs.writeFile(filePath, finalContent, 'utf8');

  console.log(`✅ Post gerado com sucesso: ${filename}`);
  console.log(`📍 Localização: ${filePath}`);

  return { filename, filePath, data, slug };
}


async function main() {
  try {
    console.log('🚀 Iniciando geração de conteúdo...');
    const langs = ['pt', 'en'];

    // Obter tópico trending
    const topic = await getCurrentTechTrends();
    console.log(`📝 Tópico selecionado: ${topic}`);

    // Gerar slug base do tópico para manter consistência
    const baseSlug = generateSlugFromTopic(topic);
    console.log(`📌 Slug base: ${baseSlug}`);

    // 1. Gerar artigo base em português
    console.log('📝 Gerando artigo base em português...');
    const baseContent = await generateBaseBlogPost(topic);

    let savedPosts = [];

    // 2. Para cada idioma, traduzir e salvar
    for (const lang of langs) {
      console.log(`📝 Processando artigo para ${lang}...`);

      // Traduzir se necessário
      const content = await translateBlogPost(baseContent, lang);

      // Salvar post usando o mesmo slug base
      const postInfo = await savePost(content, lang, baseSlug);
      savedPosts.push(postInfo);
      console.log(`🔗 Post salvo: ${postInfo.filename}`);
    }

    console.log('✨ Processo concluído com sucesso!');
    console.log('📑 Artigos gerados:');
    savedPosts.forEach(post => {
      console.log(`  - ${post.filename} (${post.data.title})`);
    });

  } catch (error) {
    console.error('❌ Erro durante a execução:', error);
    process.exit(1);
  }
}

main();