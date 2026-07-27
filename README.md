# Vương Lực — Website bán giày da nam

Website tĩnh được tạo bằng Node.js. Không dùng thư viện ngoài, **không cần `npm install`**, chỉ cần Node.js 18 trở lên.

Chạy `node build.js` → sinh ra thư mục `dist/` → copy toàn bộ nội dung `dist/` lên `public_html` của Hostinger là web chạy.

---

## 1. Chạy thử trên máy

```bash
node scripts/dev-server.js
```

Mở trình duyệt vào `http://localhost:3000`. Sửa file rồi tải lại trang (F5) là thấy thay đổi ngay.

Nếu chưa có Node.js: tải bản LTS tại <https://nodejs.org> và cài như phần mềm bình thường.

---

## 2. Sửa nội dung — chỉ cần 2 file

### `data/site.json` — thông tin cửa hàng

Mở bằng Notepad, VS Code hoặc bất kỳ trình soạn thảo nào. **Việc đầu tiên phải làm** là thay các giá trị ví dụ:

| Cần sửa | Ở đâu |
|---|---|
| Số điện thoại | `contact.hotline` (dạng đẹp: `0912 345 678`) và `contact.hotlineRaw` (chỉ số: `0912345678`) |
| Zalo | `contact.zalo` — số điện thoại đăng ký Zalo |
| Địa chỉ cửa hàng | `contact.address` |
| Email | `contact.email` |
| Tên miền thật | `url` — dùng cho sitemap và SEO |
| Phí ship, mốc miễn phí ship | `order.shippingFee`, `order.freeShippingFrom` |

### `data/products.json` — danh sách sản phẩm

Mỗi sản phẩm là một khối trong dấu `{ }`, cách nhau bằng dấu phẩy. Thêm giày mới = copy một khối rồi sửa.

```json
{
  "slug": "oxford-co-dien-vl01",
  "name": "Giày tây Oxford cổ điển VL01",
  "category": "giay-tay",
  "price": 890000,
  "oldPrice": 1150000,
  "badge": "Bán chạy",
  "featured": true,
  "colors": [{ "name": "Nâu đất", "hex": "#7A4A2B" }],
  "sizes": [38, 39, 40, 41, 42, 43],
  "short": "Một câu mô tả ngắn hiện dưới tên sản phẩm.",
  "details": ["Gạch đầu dòng 1", "Gạch đầu dòng 2"],
  "care": "Hướng dẫn bảo quản."
}
```

Giải thích các trường:

- **`slug`** — tên đường dẫn, chỉ dùng chữ thường không dấu và dấu gạch ngang. Đây cũng là tên file ảnh. **Không được trùng nhau.**
- **`category`** — phải khớp một `slug` trong danh sách `categories` của `data/site.json`.
- **`price`** — giá bán, viết số liền không dấu chấm: `890000`.
- **`oldPrice`** — giá gốc để hiện gạch ngang và tính % giảm. Không giảm giá thì ghi `null`.
- **`badge`** — nhãn góc ảnh (`"Bán chạy"`, `"Mới"`, `"Cao cấp"`). Để `""` nếu không cần. Khi có `oldPrice`, nhãn `-xx%` sẽ tự thay thế badge này.
- **`featured`** — `true` thì hiện ở mục "Nổi bật" trang chủ.
- **`colors`** — `hex` là mã màu, cũng là màu của ảnh minh hoạ tự sinh.

Sửa xong chạy `node build.js`. Nếu gõ sai (thiếu dấu phẩy, sai tên danh mục, `oldPrice` nhỏ hơn `price`...), build sẽ **dừng lại và nói rõ sai ở sản phẩm nào** thay vì tạo ra web lỗi.

---

## 3. Thay ảnh minh hoạ bằng ảnh chụp thật

Hiện web đang dùng ảnh SVG vẽ tự động để có cái nhìn ngay. Khi có ảnh chụp thật:

1. Đặt tên ảnh theo `slug` của sản phẩm, đuôi `.webp` (nhẹ nhất) hoặc `.jpg`:
   - `oxford-co-dien-vl01-1.webp` — ảnh chính, hiện ở danh sách
   - `oxford-co-dien-vl01-2.webp` — ảnh thứ hai
   - `oxford-co-dien-vl01-3.webp` — ảnh thứ ba
2. Bỏ vào thư mục `src/assets/img/`.
3. Sửa đuôi file trong `src/lib/ui.js` và `src/pages/product.js` từ `.svg` sang `.webp` (dùng chức năng Tìm & Thay thế, tìm `-1.svg` → `-1.webp`, tương tự `-2` và `-3`).
4. Chạy lại `node build.js`.

Khuyến nghị về ảnh: kích thước vuông 1200×1200px, nền sáng trơn, dung lượng dưới 200KB mỗi ảnh. Ảnh nặng làm web tải chậm và tụt hạng Google.

---

## 4. Nhận đơn hàng

Có 2 cách, chọn 1.

### Cách A — qua Zalo (mặc định, không cần cấu hình gì)

Để trống `order.endpoint` trong `data/site.json`. Khi khách bấm Đặt hàng, nội dung đơn được sao chép sẵn và cửa sổ Zalo của bạn mở ra để khách dán vào gửi.

Ưu: chạy được ngay. Nhược: phụ thuộc khách có chịu dán và gửi hay không.

### Cách B — tự động vào Google Sheet (khuyến nghị)

