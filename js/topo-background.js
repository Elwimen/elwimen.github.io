const NS = 'http://www.w3.org/2000/svg';
const RINGS = 28;

export function initTopoBackground() {
  const container = document.getElementById('topo-bg');
  if (!container) return;

  document.fonts.ready.then(() => build(container));

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => build(container), 300);
  });
}

function build(container) {
  const W = 1440;
  const H = Math.max(document.documentElement.scrollHeight, window.innerHeight);

  const foci = [
    { cx: W * 0.74, cy: H * 0.15, rx: 680, ry: H * 0.22 },
    { cx: W * 0.15, cy: H * 0.52, rx: 460, ry: H * 0.18 },
    { cx: W * 0.62, cy: H * 0.85, rx: 560, ry: H * 0.20 },
  ];

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYTop slice');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';

  foci.forEach((focus) => {
    for (let i = 1; i <= RINGS; i++) {
      const scale = 0.18 + (i / RINGS) * 0.96;
      // Fresh random phase each page load gives unique terrain every visit
      const phase = Math.random() * Math.PI * 2;

      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', contourD(focus, scale, phase));
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(52,211,153,0.065)');
      path.setAttribute('stroke-width', '0.9');
      svg.appendChild(path);
    }
  });

  container.innerHTML = '';
  container.appendChild(svg);
}

function contourD(focus, scale, phase) {
  const { cx, cy, rx, ry } = focus;
  const STEPS = 80;
  const pts = [];

  for (let i = 0; i < STEPS; i++) {
    const a = (i / STEPS) * Math.PI * 2;
    const warp =
      1.0 +
      0.20 * Math.sin(3 * a + phase) +
      0.13 * Math.cos(5 * a + phase * 1.3) +
      0.07 * Math.sin(8 * a + phase * 0.7) +
      0.04 * Math.cos(13 * a + phase * 1.9);

    pts.push([
      cx + Math.cos(a) * rx * scale * warp,
      cy + Math.sin(a) * ry * scale * warp,
    ]);
  }

  return catmullRomToBezier(pts);
}

function catmullRomToBezier(pts) {
  const n = pts.length;
  const get = (i) => pts[((i % n) + n) % n];

  let d = `M ${fmt(pts[0][0])},${fmt(pts[0][1])}`;

  for (let i = 0; i < n; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

    d += ` C ${fmt(cp1x)},${fmt(cp1y)} ${fmt(cp2x)},${fmt(cp2y)} ${fmt(p2[0])},${fmt(p2[1])}`;
  }

  return d + ' Z';
}

function fmt(n) {
  return n.toFixed(2);
}
