const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4200;

// Serve from Angular build output in production, fallback to src/ for legacy
const DIST_DIR = path.join(__dirname, 'dist', 'codequest-frontend', 'browser');
const SRC_DIR = path.join(__dirname, 'src');
const PUBLIC_DIR = fs.existsSync(DIST_DIR) ? DIST_DIR : SRC_DIR;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(PUBLIC_DIR, reqPath);
  let ext = path.extname(filePath).toLowerCase();

  // If file exists, serve it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000',
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // SPA fallback to index.html
  const indexPath = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(indexPath).pipe(res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[CodeQuest Frontend] Serving from: ${PUBLIC_DIR}`);
  console.log(`[CodeQuest Frontend] Servidor SPA escuchando en http://0.0.0.0:${PORT}`);
});
