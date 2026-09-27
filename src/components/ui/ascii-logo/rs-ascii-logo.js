/* <rs-ascii-logo> — interactive ASCII 3D logo.
   Attributes: src (logo image, default "rblogo.jpg"), palette (Logo|Blueprint|Steel), ramp (Classic|Binary|Blocks),
   effect (Scramble|Repel|None), scale (0.5–1.4), no-autorotate, no-hint, transparent
   Site change: the hint text is kept on one line and shrunk on phones. */
(() => {
  const PALETTES = {
    Logo: { bg: "#050607", gear: "#2f74e0", letter: "#e5a93a", dim: "#6b7078" },
    Blueprint: { bg: "#f2f2f3", gear: "#5980a6", letter: "#1d1f20", dim: "#8a9099" },
    Steel: { bg: "#1f2c3a", gear: "#f2f2f3", letter: "#a9c1d8", dim: "#8aa0b6" },
  };
  const RAMPS = { Classic: ".,-~:;=!*#$@", Binary: "0011", Blocks: "·:░▒▓█" };
  const cache = {};
  function loadGeo(src) {
    if (cache[src]) return cache[src];
    return (cache[src] = new Promise((res, rej) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onerror = rej;
      img.onload = () => {
        const N = 190, c = document.createElement("canvas");
        c.width = c.height = N;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, N, N);
        const d = ctx.getImageData(0, 0, N, N).data;
        const occ = [new Uint8Array(N * N), new Uint8Array(N * N)];
        for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
          const k = (j * N + i) * 4, r = d[k], g = d[k + 1], b = d[k + 2];
          if (b > 140 && r < 110 && b > g) occ[0][j * N + i] = 1;
          else if (r > 170 && g > 110 && b < 120) occ[1][j * N + i] = 1;
        }
        const s = 2 / N, DEPTH = [[-0.1, 0.1], [-0.06, 0.2]], P = [];
        const at = (o, i, j) => (i < 0 || j < 0 || i >= N || j >= N ? 0 : o[j * N + i]);
        for (let t = 0; t < 2; t++) {
          const o = occ[t], [z0, z1] = DEPTH[t];
          for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
            if (!o[j * N + i]) continue;
            const x = (i + 0.5) * s - 1, y = 1 - (j + 0.5) * s;
            P.push(x, y, z1, 0, 0, 1, t, x, y, z0, 0, 0, -1, t);
            if (at(o, i + 1, j) && at(o, i - 1, j) && at(o, i, j + 1) && at(o, i, j - 1)) continue;
            let gx = 0, gy = 0;
            for (let dj = -2; dj <= 2; dj++) for (let di = -2; di <= 2; di++) { const v = at(o, i + di, j + dj); gx += v * di; gy += v * dj; }
            let nx = -gx, ny = gy; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
            for (let z = z0 + s * 0.6; z < z1; z += s * 0.6) P.push(x, y, z, nx, ny, 0, t);
          }
        }
        res(new Float32Array(P));
      };
      img.src = src;
    }));
  }
  function hash(a, b, c) {
    let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
    h = (h ^ (h >>> 13)) * 1274126177;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  class RSAsciiLogo extends HTMLElement {
    static get observedAttributes() { return ["palette", "scale", "no-hint", "transparent"]; }
    constructor() {
      super();
      const root = this.attachShadow({ mode: "open" });
      root.innerHTML = `<style>
        :host{display:block;position:relative;width:100%;height:100%;min-height:320px;overflow:hidden;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none}
        pre{position:absolute;left:0;top:0;margin:0;font-family:'JetBrains Mono',ui-monospace,Menlo,Consolas,monospace;white-space:pre;letter-spacing:0;pointer-events:none}
        .l{font-weight:700}
        .hint{position:absolute;left:0;right:0;bottom:24px;display:flex;justify-content:center;gap:28px;font:15px 'Barlow Condensed',sans-serif;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap;pointer-events:none;transition:opacity .6s}
        @media (max-width:640px){.hint{bottom:12px;gap:16px;font-size:12px}}
      </style><pre class="g"></pre><pre class="l"></pre><div class="hint"><span>Drag to orbit</span><span>Click to spin</span></div>`;
      this.preG = root.querySelector(".g"); this.preL = root.querySelector(".l"); this.hint = root.querySelector(".hint");
      this.s = { rx: -0.3, ry: 0.62, gz: 0, vx: 0, vy: 0, vgz: 0, depth: 0, reveal: -2, revealing: false, frame: 0,
        mx: 0, my: 0, mIn: false, mc: 0, mr: 0, drag: null, touched: false, visible: true };
    }
    attributeChangedCallback() { if (this.isConnected) { this.applyPalette(); this.layout(); } }
    connectedCallback() {
      this.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      loadGeo(this.getAttribute("src") || "rblogo.jpg").then((g) => (this.geo = g)).catch(() => console.warn("rs-ascii-logo: could not load logo image"));
      this.ro = new ResizeObserver(() => this.layout()); this.ro.observe(this);
      this.io = new IntersectionObserver(([e]) => {
        const s = this.s; s.visible = e.isIntersecting;
        if (e.isIntersecting && !s.revealing) { s.revealing = true; if (this.reduced) { s.reveal = 1e4; s.depth = 1; } }
      }, { threshold: 0.15 });
      this.io.observe(this);
      const pt = (e) => { const r = this.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top, r]; };
      this.h = {
        pointerdown: (e) => { const [x, y] = pt(e); this.s.drag = { x, y, x0: x, y0: y, t: performance.now(), moved: 0 }; this.setPointerCapture(e.pointerId); this.style.cursor = "grabbing"; },
        pointermove: (e) => {
          const [x, y, r] = pt(e), s = this.s;
          s.mIn = true; s.mx = (x / r.width) * 2 - 1; s.my = (y / r.height) * 2 - 1;
          s.mc = (x - this.offX) / this.cw; s.mr = (y - this.offY) / this.fs;
          if (!s.drag) return;
          const dx = x - s.drag.x, dy = y - s.drag.y, now = performance.now(), dt = Math.max(1, now - s.drag.t) / 1000, k = 4.2 / Math.min(r.width, r.height);
          s.ry += dx * k; s.rx = Math.max(-1.3, Math.min(1.3, s.rx - dy * k));
          s.vy = (dx * k) / dt; s.vx = (-dy * k) / dt;
          s.drag.x = x; s.drag.y = y; s.drag.t = now;
          s.drag.moved = Math.max(s.drag.moved, Math.hypot(x - s.drag.x0, y - s.drag.y0));
          if (s.drag.moved > 6) this.dismissHint();
        },
        pointerup: (e) => {
          const s = this.s;
          if (s.drag && s.drag.moved < 6) { s.vgz -= 9; this.dismissHint(); }
          if (s.drag && performance.now() - s.drag.t > 80) { s.vx = 0; s.vy = 0; }
          s.drag = null; this.style.cursor = "";
          if (e.pointerType !== "mouse") s.mIn = false;
        },
        pointerleave: () => { if (!this.s.drag) this.s.mIn = false; },
      };
      this.h.pointercancel = this.h.pointerup;
      for (const n in this.h) this.addEventListener(n, this.h[n]);
      this.applyPalette(); this.layout();
      let last = performance.now();
      const loop = (now) => {
        this.raf = requestAnimationFrame(loop);
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        if (!this.s.visible || !this.geo) return;
        this.step(dt); this.draw();
      };
      this.raf = requestAnimationFrame(loop);
    }
    disconnectedCallback() {
      cancelAnimationFrame(this.raf); this.ro.disconnect(); this.io.disconnect();
      for (const n in this.h) this.removeEventListener(n, this.h[n]);
    }
    dismissHint() { this.hint.style.opacity = "0"; this.s.touched = true; }
    applyPalette() {
      const p = PALETTES[this.getAttribute("palette")] || PALETTES.Logo;
      this.style.background = this.hasAttribute("transparent") ? "transparent" : p.bg;
      this.preG.style.color = p.gear; this.preL.style.color = p.letter; this.hint.style.color = p.dim;
      this.hint.style.display = this.hasAttribute("no-hint") ? "none" : "flex";
    }
    layout() {
      const w = this.clientWidth, h = this.clientHeight; if (!w || !h) return;
      const scale = parseFloat(this.getAttribute("scale")) || 1;
      const fs = Math.max(6, Math.min(16, Math.min(w, h) / (62 * scale)));
      this.fs = fs; this.cw = fs * 0.6;
      this.cols = Math.ceil(w / this.cw); this.rows = Math.ceil(h / fs);
      this.offX = (w - this.cols * this.cw) / 2; this.offY = (h - this.rows * fs) / 2;
      this.K = (Math.min(w, h) / fs) * 1.6 * scale;
      for (const p of [this.preG, this.preL]) { p.style.left = this.offX + "px"; p.style.top = this.offY + "px"; p.style.fontSize = fs + "px"; p.style.lineHeight = fs + "px"; }
    }
    step(dt) {
      const s = this.s, auto = !this.hasAttribute("no-autorotate") && !this.reduced;
      if (s.revealing) {
        s.reveal += (dt * this.rows) / 1.1;
        if (s.reveal > this.rows * 0.6) s.depth += (1 - s.depth) * (1 - Math.exp(-dt * 3));
      }
      if (!s.drag) {
        s.vy += ((auto ? 0.32 : 0) - s.vy) * (1 - Math.exp(-dt * 1.2));
        s.ry += s.vy * dt;
        s.vx *= Math.exp(-dt * 3);
        const tiltT = -0.3 + (s.mIn ? s.my * 0.28 : 0);
        s.rx += s.vx * dt + (tiltT - s.rx) * (1 - Math.exp(-dt * 2.2));
        if (s.mIn) s.ry += s.mx * 0.5 * dt;
      }
      s.vgz += ((auto ? -0.25 : 0) - s.vgz) * (1 - Math.exp(-dt * 1.4));
      s.gz += s.vgz * dt;
      s.frame++;
    }
    draw() {
      if (!this.cols) return;
      const g = this.geo, s = this.s, COLS = this.cols, ROWS = this.rows, n = COLS * ROWS;
      if (!this.zb || this.zb.length !== n) { this.zb = new Float32Array(n); this.ch = new Int16Array(n); this.ty = new Uint8Array(n); }
      const zb = this.zb, ch = this.ch, ty = this.ty; zb.fill(0); ch.fill(-1);
      const ramp = RAMPS[this.getAttribute("ramp")] || RAMPS.Classic, R = ramp.length - 1;
      const effect = this.getAttribute("effect") || "Scramble";
      const cx = COLS / 2, cy = ROWS / 2, F = 3.2, K = this.K, depth = s.depth;
      const cgz = Math.cos(s.gz), sgz = Math.sin(s.gz), cy_ = Math.cos(s.ry), sy_ = Math.sin(s.ry), cx_ = Math.cos(s.rx), sx_ = Math.sin(s.rx);
      let lx = -0.45, ly = 0.55, lz = 0.7; const ll = Math.hypot(lx, ly, lz); lx /= ll; ly /= ll; lz /= ll;
      const RR = Math.max(6, ROWS * 0.13), mc = s.mc, mr = s.mr, act = s.mIn && !s.drag;
      for (let k = 0; k < g.length; k += 7) {
        let x = g[k], y = g[k + 1], z = g[k + 2] * depth, nx = g[k + 3], ny = g[k + 4], nz = g[k + 5];
        const t = g[k + 6];
        if (nz === 0 && depth < 0.04) continue;
        if (t === 0) { const a = x * cgz - y * sgz; y = x * sgz + y * cgz; x = a; const b = nx * cgz - ny * sgz; ny = nx * sgz + ny * cgz; nx = b; }
        let a = x * cy_ + z * sy_, b = -x * sy_ + z * cy_; x = a; z = b;
        a = nx * cy_ + nz * sy_; b = -nx * sy_ + nz * cy_; nx = a; nz = b;
        a = y * cx_ - z * sx_; b = y * sx_ + z * cx_; y = a; z = b;
        a = ny * cx_ - nz * sx_; b = ny * sx_ + nz * cx_; ny = a; nz = b;
        const ooz = 1 / (F - z);
        let fx = cx + (x * K * ooz) / 0.6, fy = cy - y * K * ooz;
        if (act && effect === "Repel") {
          const dx = (fx - mc) * 0.6, dy = fy - mr, d = Math.hypot(dx, dy);
          if (d < RR && d > 0.001) { const p = (1 - d / RR) ** 2 * RR * 0.55; fx += ((dx / d) * p) / 0.6; fy += (dy / d) * p; }
        }
        const sx = Math.floor(fx), sy = Math.floor(fy);
        if (sx < 0 || sy < 0 || sx >= COLS || sy >= ROWS) continue;
        const idx = sy * COLS + sx;
        if (ooz <= zb[idx]) continue;
        zb[idx] = ooz;
        const L = nx * lx + ny * ly + nz * lz;
        ch[idx] = Math.max(0, Math.min(R, Math.floor(((L + 0.25) / 1.25) * R + 0.5)));
        ty[idx] = t;
      }
      const A = [], B = [], fr = s.frame >> 1, show = s.reveal, scan = show < ROWS + 2;
      for (let r = 0; r < ROWS; r++) {
        let la = "", lb = "";
        const hidden = r > show, edge = scan && Math.abs(r - show) < 1.5;
        for (let c = 0; c < COLS; c++) {
          const idx = r * COLS + c, v = ch[idx];
          if (edge && (v >= 0 || hash(r, c, fr) < 0.04)) { la += ramp[Math.floor(hash(c, r, fr) * ramp.length)]; lb += " "; continue; }
          if (hidden || v < 0) { la += " "; lb += " "; continue; }
          let glyph = ramp[v];
          if (act && effect === "Scramble") {
            const d = Math.hypot((c - mc) * 0.6, r - mr);
            if (d < RR && hash(c, r, fr) < (1 - d / RR) * 0.9) glyph = ramp[Math.floor(hash(r, c, fr + 7) * ramp.length)];
          }
          if (ty[idx] === 0) { la += glyph; lb += " "; } else { la += " "; lb += glyph; }
        }
        A.push(la); B.push(lb);
      }
      this.preG.textContent = A.join("\n");
      this.preL.textContent = B.join("\n");
    }
  }
  if (!customElements.get("rs-ascii-logo")) customElements.define("rs-ascii-logo", RSAsciiLogo);
})();
