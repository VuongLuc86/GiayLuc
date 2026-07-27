/**
 * Google Apps Script — nhận đơn hàng từ website vào Google Sheet.
 *
 * CÁCH DÙNG (làm 1 lần, khoảng 5 phút):
 *  1. Vào https://sheets.google.com tạo một bảng tính mới, đặt tên "Đơn hàng Vương Lực".
 *  2. Trong bảng tính chọn menu Tiện ích mở rộng > Apps Script.
 *  3. Xoá hết code mẫu, dán toàn bộ nội dung file này vào.
 *  4. Bấm Triển khai (Deploy) > Tuỳ chọn triển khai mới > chọn loại "Ứng dụng web".
 *       - Thực thi với tư cách: Tôi
 *       - Ai có quyền truy cập: Bất kỳ ai
 *  5. Bấm Triển khai, cấp quyền, rồi copy đường link dạng
 *     https://script.google.com/macros/s/AKfy..../exec
 *  6. Dán link đó vào data/site.json, mục order.endpoint, rồi build và deploy lại.
 *
 * Muốn nhận cả email mỗi khi có đơn: điền địa chỉ vào EMAIL_NHAN bên dưới.
 */

var EMAIL_NHAN = ''; // ví dụ: 'lucvv86@gmail.com' — để trống nếu không cần email

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Thời gian', 'Họ tên', 'Điện thoại', 'Địa chỉ', 'Sản phẩm', 'Tạm tính', 'Phí ship', 'Tổng cộng', 'Ghi chú', 'Trạng thái']);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#F5F3F0');
    sheet.setFrozenRows(1);
  }

  var d = JSON.parse(e.postData.contents);

  sheet.appendRow([
    d.thoiGian || new Date(),
    d.hoTen, d.dienThoai, d.diaChi, d.sanPham,
    d.tamTinh, d.phiShip, d.tongCong,
    d.ghiChu || '', 'Mới',
  ]);

  if (EMAIL_NHAN) {
    MailApp.sendEmail({
      to: EMAIL_NHAN,
      subject: 'Đơn hàng mới — ' + d.hoTen + ' — ' + d.tongCong,
      body:
        'Khách: ' + d.hoTen + '\n' +
        'Điện thoại: ' + d.dienThoai + '\n' +
        'Địa chỉ: ' + d.diaChi + '\n\n' +
        d.sanPham + '\n\n' +
        'Tổng cộng: ' + d.tongCong + '\n' +
        (d.ghiChu ? 'Ghi chú: ' + d.ghiChu : ''),
    });
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput('Endpoint nhận đơn hàng đang hoạt động.');
}
