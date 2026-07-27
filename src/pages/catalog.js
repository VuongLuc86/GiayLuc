import { icon, money, esc, productCard } from '../lib/ui.js';

export function catalog(site, products) {
  const min = Math.min(...products.map((p) => p.price));
  const max = Math.max(...products.map((p) => p.price));

  return `
<div class="wrap">
  <nav class="breadcrumb" aria-label="Đường dẫn"><ol>
    <li><a href="./">Trang chủ</a></li><li>Sản phẩm</li>
  </ol></nav>
</div>

<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="section-head">
      <h1>Toàn bộ sản phẩm</h1>
      <p>${products.length} mẫu giày da nam, giá từ ${money(min)} đến ${money(max)}. Tất cả đều bảo hành 12 tháng và đổi size trong 7 ngày.</p>
    </div>

    <div class="filters" role="group" aria-label="Lọc sản phẩm">
      <button class="chip" type="button" data-filter="all" aria-pressed="true">Tất cả</button>
      ${site.categories.map((c) => `<button class="chip" type="button" data-filter="${c.slug}" aria-pressed="false">${esc(c.name)}</button>`).join('')}
      <div class="filters__spacer"></div>
      <label class="visually-hidden" for="sort">Sắp xếp</label>
      <select class="select" id="sort" data-sort>
        <option value="default">Sắp xếp: Mặc định</option>
        <option value="price-asc">Giá thấp đến cao</option>
        <option value="price-desc">Giá cao đến thấp</option>
        <option value="name">Tên A → Z</option>
      </select>
    </div>

    <p class="result-count" data-count aria-live="polite"></p>
    <div class="prod-grid" data-grid>${products.map((p) => productCard(p, site)).join('')}</div>
    <div class="empty-state" data-empty hidden>
      <p>Không có sản phẩm nào trong danh mục này.</p>
      <p style="margin-top:var(--s-3)"><button class="btn btn--ghost" type="button" data-reset>Xem tất cả sản phẩm</button></p>
    </div>
  </div>
</section>`;
}
