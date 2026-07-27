/**
 * Máy chủ xem thử tại chỗ.
 *   node scripts/dev-server.js     →  mở http://localhost:3000
 * Tự build lại mỗi khi bạn tải lại trang, nên sửa file xong chỉ cần F5.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};

function build() {
  try {
    execFileSync(process.execPath, [join(ROOT, 'build.js')], { stdio: 'inherit' });
    return true;
  } catch {
    return false;
  }
}

build();

createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  let file = join(DIST, p);

  // build lại khi tải trang HTML để thấy ngay thay đổi
  if (extname(file) === '.html') build();

  try {
    const s = await stat(file);
    if (s.isDirectory()) file = join(file, 'index.html');
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch {
    try {
      const data = await readFile(join(DIST, '404.html'));
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    } catch {
      res.writeHead(404).end('404');
    }
  }
}).listen(PORT, () => {
  console.log(`\n  Đang chạy tại http://localhost:${PORT}`);
  console.log('  Sửa file trong data/ hoặc src/ rồi tải lại trang là thấy thay đổi.');
  console.log('  Bấm Ctrl + C để dừng.\n');
});
