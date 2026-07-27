import { icon, money, esc } from '../lib/ui.js';

/* ------------------------------ GIỎ HÀNG ------------------------------ */
export function cartPage(site) {
  const c = site.contact;
  return `
<div class="wrap">
  <nav class="breadcrumb" aria-label="Đường dẫn"><ol><li><a href="./">Trang chủ</a></li><li>Giỏ hàng</li></ol></nav>
</div>

<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="section-head"><h1>Giỏ hàng &amp; đặt hàng</h1></div>

    <div data-cart-empty hidden>
      <div class="empty-state">
        <p style="font-size:1.05rem">Giỏ hàng đang trống.</p>
        <p style="margin-top:var(--s-4)"><a class="btn btn--accent" href="san-pham.html">Xem sản phẩm</a></p>
      </div>
    </div>

    <div class="cart-layout" data-cart-layout hidden>
      <div>
        <div class="panel">
          <h2>Sản phẩm đã chọn</h2>
          <div data-cart-items></div>
        </div>

        <div class="panel" style="margin-top:var(--s-5)">
          <h2>Thông tin nhận hàng</h2>
          <div class="alert alert--warn">${icon.truck} Bạn <strong>không phải trả tiền trước</strong>. Shipper giao đến nơi, bạn mở hộp kiểm tra rồi mới thanh toán.</div>

          <form data-order-form novalidate>
            <div class="field-row">
              <div class="field">
                <label for="f-name">Họ và tên <span class="req">*</span></label>
                <input id="f-name" name="name" type="text" autocomplete="name" required>
                <p class="err">Vui lòng nhập họ tên người nhận.</p>
              </div>
              <div class="field">
                <label for="f-phone">Số điện thoại <span class="req">*</span></label>
                <input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required>
                <p class="hint">Shipper sẽ gọi số này trước khi giao.</p>
                <p class="err">Số điện thoại chưa đúng — cần 10 chữ số, bắt đầu bằng 0.</p>
              </div>
            </div>

            <div class="field">
              <label for="f-address">Địa chỉ nhận hàng <span class="req">*</span></label>
              <input id="f-address" name="address" type="text" autocomplete="street-address" required>
              <p class="hint">Ghi rõ số nhà, đường, phường/xã, quận/huyện, tỉnh/thành.</p>
              <p class="err">Vui lòng nhập địa chỉ nhận hàng.</p>
            </div>

            <div class="field">
              <label for="f-note">Ghi chú (không bắt buộc)</label>
              <textarea id="f-note" name="note" placeholder="Ví dụ: giao ngoài giờ hành chính, gọi trước 15 phút..."></textarea>
            </div>

            <div class="alert alert--ok" data-order-ok hidden></div>
            <div class="alert" style="background:#FEF2F2;border:1px solid #FECACA;color:#7F1D1D" data-order-err hidden></div>

            <button class="btn btn--accent btn--lg btn--block" type="submit" data-order-submit>Đặt hàng — thanh toán khi nhận</button>
            <p class="hint" style="text-align:center;margin-top:var(--s-3)">Cần hỗ trợ? Gọi <a href="tel:${esc(c.hotlineRaw)}" style="color:var(--c-accent)">${esc(c.hotline)}</a> hoặc <a href="https://zalo.me/${esc(c.zalo)}" target="_blank" rel="noopener" style="color:var(--c-accent)">nhắn Zalo</a>.</p>
          </form>
        </div>
      </div>

      <aside class="panel" style="position:sticky;top:88px">
        <h2>Tóm tắt đơn</h2>
        <div class="sum-row"><span>Tạm tính</span><strong data-sum-sub>0đ</strong></div>
        <div class="sum-row"><span>Phí vận chuyển</span><strong data-sum-ship>0đ</strong></div>
        <p class="hint" data-sum-shipnote style="margin-top:0"></p>
        <div class="sum-row sum-row--total"><span>Tổng cộng</span><strong data-sum-total>0đ</strong></div>
        <ul class="details-list" style="margin-top:var(--s-4)">
          <li>${icon.check}<span>Kiểm tra hàng trước khi trả tiền</span></li>
          <li>${icon.check}<span>Đổi size miễn phí trong 7 ngày</span></li>
          <li>${icon.check}<span>Bảo hành 12 tháng</span></li>
        </ul>
      </aside>
    </div>
  </div>
</section>`;
}

