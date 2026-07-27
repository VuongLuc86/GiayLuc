/* =========================================================================
   Vương Lực — Javascript phía trình duyệt
   Không phụ thuộc thư viện ngoài. Chạy được trên mọi hosting tĩnh.
   ========================================================================= */
(function () {
  'use strict';

  var CART_KEY = 'vl_cart_v1';
  var SHIP_FEE = Number(document.documentElement.dataset.shipFee || 30000);
  var FREE_FROM = Number(document.documentElement.dataset.freeFrom || 500000);
  var ORDER_ENDPOINT = document.documentElement.dataset.orderEndpoint || '';
  var ZALO = document.documentElement.dataset.zalo || '';

  /* ------------------------------ Tiện ích ------------------------------ */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function money(n) { return new Intl.NumberFormat('vi-VN').format(Math.round(n)) + 'đ'; }
  function escHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  /* -------------------------------- Giỏ -------------------------------- */
  function readCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function writeCart(items) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) {}
    paintCount();
  }
  function cartKeyOf(i) { return i.slug + '|' + i.size + '|' + i.color; }
  function addToCart(item) {
    var items = readCart();
    var hit = null;
    for (var i = 0; i < items.length; i++) if (cartKeyOf(items[i]) === cartKeyOf(item)) hit = items[i];
    if (hit) hit.qty = Math.min(20, hit.qty + item.qty);
    else items.push(item);
    writeCart(items);
  }
  function cartSubtotal(items) {
    return items.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
  }
  function paintCount() {
    var n = readCart().reduce(function (s, i) { return s + i.qty; }, 0);
    $$('[data-cart-count]').forEach(function (el) {
      el.textContent = n > 99 ? '99+' : String(n);
      if (n > 0) el.removeAttribute('hidden'); else el.setAttribute('hidden', '');
    });
  }

  /* ------------------------------- Toast ------------------------------- */
  var toastTimer;
  function toast(msg) {
    var t = $('[data-toast]');
    if (!t) return;
    $('[data-toast-text]', t).textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-on'); }, 3200);
  }

  /* ----------------------------- Menu mobile ---------------------------- */
  function initNav() {
    var btn = $('.nav-toggle'), nav = $('#mobile-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    });
  }

  /* -------------------- Hiệu ứng xuất hiện khi cuộn -------------------- */
  function initReveal() {
    var els = $$('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add('is-in'); }, (i % 8) * 60);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* --------------------- Trang danh sách sản phẩm --------------------- */
  function initCatalog() {
    var grid = $('[data-grid]');
    if (!grid) return;
    var cards = $$('.prod', grid);
    var chips = $$('[data-filter]');
    var sortSel = $('[data-sort]');
    var countEl = $('[data-count]');
    var emptyEl = $('[data-empty]');
    var active = 'all';

    function apply() {
      var shown = 0;
      cards.forEach(function (c) {
        var ok = active === 'all' || c.dataset.cat === active;
        c.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      if (countEl) countEl.textContent = shown + ' sản phẩm';
      if (emptyEl) { if (shown === 0) emptyEl.removeAttribute('hidden'); else emptyEl.setAttribute('hidden', ''); }
      grid.style.display = shown === 0 ? 'none' : '';
    }

    function sortBy(mode) {
      var arr = cards.slice();
      if (mode === 'price-asc') arr.sort(function (a, b) { return a.dataset.price - b.dataset.price; });
      else if (mode === 'price-desc') arr.sort(function (a, b) { return b.dataset.price - a.dataset.price; });
      else if (mode === 'name') arr.sort(function (a, b) { return a.dataset.name.localeCompare(b.dataset.name, 'vi'); });
      arr.forEach(function (c) { grid.appendChild(c); });
    }

    function setFilter(slug, push) {
      active = slug;
      chips.forEach(function (ch) { ch.setAttribute('aria-pressed', String(ch.dataset.filter === slug)); });
      apply();
      if (push) {
        var url = slug === 'all' ? location.pathname : location.pathname + '?danh-muc=' + slug;
        history.replaceState(null, '', url);
      }
    }

    chips.forEach(function (ch) {
      ch.addEventListener('click', function () { setFilter(ch.dataset.filter, true); });
    });
    if (sortSel) sortSel.addEventListener('change', function () { sortBy(sortSel.value); apply(); });
    var reset = $('[data-reset]');
    if (reset) reset.addEventListener('click', function () { setFilter('all', true); });

    var q = new URLSearchParams(location.search).get('danh-muc');
    setFilter(q && chips.some(function (c) { return c.dataset.filter === q; }) ? q : 'all', false);
  }

  /* ----------------------- Trang chi tiết sản phẩm ---------------------- */
  function initPdp() {
    var root = $('[data-pdp]');
    if (!root) return;

    var chosenSize = null;
    var chosenColor = $('[data-color]', root) ? $('[data-color]', root).dataset.color : '';
    var qtyInput = $('[data-qty-input]', root);
    var mainImg = $('[data-main-img]', root);

    $$('[data-thumb]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-thumb]', root).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        if (mainImg) mainImg.src = b.dataset.thumb;
      });
    });

    $$('[data-color]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-color]', root).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        chosenColor = b.dataset.color;
        var lbl = $('[data-color-label]', root);
        if (lbl) lbl.textContent = chosenColor;
        if (mainImg && b.dataset.colorImg) {
          mainImg.src = b.dataset.colorImg;
          mainImg.alt = root.dataset.name + ' — màu ' + chosenColor;
          $$('[data-thumb]', root).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        }
      });
    });

    $$('[data-size]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-size]', root).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        chosenSize = b.dataset.size;
        var hint = b.closest('.opt').querySelector('.hint');
        if (hint) { hint.textContent = 'Đã chọn size ' + chosenSize + '.'; hint.style.color = 'var(--c-success)'; }
      });
    });

    $$('[data-qty]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var v = parseInt(qtyInput.value, 10) || 1;
        qtyInput.value = Math.max(1, Math.min(20, v + parseInt(b.dataset.qty, 10)));
      });
    });

    var addBtn = $('[data-add-cart]', root);
    if (addBtn) addBtn.addEventListener('click', function () {
      if (!chosenSize) {
        var opt = $$('.opt', root)[1];
        var hint = opt ? opt.querySelector('.hint') : null;
        if (hint) { hint.textContent = 'Bạn chưa chọn size. Hãy chọn một size ở trên.'; hint.style.color = 'var(--c-sale)'; }
        if (opt) { opt.scrollIntoView({ block: 'center', behavior: 'smooth' }); var f = opt.querySelector('[data-size]'); if (f) f.focus(); }
        return;
      }
      addToCart({
        slug: root.dataset.slug,
        name: root.dataset.name,
        price: Number(root.dataset.price),
        size: chosenSize,
        color: chosenColor,
        qty: Math.max(1, Math.min(20, parseInt(qtyInput.value, 10) || 1)),
        img: mainImg ? mainImg.getAttribute('src').replace('../', '') : '',
      });
      toast('Đã thêm vào giỏ — size ' + chosenSize + ', màu ' + chosenColor);
    });
  }

  /* --------------------------- Trang giỏ hàng --------------------------- */
  function initCartPage() {
    var wrapItems = $('[data-cart-items]');
    if (!wrapItems) return;

    var layout = $('[data-cart-layout]');
    var emptyBox = $('[data-cart-empty]');

    function render() {
      var items = readCart();
      if (!items.length) {
        layout.setAttribute('hidden', '');
        emptyBox.removeAttribute('hidden');
        return;
      }
      emptyBox.setAttribute('hidden', '');
      layout.removeAttribute('hidden');

      wrapItems.innerHTML = items
        .map(function (i, idx) {
          return (
            '<div class="cart-item">' +
            '<div class="cart-item__media"><img src="' + escHtml(i.img || 'assets/img/favicon.svg') + '" width="88" height="88" loading="lazy" alt=""></div>' +
            '<div>' +
            '<div class="cart-item__name"><a href="san-pham/' + escHtml(i.slug) + '.html">' + escHtml(i.name) + '</a></div>' +
            '<div class="cart-item__meta">Size ' + escHtml(i.size) + ' · Màu ' + escHtml(i.color) + '</div>' +
            '<div class="cart-item__meta"><strong>' + money(i.price) + '</strong> / đôi</div>' +
            '<div class="cart-item__foot">' +
            '<div class="qty"><button type="button" data-line="' + idx + '" data-delta="-1" aria-label="Giảm số lượng">−</button>' +
            '<input type="number" value="' + i.qty + '" min="1" max="20" data-line-input="' + idx + '" aria-label="Số lượng ' + escHtml(i.name) + '">' +
            '<button type="button" data-line="' + idx + '" data-delta="1" aria-label="Tăng số lượng">+</button></div>' +
            '<strong>' + money(i.price * i.qty) + '</strong>' +
            '<button class="link-danger" type="button" data-remove="' + idx + '">Xoá</button>' +
            '</div></div></div>'
          );
        })
        .join('');

      var sub = cartSubtotal(items);
      var ship = sub >= FREE_FROM ? 0 : SHIP_FEE;
      $('[data-sum-sub]').textContent = money(sub);
      $('[data-sum-ship]').textContent = ship === 0 ? 'Miễn phí' : money(ship);
      $('[data-sum-total]').textContent = money(sub + ship);
      var note = $('[data-sum-shipnote]');
      note.textContent = ship === 0
        ? 'Đơn của bạn được miễn phí vận chuyển.'
        : 'Mua thêm ' + money(FREE_FROM - sub) + ' để được miễn phí vận chuyển.';

      $$('[data-remove]').forEach(function (b) {
        b.addEventListener('click', function () {
          var items = readCart();
          items.splice(Number(b.dataset.remove), 1);
          writeCart(items);
          render();
          toast('Đã xoá sản phẩm khỏi giỏ');
        });
      });
      $$('[data-line]').forEach(function (b) {
        b.addEventListener('click', function () {
          var items = readCart();
          var it = items[Number(b.dataset.line)];
          it.qty = Math.max(1, Math.min(20, it.qty + Number(b.dataset.delta)));
          writeCart(items);
          render();
        });
      });
      $$('[data-line-input]').forEach(function (inp) {
        inp.addEventListener('change', function () {
          var items = readCart();
          items[Number(inp.dataset.lineInput)].qty = Math.max(1, Math.min(20, parseInt(inp.value, 10) || 1));
          writeCart(items);
          render();
        });
      });
    }

    render();
    initOrderForm(render);
  }

  /* ------------------------- Form đặt hàng COD ------------------------- */
  function initOrderForm(rerender) {
    var form = $('[data-order-form]');
    if (!form) return;
    var okBox = $('[data-order-ok]'), errBox = $('[data-order-err]');
    var submitBtn = $('[data-order-submit]');

    function setInvalid(input, bad) {
      var f = input.closest('.field');
      if (bad) { f.classList.add('is-invalid'); input.setAttribute('aria-invalid', 'true'); }
      else { f.classList.remove('is-invalid'); input.removeAttribute('aria-invalid'); }
    }

    function validate() {
      var ok = true, first = null;
      var n = form.querySelector('[name=name]');
      var p = form.querySelector('[name=phone]');
      var a = form.querySelector('[name=address]');

      var badName = n.value.trim().length < 2;
      setInvalid(n, badName); if (badName) { ok = false; first = first || n; }

      var digits = p.value.replace(/\D/g, '');
      var badPhone = !(digits.length === 10 && digits[0] === '0');
      setInvalid(p, badPhone); if (badPhone) { ok = false; first = first || p; }

      var badAddr = a.value.trim().length < 8;
      setInvalid(a, badAddr); if (badAddr) { ok = false; first = first || a; }

      if (first) first.focus();
      return ok;
    }

    // kiểm tra lại ngay khi người dùng sửa, thay vì chỉ báo lỗi lúc bấm gửi
    $$('input, textarea', form).forEach(function (el) {
      el.addEventListener('blur', function () { if (el.closest('.field').classList.contains('is-invalid')) validate(); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      okBox.setAttribute('hidden', ''); errBox.setAttribute('hidden', '');
      if (!validate()) return;

      var items = readCart();
      if (!items.length) { errBox.textContent = 'Giỏ hàng đang trống.'; errBox.removeAttribute('hidden'); return; }

      var sub = cartSubtotal(items);
      var ship = sub >= FREE_FROM ? 0 : SHIP_FEE;
      var order = {
        thoiGian: new Date().toLocaleString('vi-VN'),
        hoTen: form.querySelector('[name=name]').value.trim(),
        dienThoai: form.querySelector('[name=phone]').value.trim(),
        diaChi: form.querySelector('[name=address]').value.trim(),
        ghiChu: form.querySelector('[name=note]').value.trim(),
        sanPham: items.map(function (i) { return i.name + ' | size ' + i.size + ' | ' + i.color + ' | SL ' + i.qty + ' | ' + money(i.price * i.qty); }).join('\n'),
        tamTinh: sub, phiShip: ship, tongCong: sub + ship,
      };

      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang gửi đơn...';

      function done(msg) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Đặt hàng — thanh toán khi nhận';
        okBox.innerHTML = msg;
        okBox.removeAttribute('hidden');
        writeCart([]);
        form.reset();
        if (rerender) rerender();
        okBox.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }

      if (ORDER_ENDPOINT) {
        fetch(ORDER_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(order),
        })
          .then(function () {
            done('<strong>Đã nhận đơn hàng.</strong> Chúng tôi sẽ gọi lại số ' + escHtml(order.dienThoai) + ' trong giờ làm việc để xác nhận trước khi giao.');
          })
          .catch(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Đặt hàng — thanh toán khi nhận';
            errBox.innerHTML = 'Không gửi được đơn do lỗi kết nối. Bạn vui lòng <a href="https://zalo.me/' + escHtml(ZALO) + '" target="_blank" rel="noopener">nhắn Zalo</a> hoặc gọi hotline để đặt hàng.';
            errBox.removeAttribute('hidden');
          });
      } else {
        // Chưa cấu hình nơi nhận đơn → mở Zalo kèm sẵn nội dung đơn hàng
        var text =
          'ĐƠN HÀNG MỚI\n' + order.sanPham +
          '\n---\nTổng: ' + money(order.tongCong) +
          '\nHọ tên: ' + order.hoTen +
          '\nĐiện thoại: ' + order.dienThoai +
          '\nĐịa chỉ: ' + order.diaChi +
          (order.ghiChu ? '\nGhi chú: ' + order.ghiChu : '');
        try { navigator.clipboard.writeText(text); } catch (e) {}
        window.open('https://zalo.me/' + ZALO, '_blank', 'noopener');
        done(
          '<strong>Nội dung đơn đã được sao chép.</strong> Cửa sổ Zalo vừa mở — bạn dán (Ctrl+V) và gửi giúp chúng tôi để xác nhận đơn.' +
          '<br><br><textarea readonly style="width:100%;min-height:120px;font-size:.85rem;margin-top:8px">' + escHtml(text) + '</textarea>'
        );
      }
    });
  }

  /* -------------------------------- Khởi tạo -------------------------------- */
  function boot() {
    paintCount();
    initNav();
    initReveal();
    initCatalog();
    initPdp();
    initCartPage();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
