/** Icon SVG (Heroicons outline — không dùng emoji làm icon) */
export const icon = {
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 15.3-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><path d="M3 21v-5h5"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h11v10H3z"/><path d="M14 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/></svg>',
  leather: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c3 2.5 4.5 5.5 4.5 8.5S15 18 12 21c-3-3-4.5-6.5-4.5-9.5S9 5.5 12 3Z"/><path d="M12 7v11"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 13 4 4L19 7"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.2 10.5a2 2 0 0 0 2 1.5h7.6a2 2 0 0 0 2-1.6L20 8H6"/><circle cx="10" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6 18 18"/><path d="M18 6 6 18"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.6a1 1 0 0 1-.25 1l-2.22 2.2Z"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.9 3 3 6.4 3 10.6c0 2.4 1.3 4.5 3.3 5.9-.1.9-.6 2.2-1.6 3.4 1.9-.3 3.4-1.1 4.4-1.8 1 .2 1.9.4 2.9.4 5.1 0 9-3.4 9-7.9S17.1 3 12 3Z"/></svg>',
  location: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.3l3.2 2"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>',
  ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="8" width="19" height="8" rx="2"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/></svg>',
};

/** 890000 -> "890.000đ" */
export function money(n) {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}

/** Thoát ký tự HTML để tránh lỗi hiển thị và XSS khi dữ liệu có <, >, & */
export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

export function discountPct(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}

/* ---------------- Thẻ sản phẩm ---------------- */
export function productCard(p, site, { base = '' } = {}) {
  const cat = site.categories.find((c) => c.slug === p.category);
  const off = discountPct(p.price, p.oldPrice);
  const badge = off
    ? `<span class="prod__badge prod__badge--sale">-${off}%</span>`
    : p.badge
      ? `<span class="prod__badge">${esc(p.badge)}</span>`
      : '';

  return `<article class="prod reveal" data-cat="${esc(p.category)}" data-price="${p.price}" data-name="${esc(p.name.toLowerCase())}">
  <div class="prod__media">${badge}<img src="${base}assets/img/${p.slug}-1.svg" width="400" height="300" loading="lazy" decoding="async" alt="${esc(p.name)} — màu ${esc(p.colors[0].name)}"></div>
  <div class="prod__body">
    <span class="prod__cat">${esc(cat ? cat.name : '')}</span>
    <h3 class="prod__name"><a href="${base}san-pham/${p.slug}.html">${esc(p.name)}</a></h3>
    <div class="prod__price">
      <span class="price-now">${money(p.price)}</span>
      ${p.oldPrice ? `<span class="price-old">${money(p.oldPrice)}</span>` : ''}
    </div>
    <div class="prod__swatches" aria-label="Màu có sẵn: ${esc(p.colors.map((c) => c.name).join(', '))}">
      ${p.colors.map((c) => `<span class="swatch-dot" style="background:${esc(c.hex)}" title="${esc(c.name)}"></span>`).join('')}
    </div>
    <div class="prod__cta"><a class="btn btn--ghost btn--block" href="${base}san-pham/${p.slug}.html">Xem chi tiết</a></div>
  </div>
</article>`;
}

