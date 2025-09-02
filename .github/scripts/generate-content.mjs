// .github/scripts/generate-content.mjs
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

async function getCurrentTechTrends() {
  // Tópicos pré-definidos de tecnologia
  const techTopics = [
    'Inteligência Artificial e Machine Learning',
    'Testes Automatizados',
    'React e JavaScript',
    'Patterns de Design',
    'Inovações em IA',
    'Claude Code e AI Assistants',
    'AI Coders: Copilot, ChatGPT, Claude Code, Amazon Q',
    'Desenvolvimento Web e Frameworks',
    'DevOps e Cloud Computing',
    'Big Data e Analytics',
    'Automação de Desenvolvimento de Software',
    'Microserviços e Arquitetura',
    'Segurança em Desenvolvimento',
    'Performance Web e Otimização',
    'TypeScript e JavaScript Moderno'
  ];

  try {
    // Exemplo: integração com Hacker News API
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json').then(res => res.json());
    const topStoryIds = response.slice(0, 10);
    const topStories = await Promise.all(topStoryIds.map(async id => {
      const story = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json());
      return story.title;
    }));

    // Filtrar apenas títulos válidos (sem HTML, sem caracteres especiais demais)
    const validStories = topStories.filter(title => 
      title && 
      typeof title === 'string' && 
      !title.includes('<') && 
      !title.includes('>') &&
      title.length > 10 &&
      title.length < 100
    );

    console.log('Títulos válidos do Hacker News:', validStories);
    
    // Adicionar títulos válidos aos tópicos
    if (validStories.length > 0) {
      techTopics.push(...validStories.slice(0, 5)); // Máximo 5 títulos do HN
    }
  } catch (error) {
    console.log('⚠️ Erro ao buscar tópicos do Hacker News, usando tópicos pré-definidos:', error.message);
  }

  // Se tiver um tópico customizado, usar ele
  if (process.env.CUSTOM_TOPIC && process.env.CUSTOM_TOPIC.trim()) {
    console.log('🎯 Usando tópico customizado:', process.env.CUSTOM_TOPIC);
    return process.env.CUSTOM_TOPIC.trim();
  }

  // Retornar um tópico aleatório da lista
  const selectedTopic = techTopics[Math.floor(Math.random() * techTopics.length)];
  return selectedTopic;
}

async function generateBaseBlogPost(topic) {
  const customTopic = process.env.CUSTOM_TOPIC;
  const contentType = process.env.CONTENT_TYPE || 'tech-article';
  const finalTopic = customTopic || topic;

  const contentTypePrompts = {
    'tech-article': `Como um especialista em tecnologia e redator de blog, crie um artigo completo sobre "${finalTopic}".

O artigo deve conter:
1. Um título atrativo e otimizado para SEO
2. Uma introdução que contextualize o tema
3. Pelo menos 3 seções principais com subtítulos
4. Informações técnicas precisas mas acessíveis
5. Exemplos práticos ou casos de uso
6. Uma conclusão que resuma os pontos principais
7. 3-5 tags relevantes para categorização`,

    'tutorial': `Como um instrutor experiente, crie um tutorial passo-a-passo sobre "${finalTopic}".

O tutorial deve conter:
1. Um título claro indicando que é um tutorial
2. Pré-requisitos necessários
3. Lista dos materiais/ferramentas necessárias
4. Passos numerados e detalhados
5. Exemplos de código ou comandos quando aplicável
6. Possíveis problemas e soluções
7. Próximos passos ou recursos adicionais`,

    'review': `Como um analista de tecnologia, crie uma análise/review completa sobre "${finalTopic}".

A review deve conter:
1. Um título que indique ser uma análise
2. Visão geral do tópico analisado
3. Prós e contras detalhados
4. Comparação com alternativas (se aplicável)
5. Casos de uso recomendados
6. Conclusão com recomendação final
7. Rating ou pontuação quando apropriado`,

    'news-analysis': `Como um jornalista de tecnologia, crie uma análise sobre as novidades relacionadas a "${finalTopic}".

A análise deve conter:
1. Título chamativo sobre as novidades
2. Resumo das principais novidades
3. Impacto na indústria ou comunidade
4. Opinião de especialistas ou dados de mercado
5. Implicações futuras
6. Conclusão sobre a importância dessas novidades`
  };

  const prompt = `${contentTypePrompts[contentType] || contentTypePrompts['tech-article']}

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
    console.log(`📋 Parâmetros recebidos:`);
    console.log(`   - CUSTOM_TOPIC: "${process.env.CUSTOM_TOPIC || 'não definido'}"`);
    console.log(`   - CONTENT_TYPE: "${process.env.CONTENT_TYPE || 'não definido'}"`);
    
    const langs = ['pt', 'en'];

    // Obter tópico trending
    const topic = await getCurrentTechTrends();
    console.log(`📝 Tópico selecionado: ${topic}`);

    // Verificar se o tópico é válido
    if (!topic || topic.includes('<') || topic.includes('>')) {
      throw new Error(`❌ Tópico inválido detectado: "${topic}". Contém HTML ou está vazio.`);
    }

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