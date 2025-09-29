---
title: >-
  Next.js 15: How to Build a Multilingual Blog Portfolio with Modern
  Architecture and Automated Deployment
date: '2025-09-27'
author: Tech Blog Bot
tags:
  - nextjs
  - typescript
  - portfolio
  - multilingual
  - cicd
excerpt: >-
  Discover how to create a modern multilingual blog portfolio using Next.js 15,
  with optimized static architecture, Server Actions, TypeScript and complete
  CI/CD pipeline.
slug: >-
  construindo-um-blog-portfolio-multilingue-com-nextjs-15-licoes-aprendidas-sobre-arquitetura-estatica-server-actions-typescript-e-cicd
---

# Next.js 15: How to Build a Multilingual Blog Portfolio with Modern Architecture and Automated Deployment

Creating a blog portfolio that serves global audiences has become essential for developers and content creators. With the release of Next.js 15, new possibilities have opened up for building more efficient and scalable web applications. This article shares practical experiences in building a multilingual blog portfolio, exploring the framework's latest features and modern development best practices.

Next.js 15 brought significant performance improvements, primarily through the new experimental React Compiler and App Router optimizations. For a blog portfolio project, these innovations translate into faster loading, better SEO and improved user experience.

## Static Architecture and App Router: The Solid Foundation

### Project Structure and Static Generation

Static architecture remains an exceptional choice for blogs, offering superior performance and reduced hosting costs. In Next.js 15, the combination of App Router with Static Site Generation (SSG) allows creating a robust structure:

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

### Optimization with Metadata API

Next.js 15 improved the Metadata API, facilitating multilingual SEO implementation:

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

## Multilingual Implementation with Server Actions

### Modern Internationalization System

Multilingual implementation requires a structured approach that combines locale-based routing with efficient content management. Next.js 15 facilitates this implementation through middleware improvements:

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

### Server Actions for Dynamic Features

Next.js 15 Server Actions offer an elegant way to implement features like contact forms and search systems:

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
    return { error: 'Invalid data' };
  }

  // Send email using service of your choice
  await sendEmail(validatedFields.data);
  
  redirect(`/${validatedFields.data.locale}/contact/success`);
}
```

## Advanced TypeScript and Robust Typing

### Type System for Multilingual Content

A well-structured type system is fundamental for maintaining code quality in multilingual projects:

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

// Utility for localized content
export function getLocalizedContent<T>(
  content: LocalizedContent<T>,
  locale: Locale
): T {
  return content[locale] || content['pt'];
}
```

### Data Validation with Zod

Zod integration with TypeScript provides robust runtime validation:

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

## CI/CD Pipeline and Automated Deployment

### GitHub Actions for Deployment

A well-configured CI/CD pipeline ensures safe and automated deployments:

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

### Build Optimization and Performance

Proper Next.js configuration ensures optimized builds:

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

## Conclusion

Building a multilingual blog portfolio with Next.js 15 represents an excellent use case for exploring the framework's latest features. The combination of static architecture, Server Actions, robust TypeScript and automated CI/CD results in a performant, scalable and maintainable application.

Key lessons learned include: the importance of a well-defined type structure for multilingual content, the value of Server Actions for dynamic features without additional complexity, and the need for a robust CI/CD pipeline to ensure reliable deployments.

Next.js 15 consolidates its position as the framework of choice for modern web applications, offering powerful tools that simplify development while maintaining high performance and excellent developer experience.

---

## References and Useful Links

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [Zod Schema Validation](https://zod.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
