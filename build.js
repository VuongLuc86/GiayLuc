/**
 * Trình tạo web tĩnh cho Vương Lực.
 *
 * Chạy:  node build.js
 * Kết quả: thư mục dist/ — copy toàn bộ nội dung dist/ lên public_html của Hostinger.
 *
 * Không dùng thư viện ngoài, không cần npm install.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { layout, esc } from './src/lib/ui.js';
import { shoeSvg } from './src/lib/shoe-svg.js';
import { home } from './src/pages/home.js';
import { catalog } from './src/pages/catalog.js';
import { product, productJsonLd } from './src/pages/product.js';
import { cartPage, sizeGuide, policies, contact, notFound } from './src/pages/misc.js';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');
const IMG = join(DIST, 'assets', 'img');

const t0 = Date.now();
const log = (m) => console.log('  ' + m);

/* ------------------------- Đọc và kiểm tra dữ liệu ------------------------- */
function loadJson(p) {
  try {
    return JSON.parse(readFileSync(join(ROOT, p), 'utf8'));
  } catch (e) {
    console.error(`\n  LỖI: không đọc được ${p}\n  ${e.message}\n  (Thường do thiếu dấu phẩy hoặc thừa dấu phẩy cuối cùng trong file JSON.)\n`);
    process.exit(1);
  }
}

const site = loadJson('data/site.json');
const products = loadJson('data/products.json');

function validate() {
  const errs = [];
  const slugs = new Set();
  const catSlugs = new Set(site.categories.map((c) => c.slug));

  products.forEach((p, i) => {
    const at = `sản phẩm #${i + 1} (${p.name || 'chưa có tên'})`;
    if (!p.slug) errs.push(`${at}: thiếu "slug"`);
    else if (slugs.has(p.slug)) errs.push(`${at}: "slug" bị trùng — ${p.slug}`);
    else slugs.add(p.slug);
    if (!p.name) errs.push(`${at}: thiếu "name"`);
    if (typeof p.price !== 'number' || p.price <= 0) errs.push(`${at}: "price" phải là số lớn hơn 0`);
    if (p.oldPrice != null && p.oldPrice <= p.price) errs.push(`${at}: "oldPrice" phải lớn hơn "price" (hoặc để null)`);
    if (!catSlugs.has(p.category)) errs.push(`${at}: "category" = "${p.category}" không có trong data/site.json`);
    if (!Array.isArray(p.colors) || !p.colors.length) errs.push(`${at}: cần ít nhất 1 màu trong "colors"`);
    if (!Array.isArray(p.sizes) || !p.sizes.length) errs.push(`${at}: cần ít nhất 1 size trong "sizes"`);
  });

  if (!site.contact?.hotlineRaw) errs.push('data/site.json: thiếu contact.hotlineRaw');

  if (errs.length) {
    console.error('\n  DỮ LIỆU CHƯA HỢP LỆ:\n' + errs.map((e) => '   - ' + e).join('\n') + '\n');
    process.exit(1);
  }
}
validate();

/* ------------------------------- Ghi file ------------------------------- */
function write(rel, content) {
  const full = join(DIST, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf8');
}

/* --------------------------- Dọn và tạo dist --------------------------- */
// Một số ổ đĩa mạng / thư mục đồng bộ không cho xoá cả cây thư mục.
// Nếu gặp trường hợp đó thì xoá từng file thay vì dừng build.
try {
  rmSync(DIST, { recursive: true, force: true });
} catch {
  const sweep = (dir) => {
    if (!existsSync(dir)) return;
    for (const f of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, f.name);
      try {
        if (f.isDirectory()) { sweep(p); rmSync(p, { recursive: true, force: true }); }
        else rmSync(p, { force: true });
      } catch { /* bỏ qua file đang bị khoá, sẽ được ghi đè */ }
    }
  };
  sweep(DIST);
  log('Lưu ý: không xoá sạch được thư mục dist cũ, các file sẽ được ghi đè.');
}
mkdirSync(IMG, { recursive: true });
cpSync(join(ROOT, 'src', 'assets', 'css'), join(DIST, 'assets', 'css'), { recursive: true });
cpSync(join(ROOT, 'src', 'assets', 'js'), join(DIST, 'assets', 'js'), { recursive: true });

// Ảnh thật do người dùng bỏ vào src/assets/img/ được ưu tiên hơn ảnh SVG tự sinh
const realImgDir = join(ROOT, 'src', 'assets', 'img');
const realImgs = new Set(existsSync(realImgDir) ? readdirSync(realImgDir) : []);
if (realImgs.size) cpSync(realImgDir, IMG, { recursive: true });

/* ------------------------------ Sinh ảnh ------------------------------ */
let imgCount = 0;
function svgFile(name, svg) {
  // không ghi đè nếu người dùng đã đặt ảnh thật cùng tên
  if (realImgs.has(name)) return;
  writeFileSync(join(IMG, name), svg, 'utf8');
  imgCount++;
}

svgFile(
  'favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#1C1917"/><text x="32" y="42" font-family="Rubik,sans-serif" font-size="26" font-weight="700" fill="#FAFAF9" text-anchor="middle">VL</text></svg>`
);
svgFile('hero.svg', shoeSvg({ category: 'giay-tay', color: '#7A4A2B', view: 'pair', label: 'Giày da nam Vương Lực' }));

