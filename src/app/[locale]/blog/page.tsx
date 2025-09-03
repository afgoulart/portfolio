import { getAllTagsAction, getArchiveAction, getContentIndexAction } from '@/lib/content-actions';
import BlogListClient from '@/components/organisms/BlogListClient';
import { Navbar, AnalyticsProvider } from "@/components";
import type { Metadata } from 'next';

interface BlogPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const title = locale === 'pt' ? 'Blog | Meu Portfólio' : 'Blog | My Portfolio';
  const description = locale === 'pt' 
    ? 'Artigos sobre tecnologia, desenvolvimento e inovação.'
    : 'Articles about technology, development and innovation.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  
  // Get all content data at build time for static generation
  const contentIndex = await getContentIndexAction();
  const tags = await getAllTagsAction(locale);
  const archive = await getArchiveAction(locale);

  const title = locale === 'pt' ? 'Blog' : 'Blog';
  const subtitle = locale === 'pt' 
    ? 'Explorando o mundo da tecnologia e desenvolvimento' 
    : 'Exploring the world of technology and development';
  const noPosts = locale === 'pt' 
    ? 'Nenhum post encontrado para este idioma.' 
    : 'No posts found for this language.';

  return (
    <AnalyticsProvider>
      <Navbar />
      <main className="overflow-x-hidden">
        <BlogListClient 
          contentIndex={contentIndex}
          title={title}
          subtitle={subtitle}
          noPosts={noPosts}
          locale={locale}
          tags={tags}
          archive={archive}
        />
      </main>
    </AnalyticsProvider>
  );
}