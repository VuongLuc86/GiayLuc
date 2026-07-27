/**
 * Bộ sinh ảnh minh hoạ giày dạng SVG.
 *
 * MỤC ĐÍCH: để website chạy được ngay khi chưa có ảnh chụp thật.
 * KHI CÓ ẢNH THẬT: bỏ ảnh .webp/.jpg vào src/assets/img/ theo tên
 * <slug>-1.webp, <slug>-2.webp, <slug>-3.webp — build.js sẽ tự ưu tiên
 * dùng ảnh thật và bỏ qua ảnh SVG này.
 */

/* ---------- Tiện ích màu ---------- */
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
function shade(hex, amount) {
  const rgb = hexToRgb(hex);
  return rgbToHex(rgb.map((v) => (amount < 0 ? v * (1 + amount) : v + (255 - v) * amount)));
}

/* ---------- Đường viền thân giày theo từng nhóm ---------- */
function upperPath(category) {
  switch (category) {
    case 'giay-boot':
      // cổ cao qua mắt cá
      return 'M48,192 C42,150 44,120 58,96 L64,52 C64,44 72,38 84,38 L150,38 C162,38 168,46 168,58 L166,104 C204,110 240,120 274,136 C310,152 338,168 352,180 C358,186 358,190 352,192 Z';
    case 'sneaker-da':
      // dáng thấp, mũi tù hơn
      return 'M50,190 C44,158 48,134 66,122 L108,112 C132,104 152,102 168,106 C206,114 244,126 280,142 C314,157 340,172 352,182 C358,187 357,190 350,190 Z';
    case 'sandal-da':
      // chỉ có quai, thân để trống
      return 'M96,188 C112,150 140,132 176,132 C214,132 246,146 276,166 L300,182 C304,186 302,190 296,190 L104,190 C98,190 94,190 96,188 Z';
    default:
      // giày tây / giày lười — dáng thấp cổ điển
      return 'M48,192 C44,160 46,138 62,126 C78,114 96,108 118,106 C138,104 152,102 164,104 C202,110 238,120 272,134 C308,149 336,166 352,180 C358,186 358,190 352,192 Z';
  }
}

function soleShape(category) {
  if (category === 'sneaker-da') {
    return { top: 182, bottom: 212, radius: 12, heelBlock: false, white: true };
  }
  if (category === 'giay-boot') {
    return { top: 192, bottom: 216, radius: 6, heelBlock: true, white: false };
  }
  if (category === 'sandal-da') {
    return { top: 188, bottom: 208, radius: 10, heelBlock: false, white: false };
  }
  return { top: 192, bottom: 208, radius: 5, heelBlock: true, white: false };
}

/* ---------- Chi tiết đặc trưng ---------- */
function detailsFor(category, c) {
  const line = c.stitch;
  let out = '';

  if (category === 'giay-tay') {
    // mũi giày + dây buộc
    out += `<path d="M262,130 C272,148 280,166 284,186" fill="none" stroke="${line}" stroke-width="2" stroke-dasharray="5 4" stroke-linecap="round" opacity=".85"/>`;
    out += `<path d="M150,110 C176,116 200,124 222,134" fill="none" stroke="${line}" stroke-width="2" stroke-dasharray="5 4" stroke-linecap="round" opacity=".7"/>`;
    for (let i = 0; i < 3; i++) {
      const x = 168 + i * 22, y = 112 + i * 5;
      out += `<line x1="${x}" y1="${y}" x2="${x + 16}" y2="${y + 13}" stroke="${c.lace}" stroke-width="3" stroke-linecap="round"/>`;
      out += `<line x1="${x + 16}" y1="${y}" x2="${x}" y2="${y + 13}" stroke="${c.lace}" stroke-width="3" stroke-linecap="round"/>`;
    }
  }

  if (category === 'giay-luoi') {
    // quai ngang + khoá
    out += `<path d="M156,110 C182,114 206,122 228,132 L222,150 C200,140 178,132 154,128 Z" fill="${c.strap}" stroke="${line}" stroke-width="1.5"/>`;
    out += `<rect x="182" y="119" width="22" height="11" rx="3" fill="${c.metal}" stroke="${shade(c.metal, -0.3)}" stroke-width="1"/>`;
    out += `<path d="M258,128 C270,146 278,166 282,184" fill="none" stroke="${line}" stroke-width="2" stroke-dasharray="5 4" stroke-linecap="round" opacity=".8"/>`;
  }

  if (category === 'giay-boot') {
    // chun hai bên + quai kéo
    out += `<path d="M76,58 L76,116 C86,110 98,106 112,104 L112,44 L84,44 C79,44 76,48 76,58 Z" fill="${c.elastic}" opacity=".92"/>`;
    out += `<path d="M150,40 L164,40 L164,60 L150,60 Z" fill="${c.strap}" stroke="${line}" stroke-width="1.5"/>`;
    out += `<path d="M262,132 C274,150 282,168 286,186" fill="none" stroke="${line}" stroke-width="2" stroke-dasharray="5 4" stroke-linecap="round" opacity=".85"/>`;
  }

  if (category === 'sneaker-da') {
    // panel gót + lỗ xỏ dây
    out += `<path d="M70,124 C82,116 96,112 112,110 L118,152 C102,152 86,156 74,162 Z" fill="${c.strap}" opacity=".9"/>`;
    for (let i = 0; i < 4; i++) {
      out += `<circle cx="${172 + i * 26}" cy="${116 + i * 7}" r="3.2" fill="${c.metal}"/>`;
    }
    out += `<path d="M168,112 C204,120 242,132 278,148" fill="none" stroke="${c.lace}" stroke-width="3" stroke-linecap="round" opacity=".9"/>`;
  }

  if (category === 'sandal-da') {
    // các quai da
    out += `<path d="M124,178 C140,146 168,130 200,134 L208,150 C182,148 158,162 144,182 Z" fill="${c.strap}" stroke="${line}" stroke-width="1.5"/>`;
    out += `<path d="M212,140 C238,148 262,162 282,180 L272,190 C254,174 232,162 208,156 Z" fill="${c.strap}" stroke="${line}" stroke-width="1.5"/>`;
    out += `<rect x="196" y="138" width="20" height="12" rx="3" fill="${c.metal}"/>`;
  }

  return out;
}

