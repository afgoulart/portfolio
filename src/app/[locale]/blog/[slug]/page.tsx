import { notFound } from 'next/navigation';
import { getPostBySlug, getPostSlugs } from '@/lib/blog';
import BlogPost from '@/components/organisms/BlogPost';
import { Navbar, AnalyticsProvider } from "@/components";
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const slugs = getPostSlugs(locale);
  
  return slugs.map((slug) => ({
    slug,
  }));
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

  return (
    <AnalyticsProvider>
      <Navbar />
      <main className="overflow-x-hidden">
        <BlogPost post={post} />
      </main>
    </AnalyticsProvider>
  );
}