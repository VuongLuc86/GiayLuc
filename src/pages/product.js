import { icon, money, esc, productCard, discountPct } from '../lib/ui.js';

export function product(site, p, all) {
  const cat = site.categories.find((c) => c.slug === p.category);
  const off = discountPct(p.price, p.oldPrice);
  const related = all.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 4);
  const c = site.contact;

  const gallery = [1, 2, 3];

  return `
<div class="wrap">
  <nav class="breadcrumb" aria-label="Đường dẫn"><ol>
    <li><a href="../">Trang chủ</a></li>
    <li><a href="../san-pham.html">Sản phẩm</a></li>
    <li><a href="../san-pham.html?danh-muc=${esc(p.category)}">${esc(cat ? cat.name : '')}</a></li>
    <li>${esc(p.name)}</li>
  </ol></nav>

  <div class="pdp"
       data-pdp
       data-slug="${esc(p.slug)}"
       data-name="${esc(p.name)}"
       data-price="${p.price}">
    <div class="pdp__gallery">
      <div class="pdp__main">
        <img data-main-img src="../assets/img/${p.slug}-1.svg" width="400" height="300" alt="${esc(p.name)}" fetchpriority="high" decoding="async">
      </div>
      <div class="pdp__thumbs" role="group" aria-label="Chọn ảnh">
        ${gallery
          .map(
            (n) => `<button class="pdp__thumb" type="button" data-thumb="../assets/img/${p.slug}-${n}.svg" aria-pressed="${n === 1}" aria-label="Xem ảnh ${n}">
          <img src="../assets/img/${p.slug}-${n}.svg" width="76" height="76" loading="lazy" decoding="async" alt=""></button>`
          )
          .join('')}
      </div>
    </div>

    <div>
      <p class="eyebrow">${esc(cat ? cat.name : '')}</p>
      <h1 class="pdp__title">${esc(p.name)}</h1>

      <div class="pdp__price">
        <span class="price-now">${money(p.price)}</span>
        ${p.oldPrice ? `<span class="price-old">${money(p.oldPrice)}</span><span class="price-off">Tiết kiệm ${money(p.oldPrice - p.price)}</span>` : ''}
      </div>

      <p class="pdp__short">${esc(p.short)}</p>

      <div class="opt">
        <div class="opt__label"><span>Màu: <strong data-color-label>${esc(p.colors[0].name)}</strong></span></div>
        <div class="opt__row" role="group" aria-label="Chọn màu">
          ${p.colors
            .map(
              (col, i) => `<button class="opt-btn" type="button" data-color="${esc(col.name)}" data-color-img="../assets/img/${p.slug}-color-${i + 1}.svg" aria-pressed="${i === 0}">
            <span class="swatch-dot" style="background:${esc(col.hex)}"></span>${esc(col.name)}</button>`
            )
            .join('')}
        </div>
      </div>

      <div class="opt">
        <div class="opt__label">
          <span>Size <span class="req" aria-hidden="true">*</span></span>
          <a href="../huong-dan-chon-size.html">Bảng size &amp; cách đo</a>
        </div>
        <div class="opt__row" role="group" aria-label="Chọn size">
          ${p.sizes.map((s) => `<button class="opt-btn" type="button" data-size="${s}" aria-pressed="false">${s}</button>`).join('')}
        </div>
        <p class="hint" style="font-size:.85rem;color:var(--c-fg-subtle);margin-top:var(--s-2)">Chưa chọn size — hãy chọn trước khi thêm vào giỏ.</p>
      </div>

      <div class="opt">
        <div class="opt__label"><span>Số lượng</span></div>
        <div class="qty">
          <button type="button" data-qty="-1" aria-label="Giảm số lượng">−</button>
          <input type="number" value="1" min="1" max="20" data-qty-input aria-label="Số lượng">
          <button type="button" data-qty="1" aria-label="Tăng số lượng">+</button>
        </div>
      </div>

      <div class="pdp__actions">
        <button class="btn btn--accent btn--lg" type="button" data-add-cart>${icon.cart} Thêm vào giỏ</button>
        <a class="btn btn--ghost btn--lg" href="https://zalo.me/${esc(c.zalo)}" target="_blank" rel="noopener">${icon.chat} Hỏi qua Zalo</a>
      </div>

      <p class="pdp__note">${icon.truck} Giao toàn quốc, kiểm tra hàng rồi mới thanh toán. Miễn phí ship cho đơn từ ${money(site.order.freeShippingFrom)}.</p>

      <div style="margin-top:var(--s-6)">
        <h2 style="font-size:1.1rem;margin-bottom:var(--s-3)">Thông tin sản phẩm</h2>
        <ul class="details-list">
          ${p.details.map((d) => `<li>${icon.check}<span>${esc(d)}</span></li>`).join('')}
          <li>${icon.check}<span>Size có sẵn: ${p.sizes.join(', ')}</span></li>
        </ul>
      </div>

      <div style="margin-top:var(--s-5)">
        <details class="acc"><summary>Cách bảo quản</summary><div class="acc__body">${esc(p.care)}</div></details>
        <details class="acc"><summary>Vận chuyển &amp; thanh toán</summary><div class="acc__body">${esc(site.policies.shipping)} ${esc(site.policies.payment)}</div></details>
        <details class="acc"><summary>Đổi trả &amp; bảo hành</summary><div class="acc__body">${esc(site.policies.returns)} ${esc(site.policies.warranty)}</div></details>
      </div>
    </div>
  </div>
</div>

${
  related.length
    ? `<section class="section section--alt">
  <div class="wrap">
    <div class="section-head"><h2>Mẫu cùng nhóm</h2></div>
    <div class="prod-grid">${related.map((r) => productCard(r, site, { base: '../' })).join('')}</div>
  </div>
</section>`
    : ''
}`;
}

export function productJsonLd(site, p) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.short,
    brand: { '@type': 'Brand', name: site.brand },
    image: `${site.url}/assets/img/${p.slug}-1.svg`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'VND',
      price: p.price,
      availability: 'https://schema.org/InStock',
      url: `${site.url}/san-pham/${p.slug}.html`,
    },
  });
}
