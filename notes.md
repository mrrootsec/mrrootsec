# mrroot

Personal AppSec blog. Plain HTML, CSS, and vanilla JavaScript — no framework, no build tool beyond one small Node script, no database.

Live at https://mrrootsec.vercel.app/

## Contents

- [Project structure](#project-structure)
- [How publishing works](#how-publishing-works-the-important-part)
- [Adding a new post](#adding-a-new-post)
- [Editing or removing a post](#editing-or-removing-a-post)
- [Editing the Tools page](#editing-the-tools-page)
- [Editing the About page](#editing-the-about-page)
- [Running locally](#running-locally)
- [Deploying to Vercel](#deploying-to-vercel)
- [Troubleshooting](#troubleshooting)
- [Design notes](#design-notes--why-things-are-built-this-way)

## Project structure

```
/
├── index.html          Home page (renders latest 3 posts via JS)
├── blog.html           Full post listing (renders all posts via JS)
├── post.html           Single post shell (renders one post via JS, ?slug=...)
├── tools.html           Static list of tools — edit this file directly
├── about.html           Static about page — edit this file directly
├── 404.html             Static not-found page
│
├── css/
│   └── style.css       The entire site's styling
│
├── js/
│   ├── frontmatter.js  Parses the --- frontmatter --- block in a .md file
│   ├── markdown.js     Shared helpers: fetch posts, format dates, render tags
│   ├── main.js         Home page logic
│   ├── blog.js         Blog listing logic
│   └── post.js         Single post logic (fetch, render, prev/next, SEO tags)
│
├── content/
│   ├── *.md             One file per blog post — this is the only thing
│   │                    you touch to publish
│   └── index.json       Generated. Do not edit by hand (see below).
│
├── assets/
│   ├── images/          Post images and the avatar
│   └── favicons/        Favicon set
│
├── scripts/
│   ├── build.js         Generates content/index.json and sitemap.xml
│   └── serve.js         Zero-dependency local dev server
│
├── package.json          npm scripts only — zero runtime dependencies
├── vercel.json           Build command + security headers for Vercel
├── robots.txt
└── sitemap.xml           Generated. Do not edit by hand.
```

## How publishing works (the important part)

Browsers can't list a folder's contents on static hosting, so the site can't
just "look in `/content`" at runtime to see what posts exist. Instead, a tiny
zero-dependency Node script (`scripts/build.js`) scans `content/*.md`, reads
each file's frontmatter, and writes `content/index.json` — a small manifest
of `{slug, title, date, description, tags}` used by the home and blog pages
to list and sort posts. The same script also regenerates `sitemap.xml`.

That script runs **automatically on every Vercel deploy** (it's the
`buildCommand` in `vercel.json`), so you never run it yourself in normal use.
The actual article body is still fetched and rendered straight from the
`.md` file in the browser when someone opens a post — only the metadata used
for listings is pre-generated. Markdown stays the single source of truth;
the JSON file is a cache, not a second copy of your content.

**Practical result:** to publish a post, you only ever touch one file — a
new `.md` file in `content/`. Nothing else needs editing — not `index.html`,
not `blog.html`, not any JavaScript file.

## Adding a new post

1. Create a new file in `content/`, named after the URL slug you want, e.g.
   `content/my-new-post.md` → reachable at `/post.html?slug=my-new-post`.

2. Add frontmatter at the top, then the article body as normal Markdown:

   ````markdown
   ---
   title: "My New Post"
   date: "2026-09-06"
   description: "One sentence describing the post, shown on cards and as the meta description."
   tags:
     - appsec
     - bug-bounty
   ---

   Write the article here, in normal Markdown.

   ## A heading

   Some text, a [link](https://example.com), and a code block:

   ```http
   GET /api/users/1 HTTP/1.1
   Host: example.com
   ```
   ````

3. Commit and push (or however you deploy — see
   [Deploying to Vercel](#deploying-to-vercel)).

That's it. On the next deploy:

- The home page shows it if it's one of the 3 most recent posts.
- The blog page (`/blog.html`) lists it among all posts.
- It's sorted into place by `date` automatically (newest first, everywhere).
- Its `tags` render automatically as `#tag` labels.
- It's added to `sitemap.xml` automatically.
- Its title becomes the page's `<title>` and meta description once the post
  loads (see [Design notes](#design-notes--why-things-are-built-this-way)
  for the one caveat around this).

### Frontmatter reference

| Field         | Required | Notes                                                          |
| ------------- | -------- | ---------------------------------------------------------------- |
| `title`       | yes      | Plain text. Quote it if it contains a colon (`:`).               |
| `date`        | yes      | `YYYY-MM-DD`. Controls sort order everywhere.                    |
| `description` | no       | Shown on home/blog cards and used as the meta description.       |
| `tags`        | no       | A YAML list (multi-line `- tag`) or an inline list (`['a', 'b']`). |

A post missing `title` or `date`, or with an unparseable `date`, is skipped
by the build script — with a console warning at build time — rather than
shown broken. Check your Vercel build logs if a post doesn't appear.

### Writing tips

- **Code blocks**: fence them with a language name (` ```python `,
  ` ```json `, ` ```bash `, ` ```sql `, ` ```graphql `, ` ```http `,
  ` ```javascript `) for syntax highlighting. Long lines scroll
  horizontally instead of wrapping or breaking layout.
- **Images**: put files under `assets/images/<something>/` and reference
  them with an absolute path, e.g. `![Alt text](/assets/images/my-post/shot.png)`.
  Always write real alt text — it's the only place accessibility can't be
  retrofitted automatically.
- **Links**: normal Markdown `[text](url)` — no special handling needed.

## Editing or removing a post

- **Edit**: open the `.md` file and change it. The title/date/description/
  tags and body all come from that one file.
- **Remove**: delete the `.md` file. It disappears from the home page, the
  blog page, and the sitemap on the next deploy. (If you just want to hide
  it temporarily, move it out of `content/` rather than renaming it inside
  the folder — anything with a `.md` extension in `content/` is picked up.)
- **Change the date** to reorder it, or to bump an updated post back to the
  top of the list.

## Editing the Tools page

`tools.html` is fully static — there's no JSON manifest and no build step
involved. Each tool is one `<li class="tool">` block:

```html
<li class="tool">
  <h3><a href="https://github.com/you/your-tool" target="_blank" rel="noopener noreferrer">Tool Name</a></h3>
  <p>A short description of what it does and who it's for.</p>
  <p class="tool-links"><a href="https://github.com/you/your-tool" target="_blank" rel="noopener noreferrer">github.com/you/your-tool</a></p>
</li>
```

Copy/paste/edit that block inside `<ul class="tool-list">` to add, change,
or remove a tool. They lay out as a responsive card grid automatically —
no CSS changes needed for one more or one fewer card.

## Editing the About page

`about.html` is also fully static plain HTML — edit the bio paragraphs,
the "What I work on" list, or the social links directly in that file.

## Running locally

Requires [Node.js](https://nodejs.org/) 18 or later. No dependencies to
install.

```
npm run dev
```

This runs the build script once (generating `content/index.json` and
`sitemap.xml`) and starts a small local server at http://localhost:3000.
A real server is required — opening `index.html` directly via `file://`
won't work, because `fetch()` of local files is blocked under that
protocol.

If you add/edit a post while the server is running, re-run `npm run build`
(or stop and restart `npm run dev`) to regenerate the manifest — the server
itself doesn't watch for file changes.

Other scripts:

```
npm run build   # regenerate content/index.json and sitemap.xml only
npm run serve   # start the local server without rebuilding
```

To use a different port: `PORT=4000 npm run serve`.

## Deploying to Vercel

### First-time setup

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. In the [Vercel dashboard](https://vercel.com/new), import that
   repository as a new project.
3. Vercel reads `vercel.json` automatically, which sets:
   - **Build Command**: `npm run build`
   - **Output Directory**: `.` (the project root — this is a static site,
     there's no separate build output folder)
   - Security response headers (CSP, HSTS, etc. — see below)
4. Framework Preset can stay on "Other" — there's no framework here, so
   nothing to auto-detect. Leave the Install Command as the default
   (`npm install`); with zero dependencies it's effectively instant.
5. Click Deploy.

### Every deploy after that

Just push to the branch Vercel is watching (typically `main`). Vercel runs
`npm install` → `npm run build` → serves the result. `content/index.json`
and `sitemap.xml` are git-ignored on purpose — Vercel regenerates them
fresh on every deploy, so they can never go stale or drift out of sync with
whatever `.md` files are actually in `content/`.

### Custom domain

Add it under the project's **Settings → Domains** in the Vercel dashboard.
No code changes needed — but if you do move to a new domain, update the
hardcoded `SITE_URL` constant in `scripts/build.js` and the canonical/OG
URLs in the `<head>` of each HTML file, so sitemap and social-share links
point at the right place.

### Previews

Every pull request / non-production branch gets its own preview URL from
Vercel automatically — same build process, just a different deployment.

## Troubleshooting

**A post doesn't show up on the site.**
Check the Vercel build log for a line like `Skipping <file>: frontmatter is
missing "title" or "date".` — the build script skips malformed posts rather
than crashing the whole site. Fix the frontmatter and redeploy.

**Dates are sorting oddly.**
`date` must be `YYYY-MM-DD`. Anything else may parse inconsistently across
browsers/Node versions.

**Images in a post are broken.**
The path must be absolute from the site root (`/assets/images/...`), and
the file must actually be committed under `assets/images/`. A relative path
like `images/foo.png` will resolve against `/post.html`, not against
`content/`, and will 404.

**Code isn't highlighted.**
Check the fence has a language name (` ```python `, not just ` ``` `), and
that the language is one of: `javascript`, `python`, `bash`, `json`, `sql`,
`graphql`, `http` (plus anything Prism's core bundle covers, like markup).
Unlisted languages just render as plain text — no error, no crash.

**Local changes aren't showing up.**
The dev server doesn't watch files. After editing a `.md` file, re-run
`npm run build` (or restart `npm run dev`) and hard-refresh the browser.

**Build fails on Vercel but works locally.**
Almost always a frontmatter typo that a stricter environment surfaces, or a
file encoding issue. Re-run `npm run build` locally and read the console
output — it's the exact same script Vercel runs.

## Design notes / why things are built this way

- **Markdown rendering**: [marked](https://github.com/markedjs/marked) and
  [Prism.js](https://prismjs.com/) (for code block syntax highlighting) are
  loaded from cdnjs on `post.html` only — the one page that needs them.
  Nothing is bundled or installed.
- **No web fonts**: the whole site uses the system font stack (both the
  sans-serif UI font and the monospace font for code/tags), so there's
  nothing to download before text can render.
- **Tools/About are static on purpose**: no manifest, no build step — just
  edit the HTML directly, since they change far less often than posts do.
- **Individual post SEO is best-effort**: `post.html` is one shared page
  for every post, distinguished by `?slug=`. JavaScript updates the
  `<title>`, meta description, and canonical link once the post loads, which
  works fine for users and for crawlers that execute JavaScript (including
  Google). Link-preview bots that don't run JavaScript (e.g. some chat apps)
  will see the generic fallback tags baked into `post.html` instead of the
  post's real title/description. Fixing that fully would mean generating a
  static HTML file per post, which was intentionally left out to keep this
  a single dynamic page, per the original brief.
- **Security headers**: `vercel.json` sets a Content-Security-Policy,
  X-Frame-Options, Referrer-Policy, Permissions-Policy, and HSTS. If you
  add a new external script/stylesheet source later, you'll need to add its
  origin to the CSP's `script-src`/`style-src` or the browser will silently
  block it.
