// Спільне для всіх сторінок: шапка, футер, тема, обране, картки, ілюстрації об'єктів, форми, анімації.
(function () {
  const A = window.AGENCY;
  const page = document.body.dataset.page;

  // ---------- утиліти ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (n) => n.toLocaleString('uk-UA').replace(/,/g, ' ') + ' ₴';
  const priceLabel = (p) => money(p.price) + (p.deal === 'rent' ? '<small> / міс</small>' : '');
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* приватний режим */ } },
  };
  const icon = (name, size = 20) => {
    const p = {
      key: '<circle cx="8" cy="15" r="4"/><path d="M10.8 12.2 20 3m-4 4 3 3m-6-1 2 2"/>',
      tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
      calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
      shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
      heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
      phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
      mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
      pin: '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
      clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
      area: '<path d="M3 3h18v18H3z"/><path d="M3 9h6V3M21 15h-6v6"/>',
      bed: '<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8M2 16h20M6 10V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>',
      floor: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/>',
      moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
      menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
      filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',
      arrow: '<path d="M5 12h14M13 5l7 7-7 7"/>',
      send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
      house: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 9.6V20h13V9.6"/><path d="M10 20v-5.5h4V20"/><path d="M16 6.6V4.5h2.2v4"/>',
      palette: '<path d="M12 2a10 10 0 0 0 0 20c1 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7H17a5 5 0 0 0 5-5C22 6 17.5 2 12 2z"/><circle cx="7.5" cy="11.5" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7" r="1"/>',
      check: '<path d="M20 6 9 17l-5-5"/>',
      hammer: '<path d="m15 12-8.4 8.4a2.1 2.1 0 0 1-3-3L12 9"/><path d="M17.6 15 22 10.6M20.9 11.7l-1.3-1.3c-.6-.6-.9-1.3-.9-2.1v-.9L16.5 5.2a6 6 0 0 0-4.2-1.7H9.6l.9.9a6.5 6.5 0 0 1 1.9 4.4v1.6l2 2h1c.8 0 1.5.3 2.1.9l1.3 1.3"/>',
      pen: '<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.6 7.6"/><circle cx="11" cy="11" r="2"/>',
      roller: '<rect x="2" y="2" width="16" height="6" rx="2"/><path d="M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="8" y="16" width="4" height="6" rx="1"/>',
      zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
      sofa: '<path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M4 18v2M20 18v2"/>',
      leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12"/>',
    }[name] || '';
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  };

  // ---------- ілюстрації об'єктів (замість фото) ----------
  // Детермінований «рандом» від id, щоб малюнок об'єкта був однаковим на всіх сторінках.
  const rng = (seed) => { let s = 0; for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };

  // Небо за реальним часом у Києві: день / захід (і світанок) / ніч.
  function skyPhase() {
    let h;
    try { h = +new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Kyiv', hour: 'numeric', hourCycle: 'h23' }).format(new Date()); }
    catch { h = new Date().getHours(); }
    return h >= 7 && h < 18 ? 'day' : (h >= 18 && h < 21) || (h >= 5 && h < 7) ? 'dusk' : 'night';
  }
  const kyivTime = () => { try { return new Date().toLocaleTimeString('uk-UA', { timeZone: 'Europe/Kyiv', hour: '2-digit', minute: '2-digit' }); } catch { return ''; } };

  // o: { phase: 'day'|'dusk'|'night', facade, roof, sky } — щоб перефарбувати об'єкт або задати небо вручну.
  function art(p, variant = 0, o = {}) {
    const r = rng(p.id + ':' + variant);
    const phase = o.phase || (variant === 2 ? 'dusk' : skyPhase());
    const dusk = phase === 'dusk', night = phase === 'night';
    const c1 = o.sky || p.palette[0], c2 = shade(o.facade || p.palette[1], night ? -35 : 0);
    const W = 400, H = 300, gid = `g${p.id}${variant}`;
    const sky = night ? ['#070a18', '#232a52'] : dusk ? ['#2b3a55', '#e8a87c'] : [c1, '#f6efe6'];
    let s = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${p.title}">
      <defs>
        <linearGradient id="${gid}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>
        <linearGradient id="${gid}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c2}"/><stop offset="1" stop-color="${shade(c2, -18)}"/></linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#${gid}s)"/>`;
    // зорі — з окремого «рандому», щоб не зсувати решту малюнка
    if (night) { const sr = rng(p.id + ':stars'); for (let i = 0; i < 40; i++) s += `<circle cx="${sr() * W}" cy="${sr() * H * .55}" r="${.5 + sr() * 1.1}" fill="#fff" opacity="${.35 + sr() * .6}"/>`; }
    // сонце / місяць
    const mx = 60 + r() * 280, my = 40 + r() * 40;
    s += night ? `<circle cx="${mx}" cy="${my}" r="15" fill="#f4ecd0"/><circle cx="${mx + 6}" cy="${my - 4}" r="13" fill="${sky[0]}"/>`
      : `<circle cx="${mx}" cy="${my}" r="${dusk ? 16 : 22}" fill="${dusk ? '#fde7b0' : '#fff6d8'}" opacity=".9"/>`;
    // далекий план — силует міста
    let x = 0;
    while (x < W) {
      const w = 24 + r() * 40, h = 40 + r() * 90;
      s += `<rect x="${x}" y="${H - 70 - h}" width="${w}" height="${h + 70}" fill="${night ? '#141a3a' : shade(c1, -12)}" opacity="${night ? .9 : .45}"/>`;
      x += w + 2;
    }
    const win = phase === 'day' ? '#eaf4ff' : '#ffd88a';
    if (p.type === 'Будинок') s += house(r, W, H, gid, c2, win, o.roof);
    else if (p.type === 'Комерція') s += shopfront(r, W, H, gid, c2, win, p);
    else s += tower(r, W, H, gid, c2, win, variant, night ? .3 : .55);
    // земля, дерева
    s += `<rect y="${H - 34}" width="${W}" height="34" fill="${shade(c2, night ? -55 : -35)}" opacity=".9"/>`;
    for (let i = 0; i < 4; i++) {
      const tx = r() * W, th = 26 + r() * 22;
      s += `<rect x="${tx - 2}" y="${H - 36 - th * .4}" width="4" height="${th * .5}" fill="#4a3b2a"/>
            <ellipse cx="${tx}" cy="${H - 36 - th * .6}" rx="${th * .38}" ry="${th * .5}" fill="${night ? '#1c2b24' : dusk ? '#2f4a3a' : '#5d8a5a'}" opacity=".95"/>`;
    }
    return s + '</svg>';
  }
  // Міська забудова для головної: вежі в кольорах палітри, золоті карнизи, шпиль і будівельний кран.
  // o: { phase, facade, roof (золото/бренд), sky } — ті ж параметри, що в art().
  function city(o = {}) {
    const r = rng('city'), W = 400, H = 320, base = H - 30;
    const phase = o.phase || skyPhase(), dusk = phase === 'dusk', night = phase === 'night';
    const sky = night ? ['#070a18', '#232a52'] : dusk ? ['#2b3a55', '#e8a87c'] : [o.sky || '#cfdcea', '#f6efe6'];
    const facade = shade(o.facade || '#2a2620', night ? -20 : 0), gold = o.roof || '#cfa349';
    const win = phase === 'day' ? '#eaf4ff' : '#ffd88a';
    let s = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Міська забудова">
      <defs><linearGradient id="citySky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>
        <filter id="cityGlow2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id="cityGlow"><stop offset="0" stop-color="#ffd88a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd88a" stop-opacity="0"/></radialGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#citySky)"/>`;
    if (night) { const sr = rng('city:stars'); for (let i = 0; i < 45; i++) s += `<circle cx="${sr() * W}" cy="${sr() * H * .5}" r="${.5 + sr() * 1.1}" fill="#fff" opacity="${.35 + sr() * .6}"/>`; }
    s += night ? `<circle cx="140" cy="55" r="13" fill="#f4ecd0"/><circle cx="145" cy="51" r="11.5" fill="${sky[0]}"/>`
      : `<circle cx="140" cy="55" r="${dusk ? 15 : 20}" fill="${dusk ? '#fde7b0' : '#fff6d8'}" opacity=".9"/>`;
    // далекий план
    for (let x = -10; x < W;) {
      const w = 18 + r() * 30, h = 60 + r() * 110;
      s += `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="${night ? '#141a3a' : shade(sky[0], -15)}" opacity="${night ? .9 : .55}"/>`;
      x += w + 2;
    }
    // вежі: x, висота, відтінок фасаду. У кожній вежі вікна складаються в одну літеру слова GLORY (шрифт 5×7).
    const FONT = {
      G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
      L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
      O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
      R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
      Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
    };
    const word = 'GLORY', TW = 62, rowTop = 10; // верхній рядок літер — 11-й ряд вікон знизу
    const letter = phase === 'day' ? gold : '#ffe3a0';
    const towers = [[14, 190, -10], [88, 228, 0], [162, 244, 10], [236, 206, -5], [310, 186, -14]];
    towers.forEach(([tx, th, d], i) => {
      const c = shade(facade, d), top = base - th, glyph = FONT[word[i]], cw = (TW - 10) / 5;
      s += `<rect x="${tx}" y="${top}" width="${TW}" height="${th}" fill="${c}"/><rect x="${tx + TW}" y="${top + 8}" width="8" height="${th - 8}" fill="${shade(c, -35)}"/>`;
      for (let k = 0; base - 20 - 14 * k > top + 8; k++) for (let j = 0; j < 5; j++) {
        const y = base - 20 - 14 * k, x = tx + 5 + j * cw + 1.5, gr = rowTop - k;
        const on = gr >= 0 && gr < 7 && glyph[gr][j] === '#', dim = !on && r() > .88;
        s += on
          ? `<rect class="gl" style="animation-delay:${(i * .3 + (6 - gr) * .05).toFixed(2)}s" x="${x}" y="${y}" width="${cw - 3}" height="8" rx="1" fill="${letter}" filter="url(#cityGlow2)"/>`
          : `<rect x="${x}" y="${y}" width="${cw - 3}" height="8" rx="1" fill="${dim ? win : shade(c, -25)}" opacity="${dim ? .3 : .6}"/>`;
      }
      s += `<rect x="${tx - 2}" y="${top - 4}" width="${TW + 12}" height="4" fill="${gold}"/>`;
    });
    // шпиль на найвищій вежі
    const hc = towers[2][0] + TW / 2 + 4, ht = base - towers[2][1];
    s += `<path d="M${hc - 7} ${ht - 4} L${hc} ${ht - 38} L${hc + 7} ${ht - 4}z" fill="${gold}"/>`;
    // будівельний кран
    const top = 78;
    let lattice = '';
    for (let y = base; y > top + 14; y -= 14) lattice += `M380 ${y} L390 ${y - 14} `;
    s += `<g stroke="${gold}" stroke-width="2" fill="none" stroke-linejoin="round">
        <path d="M380 ${base}V${top}M390 ${base}V${top}${lattice}"/>
        <path d="M262 ${top}H400M262 ${top}L385 ${top - 16}L400 ${top}M385 ${top - 16}V${top}"/>
        <path d="M340 ${top}V${top + 12}" stroke-width="1.2"/></g>
      <rect x="334" y="${top + 12}" width="12" height="7" fill="${gold}"/>`;
    if (phase !== 'day') s += `<circle cx="385" cy="${top - 18}" r="2.5" fill="#ff5a4a"/>`;
    // вулиця, дерева, ліхтарі
    s += `<rect y="${base}" width="${W}" height="${H - base}" fill="${shade(facade, -45)}"/>
      <path d="M0 ${base + 16}H${W}" stroke="${gold}" stroke-opacity=".4" stroke-width="2" stroke-dasharray="12 9"/>`;
    [70, 196, 300].forEach((lx) => {
      if (phase !== 'day') s += `<circle cx="${lx}" cy="${base - 30}" r="22" fill="url(#cityGlow)"/>`;
      s += `<path d="M${lx} ${base}V${base - 30}" stroke="${shade(facade, -60)}" stroke-width="2"/><circle cx="${lx}" cy="${base - 31}" r="3" fill="${phase === 'day' ? shade(facade, -20) : '#ffd88a'}"/>`;
    });
    [44, 140, 228, 346].forEach((tx) => {
      const th = 22 + r() * 14;
      s += `<rect x="${tx - 2}" y="${base - th * .5}" width="4" height="${th * .5}" fill="#4a3b2a"/>
        <ellipse cx="${tx}" cy="${base - th * .7}" rx="${th * .36}" ry="${th * .45}" fill="${night ? '#1c2b24' : dusk ? '#2f4a3a' : '#5d8a5a'}"/>`;
    });
    return s + '</svg>';
  }
  function tower(r, W, H, gid, c, win, v, litP) {
    const bw = 150 + r() * 60, bx = (W - bw) / 2 + (v === 1 ? -40 : 0), top = 40 + r() * 30;
    let s = `<rect x="${bx}" y="${top}" width="${bw}" height="${H - top}" rx="4" fill="url(#${gid}b)"/>`;
    s += `<rect x="${bx + bw}" y="${top + 12}" width="22" height="${H - top}" fill="${shade(c, -28)}"/>`;
    const cols = 5 + Math.floor(r() * 3), rows = 9 + Math.floor(r() * 4);
    const cw = (bw - 24) / cols, rh = (H - top - 60) / rows;
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
      const lit = r() > litP;
      s += `<rect x="${bx + 12 + j * cw + 3}" y="${top + 14 + i * rh + 3}" width="${cw - 6}" height="${rh - 7}" rx="1.5" fill="${lit ? win : shade(c, -30)}" opacity="${lit ? .95 : .55}"/>`;
    }
    for (let i = 2; i < rows; i += 3) s += `<rect x="${bx + 6}" y="${top + 14 + i * rh + rh - 6}" width="${bw - 12}" height="3" fill="${shade(c, 25)}" opacity=".7"/>`;
    return s;
  }
  function house(r, W, H, gid, c, win, roof) {
    const bw = 210, bx = (W - bw) / 2, base = H - 34, h1 = 120;
    let s = `<polygon points="${bx - 14},${base - h1} ${bx + bw / 2},${base - h1 - 70} ${bx + bw + 14},${base - h1}" fill="${roof || shade(c, -40)}"/>`;
    s += `<rect x="${bx}" y="${base - h1}" width="${bw}" height="${h1}" fill="url(#${gid}b)"/>`;
    s += `<rect x="${bx + bw - 50}" y="${base - h1 - 58}" width="16" height="34" fill="${shade(c, -45)}"/>`;
    [[bx + 22, base - h1 + 18], [bx + bw - 72, base - h1 + 18], [bx + 22, base - 52]].forEach(([x, y]) => {
      s += `<rect x="${x}" y="${y}" width="50" height="38" rx="3" fill="${win}"/><path d="M${x + 25} ${y}v38M${x} ${y + 19}h50" stroke="${shade(c, -30)}" stroke-width="3"/>`;
    });
    s += `<rect x="${bx + bw - 66}" y="${base - 62}" width="38" height="62" rx="3" fill="${shade(c, -50)}"/><circle cx="${bx + bw - 36}" cy="${base - 30}" r="2.5" fill="#f3d27a"/>`;
    s += `<rect x="${bx - 40}" y="${base - 26}" width="${bw + 80}" height="6" fill="#fff" opacity=".5"/>`;
    return s;
  }
  function shopfront(r, W, H, gid, c, win, p) {
    const bw = 300, bx = (W - bw) / 2, base = H - 34, h = 190;
    let s = `<rect x="${bx}" y="${base - h}" width="${bw}" height="${h}" fill="url(#${gid}b)"/>`;
    for (let j = 0; j < 4; j++) s += `<rect x="${bx + 18 + j * 70}" y="${base - h + 20}" width="48" height="56" rx="22" fill="${win}" opacity=".9"/>`;
    s += `<rect x="${bx - 6}" y="${base - 96}" width="${bw + 12}" height="18" fill="${shade(c, -35)}"/>`;
    for (let j = 0; j < 10; j++) s += `<path d="M${bx - 6 + j * 31.2} ${base - 78} q15.6 14 31.2 0" fill="${j % 2 ? '#fff' : shade(c, 15)}"/>`;
    s += `<rect x="${bx + 16}" y="${base - 66}" width="${bw - 100}" height="66" fill="${win}" opacity=".85"/>`;
    s += `<rect x="${bx + bw - 70}" y="${base - 66}" width="50" height="66" fill="${shade(c, -45)}"/>`;
    return s;
  }
  function shade(hex, pct) {
    const n = parseInt(hex.slice(1), 16), f = pct / 100;
    const ch = (v) => Math.max(0, Math.min(255, Math.round(v + (f < 0 ? v * f : (255 - v) * f))));
    return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(ch).map((v) => v.toString(16).padStart(2, '0')).join('');
  }

  // ---------- обране ----------
  const favs = () => store.get('favs', []);
  function toggleFav(id) {
    const f = favs(); const i = f.indexOf(id);
    i >= 0 ? f.splice(i, 1) : f.push(id);
    store.set('favs', f); syncFavs();
  }
  function syncFavs() {
    const f = favs();
    $$('[data-fav]').forEach((b) => {
      const on = f.includes(b.dataset.fav);
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
      b.title = on ? 'Прибрати з обраного' : 'Додати в обране';
    });
    const badge = $('#favCount'); if (badge) { badge.textContent = f.length; badge.hidden = !f.length; }
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-fav]'); if (b) { e.preventDefault(); toggleFav(b.dataset.fav); }
  });

  // ---------- картка ----------
  function card(p) {
    return `<article class="card reveal">
      <div class="card-media">
        <a href="property.html?id=${p.id}" aria-label="${p.title}">${art(p)}</a>
        <span class="chip ${p.deal}">${p.deal === 'rent' ? 'Оренда' : 'Продаж'} · ${p.type}</span>
        <button class="fav" data-fav="${p.id}" aria-label="Обране">${icon('heart', 18)}</button>
      </div>
      <div class="card-body">
        <div class="price">${priceLabel(p)}</div>
        <a class="card-title" href="property.html?id=${p.id}">${p.title}</a>
        <div class="muted">${p.city}, ${p.district}</div>
        <div class="meta"><span>${icon('area', 16)} ${p.area} м²</span><span>${icon('bed', 16)} ${p.rooms} кімн.</span><span>${icon('floor', 16)} ${p.floor}/${p.floors}</span></div>
      </div>
    </article>`;
  }

  // ---------- шапка / футер ----------
  function layout() {
    const nav = [['index.html', 'Головна', 'home'], ['catalog.html', 'Каталог', 'catalog'], ['catalog.html?deal=rent', 'Оренда', 'rent'], ['contacts.html', 'Контакти', 'contacts']];
    const deal = new URLSearchParams(location.search).get('deal');
    const active = (k) => (k === page && !(k === 'catalog' && deal === 'rent')) || (k === 'rent' && page === 'catalog' && deal === 'rent');
    $('#header').innerHTML = `
      <div class="demo-bar">Демо-версія: агенція, об'єкти, ціни й контакти вигадані</div>
      <header class="header"><div class="container">
        <a class="logo" href="index.html"><span class="logo-mark">${icon('house', 20)}</span><span>${A.name}<small>${A.tagline}</small></span></a>
        <nav class="nav" id="nav">${nav.map(([h, t, k]) => `<a href="${h}" class="${active(k) ? 'active' : ''}">${t}</a>`).join('')}</nav>
        <div class="header-actions">
          <a class="icon-btn" href="catalog.html?fav=1" title="Обране">${icon('heart', 18)}<span class="badge" id="favCount" hidden>0</span></a>
          ${paletteMenu()}
          <button class="icon-btn" id="themeBtn" title="Світла / темна тема"></button>
          <a class="btn btn-primary" href="tel:${A.phoneHref}">${icon('phone', 16)} ${A.phone}</a>
          <button class="icon-btn burger" id="burger" aria-label="Меню">${icon('menu', 18)}</button>
        </div>
      </div></header>`;
    $('#footer').innerHTML = `
      <footer class="footer"><div class="container">
        <div><a class="logo" href="index.html" style="margin-bottom:12px"><span class="logo-mark">${icon('house', 20)}</span><span>${A.name}</span></a>
          <p>Допомагаємо купити, продати й орендувати нерухомість у Києві та області — чесно, швидко і з юридичною перевіркою.</p>
          <p>© ${new Date().getFullYear()} ${A.name}. Демо-сайт.</p></div>
        <div><b style="color:var(--ink)">Розділи</b><br><br>${nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</div>
        <div><b style="color:var(--ink)">Контакти</b><br><br><a href="tel:${A.phoneHref}">${A.phone}</a><a href="mailto:${A.email}">${A.email}</a>
          <a href="${A.telegram}">Telegram</a><a href="${A.instagram}">Instagram</a></div>
      </div></footer>`;
    $('#burger').onclick = () => $('#nav').classList.toggle('open');
    // тема й палітра (стан і застосування — у theme.js)
    const T = window.THEME, menu = $('#palMenu'), palBtn = $('#palBtn');
    const openMenu = (on) => { menu.hidden = !on; palBtn.setAttribute('aria-expanded', on); };
    $('#themeBtn').onclick = (e) => T.change({ theme: T.state.theme === 'dark' ? 'light' : 'dark' }, e.currentTarget);
    palBtn.onclick = () => openMenu(menu.hidden);
    menu.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-pal], button[data-mode]'); if (!b) return;
      T.change(b.dataset.pal ? { palette: b.dataset.pal } : { theme: b.dataset.mode }, b);
    });
    $('#palColor').addEventListener('input', (e) => T.change({ palette: 'custom', custom: e.target.value }));
    document.addEventListener('click', (e) => { if (!e.target.closest('.pal-wrap')) openMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { openMenu(false); palBtn.focus(); } });
    document.addEventListener('palettechange', syncThemeUi);
    syncThemeUi();
  }
  function paletteMenu() {
    const opts = Object.entries(window.THEME.palettes).map(([k, v]) => `
      <button class="pal-opt" data-pal="${k}"><span class="pal-sw" style="--a:${v.swatch[0]};--b:${v.swatch[1]}"></span>${v.name}<span class="pal-check">${icon('check', 16)}</span></button>`).join('');
    return `<div class="pal-wrap">
      <button class="icon-btn" id="palBtn" title="Палітра сайту" aria-haspopup="true" aria-expanded="false">${icon('palette', 18)}</button>
      <div class="pal-menu" id="palMenu" hidden>
        <div class="pal-title">Палітра сайту</div>
        ${opts}
        <label class="pal-opt" data-pal="custom"><span class="pal-sw pal-sw-custom"><input type="color" id="palColor" aria-label="Обрати свій колір"></span>Свій колір<span class="pal-check">${icon('check', 16)}</span></label>
        <div class="tabs pal-modes"><button data-mode="light">${icon('sun', 16)} Світла</button><button data-mode="dark">${icon('moon', 16)} Темна</button></div>
      </div></div>`;
  }
  function syncThemeUi() {
    const s = window.THEME.state;
    $('#themeBtn').innerHTML = icon(s.theme === 'dark' ? 'sun' : 'moon', 18);
    $$('[data-pal]').forEach((b) => b.classList.toggle('on', b.dataset.pal === s.palette));
    $$('[data-mode]').forEach((b) => b.classList.toggle('on', b.dataset.mode === s.theme));
    $('#palColor').value = s.custom;
  }

  // ---------- форми ----------
  function bindForm(form) {
    if (!form) return;
    form.noValidate = true;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      $$('[data-req]', form).forEach((inp) => {
        const f = inp.closest('.field');
        let bad = !inp.value.trim();
        if (inp.type === 'tel') bad = inp.value.replace(/\D/g, '').length < 10;
        if (inp.type === 'email' && inp.value) bad = !/^\S+@\S+\.\S+$/.test(inp.value);
        f.classList.toggle('error', bad); ok = ok && !bad;
      });
      if (!ok) return;
      const okBox = $('.form-ok', form);
      okBox.classList.add('show');
      $$('input, textarea', form).forEach((i) => { if (i.type !== 'hidden') i.value = ''; });
      setTimeout(() => okBox.classList.remove('show'), 6000);
    });
  }
  const leadForm = (title, extra = '') => `
    <form class="lead">
      ${title ? `<h3>${title}</h3>` : ''}
      ${extra}
      <div class="field"><label>Ім'я</label><input name="name" data-req placeholder="Як до вас звертатися"><div class="err">Вкажіть ім'я</div></div>
      <div class="field"><label>Телефон</label><input name="phone" type="tel" data-req placeholder="+38 (0__) ___-__-__"><div class="err">Вкажіть номер телефону</div></div>
      <div class="field"><label>Коментар</label><textarea name="msg" placeholder="Що шукаєте? Бюджет, район, терміни"></textarea></div>
      <button class="btn btn-primary btn-block">${icon('send', 16)} Надіслати заявку</button>
      <div class="form-ok">Дякуємо! Агент зателефонує протягом 15 хвилин у робочий час. <span class="muted">(демо: заявка нікуди не надсилається)</span></div>
    </form>`;

  // ---------- анімація появи ----------
  function reveal() {
    const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .12 }) : null;
    $$('.reveal:not(.in)').forEach((el, i) => { el.style.transitionDelay = `${(i % 6) * 60}ms`; io ? io.observe(el) : el.classList.add('in'); });
  }

  // ---------- перехід між сторінками: «двері» ----------
  // При переході на «Контакти» стулки зачиняються, а на сторінці контактів відчиняються вглиб — ніби заходимо в офіс.
  function doors() {
    const root = document.documentElement;
    const make = (open) => {
      const d = document.createElement('div');
      d.id = 'doors'; d.className = open ? 'open' : ''; d.setAttribute('aria-hidden', 'true');
      d.innerHTML = `<div class="door door-l"><span class="door-word">Glory</span><i class="door-handle"></i></div>
        <div class="door door-r"><i class="door-handle"></i><span class="door-word">Estate</span></div>`;
      document.body.appendChild(d);
      return d;
    };
    if (root.classList.contains('doors-closed')) {
      const d = make(false);
      root.classList.remove('doors-closed');
      setTimeout(() => d.classList.add('open'), 180);
      setTimeout(() => d.remove(), 1300);
    }
    // повернулися «Назад» на сторінку, яку покидали із зачиненими дверима
    addEventListener('pageshow', (e) => { if (e.persisted) $('#doors')?.remove(); });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target || a.hasAttribute('download')) return;
      const u = new URL(a.href, location.href);
      // двері — лише при вході на «Контакти»
      if (u.protocol !== location.protocol || u.host !== location.host || !/contacts\.html$/.test(u.pathname)) return;
      if (u.pathname === location.pathname) return; // уже на контактах
      e.preventDefault();
      const d = make(true);
      d.classList.add('busy');
      d.getBoundingClientRect(); // зафіксувати «відчинений» стан, щоб спрацював перехід
      d.classList.remove('open');
      try { sessionStorage.setItem('doors', '1'); } catch { /* приватний режим */ }
      setTimeout(() => { location.href = u.href; }, 650);
    });
  }

  window.UI = { $, $$, money, priceLabel, icon, art, city, skyPhase, kyivTime, card, syncFavs, favs, bindForm, leadForm, reveal, store };
  layout();
  doors();
  document.addEventListener('DOMContentLoaded', () => { syncFavs(); reveal(); });
})();
