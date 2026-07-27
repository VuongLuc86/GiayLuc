/**
 * Kiểm tra chất lượng bản build.
 *   node build.js && node scripts/kiem-tra.js
 *
 * Kiểm: tương phản màu WCAG, thẻ alt của ảnh, viewport, ngôn ngữ trang,
 * liên kết nội bộ hỏng, vùng chạm, prefers-reduced-motion, dung lượng.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const D = join(ROOT, 'dist');
if (!existsSync(D)) { console.error('Chưa có thư mục dist/. Chạy "node build.js" trước.'); process.exit(1); }

const fails = [], warns = [];
const walk = (d, acc = []) => { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p, acc) : acc.push(p); } return acc; };
const files = walk(D);
const html = files.filter((f) => f.endsWith('.html'));

/* ---- Tương phản màu ---- */
const lum = (h) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

const pairs = [
  ['#1C1917', '#FAFAF9', 'chữ chính trên nền trang'],
  ['#57534E', '#FAFAF9', 'chữ phụ trên nền trang'],
  ['#78716C', '#FAFAF9', 'chữ mờ trên nền trang'],
  ['#92400E', '#FFFFFF', 'nâu da trên nền trắng'],
  ['#FFFFFF', '#92400E', 'chữ trắng trên nút nâu'],
  ['#FFFFFF', '#1C1917', 'chữ trắng trên nền đen'],
  ['#B91C1C', '#FFFFFF', 'màu giảm giá trên nền trắng'],
  ['#D6D3D1', '#1C1917', 'chữ footer trên nền đen'],
  ['#A8A29E', '#1C1917', 'chữ footer mờ trên nền đen'],
  ['#78350F', '#FEF6EE', 'chữ trong hộp ghi chú'],
  ['#92400E', '#FEF6EE', 'nút tuỳ chọn đang chọn'],
  ['#15803D', '#FFFFFF', 'chữ báo thành công'],
];
console.log('== Tương phản màu (chuẩn WCAG AA: >= 4.5:1) ==');
for (const [fg, bg, name] of pairs) {
  const r = ratio(fg, bg), ok = r >= 4.5;
  console.log(`  ${ok ? 'ĐẠT ' : 'HỎNG'}  ${r.toFixed(2).padStart(5)}:1  ${name}`);
  if (!ok) fails.push(`Tương phản kém: ${name} = ${r.toFixed(2)}:1`);
}

/* ---- HTML ---- */
console.log('\n== Kiểm tra HTML ==');
let imgNoAlt = 0, emojiFiles = 0, noViewport = 0, noLang = 0;
const badLinks = [];
const emojiRe = /[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F0FF}\u{2700}-\u{27BF}]/u;
for (const f of html) {
  const s = readFileSync(f, 'utf8');
  const rel = f.replace(D + '/', '');
  for (const m of s.matchAll(/<img\b[^>]*>/g)) if (!/\salt=/.test(m[0])) imgNoAlt++;
  if (emojiRe.test(s)) { emojiFiles++; warns.push(`${rel}: có ký tự emoji trong nội dung`); }
  if (!/name="viewport"/.test(s)) { noViewport++; fails.push(`${rel}: thiếu thẻ viewport`); }
  if (!/<html lang="vi"/.test(s)) { noLang++; fails.push(`${rel}: thiếu lang="vi"`); }
  const h1 = (s.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) warns.push(`${rel}: có ${h1} thẻ h1 (nên đúng 1)`);
  for (const m of s.matchAll(/(?:href|src)="([^"#?:]+\.(?:html|css|js|svg|webp|jpg|jpeg|png))(?:[?#][^"]*)?"/g)) {
    const href = m[1];
    if (href.startsWith('http') || href.startsWith('//')) continue;
    const dir = rel.includes('/') ? rel.slice(0, rel.lastIndexOf('/')) : '';
    const target = join(D, href.startsWith('/') ? href.slice(1) : join(dir, href));
    if (!existsSync(target)) badLinks.push(`${rel} -> ${href}`);
  }
}
const line = (ok, txt) => console.log(`  ${ok ? 'ĐẠT ' : 'HỎNG'}  ${txt}`);
line(imgNoAlt === 0, `ảnh thiếu thuộc tính alt: ${imgNoAlt}`);
line(noViewport === 0, `trang thiếu viewport: ${noViewport}`);
line(noLang === 0, `trang thiếu lang="vi": ${noLang}`);
line(badLinks.length === 0, `liên kết nội bộ hỏng: ${badLinks.length}`);
badLinks.slice(0, 10).forEach((b) => console.log('          ' + b));
console.log(`  ${emojiFiles === 0 ? 'ĐẠT ' : 'LƯU Ý'}  trang dùng emoji thay icon: ${emojiFiles}`);
if (imgNoAlt) fails.push(`${imgNoAlt} ảnh thiếu alt`);
badLinks.forEach((b) => fails.push('Liên kết hỏng: ' + b));

/* ---- CSS ---- */
console.log('\n== Giao diện & khả năng tiếp cận ==');
const css = readFileSync(join(D, 'assets/css/style.css'), 'utf8');
[
  [/--tap:\s*44px/, 'khai báo vùng chạm tối thiểu 44px'],
  [/prefers-reduced-motion/, 'tôn trọng tuỳ chọn giảm chuyển động'],
  [/:focus-visible\s*\{[^}]*outline:/, 'có viền focus rõ ràng cho bàn phím'],
  [/\.skip-link/, 'có liên kết bỏ qua điều hướng'],
  [/@media \(min-width: 640px\)/, 'thiết kế mobile-first, có breakpoint'],
  [/aspect-ratio/, 'giữ chỗ cho ảnh, chống nhảy layout (CLS)'],
  [/overflow-x:\s*hidden/, 'chặn cuộn ngang'],
].forEach(([re, l]) => { const ok = re.test(css); line(ok, l); if (!ok) fails.push('CSS thiếu: ' + l); });

/* ---- JS ---- */
console.log('\n== Javascript ==');
const js = readFileSync(join(D, 'assets/js/app.js'), 'utf8');
[
  [/localStorage/, 'giỏ hàng lưu trong máy khách'],
  [/escHtml/, 'thoát ký tự HTML khi hiển thị giỏ hàng'],
  [/aria-pressed/, 'cập nhật aria-pressed cho nút chọn size/màu'],
  [/aria-invalid/, 'đánh dấu ô nhập sai bằng aria-invalid'],
  [/matchMedia\('\(prefers-reduced-motion/, 'tắt hiệu ứng khi người dùng yêu cầu'],
].forEach(([re, l]) => { const ok = re.test(js); line(ok, l); if (!ok) fails.push('JS thiếu: ' + l); });

/* ---- Dung lượng ---- */
console.log('\n== Dung lượng ==');
const kb = (p) => (statSync(p).size / 1024).toFixed(1);
console.log(`  Trang chủ  : ${kb(join(D, 'index.html'))} KB`);
console.log(`  CSS        : ${kb(join(D, 'assets/css/style.css'))} KB`);
console.log(`  JS         : ${kb(join(D, 'assets/js/app.js'))} KB`);
console.log(`  Tổng dist/ : ${(files.reduce((s, f) => s + statSync(f).size, 0) / 1024).toFixed(0)} KB — ${files.length} file`);

console.log('\n' + '='.repeat(46));
if (fails.length) { console.log('LỖI CẦN SỬA:'); fails.forEach((f) => console.log('  - ' + f)); }
else console.log('Không có lỗi.');
if (warns.length) { console.log('\nGHI CHÚ:'); warns.forEach((w) => console.log('  - ' + w)); }
process.exit(fails.length ? 1 : 0);
