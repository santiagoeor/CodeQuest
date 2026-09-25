const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

function normalizeUrl(url) {
  if (!url) return '';
  let cleaned = url.trim().replace(/^['"]|['"]$/g, '');
  if (!cleaned) return '';
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'https://' + cleaned;
  }
  return cleaned.replace(/\/$/, '');
}

const PORT = process.env.PORT || 4200;
const BACKEND_URL = normalizeUrl(process.env.BACKEND_URL || process.env.API_URL || '');
const PUBLIC_API_URL = process.env.PUBLIC_API_URL || '';

// Serve from Angular build output in production, fallback to src/ for dev
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
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

/**
 * Proxy API requests directly to the Laravel backend
 */
function proxyApiRequest(req, res, targetUrl) {
  try {
    const parsedTarget = new URL(targetUrl);
    const client = parsedTarget.protocol === 'https:' ? https : http;
    const targetPath = parsedTarget.pathname.replace(/\/$/, '') + req.url;

    const headers = { ...req.headers, host: parsedTarget.host };
    delete headers['connection'];

    const proxyReq = client.request(
      {
        protocol: parsedTarget.protocol,
        hostname: parsedTarget.hostname,
        port: parsedTarget.port || (parsedTarget.protocol === 'https:' ? 443 : 80),
        path: targetPath,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      }
    );

    proxyReq.on('error', (err) => {
      console.error('[API Proxy Error]', err.message);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          error: 'Bad Gateway',
          message: 'No se pudo comunicar con el backend de CodeQuest',
          details: err.message,
        })
      );
    });

    req.pipe(proxyReq, { end: true });
  } catch (err) {
    console.error('[API Proxy Setup Error]', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Proxy Configuration Error', details: err.message }));
  }
}

/**
 * Send index.html with runtime config injected into <head>
 */
function sendIndexHtml(res, indexPath) {
  fs.readFile(indexPath, 'utf8', (err, html) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading index.html');
      return;
    }

    let modifiedHtml = html;
    if (PUBLIC_API_URL) {
      const injectScript = `<script>window.__CODEQUEST_API_URL__ = ${JSON.stringify(PUBLIC_API_URL)};</script>`;
      modifiedHtml = html.replace('<head>', `<head>${injectScript}`);
    }

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    });
    res.end(modifiedHtml);
  });
}

const server = http.createServer((req, res) => {
  // 1. Proxy /api requests to backend if BACKEND_URL is defined
  if (req.url.startsWith('/api') && BACKEND_URL) {
    return proxyApiRequest(req, res, BACKEND_URL);
  }

  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(PUBLIC_DIR, reqPath);
  let ext = path.extname(filePath).toLowerCase();

  // 2. Serve static file if it exists
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    if (ext === '.html') {
      return sendIndexHtml(res, filePath);
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=31536000',
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // 3. SPA fallback to index.html
  const indexPath = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    return sendIndexHtml(res, indexPath);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[CodeQuest Frontend] Serving from: ${PUBLIC_DIR}`);
  if (BACKEND_URL) {
    console.log(`[CodeQuest Frontend] Proxying /api to: ${BACKEND_URL}`);
  }
  console.log(`[CodeQuest Frontend] Servidor SPA escuchando en http://0.0.0.0:${PORT}`);
});
