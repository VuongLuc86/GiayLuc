/**
 * Gộp một trang thành file HTML đơn lẻ để xem thử hoặc gửi cho người khác.
 *   node build.js && node scripts/tao-preview.js [tên-file.html]
 * Mặc định lấy index.html. Kết quả: preview-<tên>.html ở thư mục gốc.
 *
 * File tạo ra chứa sẵn CSS, Javascript và ảnh nên mở được bằng cách
 * nhấp đúp, không cần chạy server.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const D = join(ROOT, 'dist');
const target = process.argv[2] || 'index.html';
const src = join(D, target);

if (!existsSync(src)) {
  console.error(`Không tìm thấy dist/${target}. Chạy "node build.js" trước.`);
  process.exit(1);
}

let html = readFileSync(src, 'utf8');
const depth = target.includes('/') ? '../' : '';

html = html.replace(/(?:src|href)="((?:\.\.\/)?assets\/img\/[^"]+\.svg)"/g, (m, p) => {
  const f = join(D, p.replace(/^\.\.\//, ''));
  if (!existsSync(f)) return m;
  const b64 = Buffer.from(readFileSync(f, 'utf8')).toString('base64');
  return m.split('"')[0] + `"data:image/svg+xml;base64,${b64}"`;
});

const css = readFileSync(join(D, 'assets/css/style.css'), 'utf8');
const js = readFileSync(join(D, 'assets/js/app.js'), 'utf8');
html = html.replace(`<link rel="stylesheet" href="${depth}assets/css/style.css">`, `<style>${css}</style>`);
html = html.replace(`<script src="${depth}assets/js/app.js" defer></script>`, `<script>${js}</script>`);

const out = join(ROOT, `preview-${basename(target)}`);
writeFileSync(out, html, 'utf8');
console.log(`  Đã tạo ${basename(out)} (${(html.length / 1024).toFixed(0)} KB) — nhấp đúp để xem thử.`);