/* ---------------- Khung trang ---------------- */
export function layout({ site, title, description, body, current = '', base = '', bodyClass = '', jsonLd = '' }) {
  const nav = [
    ['', 'Trang chủ'],
    ['san-pham.html', 'Sản phẩm'],
    ['huong-dan-chon-size.html', 'Chọn size'],
    ['chinh-sach.html', 'Chính sách'],
    ['lien-he.html', 'Liên hệ'],
  ];
  const navHtml = (cls) =>
    nav
      .map(([href, label]) => {
        const h = href === '' ? base || './' : base + href;
        const cur = current === href ? ' aria-current="page"' : '';
        return `<a href="${h}"${cur}>${label}</a>`;
      })
      .join('');

  const c = site.contact;
  const fullTitle = title ? `${title} | ${site.brand}` : `${site.brand} — ${site.tagline}`;

  return `<!DOCTYPE html>
<html lang="vi" data-ship-fee="${site.order.shippingFee}" data-free-from="${site.order.freeShippingFrom}" data-order-endpoint="${esc(site.order.endpoint || '')}" data-zalo="${esc(c.zalo)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description || site.description)}">
<meta name="theme-color" content="#1C1917">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.brand)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description || site.description)}">
<meta property="og:locale" content="vi_VN">
<link rel="canonical" href="${esc(site.url)}">
<link rel="icon" href="${base}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&family=Rubik:wght@500;600;700&display=swap">
<link rel="stylesheet" href="${base}assets/css/style.css">
${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ''}
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#main">Bỏ qua, đến nội dung chính</a>

<div class="topbar">Miễn phí giao hàng cho đơn từ ${money(site.order.freeShippingFrom)} &nbsp;·&nbsp; Gọi <a href="tel:${esc(c.hotlineRaw)}">${esc(c.hotline)}</a></div>

<header class="header">
  <div class="wrap header__bar">
    <a class="logo" href="${base || './'}">
      <span class="logo__mark" aria-hidden="true">VL</span>
      <span><span class="logo__name">${esc(site.brand)}</span><br><span class="logo__sub">Giày da nam</span></span>
    </a>
    <nav class="nav" aria-label="Điều hướng chính">${navHtml()}</nav>
    <div class="header__actions">
      <a class="icon-btn" href="tel:${esc(c.hotlineRaw)}" aria-label="Gọi ${esc(c.hotline)}">${icon.phone}</a>
      <a class="icon-btn" href="${base}gio-hang.html" aria-label="Giỏ hàng">${icon.cart}<span class="cart-count" data-cart-count hidden>0</span></a>
      <button class="icon-btn nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Mở menu">${icon.menu}</button>
    </div>
  </div>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Điều hướng di động"><div class="wrap">${navHtml()}</div></nav>
</header>

<main id="main">
${body}
</main>

<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div>
        <h3>${esc(site.brand)}</h3>
        <p class="footer__note">${esc(site.description)}</p>
      </div>
      <div>
        <h3>Danh mục</h3>
        <ul>${site.categories.map((x) => `<li><a href="${base}san-pham.html?danh-muc=${x.slug}">${esc(x.name)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h3>Hỗ trợ</h3>
        <ul>
          <li><a href="${base}huong-dan-chon-size.html">Hướng dẫn chọn size</a></li>
          <li><a href="${base}chinh-sach.html#doi-tra">Đổi trả &amp; bảo hành</a></li>
          <li><a href="${base}chinh-sach.html#van-chuyen">Vận chuyển &amp; thanh toán</a></li>
          <li><a href="${base}lien-he.html">Liên hệ</a></li>
        </ul>
      </div>
      <div>
        <h3>Liên hệ</h3>
        <ul>
          <li><a href="tel:${esc(c.hotlineRaw)}">${esc(c.hotline)}</a></li>
          <li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>
          <li>${esc(c.address)}</li>
          <li>${esc(c.workingHours)}</li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <span>&copy; ${new Date().getFullYear()} ${esc(site.brand)}. Bảo lưu mọi quyền.</span>
      <span>Giá đã bao gồm VAT</span>
    </div>
  </div>
</footer>

<div class="fab">
  <a href="https://zalo.me/${esc(c.zalo)}" target="_blank" rel="noopener" aria-label="Nhắn Zalo">${icon.chat}</a>
  <a class="is-phone" href="tel:${esc(c.hotlineRaw)}" aria-label="Gọi ${esc(c.hotline)}">${icon.phone}</a>
</div>

<div class="toast" role="status" aria-live="polite" data-toast>${icon.check}<span data-toast-text></span></div>

<script src="${base}assets/js/app.js" defer></script>
</body>
</html>`;
}
