#!/usr/bin/env node
// Zero-dependency static file server for local development.
//
// A real HTTP server is required even for a "just open the HTML" site
// because fetch() of local files is blocked under the file:// protocol —
// the browser refuses it as a cross-origin request. This has no role in
// production; Vercel serves the files directly.

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

// Resolves a request path to a file inside ROOT, refusing anything that
// would escape it via "..".
function safeJoin(root, urlPath) {
  const resolved = path.resolve(root, `.${urlPath}`);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    return null;
  }
  return resolved;
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const requested = urlPath === '/' ? '/index.html' : urlPath;
  const filePath = safeJoin(ROOT, requested);

  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(ROOT, '404.html'), (err404, notFoundPage) => {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(err404 ? 'Not found' : notFoundPage);
      });
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Serving mrroot locally at http://localhost:${PORT}`);
});
