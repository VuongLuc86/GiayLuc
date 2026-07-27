import { icon, money, esc, productCard } from '../lib/ui.js';

export function home(site, products) {
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const c = site.contact;

  return `
<section class="hero">
  <div class="wrap hero__grid">
    <div>
      <p class="eyebrow">Giày da nam · Hải Phòng</p>
      <h1>Giày da thật, giá thật.<br>Đi cả ngày không mỏi chân.</h1>
      <p class="hero__lead">${esc(site.description)}</p>
      <div class="hero__cta">
        <a class="btn btn--accent btn--lg" href="san-pham.html">Xem toàn bộ sản phẩm</a>
        <a class="btn btn--ghost btn--lg" href="huong-dan-chon-size.html">${icon.ruler} Cách chọn size</a>
      </div>
      <div class="hero__proof">
        <span>${icon.check} Bảo hành 12 tháng</span>
        <span>${icon.check} Đổi size 7 ngày</span>
        <span>${icon.check} Kiểm tra hàng rồi mới trả tiền</span>
      </div>
    </div>
    <div class="hero__media">
      <img src="assets/img/hero.svg" width="400" height="300" alt="Giày da nam Vương Lực" fetchpriority="high" decoding="async">
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="usp-grid">
      ${site.usp
        .map(
          (u) => `<div class="usp reveal">
        <div class="usp__icon">${icon[u.icon] || icon.check}</div>
        <h3>${esc(u.title)}</h3>
        <p>${esc(u.text)}</p>
      </div>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Danh mục</p>
      <h2>Chọn theo kiểu giày bạn cần</h2>
      <p>Mỗi nhóm phục vụ một hoàn cảnh khác nhau. Không chắc nên chọn gì, gọi ${esc(c.hotline)} để được tư vấn.</p>
    </div>
    <div class="cat-grid">
      ${site.categories
        .map(
          (cat) => `<a class="cat-card reveal" href="san-pham.html?danh-muc=${cat.slug}">
        <div class="cat-card__media"><img src="assets/img/cat-${cat.slug}.svg" width="400" height="300" loading="lazy" decoding="async" alt="${esc(cat.name)}"></div>
        <div class="cat-card__body">
          <h3>${esc(cat.name)}</h3>
          <p>${esc(cat.desc)}</p>
          <span class="cat-card__more">Xem mẫu ${icon.arrow}</span>
        </div>
      </a>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Nổi bật</p>
      <h2>Mẫu khách hỏi nhiều nhất</h2>
    </div>
    <div class="prod-grid">${featured.map((p) => productCard(p, site)).join('')}</div>
    <div style="margin-top:var(--s-6);text-align:center">
      <a class="btn btn--primary btn--lg" href="san-pham.html">Xem tất cả ${products.length} sản phẩm</a>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Mua hàng thế nào</p>
      <h2>Ba bước, không cần tài khoản</h2>
    </div>
    <div class="usp-grid">
      <div class="usp reveal"><div class="usp__icon">${icon.ruler}</div><h3>1. Chọn size</h3><p>Đo chiều dài bàn chân rồi đối chiếu bảng size. Phân vân giữa hai số thì nhắn Zalo, chúng tôi tư vấn theo dáng chân.</p></div>
      <div class="usp reveal"><div class="usp__icon">${icon.cart}</div><h3>2. Đặt hàng</h3><p>Thêm vào giỏ, điền tên — số điện thoại — địa chỉ. Không cần đăng ký tài khoản, không cần thanh toán trước.</p></div>
      <div class="usp reveal"><div class="usp__icon">${icon.truck}</div><h3>3. Nhận và thử</h3><p>Shipper giao tận nơi, bạn mở hộp kiểm tra rồi mới trả tiền. Không vừa chân thì đổi size trong 7 ngày.</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="panel" style="text-align:center;padding:var(--s-7) var(--s-5)">
      <h2 style="margin-bottom:var(--s-3)">Chưa biết chọn mẫu nào?</h2>
      <p style="color:var(--c-fg-muted);max-width:52ch;margin:0 auto var(--s-5)">Nhắn cho chúng tôi hoàn cảnh sử dụng (đi làm, đi cưới, đi chơi) và số đo bàn chân — chúng tôi gợi ý 2-3 mẫu phù hợp, không chào mời thêm.</p>
      <div style="display:flex;gap:var(--s-3);justify-content:center;flex-wrap:wrap">
        <a class="btn btn--accent btn--lg" href="https://zalo.me/${esc(c.zalo)}" target="_blank" rel="noopener">${icon.chat} Nhắn Zalo</a>
        <a class="btn btn--ghost btn--lg" href="tel:${esc(c.hotlineRaw)}">${icon.phone} ${esc(c.hotline)}</a>
      </div>
    </div>
  </div>
</section>`;
}