/* --------------------------- HƯỚNG DẪN SIZE --------------------------- */
const SIZE_ROWS = [
  [38, 24.0, '38 - 38.5', 5],
  [39, 24.7, '39', 6],
  [40, 25.3, '40', 7],
  [41, 26.0, '41', 8],
  [42, 26.7, '42', 9],
  [43, 27.3, '43', 10],
  [44, 28.0, '44', 11],
];

export function sizeGuide(site) {
  return `
<div class="wrap">
  <nav class="breadcrumb" aria-label="Đường dẫn"><ol><li><a href="./">Trang chủ</a></li><li>Hướng dẫn chọn size</li></ol></nav>
</div>

<section class="section" style="padding-top:0">
  <div class="wrap" style="max-width:820px">
    <div class="section-head">
      <h1>Hướng dẫn chọn size</h1>
      <p>Chọn đúng size ngay từ đầu giúp bạn khỏi mất công đổi hàng. Chỉ cần một tờ giấy và cây thước.</p>
    </div>

    <h2 style="margin-bottom:var(--s-4)">Cách đo bàn chân</h2>
    <ul class="details-list" style="margin-bottom:var(--s-6)">
      <li>${icon.check}<span><strong>Đo vào buổi chiều tối.</strong> Bàn chân nở ra sau một ngày đi lại, đo lúc này sẽ sát với lúc bạn mang giày nhất.</span></li>
      <li>${icon.check}<span><strong>Đi tất trước khi đo</strong> — loại tất bạn hay dùng với giày da.</span></li>
      <li>${icon.check}<span><strong>Đặt giấy sát tường</strong>, đứng thẳng, gót chạm tường, dồn đều trọng lượng lên hai chân.</span></li>
      <li>${icon.check}<span><strong>Đánh dấu đầu ngón chân dài nhất</strong> (không phải lúc nào cũng là ngón cái), rồi đo khoảng cách từ mép giấy sát tường đến vạch.</span></li>
      <li>${icon.check}<span><strong>Đo cả hai chân, lấy số lớn hơn.</strong> Hai bàn chân lệch nhau 2-5mm là chuyện bình thường.</span></li>
    </ul>

    <h2 style="margin-bottom:var(--s-4)">Bảng quy đổi size</h2>
    <div class="table-wrap">
      <table>
        <caption class="visually-hidden">Bảng quy đổi chiều dài bàn chân sang size giày</caption>
        <thead><tr><th scope="col">Size Vương Lực</th><th scope="col">Chiều dài bàn chân</th><th scope="col">Size VN thường gặp</th><th scope="col">US</th></tr></thead>
        <tbody>
          ${SIZE_ROWS.map(([s, cm, vn, us]) => `<tr><th scope="row">${s}</th><td>${cm.toFixed(1)} cm</td><td>${vn}</td><td>${us}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    <p class="hint" style="margin-top:var(--s-3)">Bảng trên áp dụng cho giày tây, giày lười và boot. Sandal và dép da nên lấy đúng theo chiều dài bàn chân, không cần cộng thêm.</p>

    <h2 style="margin:var(--s-7) 0 var(--s-4)">Trường hợp hay gặp</h2>
    <details class="acc"><summary>Số đo của tôi nằm giữa hai size thì chọn cái nào?</summary><div class="acc__body">Chọn size lớn hơn. Da sẽ giãn theo bàn chân sau vài lần đi, còn giày chật thì không sửa được. Nếu chênh dưới 2mm, bạn có thể lấy size nhỏ và dùng thêm lót giày mỏng.</div></details>
    <details class="acc"><summary>Bàn chân tôi bè ngang thì sao?</summary><div class="acc__body">Ưu tiên nhóm giày lười và sandal — form rộng rãi hơn. Với giày tây, nên lên nửa size hoặc nhắn Zalo cho chúng tôi kèm số đo chiều rộng bàn chân để được tư vấn mẫu phù hợp.</div></details>
    <details class="acc"><summary>Đi thử rồi mà không vừa thì làm sao?</summary><div class="acc__body">${esc(site.policies.returns)}</div></details>
    <details class="acc"><summary>Giày mới có cần thời gian đi rão không?</summary><div class="acc__body">Giày da thật thường cần 3-7 ngày đầu để mềm và ôm theo bàn chân. Trong tuần đầu nên đi ngắn 2-3 tiếng mỗi ngày. Nếu sau 2 tuần vẫn cấn đau ở cùng một điểm thì đó là do sai size, không phải do chưa rão.</div></details>

    <div class="panel" style="margin-top:var(--s-7);text-align:center">
      <h2 style="font-size:1.15rem;margin-bottom:var(--s-3)">Vẫn chưa chắc chắn?</h2>
      <p style="color:var(--c-fg-muted);margin-bottom:var(--s-4)">Gửi số đo bàn chân qua Zalo, chúng tôi trả lời size nên lấy trong vài phút.</p>
      <a class="btn btn--accent" href="https://zalo.me/${esc(site.contact.zalo)}" target="_blank" rel="noopener">${icon.chat} Nhắn Zalo ${esc(site.contact.hotline)}</a>
    </div>
  </div>
</section>`;
}

/* ------------------------------ CHÍNH SÁCH ------------------------------ */
export function policies(site) {
  const p = site.policies;
  return `
<div class="wrap">
  <nav class="breadcrumb" aria-label="Đường dẫn"><ol><li><a href="./">Trang chủ</a></li><li>Chính sách</li></ol></nav>
</div>

<section class="section" style="padding-top:0">
  <div class="wrap" style="max-width:820px">
    <div class="section-head">
      <h1>Chính sách bán hàng</h1>
      <p>Viết ngắn gọn, không có điều khoản ẩn. Có gì chưa rõ, gọi ${esc(site.contact.hotline)}.</p>
    </div>

    <h2 id="van-chuyen" style="margin-bottom:var(--s-3)">Vận chuyển</h2>
    <p style="color:var(--c-fg-muted);margin-bottom:var(--s-6)">${esc(p.shipping)}</p>

    <h2 id="thanh-toan" style="margin-bottom:var(--s-3)">Thanh toán</h2>
    <p style="color:var(--c-fg-muted);margin-bottom:var(--s-6)">${esc(p.payment)}</p>

    <h2 id="doi-tra" style="margin-bottom:var(--s-3)">Đổi trả</h2>
    <p style="color:var(--c-fg-muted);margin-bottom:var(--s-4)">${esc(p.returns)}</p>
    <ul class="details-list" style="margin-bottom:var(--s-6)">
      <li>${icon.check}<span>Đổi size khác hoặc mẫu khác cùng giá — miễn phí phần chênh nếu mẫu mới rẻ hơn thì hoàn lại tiền thừa.</span></li>
      <li>${icon.check}<span>Lỗi từ nhà sản xuất (lệch đế, rách da, sai mẫu): chúng tôi chịu toàn bộ phí đổi cả hai chiều.</span></li>
      <li>${icon.check}<span>Không nhận đổi giày đã đi ngoài trời, đế bám bẩn, mất hộp hoặc mất phụ kiện đi kèm.</span></li>
    </ul>

    <h2 id="bao-hanh" style="margin-bottom:var(--s-3)">Bảo hành</h2>
    <p style="color:var(--c-fg-muted);margin-bottom:var(--s-4)">${esc(p.warranty)}</p>
    <p style="color:var(--c-fg-muted);margin-bottom:var(--s-6)">Cách bảo hành: chụp ảnh chỗ hỏng gửi qua Zalo, chúng tôi xác nhận và hướng dẫn gửi giày về. Thời gian xử lý 3-7 ngày làm việc kể từ khi nhận được hàng.</p>

    <h2 id="bao-mat" style="margin-bottom:var(--s-3)">Bảo mật thông tin</h2>
    <p style="color:var(--c-fg-muted)">Chúng tôi chỉ dùng tên, số điện thoại và địa chỉ của bạn để giao hàng và liên hệ về đơn hàng đó. Không bán, không chia sẻ cho bên thứ ba ngoài đơn vị vận chuyển. Bạn có thể yêu cầu xoá thông tin bất cứ lúc nào bằng cách gọi ${esc(site.contact.hotline)}.</p>
  </div>
</section>`;
}

/* ------------------------------- LIÊN HỆ ------------------------------- */
export function contact(site) {
  const c = site.contact;
  return `
<div class="wrap">
  <nav class="breadcrumb" aria-label="Đường dẫn"><ol><li><a href="./">Trang chủ</a></li><li>Liên hệ</li></ol></nav>
</div>

<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="section-head">
      <h1>Liên hệ ${esc(site.brand)}</h1>
      <p>Cách nhanh nhất là nhắn Zalo — thường trả lời trong 5-10 phút giờ hành chính.</p>
    </div>

    <div class="cat-grid">
      <a class="cat-card" href="https://zalo.me/${esc(c.zalo)}" target="_blank" rel="noopener">
        <div class="cat-card__body">
          <div class="usp__icon">${icon.chat}</div>
          <h3>Zalo</h3><p>${esc(c.hotline)}</p>
          <span class="cat-card__more">Nhắn ngay ${icon.arrow}</span>
        </div>
      </a>
      <a class="cat-card" href="tel:${esc(c.hotlineRaw)}">
        <div class="cat-card__body">
          <div class="usp__icon">${icon.phone}</div>
          <h3>Điện thoại</h3><p>${esc(c.hotline)}</p>
          <span class="cat-card__more">Gọi ${icon.arrow}</span>
        </div>
      </a>
      <a class="cat-card" href="mailto:${esc(c.email)}">
        <div class="cat-card__body">
          <div class="usp__icon">${icon.mail}</div>
          <h3>Email</h3><p>${esc(c.email)}</p>
          <span class="cat-card__more">Gửi thư ${icon.arrow}</span>
        </div>
      </a>
    </div>

    <div class="panel" style="margin-top:var(--s-6)">
      <h2>Cửa hàng</h2>
      <ul class="details-list">
        <li>${icon.location}<span>${esc(c.address)}</span></li>
        <li>${icon.clock}<span>${esc(c.workingHours)}</span></li>
      </ul>
      <p class="hint" style="margin-top:var(--s-4)">Bạn có thể đến trực tiếp để thử giày. Nếu muốn thử nhiều mẫu, nhắn trước để chúng tôi chuẩn bị sẵn đúng size.</p>
    </div>

    <div class="panel" style="margin-top:var(--s-5)">
      <h2>Về ${esc(site.brand)}</h2>
      <p style="color:var(--c-fg-muted);margin-bottom:var(--s-4)">${esc(site.description)}</p>
      <p style="color:var(--c-fg-muted)">Chúng tôi làm giày da nam ở phân khúc bình dân đến trung cấp — nghĩa là dùng da thật và đế khâu, nhưng giữ giá ở mức người đi làm mua được mỗi năm một đôi. Không quảng cáo quá lời: giày da đúng giá này sẽ đẹp và bền trong 2-4 năm nếu bảo quản đúng cách, không phải hàng gia truyền dùng chục năm.</p>
    </div>
  </div>
</section>`;
}

/* --------------------------------- 404 --------------------------------- */
export function notFound(site) {
  return `
<section class="section">
  <div class="wrap">
    <div class="empty-state" style="padding-block:var(--s-9)">
      <p class="eyebrow">Lỗi 404</p>
      <h1 style="margin-bottom:var(--s-4)">Không tìm thấy trang này</h1>
      <p style="margin-bottom:var(--s-5)">Có thể đường dẫn đã thay đổi hoặc sản phẩm đã ngừng bán.</p>
      <div style="display:flex;gap:var(--s-3);justify-content:center;flex-wrap:wrap">
        <a class="btn btn--accent" href="/">Về trang chủ</a>
        <a class="btn btn--ghost" href="/san-pham.html">Xem sản phẩm</a>
      </div>
    </div>
  </div>
</section>`;
}