Làm theo hướng dẫn ghi trong file `scripts/nhan-don-hang.gs`. Mất khoảng 5 phút, sau đó mọi đơn hàng tự động chảy vào một bảng tính Google, kèm email báo nếu bạn muốn.

Xong thì dán link nhận được vào `order.endpoint` trong `data/site.json` và build lại.

---

## 5. Đưa lên GitHub

Lần đầu:

```bash
cd đường-dẫn-tới-thư-mục-này
git init
git add .
git commit -m "Khởi tạo website Vương Lực"
git branch -M main
git remote add origin https://github.com/TEN-CUA-BAN/vuong-luc-shoes.git
git push -u origin main
```

Tạo repo trống trên GitHub trước (không tích "Add a README file"), rồi thay `TEN-CUA-BAN` bằng tên tài khoản GitHub của bạn.

Các lần sau, mỗi khi sửa nội dung:

```bash
git add .
git commit -m "Thêm 3 mẫu giày mới"
git push
```

---

## 6. Đưa lên Hostinger

### Cách A — tải lên thủ công (đơn giản nhất, làm được ngay)

1. Chạy `node build.js` trên máy.
2. Đăng nhập hPanel Hostinger → **Files** → **File Manager**.
3. Vào thư mục `public_html`, xoá file `default.php` hoặc `index.html` mẫu nếu có.
4. Kéo thả **toàn bộ nội dung bên trong** thư mục `dist/` vào `public_html`.
   Lưu ý: kéo *nội dung bên trong* `dist`, không kéo cả thư mục `dist` vào.
5. Nhớ upload cả file `.htaccess` (File Manager có thể ẩn file bắt đầu bằng dấu chấm — bật "Show hidden files" trong phần cài đặt).

Web tĩnh nên chạy được trên **mọi gói Hostinger**, kể cả gói rẻ nhất. Không cần bật Node.js trên server.

### Cách B — tự động qua GitHub Actions

File `.github/workflows/deploy.yml` đã viết sẵn. Cấu hình một lần:

1. Trong hPanel Hostinger: **Files** → **FTP Accounts**, ghi lại *FTP hostname*, *username*, *password*.
2. Trên GitHub, vào repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**, tạo 3 secret:
   - `FTP_SERVER` — ví dụ `ftp.tenmiencuaban.com`
   - `FTP_USERNAME`
   - `FTP_PASSWORD`
3. Từ đó, mỗi lần `git push` lên nhánh `main`, GitHub tự build và tải lên `public_html`.

Chưa tạo secret thì workflow vẫn chạy build bình thường và bỏ qua bước tải lên, không báo lỗi đỏ.

> **Lưu ý bảo mật:** mật khẩu FTP chỉ nên nằm trong GitHub Secrets. Đừng ghi trực tiếp vào file trong repo.

### Xem thử miễn phí trước khi mua hosting

Bật GitHub Pages (repo → Settings → Pages) và trỏ vào nhánh chứa thư mục `dist`, hoặc kéo thả thư mục `dist` vào <https://app.netlify.com/drop>. Cả hai đều miễn phí và cho link xem ngay.

---

## 7. Cấu trúc thư mục

```
vuong-luc-shoes/
├── data/
│   ├── site.json          ← thông tin cửa hàng (SỬA Ở ĐÂY)
│   └── products.json      ← danh sách sản phẩm (SỬA Ở ĐÂY)
├── src/
│   ├── assets/
│   │   ├── css/style.css  ← toàn bộ giao diện, biến màu nằm ở đầu file
│   │   ├── js/app.js      ← giỏ hàng, bộ lọc, form đặt hàng
│   │   └── img/           ← bỏ ảnh chụp thật vào đây
│   ├── lib/
│   │   ├── ui.js          ← khung trang, header, footer, thẻ sản phẩm
│   │   └── shoe-svg.js    ← bộ vẽ ảnh minh hoạ tự động
│   └── pages/             ← nội dung từng trang
├── scripts/
│   ├── dev-server.js      ← máy chủ xem thử
│   └── nhan-don-hang.gs   ← script Google Sheet nhận đơn
├── .github/workflows/deploy.yml
├── build.js               ← chạy lệnh này để tạo web
└── dist/                  ← kết quả build (không đưa lên git)
```

---

## 8. Đổi màu thương hiệu

Mở `src/assets/css/style.css`, sửa các dòng trong khối `:root` ở đầu file:

```css
--c-accent: #92400E;   /* màu nâu da — nút chính, chữ nhấn */
--c-primary: #1C1917;  /* màu đen trầm — header, footer, nút phụ */
```

Nếu đổi màu, kiểm tra lại độ tương phản chữ trên nền tại <https://webaim.org/resources/contrastchecker/> — cần đạt tối thiểu **4.5:1** để chữ dễ đọc và không bị Google đánh giá thấp.

---

## 9. Những việc nên làm sau khi web chạy

- [ ] Thay hết thông tin ví dụ trong `data/site.json` bằng thông tin thật
- [ ] Chụp và thay ảnh sản phẩm thật
- [ ] Cấu hình nhận đơn qua Google Sheet (mục 4B)
- [ ] Đăng ký Google Search Console và nộp `sitemap.xml`
- [ ] Bật SSL miễn phí trong hPanel Hostinger (SSL → Install)
- [ ] Kiểm tra trên điện thoại thật, không chỉ trên máy tính

---

## Giấy phép

Mã nguồn thuộc quyền sở hữu của chủ website. Font Rubik và Nunito Sans dùng qua Google Fonts, giấy phép SIL Open Font License.
