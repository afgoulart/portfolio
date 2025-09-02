import type { Metadata } from "next";
import { I18nProvider } from '@/lib/i18n-context';

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Full Stack Developer Portfolio",
  alternates: {
    types: {
      'application/rss+xml': [
        { url: '/rss.xml', title: 'RSS Feed (PT)' },
        { url: '/rss-pt.xml', title: 'RSS Feed (Português)' },
        { url: '/rss-en.xml', title: 'RSS Feed (English)' }
      ]
    }
  }
};

async function getMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch {
    return (await import(`../../messages/pt.json`)).default;
  }
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return (
    <I18nProvider locale={locale} messages={messages}>
      {children}
    </I18nProvider>
  );
}