/* ---------- Vẽ 1 chiếc giày ---------- */
function shoeGroup(category, hex, id) {
  const light = shade(hex, 0.22);
  const c = {
    base: hex,
    light,
    dark: shade(hex, -0.3),
    sole: shade(hex, -0.55),
    stitch: shade(hex, 0.45),
    strap: shade(hex, -0.18),
    lace: shade(hex, -0.45),
    metal: '#C4A265',
    elastic: shade(hex, -0.4),
  };
  const s = soleShape(category);
  const soleFill = s.white ? '#F2EFEA' : c.sole;

  let g = '';
  // bóng đổ
  g += `<ellipse cx="200" cy="${s.bottom + 8}" rx="150" ry="9" fill="#1C1917" opacity=".10"/>`;
  // đế
  g += `<rect x="40" y="${s.top}" width="322" height="${s.bottom - s.top}" rx="${s.radius}" fill="${soleFill}"/>`;
  if (s.heelBlock) {
    g += `<rect x="44" y="${s.top}" width="66" height="${s.bottom - s.top + 8}" rx="4" fill="${shade(soleFill, -0.15)}"/>`;
  }
  if (s.white) {
    g += `<line x1="46" y1="${s.top + 11}" x2="356" y2="${s.top + 11}" stroke="#D9D3CA" stroke-width="2"/>`;
  }
  // thân giày
  g += `<path d="${upperPath(category)}" fill="url(#grad-${id})" stroke="${c.dark}" stroke-width="2" stroke-linejoin="round"/>`;
  // chi tiết
  g += detailsFor(category, c);
  // ánh sáng mềm trên mũi giày
  g += `<path d="${upperPath(category)}" fill="url(#gloss-${id})" opacity=".5"/>`;
  return { g, c };
}

/**
 * Sinh ảnh SVG.
 * @param {'side'|'pair'|'sole'} view
 */
export function shoeSvg({ category = 'giay-tay', color = '#7A4A2B', view = 'side', label = '' } = {}) {
  const id = Math.random().toString(36).slice(2, 8);
  const { g, c } = shoeGroup(category, color, id);
  const bg = '#F5F3F0';

  const defs = `<defs>
    <linearGradient id="grad-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c.light}"/>
      <stop offset="55%" stop-color="${c.base}"/>
      <stop offset="100%" stop-color="${c.dark}"/>
    </linearGradient>
    <linearGradient id="gloss-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".38"/>
      <stop offset="45%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="bg-${id}" cx="50%" cy="38%" r="72%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="${bg}"/>
    </radialGradient>
  </defs>`;

  let body;
  if (view === 'pair') {
    body = `<g transform="translate(28,-6) scale(.82)" opacity=".45">${g}</g><g transform="translate(-10,34) scale(.92)">${g}</g>`;
  } else if (view === 'sole') {
    const soleCol = category === 'sneaker-da' ? '#E8E4DE' : shade(color, -0.5);
    let tread = '';
    for (let i = 0; i < 9; i++) {
      tread += `<rect x="${132 + i * 16}" y="${86 + Math.abs(4 - i) * 3}" width="9" height="${128 - Math.abs(4 - i) * 6}" rx="4" fill="${shade(soleCol, -0.18)}" opacity=".8"/>`;
    }
    body = `<ellipse cx="200" cy="150" rx="132" ry="86" fill="${soleCol}"/>
      <ellipse cx="200" cy="150" rx="122" ry="77" fill="${shade(soleCol, 0.1)}"/>${tread}
      <ellipse cx="200" cy="150" rx="132" ry="86" fill="none" stroke="${shade(soleCol, -0.3)}" stroke-width="2"/>`;
  } else {
    body = `<g transform="translate(0,18)">${g}</g>`;
  }

  const title = label ? `<title>${label}</title>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" role="img" aria-label="${label || 'Ảnh minh hoạ sản phẩm'}">${title}${defs}<rect width="400" height="300" fill="url(#bg-${id})"/>${body}</svg>`;
}

/** Ảnh nền lớn cho khu vực hero */
export function heroSvg() {
  const a = shoeSvg({ category: 'giay-tay', color: '#7A4A2B', view: 'pair', label: 'Giày da nam Vương Lực' });
  return a;
}

export { shade };
