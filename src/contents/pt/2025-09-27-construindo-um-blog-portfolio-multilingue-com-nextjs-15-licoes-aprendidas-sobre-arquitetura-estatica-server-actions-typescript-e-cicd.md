---
title: >-
  Next.js 15: Como Construir um Blog Portfolio Multilíngue com Arquitetura
  Moderna e Deploy Automatizado
date: '2025-09-27'
author: Tech Blog Bot
tags:
  - nextjs
  - typescript
  - portfolio
  - multilingual
  - cicd
excerpt: >-
  Descubra como criar um blog portfolio multilíngue moderno usando Next.js 15,
  com arquitetura estática otimizada, Server Actions, TypeScript e pipeline
  CI/CD completo.
slug: >-
  construindo-um-blog-portfolio-multilingue-com-nextjs-15-licoes-aprendidas-sobre-arquitetura-estatica-server-actions-typescript-e-cicd
---

# Next.js 15: Como Construir um Blog Portfolio Multilíngue com Arquitetura Moderna e Deploy Automatizado

A criação de um blog portfolio que atenda audiências globais tornou-se essencial para desenvolvedores e criadores de conteúdo. Com o lançamento do Next.js 15, novas possibilidades se abriram para construir aplicações web mais eficientes e escaláveis. Este artigo compartilha experiências práticas na construção de um blog portfolio multilíngue, explorando as funcionalidades mais recentes do framework e as melhores práticas de desenvolvimento moderno.

O Next.js 15 trouxe melhorias significativas em performance, principalmente através do novo React Compiler experimental e otimizações no App Router. Para um projeto de blog portfolio, essas inovações se traduzem em carregamento mais rápido, melhor SEO e experiência do usuário aprimorada.

## Arquitetura Estática e App Router: A Base Sólida

### Estrutura do Projeto e Geração Estática

A arquitetura estática continua sendo uma escolha excepcional para blogs, oferecendo performance superior e custos reduzidos de hospedagem. No Next.js 15, a combinação do App Router com Static Site Generation (SSG) permite criar uma estrutura robusta:

```typescript
// app/[locale]/blog/[slug]/page.tsx
import { generateStaticParams } from 'next';
import { getPostBySlug, getAllPosts } from '@/lib/posts';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const locales = ['pt', 'en', 'es'];
  
  return locales.flatMap(locale => 
    posts.map(post => ({
      locale,
      slug: post.slug
    }))
  );
}

export default async function BlogPost({ 
  params 
}: { 
  params: { locale: string; slug: string } 
}) {
  const post = await getPostBySlug(params.slug, params.locale);
  
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### Otimização com Metadata API

O Next.js 15 aprimorou a Metadata API, facilitando a implementação de SEO multilíngue:

```typescript
// app/[locale]/blog/[slug]/page.tsx
export async function generateMetadata({ params }: Props) {
  const post = await getPostBySlug(params.slug, params.locale);
  
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      languages: {
        'pt': `/pt/blog/${params.slug}`,
        'en': `/en/blog/${params.slug}`,
        'es': `/es/blog/${params.slug}`
      }
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage]
    }
  };
}
```

## Implementação Multilíngue com Server Actions

### Sistema de Internacionalização Moderno

A implementação multilíngue requer uma abordagem estruturada que combine roteamento por locale com gerenciamento eficiente de conteúdo. O Next.js 15 facilita essa implementação através de melhorias no middleware:

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['pt', 'en', 'es'];
const defaultLocale = 'pt';

function getLocale(request: NextRequest): string {
  const acceptedLanguage = request.headers.get('accept-language') ?? undefined;
  const headers = { 'accept-language': acceptedLanguage };
  const languages = new Negotiator({ headers }).languages();
  
  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }
}
```

### Server Actions para Funcionalidades Dinâmicas

As Server Actions do Next.js 15 oferecem uma maneira elegante de implementar funcionalidades como formulários de contato e sistemas de busca:

```typescript
// app/actions/contact.ts
'use server'

import { z } from 'zod';
import { redirect } from 'next/navigation';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
  locale: z.string()
});

export async function submitContact(formData: FormData) {
  const validatedFields = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    locale: formData.get('locale')
  });

  if (!validatedFields.success) {
    return { error: 'Dados inválidos' };
  }

  // Enviar email usando serviço de sua escolha
  await sendEmail(validatedFields.data);
  
  redirect(`/${validatedFields.data.locale}/contato/sucesso`);
}
```

## TypeScript Avançado e Tipagem Robusta

### Sistema de Tipos para Conteúdo Multilíngue

Um sistema de tipos bem estruturado é fundamental para manter a qualidade do código em projetos multilíngues:

```typescript
// types/blog.ts
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: Author;
  tags: string[];
  locale: Locale;
  coverImage?: string;
  readingTime: number;
}

export interface Author {
  name: string;
  bio: string;
  avatar: string;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export type Locale = 'pt' | 'en' | 'es';

export interface LocalizedContent<T> {
  [K in Locale]: T;
}

// Utilitário para conteúdo localizado
export function getLocalizedContent<T>(
  content: LocalizedContent<T>,
  locale: Locale
): T {
  return content[locale] || content['pt'];
}
```

### Validação de Dados com Zod

A integração do Zod com TypeScript proporciona validação robusta em tempo de execução:

```typescript
// lib/schemas.ts
import { z } from 'zod';

export const blogPostSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(100),
  excerpt: z.string().min(50).max(300),
  content: z.string().min(100),
  date: z.string().datetime(),
  locale: z.enum(['pt', 'en', 'es']),
  tags: z.array(z.string()).min(1).max(10),
  published: z.boolean().default(false)
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
```

## Pipeline CI/CD e Deploy Automatizado

### GitHub Actions para Deployment

Um pipeline CI/CD bem configurado garante deployments seguros e automáticos:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Otimização de Build e Performance

A configuração adequada do Next.js garante builds otimizados:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    reactCompiler: true
  },
  i18n: {
    locales: ['pt', 'en', 'es'],
    defaultLocale: 'pt'
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
```

## Conclusão

A construção de um blog portfolio multilíngue com Next.js 15 representa um excelente caso de uso para explorar as funcionalidades mais recentes do framework. A combinação de arquitetura estática, Server Actions, TypeScript robusto e CI/CD automatizado resulta em uma aplicação performática, escalável e fácil de manter.

As principais lições aprendidas incluem: a importância de uma estrutura de tipos bem definida para conteúdo multilíngue, o valor das Server Actions para funcionalidades dinâmicas sem complexidade adicional, e a necessidade de um pipeline CI/CD robusto para garantir deployments confiáveis.

O Next.js 15 consolida sua posição como framework de escolha para aplicações web modernas, oferecendo ferramentas poderosas que simplificam o desenvolvimento enquanto mantêm alta performance e excelente experiência do desenvolvedor.

---

## Referências e Links Úteis

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [Zod Schema Validation](https://zod.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