site.categories.forEach((c) => {
  const sample = products.find((p) => p.category === c.slug);
  svgFile(`cat-${c.slug}.svg`, shoeSvg({ category: c.slug, color: sample ? sample.colors[0].hex : '#7A4A2B', view: 'side', label: c.name }));
});

products.forEach((p) => {
  const c1 = p.colors[0].hex;
  const c2 = (p.colors[1] || p.colors[0]).hex;
  svgFile(`${p.slug}-1.svg`, shoeSvg({ category: p.category, color: c1, view: 'side', label: `${p.name} — ${p.colors[0].name}` }));
  svgFile(`${p.slug}-2.svg`, shoeSvg({ category: p.category, color: c2, view: 'pair', label: `${p.name} — cặp đôi` }));
  svgFile(`${p.slug}-3.svg`, shoeSvg({ category: p.category, color: c1, view: 'sole', label: `${p.name} — mặt đế` }));
  // mỗi màu một ảnh riêng để bấm đổi màu là ảnh đổi theo
  p.colors.forEach((col, i) => {
    svgFile(`${p.slug}-color-${i + 1}.svg`, shoeSvg({ category: p.category, color: col.hex, view: 'side', label: `${p.name} — ${col.name}` }));
  });
});
log(`Ảnh minh hoạ: ${imgCount} file SVG${realImgs.size ? ` (giữ nguyên ${realImgs.size} ảnh thật của bạn)` : ''}`);

/* ------------------------------- Các trang ------------------------------- */
const pages = [];

pages.push(['index.html', layout({
  site, title: '', description: site.description, current: '',
  body: home(site, products),
  jsonLd: JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Store', name: site.brand, description: site.description,
    url: site.url, telephone: site.contact.hotlineRaw, email: site.contact.email,
    address: { '@type': 'PostalAddress', streetAddress: site.contact.address, addressCountry: 'VN' },
    openingHours: site.contact.workingHours,
  }),
})]);

pages.push(['san-pham.html', layout({
  site, title: 'Tất cả sản phẩm', current: 'san-pham.html',
  description: `${products.length} mẫu giày da nam ${site.brand}: giày tây, giày lười, boot, sneaker da và sandal. Bảo hành 12 tháng, đổi size 7 ngày.`,
  body: catalog(site, products),
})]);

pages.push(['gio-hang.html', layout({
  site, title: 'Giỏ hàng', current: '',
  description: 'Xem lại đơn hàng và điền thông tin nhận hàng. Thanh toán khi nhận hàng (COD).',
  body: cartPage(site),
})]);

pages.push(['huong-dan-chon-size.html', layout({
  site, title: 'Hướng dẫn chọn size', current: 'huong-dan-chon-size.html',
  description: 'Cách đo bàn chân và bảng quy đổi size giày da nam từ 38 đến 44.',
  body: sizeGuide(site),
})]);

pages.push(['chinh-sach.html', layout({
  site, title: 'Chính sách bán hàng', current: 'chinh-sach.html',
  description: 'Chính sách vận chuyển, thanh toán, đổi trả và bảo hành của ' + site.brand + '.',
  body: policies(site),
})]);

pages.push(['lien-he.html', layout({
  site, title: 'Liên hệ', current: 'lien-he.html',
  description: `Liên hệ ${site.brand} qua Zalo ${site.contact.hotline}, điện thoại hoặc email.`,
  body: contact(site),
})]);

pages.push(['404.html', layout({ site, title: 'Không tìm thấy trang', current: '', body: notFound(site) })]);

products.forEach((p) => {
  pages.push([`san-pham/${p.slug}.html`, layout({
    site, title: p.name, description: p.short, current: 'san-pham.html', base: '../',
    body: product(site, p, products),
    jsonLd: productJsonLd(site, p),
  })]);
});

pages.forEach(([rel, html]) => write(rel, html));
log(`Trang HTML: ${pages.length} file`);

/* --------------------------- sitemap & robots --------------------------- */
const base = site.url.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);
const urls = pages
  .filter(([rel]) => rel !== '404.html')
  .map(([rel]) => {
    const loc = rel === 'index.html' ? base + '/' : `${base}/${rel}`;
    const pri = rel === 'index.html' ? '1.0' : rel.startsWith('san-pham/') ? '0.8' : '0.6';
    return `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>${pri}</priority></url>`;
  })
  .join('\n');
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);

/* ----- .htaccess: nén, cache, trang 404 (Hostinger dùng Apache/LiteSpeed) ----- */
write('.htaccess', `# Trang báo lỗi
ErrorDocument 404 /404.html

# Nén nội dung để tải nhanh hơn
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json image/svg+xml
</IfModule>

# Lưu cache tài nguyên tĩnh
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 7 days"
  ExpiresByType application/javascript "access plus 7 days"
  ExpiresByType image/svg+xml "access plus 30 days"
  ExpiresByType image/webp "access plus 30 days"
  ExpiresByType image/jpeg "access plus 30 days"
  ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Vài header bảo mật cơ bản
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set X-Frame-Options "SAMEORIGIN"
</IfModule>
`);

log(`sitemap.xml, robots.txt, .htaccess`);
console.log(`\n  Xong sau ${Date.now() - t0}ms — kết quả nằm trong thư mục dist/\n`);
