#!/usr/bin/env node
// Scans content/*.md, reads each post's frontmatter, and writes:
//   - content/index.json  (post metadata used by the home + blog pages)
//   - sitemap.xml          (one <url> per post, plus the static pages)
//
// This is the only place that needs to know a post exists. It runs
// automatically on every Vercel deploy (see the "build" script in
// package.json), so publishing a post never means touching HTML/JS by hand.

const fs = require('fs');
const path = require('path');
const { parseFrontmatter } = require('../js/frontmatter.js');

const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const SITE_URL = 'https://mrrootsec.vercel.app';

function readPosts() {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));
  const posts = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
    const { data } = parseFrontmatter(raw);

    if (!data.title || !data.date) {
      console.warn(`Skipping ${file}: frontmatter is missing "title" or "date".`);
      continue;
    }

    if (Number.isNaN(new Date(data.date).getTime())) {
      console.warn(`Skipping ${file}: "date" ("${data.date}") is not a valid date.`);
      continue;
    }

    posts.push({
      slug,
      title: data.title,
      date: data.date,
      description: data.description || '',
      tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
    });
  }

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

function writeIndex(posts) {
  fs.writeFileSync(path.join(CONTENT_DIR, 'index.json'), JSON.stringify(posts, null, 2) + '\n');
  console.log(`content/index.json written with ${posts.length} post(s).`);
}

function writeSitemap(posts) {
  const staticPages = ['', 'blog.html', 'tools.html', 'about.html'];
  const urls = staticPages.map((page) => `  <url><loc>${SITE_URL}/${page}</loc></url>`);

  for (const post of posts) {
    urls.push(
      `  <url><loc>${SITE_URL}/post.html?slug=${encodeURIComponent(post.slug)}</loc><lastmod>${post.date}</lastmod></url>`
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
  console.log('sitemap.xml written.');
}

const posts = readPosts();
writeIndex(posts);
writeSitemap(posts);
