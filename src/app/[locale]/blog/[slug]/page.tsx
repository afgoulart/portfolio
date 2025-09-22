import { notFound } from 'next/navigation';
import { getPostBySlug, getPostSlugs, getAdjacentPosts } from '@/lib/blog';
import BlogPost from '@/components/organisms/BlogPost';
import BlogPostFloatingNavigation from '@/components/molecules/BlogPostFloatingNavigation';
import { Navbar, AnalyticsProvider } from "@/components";
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const locales = ['en', 'pt'];
  const allParams: { locale: string; slug: string }[] = [];
  
  for (const locale of locales) {
    const slugs = getPostSlugs(locale);
    for (const slug of slugs) {
      allParams.push({ locale, slug });
    }
  }
  
  return allParams;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    return {
      title: 'Post não encontrado',
      description: 'O post solicitado não foi encontrado.',
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  // Get adjacent posts for navigation
  const { prev, next } = getAdjacentPosts(slug, locale);

  return (
    <AnalyticsProvider>
      <Navbar />
      <main className="overflow-x-hidden">
        <BlogPost post={post} />
        <BlogPostFloatingNavigation
          locale={locale}
          prevPost={prev}
          nextPost={next}
        />
      </main>
    </AnalyticsProvider>
  );
}