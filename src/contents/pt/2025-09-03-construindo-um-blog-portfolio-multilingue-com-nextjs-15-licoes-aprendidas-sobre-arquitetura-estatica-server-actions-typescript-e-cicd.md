---
title: >-
  Next.js 15 na Prática: Construindo um Blog Portfolio Multilíngue com
  Arquitetura Moderna e CI/CD
date: '2025-09-03'
author: Tech Blog Bot
tags:
  - nextjs
  - typescript
  - portfolio
  - multilingual
  - cicd
excerpt: >-
  Descubra como construir um blog portfolio multilíngue profissional com Next.js
  15, explorando Server Actions, geração estática, TypeScript e automação CI/CD
  em um projeto real.
slug: >-
  construindo-um-blog-portfolio-multilingue-com-nextjs-15-licoes-aprendidas-sobre-arquitetura-estatica-server-actions-typescript-e-cicd
---

# Next.js 15 na Prática: Construindo um Blog Portfolio Multilíngue com Arquitetura Moderna e CI/CD

O desenvolvimento de portfolios pessoais e blogs técnicos evoluiu significativamente nos últimos anos. Com o lançamento do Next.js 15, desenvolvedores agora têm acesso a ferramentas ainda mais poderosas para criar experiências web modernas e performáticas. Neste artigo, compartilho as lições aprendidas ao construir um blog portfolio multilíngue usando as últimas funcionalidades do Next.js, explorando desde a arquitetura estática até a implementação de pipelines CI/CD robustos.

A jornada de criar um portfolio que não apenas showcase projetos, mas também sirva como plataforma de conteúdo técnico, apresenta desafios únicos. Como equilibrar performance, SEO, experiência do usuário e manutenibilidade? Como implementar suporte multilíngue sem comprometer a velocidade? Essas questões guiaram todo o processo de desenvolvimento.

## Arquitetura Estática com Next.js 15: App Router e Server Components

### Migração para App Router: Uma Nova Filosofia

O App Router do Next.js 15 representa uma mudança fundamental na forma como estruturamos aplicações React. Diferente do Pages Router tradicional, o App Router abraça totalmente os Server Components, oferecendo melhor performance e experiência de desenvolvimento.

```typescript
// app/[locale]/blog/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/posts'

interface PageProps {
  params: {
    locale: string
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug, params.locale)
  
  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage]
    }
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  
  return posts.map((post) => ({
    locale: post.locale,
    slug: post.slug,
  }))
}

export default async function BlogPost({ params }: PageProps) {
  const post = await getPostBySlug(params.slug, params.locale)
  
  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <time className="text-gray-600">{post.publishedAt}</time>
      </header>
      
      <div 
        className="prose lg:prose-xl"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}
```

### Otimização de Performance com Static Generation

Uma das decisões mais impactantes foi optar por Static Site Generation (SSG) para o blog. Isso significa que todas as páginas são pré-renderizadas durante o build, resultando em tempos de carregamento extremamente rápidos.

```typescript
// lib/posts.ts
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
  locale: string
  tags: string[]
}

export async function getAllPosts(): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), 'content/posts')
  const locales = ['pt-BR', 'en-US']
  const allPosts: Post[] = []

  for (const locale of locales) {
    const localePath = path.join(postsDirectory, locale)
    
    try {
      const filenames = await fs.readdir(localePath)
      
      const posts = await Promise.all(
        filenames
          .filter(name => name.endsWith('.md'))
          .map(async (filename) => {
            const filePath = path.join(localePath, filename)
            const fileContents = await fs.readFile(filePath, 'utf8')
            const { data, content } = matter(fileContents)
            
            const processedContent = await remark()
              .use(remarkHtml)
              .process(content)
            
            return {
              slug: filename.replace('.md', ''),
              title: data.title,
              excerpt: data.excerpt,
              content: processedContent.toString(),
              publishedAt: data.date,
              locale,
              tags: data.tags || []
            }
          })
      )
      
      allPosts.push(...posts)
    } catch (error) {
      console.warn(`No posts found for locale: ${locale}`)
    }
  }

  return allPosts.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}
```

## Server Actions e TypeScript: Interatividade Moderna

### Implementando Formulários com Server Actions

Uma das funcionalidades mais empolgantes do Next.js 15 são as Server Actions, que permitem executar código servidor diretamente de componentes cliente, simplificando drasticamente o desenvolvimento de formulários e interações.

```typescript
// app/actions/contact.ts
'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
  locale: z.string()
})

export async function submitContact(formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    locale: formData.get('locale')
  }

  const validatedData = contactSchema.parse(rawData)
  
  try {
    // Enviar email usando serviço como SendGrid ou Resend
    await sendEmail({
      to: 'contato@exemplo.com',
      subject: `Nova mensagem de ${validatedData.name}`,
      html: `
        <h2>Nova mensagem do portfolio</h2>
        <p><strong>Nome:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${validatedData.message}</p>
      `
    })
    
  } catch (error) {
    throw new Error('Erro ao enviar mensagem')
  }

  redirect(`/${validatedData.locale}/contato/sucesso`)
}
```

