import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDirectory = path.join(process.cwd(), 'src/contents');

async function generatePostsJSON() {
  const locales = ['pt', 'en'];
  
  for (const locale of locales) {
    const localeDirectory = path.join(postsDirectory, locale);
    
    if (!await fs.pathExists(localeDirectory)) {
      console.log(`Directory ${localeDirectory} does not exist`);
      continue;
    }

    const files = await fs.readdir(localeDirectory);
    const postsData = [];

    for (const fileName of files) {
      if (fileName.endsWith('.md')) {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(localeDirectory, fileName);
        const fileContents = await fs.readFile(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        postsData.push({
          slug: matterResult.data.slug || slug, // Usar slug do front matter se existir
          title: matterResult.data.title,
          date: matterResult.data.date,
          author: matterResult.data.author,
          tags: matterResult.data.tags || [],
          excerpt: matterResult.data.excerpt,
          filename: fileName,
        });
      }
    }

    // Ordenar por data (mais recente primeiro)
    postsData.sort((a, b) => {
      if (a.date < b.date) return 1;
      else return -1;
    });

    const jsonPath = path.join(localeDirectory, 'posts.json');
    await fs.writeFile(jsonPath, JSON.stringify(postsData, null, 2));
    console.log(`✅ Generated ${jsonPath} with ${postsData.length} posts`);
  }
}

generatePostsJSON().catch(console.error);