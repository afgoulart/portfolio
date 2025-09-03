import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDirectory = path.join(process.cwd(), 'src/contents');

// Type definitions (for documentation purposes)
// PostIndex: { slug, title, date, author, tags[], excerpt, filename, locale, year, month, day }
// ContentIndex: { totalPosts, locales[], years{}, posts[], tags{} }

async function generateContentIndex() {
  const locales = ['pt', 'en'];
  const allPosts = [];
  const tagsMap = new Map();
  const yearsMap = new Map();

  for (const locale of locales) {
    const localeDirectory = path.join(postsDirectory, locale);
    
    if (!await fs.pathExists(localeDirectory)) {
      console.log(`Directory ${localeDirectory} does not exist`);
      continue;
    }

    const files = await fs.readdir(localeDirectory);

    for (const fileName of files) {
      if (fileName.endsWith('.md')) {
        const fullPath = path.join(localeDirectory, fileName);
        const fileContents = await fs.readFile(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        
        const date = new Date(matterResult.data.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        const fileSlug = fileName.replace(/\.md$/, '');
        const slug = matterResult.data.slug || fileSlug;

        const postIndex = {
          slug,
          title: matterResult.data.title,
          date: matterResult.data.date,
          author: matterResult.data.author,
          tags: matterResult.data.tags || [],
          excerpt: matterResult.data.excerpt,
          filename: fileName,
          locale,
          year,
          month,
          day,
        };

        allPosts.push(postIndex);

        // Build tags index
        postIndex.tags.forEach(tag => {
          if (!tagsMap.has(tag)) {
            tagsMap.set(tag, new Set());
          }
          tagsMap.get(tag).add(slug);
        });

        // Build date hierarchy
        const yearStr = year.toString();
        const monthStr = month.toString().padStart(2, '0');
        const dayStr = day.toString().padStart(2, '0');

        if (!yearsMap.has(yearStr)) {
          yearsMap.set(yearStr, new Map());
        }
        const yearMap = yearsMap.get(yearStr);

        if (!yearMap.has(monthStr)) {
          yearMap.set(monthStr, new Map());
        }
        const monthMap = yearMap.get(monthStr);

        if (!monthMap.has(dayStr)) {
          monthMap.set(dayStr, []);
        }
        monthMap.get(dayStr).push(postIndex);
      }
    }
  }

  // Sort posts by date (newest first)
  allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Build final structure
  const years = {};
  
  for (const [yearStr, yearMap] of yearsMap) {
    const months = {};
    let yearCount = 0;

    for (const [monthStr, monthMap] of yearMap) {
      const days = {};
      let monthCount = 0;

      for (const [dayStr, dayPosts] of monthMap) {
        days[dayStr] = {
          count: dayPosts.length,
          posts: dayPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        };
        monthCount += dayPosts.length;
      }

      months[monthStr] = { days, count: monthCount };
      yearCount += monthCount;
    }

    years[yearStr] = { months, count: yearCount };
  }

  // Build tags structure
  const tags = {};
  for (const [tag, slugSet] of tagsMap) {
    tags[tag] = {
      count: slugSet.size,
      posts: Array.from(slugSet),
    };
  }

  return {
    totalPosts: allPosts.length,
    locales,
    years,
    posts: allPosts,
    tags,
  };
}

async function saveContentIndex() {
  try {
    console.log('🚀 Generating content index...');
    
    const contentIndex = await generateContentIndex();
    
    // Save main index
    const indexPath = path.join(postsDirectory, 'content-index.json');
    await fs.writeFile(indexPath, JSON.stringify(contentIndex, null, 2));
    
    console.log(`✅ Content index generated: ${indexPath}`);
    console.log(`📊 Statistics:`);
    console.log(`   - Total posts: ${contentIndex.totalPosts}`);
    console.log(`   - Languages: ${contentIndex.locales.join(', ')}`);
    console.log(`   - Years: ${Object.keys(contentIndex.years).join(', ')}`);
    console.log(`   - Tags: ${Object.keys(contentIndex.tags).length}`);

    // Generate individual language posts.json files for backward compatibility
    for (const locale of contentIndex.locales) {
      const localePosts = contentIndex.posts.filter(post => post.locale === locale);
      const localeData = localePosts.map(({ locale, year, month, day, ...post }) => post);
      
      const localeJsonPath = path.join(postsDirectory, locale, 'posts.json');
      await fs.writeFile(localeJsonPath, JSON.stringify(localeData, null, 2));
      
      console.log(`✅ Generated ${localeJsonPath} with ${localeData.length} posts`);
    }

  } catch (error) {
    console.error('❌ Error generating content index:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  saveContentIndex();
}

export { generateContentIndex, saveContentIndex };