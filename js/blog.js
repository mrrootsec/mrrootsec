// Blog listing page: renders every post, newest first. Add a new post by
// dropping a .md file in /content — nothing here needs to change.
(async function () {
  const container = document.getElementById('post-list');
  if (!container) return;

  try {
    const posts = await fetchPostsIndex();
    if (!posts.length) {
      container.innerHTML = '<p class="state-message">No posts yet. Check back soon.</p>';
      return;
    }
    container.innerHTML = `<ul class="post-list">${posts.map(postListItemHTML).join('')}</ul>`;
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p class="state-message is-error">Unable to load posts right now.</p>';
  }
})();