```typescript
// components/ContactForm.tsx
'use client'

import { useFormState } from 'react-dom'
import { submitContact } from '@/app/actions/contact'

interface ContactFormProps {
  locale: string
  labels: {
    name: string
    email: string
    message: string
    submit: string
  }
}

export default function ContactForm({ locale, labels }: ContactFormProps) {
  const [state, formAction] = useFormState(submitContact, null)

  return (
    <form action={formAction} className="max-w-lg mx-auto space-y-6">
      <input type="hidden" name="locale" value={locale} />
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          {labels.name}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          {labels.email}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          {labels.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        {labels.submit}
      </button>

      {state?.error && (
        <div className="text-red-600 text-sm">{state.error}</div>
      )}
    </form>
  )
}
```

### TypeScript Avançado para Type Safety

O uso extensivo de TypeScript foi fundamental para manter a qualidade do código. Implementamos tipos personalizados e utility types para garantir consistência em todo o projeto:

```typescript
// types/blog.ts
export interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
  updatedAt?: string
  coverImage?: string
  tags: string[]
  locale: Locale
  author: Author
  readingTime: number
}

export interface Author {
  name: string
  avatar: string
  bio: string
  social: {
    twitter?: string
    github?: string
    linkedin?: string
  }
}

export type Locale = 'pt-BR' | 'en-US'

export type PostPreview = Omit<Post, 'content'>

export interface BlogPageProps {
  posts: PostPreview[]
  totalPages: number
  currentPage: number
  locale: Locale
}

// Utility types para internacionalização
export interface LocalizedContent {
  [key: string]: {
    'pt-BR': string
    'en-US': string
  }
}

export type TranslationKey = keyof typeof import('../locales/pt-BR.json')
```

## Internacionalização e Pipelines CI/CD

### Implementação Multilíngue Robusta

A implementação de suporte multilíngue foi um dos aspectos mais complexos do projeto. Utilizamos o sistema de roteamento do Next.js 15 combinado com uma estratégia de conteúdo organizada:

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const locales = ['pt-BR', 'en-US']
const defaultLocale = 'pt-BR'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Verificar se já existe um locale na URL
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Detectar locale preferido do usuário
  const locale = getLocale(request) || defaultLocale
  
  // Redirecionar com o locale
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

function getLocale(request: NextRequest): string | undefined {
  // Verificar cookie de preferência
  const cookieLocale = request.cookies.get('preferred-locale')?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  // Verificar Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    for (const locale of locales) {
      if (acceptLanguage.includes(locale)) {
        return locale
      }
    }
  }

  return defaultLocale
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
```

### Pipeline CI/CD com GitHub Actions

A automação do deployment foi implementada usando GitHub Actions, garantindo que cada push para a branch principal resulte em um deployment automático:

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run TypeScript check
      run: npm run type-check
    
    - name: Run tests
      run: npm run test
    
    - name: Run linting
      run: npm run lint

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
      env:
        NEXT_PUBLIC_BASE_URL: ${{ secrets.BASE_URL }}
        RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

### Monitoramento e Analytics

Implementamos também um sistema básico de analytics e monitoramento de performance:

```typescript
// lib/analytics.ts
interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp: number
  locale: string
}

export function trackPageView(page: string, locale: string) {
  if (typeof window !== 'undefined') {
    // Google Analytics 4
    window.gtag?.('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: page,
      custom_map: { locale }
    })
    
    // Analytics personalizado
    trackEvent('page_view', { page, locale })
  }
}

export function trackEvent(name: string, properties: Record<string, any> = {}) {
  const event: AnalyticsEvent = {
    name,
    properties,
    timestamp: Date.now(),
    locale: properties.locale || 'pt-BR'
  }
  
  // Enviar para serviço de analytics
  if (typeof window !== 'undefined') {
    window.gtag?.('event', name, properties)
  }
}
```

## Conclusão: Lições Aprendidas e Próximos Passos

Construir um blog portfolio multilíngue com Next.js 15 foi uma jornada repleta de aprendizados valiosos. A combinação de Server Components, Server Actions e Static Site Generation oferece uma base sólida para aplicações modernas e performáticas.

**Principais lições aprendidas:**

1. **App Router é o futuro**: A migração para o App Router, embora inicialmente desafiadora, resulta em melhor organização do código e performance superior.

2. **Server Actions simplificam o desenvolvimento**: A capacidade de executar código servidor diretamente de componentes elimina muito boilerplate e melhora a experiência de desenvolvimento.

3. **TypeScript é essencial para projetos complexos**: O sistema de tipos robusto preveniu inúmeros bugs e melhorou significativamente a manutenibilidade.

4. **Internacionalização requer planejamento**: Implementar suporte multilíngue desde o início é muito mais eficiente do que adicionar depois.

5. **CI/CD automatizado é investimento que vale a pena**: O tempo gasto configurando pipelines é rapidamente recuperado pela confiabilidade dos deployments.

Os próximos passos incluem a implementação de um CMS headless para facilitar a criação de conteúdo, otimizações avançadas de SEO e a adição de funcionalidades como comentários e busca em tempo real.

O código completo do projeto está disponível no GitHub, e encorajo outros desenvolvedores a experimentarem essas tecnologias em seus próprios projetos.

## Fontes e Referências

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MDN Web Docs - Internationalization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Web.dev - Core Web Vitals](https://web.dev/vitals/)
