---
title: >-
  Next.js 15 in Practice: Building a Multilingual Blog Portfolio with Modern
  Architecture and CI/CD
date: '2025-09-03'
author: Tech Blog Bot
tags:
  - nextjs
  - typescript
  - portfolio
  - multilingual
  - cicd
excerpt: >-
  Discover how to build a professional multilingual blog portfolio with Next.js
  15, exploring Server Actions, static generation, TypeScript and CI/CD
  automation in a real project.
slug: >-
  construindo-um-blog-portfolio-multilingue-com-nextjs-15-licoes-aprendidas-sobre-arquitetura-estatica-server-actions-typescript-e-cicd
---

# Next.js 15 in Practice: Building a Multilingual Blog Portfolio with Modern Architecture and CI/CD

Personal portfolio and technical blog development has evolved significantly in recent years. With the release of Next.js 15, developers now have access to even more powerful tools to create modern and performant web experiences. In this article, I share the lessons learned while building a multilingual blog portfolio using the latest Next.js features, exploring everything from static architecture to implementing robust CI/CD pipelines.

The journey of creating a portfolio that not only showcases projects but also serves as a technical content platform presents unique challenges. How do we balance performance, SEO, user experience, and maintainability? How do we implement multilingual support without compromising speed? These questions guided the entire development process.

## Static Architecture with Next.js 15: App Router and Server Components

### Migration to App Router: A New Philosophy

Next.js 15's App Router represents a fundamental change in how we structure React applications. Unlike the traditional Pages Router, the App Router fully embraces Server Components, offering better performance and developer experience.

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

### Performance Optimization with Static Generation

One of the most impactful decisions was opting for Static Site Generation (SSG) for the blog. This means all pages are pre-rendered during build time, resulting in extremely fast loading times.

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

## Server Actions and TypeScript: Modern Interactivity

### Implementing Forms with Server Actions

One of the most exciting features of Next.js 15 is Server Actions, which allow executing server code directly from client components, dramatically simplifying form development and interactions.

```typescript
// app/actions/contact.ts
'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message must have at least 10 characters'),
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
    // Send email using service like SendGrid or Resend
    await sendEmail({
      to: 'contact@example.com',
      subject: `New message from ${validatedData.name}`,
      html: `
        <h2>New message from portfolio</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message}</p>
      `
    })
    
  } catch (error) {
    throw new Error('Error sending message')
  }

  redirect(`/${validatedData.locale}/contact/success`)
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

### Advanced TypeScript for Type Safety

Extensive use of TypeScript was fundamental to maintaining code quality. We implemented custom types and utility types to ensure consistency throughout the project:

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

// Utility types for internationalization
export interface LocalizedContent {
  [key: string]: {
    'pt-BR': string
    'en-US': string
  }
}

export type TranslationKey = keyof typeof import('../locales/pt-BR.json')
```

## Internationalization and CI/CD Pipelines

### Robust Multilingual Implementation

Implementing multilingual support was one of the most complex aspects of the project. We used Next.js 15's routing system combined with an organized content strategy:

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const locales = ['pt-BR', 'en-US']
const defaultLocale = 'pt-BR'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if locale already exists in URL
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Detect user's preferred locale
  const locale = getLocale(request) || defaultLocale
  
  // Redirect with locale
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

function getLocale(request: NextRequest): string | undefined {
  // Check preference cookie
  const cookieLocale = request.cookies.get('preferred-locale')?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  // Check Accept-Language header
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

### CI/CD Pipeline with GitHub Actions

Deployment automation was implemented using GitHub Actions, ensuring every push to the main branch results in automatic deployment:

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

### Monitoring and Analytics

We also implemented a basic analytics and performance monitoring system:

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
    
    // Custom analytics
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
  
  // Send to analytics service
  if (typeof window !== 'undefined') {
    window.gtag?.('event', name, properties)
  }
}
```

## Conclusion: Lessons Learned and Next Steps

Building a multilingual blog portfolio with Next.js 15 was a journey full of valuable learnings. The combination of Server Components, Server Actions, and Static Site Generation provides a solid foundation for modern and performant applications.

**Key lessons learned:**

1. **App Router is the future**: Migrating to App Router, while initially challenging, results in better code organization and superior performance.

2. **Server Actions simplify development**: The ability to execute server code directly from components eliminates much boilerplate and improves developer experience.

3. **TypeScript is essential for complex projects**: The robust type system prevented numerous bugs and significantly improved maintainability.

4. **Internationalization requires planning**: Implementing multilingual support from the start is much more efficient than adding it later.

5. **Automated CI/CD is a worthwhile investment**: Time spent configuring pipelines is quickly recovered through deployment reliability.

Next steps include implementing a headless CMS to facilitate content creation, advanced SEO optimizations, and adding features like comments and real-time search.

The complete project code is available on GitHub, and I encourage other developers to experiment with these technologies in their own projects.

## Sources and References

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MDN Web Docs - Internationalization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Web.dev - Core Web Vitals](https://web.dev/vitals/)
