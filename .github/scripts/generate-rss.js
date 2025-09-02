const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { Feed } = require('feed');

function getAllPosts(locale = 'pt') {
  const postsDirectory = path.join(process.cwd(), 'src/contents');
  const localeDirectory = path.join(postsDirectory, locale);
  
  if (!fs.existsSync(localeDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(localeDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(localeDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        locale,
        title: matterResult.data.title,
        date: matterResult.data.date,
        author: matterResult.data.author,
        tags: matterResult.data.tags || [],
        excerpt: matterResult.data.excerpt,
      };
    });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

async function generateRssFeed() {
  const siteURL_pt = 'https://afgoulart.github.io/portfolio/pt';
  const siteURL_en = 'https://afgoulart.github.io/portfolio/en';

  const author = {
    name: "André Goulart",
    email: "afgoulart.rj@gmail.com",
    link: "https://www.linkedin.com/in/afgoulart"
  };

  // Buscar posts em português
  const posts_pt = getAllPosts('pt');
  const feed_pt = new Feed({
    title: "André Goulart - Tech Blog",
    description: "Um blog de tecnologia com conteúdo mais atual que está sendo discutido no meio tech.",
    id: siteURL_pt,
    link: siteURL_pt,
    language: "pt-BR",
    copyright: `Todos os direitos reservados ${new Date().getFullYear()}, André Filipe Goulart`,
    author,
    updated: posts_pt.length > 0 ? new Date(posts_pt[0].date) : new Date(),
  });

  posts_pt.forEach(post => {
    feed_pt.addItem({
      title: post.title,
      id: `${siteURL_pt}/blog/${post.slug}`,
      link: `${siteURL_pt}/blog/${post.slug}`,
      description: post.excerpt,
      content: post.excerpt,
      author: [author],
      date: new Date(post.date),
      category: post.tags.map(tag => ({ name: tag })),
    });
  });

  // Buscar posts em inglês
  const posts_en = getAllPosts('en');
  const feed_en = new Feed({
    title: "André Goulart - Tech Blog",
    description: "A tech blog with the most current content being discussed in the tech world.",
    id: siteURL_en,
    link: siteURL_en,
    language: "en-US",
    copyright: `All rights reserved ${new Date().getFullYear()}, André Filipe Goulart`,
    author,
    updated: posts_en.length > 0 ? new Date(posts_en[0].date) : new Date(),
  });

  posts_en.forEach(post => {
    feed_en.addItem({
      title: post.title,
      id: `${siteURL_en}/blog/${post.slug}`,
      link: `${siteURL_en}/blog/${post.slug}`,
      description: post.excerpt,
      content: post.excerpt,
      author: [author],
      date: new Date(post.date),
      category: post.tags.map(tag => ({ name: tag })),
    });
  });

  // Criar diretório public se não existir
  if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public', { recursive: true });
  }

  // Gerar feeds RSS
  fs.writeFileSync('./public/rss.xml', feed_pt.rss2());
  fs.writeFileSync('./public/rss-pt.xml', feed_pt.rss2());
  fs.writeFileSync('./public/rss-en.xml', feed_en.rss2());
  
  console.log('✅ RSS feeds gerados com sucesso!');
  console.log(`📄 Posts em português: ${posts_pt.length}`);
  console.log(`📄 Posts em inglês: ${posts_en.length}`);
  console.log('📍 Arquivos gerados:');
  console.log('  - public/rss.xml (português)');
  console.log('  - public/rss-pt.xml (português)');
  console.log('  - public/rss-en.xml (inglês)');
}

generateRssFeed();