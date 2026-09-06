// Shared YAML-ish frontmatter parser.
//
// Loaded two ways by design: as a plain <script> in the browser (post.js
// parses the raw .md file the visitor requested) and via require() in
// scripts/build.js (which generates content/index.json at build time).
// Keeping one implementation means the manifest and the live post page can
// never disagree about what a post's frontmatter means.
function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) {
    return { data: {}, content: raw };
  }

  const [, block, content] = match;
  const data = {};
  let listKey = null;

  for (const line of block.split(/\r?\n/)) {
    if (!line.trim()) continue;

    const listItem = /^\s*-\s+(.*)$/.exec(line);
    if (listItem && listKey) {
      data[listKey].push(stripQuotes(listItem[1].trim()));
      continue;
    }

    const pair = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (!pair) continue;

    const [, key, rawValue] = pair;
    const value = rawValue.trim();

    if (value === '') {
      listKey = key;
      data[key] = [];
      continue;
    }

    listKey = null;
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map((item) => stripQuotes(item.trim()))
        .filter(Boolean);
    } else {
      data[key] = stripQuotes(value);
    }
  }

  return { data, content: content.replace(/^\r?\n/, '') };
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { parseFrontmatter };
}
