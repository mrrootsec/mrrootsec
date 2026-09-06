// Individual post page. Reads ?slug=..., fetches /content/<slug>.md, parses
// its frontmatter, converts the body with marked, and renders it — plus
// prev/next links computed from the shared post manifest.
(async function () {
  const root = document.getElementById('post-root');
  if (!root) return;

  const slug = new URLSearchParams(location.search).get('slug');

  if (!slug) {
    renderNotFound(root, 'No post was specified.');
    return;
  }

  let posts = [];
  try {
    posts = await fetchPostsIndex();
  } catch (err) {
    console.error(err);
  }

  let parsed;
  try {
    parsed = await fetchPost(slug);
  } catch (err) {
    console.error(err);
    renderNotFound(root, "That post doesn't exist, or couldn't be loaded.");
    return;
  }

  const { data, content } = parsed;
  if (!data.title || !data.date) {
    renderNotFound(root, 'That post is missing required frontmatter.');
    return;
  }

  const articleHtml = window.marked ? window.marked.parse(content) : `<pre>${escapeHtml(content)}</pre>`;
  const index = posts.findIndex((p) => p.slug === slug);

  root.innerHTML = `
    <header class="post-header">
      <h1 class="post-title">${escapeHtml(data.title)}</h1>
      <div class="post-meta">
        <span>${formatDate(data.date)}</span>
        ${renderTags(data.tags)}
      </div>
    </header>
    <article class="post-content">${articleHtml}</article>
    ${renderPostNav(posts, index)}
    <a class="back-link" href="/blog.html">&larr; Back to Blog</a>
  `;

  updateMeta(data, slug);

  if (window.Prism) {
    window.Prism.highlightAllUnder(root);
  }
})();

function renderNotFound(root, message) {
  root.innerHTML = `
    <div class="post-header">
      <p class="state-message is-error">${escapeHtml(message)}</p>
      <p><a href="/blog.html">&larr; Back to Blog</a></p>
    </div>
  `;
}

function renderPostNav(posts, index) {
  if (index === -1 || posts.length < 2) return '';

  const newer = posts[index - 1];
  const older = posts[index + 1];
  if (!newer && !older) return '';

  const newerLink = newer
    ? `<a href="${postUrl(newer.slug)}"><span class="direction">&larr; Newer</span>${escapeHtml(newer.title)}</a>`
    : '<span></span>';
  const olderLink = older
    ? `<a class="next" href="${postUrl(older.slug)}"><span class="direction">Older &rarr;</span>${escapeHtml(older.title)}</a>`
    : '<span></span>';

  return `<nav class="post-nav" aria-label="Post navigation">${newerLink}${olderLink}</nav>`;
}

function updateMeta(data, slug) {
  document.title = `${data.title} — mrroot`;

  const description = data.description || '';
  setMetaContent('description', description);
  setMetaContent('og:title', `${data.title} — mrroot`, 'property');
  setMetaContent('og:description', description, 'property');

  const canonical = document.getElementById('canonical-link');
  if (canonical) {
    canonical.href = `https://mrrootsec.vercel.app/post.html?slug=${encodeURIComponent(slug)}`;
  }
}

function setMetaContent(name, content, attr) {
  const el = document.querySelector(`meta[${attr || 'name'}="${name}"]`);
  if (el) el.setAttribute('content', content);
}
