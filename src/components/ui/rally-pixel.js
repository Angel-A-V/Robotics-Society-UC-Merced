// <rally-kart-pixel> — pixel-art rally kart hero animation.
// Drop-in web component, no dependencies. Usage:
//   import './rally-pixel.js'
//   <rally-kart-pixel speed="1" sun="on" jumps="on"></rally-kart-pixel>
// Renders at 160×90 and scales up with crisp pixels; fills its container width.
(function () {
  if (customElements.get('rally-kart-pixel')) return;
  const W = 160, H = 90, GROUND = 78;

  const PAL = {
    K: '#05070d', A: '#FDB913', D: '#c48a00', L: '#ffe07a', G: '#0a2a6b', H: '#6e9bff',
    N: '#1463FF', R: '#ef4444', Y: '#fff3c4', B: '#1a1410', T: '#4a3a2c', S: '#8b99b0', M: '#dce8f5',
  };
  const CAR = [
    '.KKKKKK.................................',
    '.KLLLLK.........KKKKKKKKKKKK............',
    '.KKDDKK........KLLLLLLLLLLLLKK..........',
    '...KDK........KAKGGGGGGKGGGGGGKK........',
    '...KDK.......KAAKGHGGGGKGGHGGGGGK.......',
    '...KDKKKKKKKKAAAKGGGGGGKGGGGGGGGGKKKK...',
    '..KRAAAAAAAAAAAAKKKKKKKKKKKKKKKKKKLLLKK.',
    '..KRLLLLLLLLLLLLLLLLLKLLLLLLLLLLLLLLLLLK',
    '..KAAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAYYK',
    '..KAANNNNNNNNNNNNNNNNKNNNNNNNNNNNNNNNYYK',
    '..KAAAAKKKKKKKAAAAAAAKAAAAAKKKKKKKAAAAAK',
    '..KDDDK.......KDDDDDDDDDDDK.......KDDDDK',
    '..KKKKK.......KKKKKKKKKKKKK.......KKKKK.',
  ];
  const WHEEL = [[
    '..KKKK..', '.KBTBBK.', 'KBBSSBTK', 'KBSMSSBK', 'KBSSMSBK', 'KTBSSBBK', '.KBBTBK.', '..KKKK..',
  ], [
    '..KKKK..', '.KTBBBK.', 'KBBSSBBK', 'KBSSMSTK', 'KTSMSSBK', 'KBBSSBBK', '.KBBBTK.', '..KKKK..',
  ]];
  const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  const hash = (n) => { n = (n | 0) * 374761393; n = (n ^ (n >>> 13)) * 1274126177; return ((n ^ (n >>> 16)) >>> 0); };

  class RallyKartPixel extends HTMLElement {
    static get observedAttributes() { return ['speed', 'sun', 'jumps']; }
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = '<style>:host{display:block;width:100%}canvas{display:block;width:100%;height:auto;image-rendering:pixelated;image-rendering:crisp-edges}</style>';
      this.cv = document.createElement('canvas');
      this.cv.width = W; this.cv.height = H;
      this.cv.setAttribute('role', 'img');
      this.cv.setAttribute('aria-label', 'Pixel-art rally kart driving across a dirt stage');
      root.appendChild(this.cv);
      this.ctx = this.cv.getContext('2d');
      this.scroll = 0; this.t = 0; this.dust = []; this.flame = 0; this.landT = 0; this.visible = true;
    }
    attributeChangedCallback() { if (!this.raf) this.draw(); }
    get speed() { const s = parseFloat(this.getAttribute('speed')); return isFinite(s) ? s : 1; }
    on(name) { return this.getAttribute(name) !== 'off' && this.getAttribute(name) !== 'false'; }
    connectedCallback() {
      this.reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      if ('IntersectionObserver' in window) {
        this.io = new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; });
        this.io.observe(this);
      }
      let last = performance.now();
      const loop = (now) => {
        const dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); last = now;
        if (this.visible) { this.step(dt); this.draw(); }
        this.raf = requestAnimationFrame(loop);
      };
      if (this.reduced) { this.scroll = 40; this.draw(); } else this.raf = requestAnimationFrame(loop);
    }
    disconnectedCallback() { cancelAnimationFrame(this.raf); this.raf = null; this.io && this.io.disconnect(); }

    jumpHeight() {
      if (!this.on('jumps')) return 0;
      const p = (this.t % 6) / 6, j = 0.13; // airborne for first 13% of each 6s cycle
      return p < j ? Math.sin(Math.PI * p / j) * 13 : 0;
    }
    step(dt) {
      const sp = this.speed, prevAir = this.jumpHeight() > 0;
      this.t += dt * sp;
      this.scroll += dt * 60 * 1.6 * sp;
      const air = this.jumpHeight() > 0;
      if (prevAir && !air) { this.landT = 0.18; this.emit(14, 1.6); }
      this.landT = Math.max(0, this.landT - dt);
      if (!air) this.emit(Math.random() < 0.7 * sp ? 1 : 0, 1);
      this.flame = this.flame > 0 ? this.flame - dt : (Math.random() < dt * 0.5 * sp ? 0.12 : 0);
      const d = this.dust;
      for (const p of d) { p.x += p.vx * dt * 60; p.y += p.vy * dt * 60; p.vy *= 0.96; p.life -= dt; }
      this.dust = d.filter((p) => p.life > 0 && p.x > -4);
    }
    emit(n, force) {
      for (let i = 0; i < n; i++) {
        const life = 0.6 + Math.random() * 0.8;
        this.dust.push({
          x: 44 + 8 + Math.random() * 3, y: GROUND - 1 - Math.random() * 2,
          vx: -(1.2 + Math.random() * 1.2) * force * this.speed, vy: -(0.1 + Math.random() * 0.35) * force,
          life, max: life, s: Math.random() < 0.3 ? 2 : 1,
        });
      }
    }
    px(x, y, c, w = 1, h = 1) { this.ctx.fillStyle = c; this.ctx.fillRect(x | 0, y | 0, w, h); }
    sprite(rows, ox, oy) {
      for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[y].length; x++) {
        const c = rows[y][x]; if (c !== '.') this.px(ox + x, oy + y, PAL[c]);
      }
    }
    draw() {
      const c = this.ctx, s = this.scroll;
      c.clearRect(0, 0, W, H);

      if (this.on('sun')) { // striped dusk sun
        const cx = 116, cy = 50, r = 17;
        for (let y = -r; y <= 0; y++) {
          const yy = cy + y, band = y > -8 && ((yy - cy) % 3 === 0);
          if (band) continue;
          const w = Math.round(Math.sqrt(r * r - y * y));
          this.px(cx - w, yy, y < -10 ? '#FDB913' : y < -5 ? '#d99a0a' : '#9c6c06', w * 2 + 1, 1);
        }
      }
      for (let i = 0; i < 4; i++) { // speed streaks
        const y = 12 + (hash(i * 7) % 34), len = 6 + (hash(i * 13) % 10);
        const x = W - ((s * (2.4 + i * 0.3) + hash(i) % 400) % (W + 200));
        this.px(x, y, '#123a9e', len, 1);
      }
      for (let x = 0; x < W; x++) { // far mesas
        const u = x + s * 0.15;
        let h = 9 + 6 * Math.sin(u * 0.028) + 3 * Math.sin(u * 0.067 + 1.3);
        h = Math.min(Math.round(h), 13);
        this.px(x, 62 - h, '#0c1224', 1, h + 10);
      }
      for (let x = 0; x < W; x++) { // near hills
        const u = x + s * 0.4;
        const h = Math.round(4 + 3 * Math.sin(u * 0.045) + 2 * Math.sin(u * 0.12 + 2));
        this.px(x, 70 - h, '#141c36', 1, h + 2);
      }
      this.px(0, 70, '#7a5a12', W, 1);
      this.px(0, 71, '#4a360c', W, 1);
      this.px(0, 72, '#231a08', W, H - 72);
      for (let x = 0; x < W; x++) { // ruts + pebbles
        const wx = Math.floor(x + s);
        if (wx % 14 < 9) this.px(x, 81, '#140f05');
        if ((wx + 5) % 18 < 11) this.px(x, 86, '#140f05');
        const hh = hash(wx);
        if (hh % 19 === 0) this.px(x, 73 + (hh >>> 5) % 16, (hh >>> 9) % 2 ? '#4f3b12' : '#6e5520');
      }
      for (let k = Math.floor(s / 150) - 1; k <= Math.floor((s + W) / 150) + 1; k++) { // stage markers
        const x = Math.round(k * 150 + 40 - s);
        this.px(x, 62, '#dce8f5', 1, 10);
        this.px(x - 2, 60, '#FDB913', 5, 4);
        this.px(x - 1, 61, '#0a0602'); this.px(x, 62, '#0a0602'); this.px(x - 1, 63, '#0a0602');
        this.px(x + 1, 61, '#0a0602'); this.px(x + 2, 62, '#0a0602'); this.px(x + 1, 63, '#0a0602');
      }

      const jh = this.jumpHeight(), air = jh > 0;
      const carX = 44, lift = Math.round(jh);
      const rumble = air ? 0 : (hash(Math.floor(this.t * 14)) % 3 === 0 ? 1 : 0);
      const squash = this.landT > 0 ? 1 : 0;
      const bodyY = GROUND - 17 - lift + rumble + squash;
      const wheelY = GROUND - 8 - lift + (air ? 1 : 0);

      const sw = Math.max(10, 32 - lift * 1.2); // shadow
      this.px(carX + 20 - sw / 2, GROUND, '#0b0803', sw, 1);

      for (const p of this.dust) {
        const f = p.life / p.max;
        this.px(p.x, p.y, f > 0.66 ? '#c9a86a' : f > 0.33 ? '#8f7442' : '#5a4724', p.s + (f < 0.5 ? 1 : 0), p.s);
      }

      const wf = Math.abs(Math.floor(s / 3)) % 2;
      this.sprite(WHEEL[wf], carX + 7, wheelY);
      this.sprite(WHEEL[wf], carX + 27, wheelY);
      this.sprite(CAR, carX, bodyY);
      if (this.flame > 0) {
        this.px(carX + 0, bodyY + 10, '#fff3c4', 2, 1);
        this.px(carX - 2, bodyY + 10, '#FDB913', 2, 1);
        this.px(carX - 3, bodyY + 9, '#ef4444', 1, 1);
      }

      // dithered fade on left, right and bottom edges so it melts into the hero
      const img = c.getImageData(0, 0, W, H), d = img.data, E = 18, EB = 8;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        let k = 1;
        if (x < E) k = Math.min(k, x / E);
        if (x > W - 1 - E) k = Math.min(k, (W - 1 - x) / E);
        if (y > H - 1 - EB) k = Math.min(k, (H - 1 - y) / EB);
        if (k < 1 && BAYER[y & 3][x & 3] / 16 >= k) d[(y * W + x) * 4 + 3] = 0;
      }
      c.putImageData(img, 0, 0);
    }
  }
  customElements.define('rally-kart-pixel', RallyKartPixel);
})();
