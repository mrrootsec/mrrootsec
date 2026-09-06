// Shared helpers for rendering post data on the home, blog, and post pages.
// Depends on parseFrontmatter() from frontmatter.js being loaded first.

function escapeHtml(str) {
  return String(str).replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]
  );
}

function formatDate(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function postUrl(slug) {
  return `/post.html?slug=${encodeURIComponent(slug)}`;
}

function renderTags(tags) {
  if (!tags || !tags.length) return '';
  return `<ul class="tags">${tags.map((tag) => `<li class="tag">${escapeHtml(tag)}</li>`).join('')}</ul>`;
}

function postListItemHTML(post) {
  return `
    <li class="post-item">
      <h3 class="post-item__title"><a href="${postUrl(post.slug)}">${escapeHtml(post.title)}</a></h3>
      <div class="post-item__date">${formatDate(post.date)}</div>
      <p class="post-item__desc">${escapeHtml(post.description)}</p>
      <div class="post-item__footer">
        ${renderTags(post.tags)}
        <a class="read-more" href="${postUrl(post.slug)}">Read more &rarr;</a>
      </div>
    </li>
  `;
}

// Always re-sorts client-side (newest first), even though the build script
// already sorts content/index.json — cheap insurance against a stale or
// hand-edited manifest.
async function fetchPostsIndex() {
  const res = await fetch('/content/index.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load content/index.json (${res.status})`);
  const posts = await res.json();
  return posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function fetchPost(slug) {
  const res = await fetch(`/content/${encodeURIComponent(slug)}.md`, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Post not found: ${slug}`);
  const raw = await res.text();
  return parseFrontmatter(raw);
}
