// Палітри й світла/темна тема. Підключається в <head>, щоб кольори застосувалися ще до першого малювання (без «блимання»).
// Самі кольори готових палітр — у style.css (:root[data-palette="..."]); тут назви, зразки для меню й кольори міської забудови в hero.
(function () {
  const root = document.documentElement;
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* приватний режим */ } };

  const PALETTES = {
    gold:       { name: 'Чорне золото', swatch: ['#0b0a08', '#cfa349'], facade: '#2a2620', sky: '#e8d9b5' },
    emerald:    { name: 'Смарагд',      swatch: ['#1f5c4e', '#c8873a'], facade: '#2f5a4c', sky: '#b9d4c2' },
    terracotta: { name: 'Теракота',     swatch: ['#a8481f', '#efc9ad'], facade: '#7a3f26', sky: '#efc9ad' },
    ocean:      { name: 'Океан',        swatch: ['#1d4e89', '#3fb8c4'], facade: '#2c4f73', sky: '#a9c8e6' },
    lavender:   { name: 'Лаванда',      swatch: ['#6b4fa0', '#e4b7c8'], facade: '#4f4270', sky: '#d5c6ec' },
  };

  // ---------- колірна математика для «свого кольору» ----------
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const lum = (h) => {
    const c = rgb(h).map((v) => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
  };
  const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); };
  function hsl(h, s, l) {
    l = Math.max(0, Math.min(100, l)) / 100; s /= 100;
    const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return '#' + [0, 8, 4].map((n) => Math.round(f(n) * 255).toString(16).padStart(2, '0')).join('');
  }
  function toHsl(hex) {
    const [r, g, b] = rgb(hex).map((v) => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, l = (mx + mn) / 2;
    let h = 0;
    if (d) { h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
    return [h, d ? d / (1 - Math.abs(2 * l - 1)) * 100 : 0, l * 100];
  }
  // З одного кольору будуємо всю палітру. Яскравість бренду підганяємо, доки текст цим кольором
  // не стане читабельним на фоні (WCAG AA, 4.5:1); колір тексту на кнопках — білий або чорний, що контрастніший.
  function customTokens(hex, dark) {
    const [h, s0, l0] = toHsl(hex), s = Math.min(s0, 85);
    const bg = dark ? hsl(h, 14, 7) : hsl(h, 30, 97);
    let l = l0, brand = hex;
    for (let i = 0; i < 70 && contrast(brand, bg) < 4.5; i++) { l += dark ? 1.5 : -1.5; brand = hsl(h, s, l); }
    return {
      '--bg': bg, '--surface': dark ? hsl(h, 12, 11) : '#ffffff', '--ink': dark ? hsl(h, 15, 93) : hsl(h, 20, 12),
      '--muted': dark ? hsl(h, 8, 64) : hsl(h, 8, 40), '--line': dark ? hsl(h, 10, 20) : hsl(h, 18, 88),
      '--brand': brand, '--brand-ink': contrast(brand, '#ffffff') >= contrast(brand, '#111111') ? '#ffffff' : '#111111',
      '--brand-soft': dark ? hsl(h, 30, 16) : hsl(h, 45, 92), '--accent': hsl((h + 35) % 360, 55, 42),
    };
  }

  // ---------- стан ----------
  const saved = get('palette', 'gold');
  const state = {
    palette: PALETTES[saved] || saved === 'custom' ? saved : 'gold',
    theme: get('theme', 'dark') === 'light' ? 'light' : 'dark',
    custom: /^#[0-9a-f]{6}$/i.test(get('customColor', '')) ? get('customColor') : '#cfa349',
  };
  const KEYS = ['--bg', '--surface', '--ink', '--muted', '--line', '--brand', '--brand-ink', '--brand-soft', '--accent'];

  function apply() {
    root.dataset.theme = state.theme;
    root.dataset.palette = state.palette;
    root.style.colorScheme = state.theme;
    KEYS.forEach((k) => root.style.removeProperty(k));
    if (state.palette === 'custom') Object.entries(customTokens(state.custom, state.theme === 'dark')).forEach(([k, v]) => root.style.setProperty(k, v));
    document.dispatchEvent(new CustomEvent('palettechange', { detail: { ...state } }));
  }

  // origin — елемент, від якого нова палітра «розходиться» колом (View Transitions API; де його нема — міняємо миттєво).
  function change(patch, origin) {
    if (Object.keys(patch).every((k) => state[k] === patch[k])) return;
    Object.assign(state, patch);
    set('palette', state.palette); set('theme', state.theme); set('customColor', state.custom);
    if (!origin || !document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply();
    const r = origin.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(() => root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] },
      { duration: 650, easing: 'cubic-bezier(.65, 0, .35, 1)', pseudoElement: '::view-transition-new(root)' },
    )).catch(() => {});
  }

  // Кольори для міської забудови в hero: фасади, золоті акценти (= бренд) і денне небо.
  function sceneColors() {
    const brand = (getComputedStyle(root).getPropertyValue('--brand').trim() || '#cfa349').slice(0, 7);
    const p = PALETTES[state.palette];
    if (p) return { facade: p.facade, roof: brand, sky: p.sky };
    const [h] = toHsl(state.custom);
    return { facade: hsl(h, 22, 20), roof: brand, sky: hsl(h, 45, 84) };
  }

  apply();

  // Перехід між сторінками «двері» (див. doors() в app.js): якщо прийшли через нього — тримаємо двері зачиненими до старту app.js.
  try {
    if (sessionStorage.getItem('doors')) {
      sessionStorage.removeItem('doors');
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) root.classList.add('doors-closed');
    }
  } catch { /* приватний режим */ }

  // іконка вкладки — золотий будиночок на чорному
  const fav = document.createElement('link');
  fav.rel = 'icon';
  fav.href = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fcf6ba"/><stop offset="1" stop-color="#b38728"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="#0b0a08"/><path d="M6 15.5 16 7l10 8.5" fill="none" stroke="url(#g)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 14v11h14V14" fill="none" stroke="url(#g)" stroke-width="2.6" stroke-linejoin="round"/><rect x="13.5" y="17" width="5" height="5" rx="1" fill="#e6c77a"/></svg>');
  document.head.appendChild(fav);

  window.THEME = { palettes: PALETTES, state, change, sceneColors };
})();
