require('./env.cjs');
require('./build.cjs');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const handler = require('../api/backend.js');
const root = path.resolve(__dirname, '..', 'public');
const port = Number(process.env.PORT || 4181);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/backend') return handler(req, res);
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); return res.end(); }
  let requested;
  try { requested = decodeURIComponent(url.pathname); } catch { res.writeHead(400); return res.end(); }
  if (requested === '/admin') { res.writeHead(302, { Location: '/admin/' }); return res.end(); }
  if (requested.endsWith('/')) requested += 'index.html';
  const file = path.resolve(root, `.${requested}`);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end('Not found'); }
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(file).pipe(res);
}).listen(port, '127.0.0.1', () => console.log(`Site: http://127.0.0.1:${port}/\nAdmin: http://127.0.0.1:${port}/admin/`));
