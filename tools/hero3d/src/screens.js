// The pictures on the model's screens. Each is drawn large and plain, because a screen is about
// 100 to 250 px wide in the hero: bars, dots and a few big words, no small text.
const FONT = '"Host Grotesk", system-ui, sans-serif';
const PURPLE = '#762bee', LILAC = '#b9a3ff', INK = '#0f0d18', AMBER = '#ffb547', GREEN = '#4fd68b', GREY = '#5d5a70';

const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };

// the roof sign: a neon mark for the kind of business, then its name
const ICONS = {
  cafe(g) {            // a cup with steam
    g.beginPath(); g.moveTo(-58, -18); g.lineTo(-48, 62); g.quadraticCurveTo(-46, 78, -30, 78); g.lineTo(26, 78); g.quadraticCurveTo(42, 78, 44, 62); g.lineTo(54, -18); g.closePath(); g.stroke();
    g.beginPath(); g.moveTo(52, 0); g.bezierCurveTo(98, -6, 98, 56, 46, 50); g.stroke();
    for (const x of [-26, 0, 26]) { g.beginPath(); g.moveTo(x, -40); g.bezierCurveTo(x - 14, -58, x + 14, -70, x, -90); g.stroke(); }
  },
  dental(g) {          // a tooth
    g.beginPath(); g.moveTo(0, -58); g.bezierCurveTo(-34, -92, -84, -66, -70, -14); g.bezierCurveTo(-62, 16, -58, 84, -36, 84); g.bezierCurveTo(-18, 84, -22, 26, 0, 26);
    g.bezierCurveTo(22, 26, 18, 84, 36, 84); g.bezierCurveTo(58, 84, 62, 16, 70, -14); g.bezierCurveTo(84, -66, 34, -92, 0, -58); g.closePath(); g.stroke();
  },
  shop(g) {            // a bag
    g.beginPath(); g.moveTo(-62, -34); g.lineTo(62, -34); g.lineTo(72, 80); g.lineTo(-72, 80); g.closePath(); g.stroke();
    g.beginPath(); g.moveTo(-30, -10); g.lineTo(-30, -48); g.bezierCurveTo(-30, -98, 30, -98, 30, -48); g.lineTo(30, -10); g.stroke();
  },
  plumbing(g) {        // a wrench
    g.save(); g.rotate(-Math.PI / 4);
    g.beginPath(); g.moveTo(-16, 96); g.lineTo(-16, -28); g.bezierCurveTo(-62, -52, -52, -112, -18, -112); g.lineTo(-18, -68); g.lineTo(18, -68); g.lineTo(18, -112);
    g.bezierCurveTo(52, -112, 62, -52, 16, -28); g.lineTo(16, 96); g.bezierCurveTo(16, 118, -16, 118, -16, 96); g.closePath(); g.stroke();
    g.restore();
  },
};
export function drawSign(g, w, h, biz) {
  g.clearRect(0, 0, w, h);
  g.fillStyle = '#120f1e'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(185,163,255,0.35)'; g.lineWidth = 6; rr(g, 14, 14, w - 28, h - 28, 26); g.stroke();
  const name = biz.name;
  let size = 112;
  g.font = `600 ${size}px ${FONT}`;
  const room = w - 300;
  while (g.measureText(name).width > room && size > 50) { size -= 4; g.font = `600 ${size}px ${FONT}`; }
  const tw = g.measureText(name).width, total = 170 + tw, x0 = (w - total) / 2;
  // the mark, twice: a wide soft pass, then the tube
  for (const pass of [0, 1]) {
    g.save();
    g.translate(x0 + 62, h / 2 + 2); g.scale(0.92, 0.92);
    g.lineCap = 'round'; g.lineJoin = 'round';
    g.shadowColor = '#ffd08a'; g.shadowBlur = pass ? 10 : 40;
    g.strokeStyle = pass ? '#fff4dc' : '#ffb347'; g.lineWidth = pass ? 7 : 13;
    (ICONS[biz.key] || ICONS.shop)(g);
    g.restore();
  }
  g.textBaseline = 'middle'; g.textAlign = 'left';
  for (const pass of [0, 1]) {
    g.shadowColor = '#a67bff'; g.shadowBlur = pass ? 8 : 44;
    g.fillStyle = pass ? '#ffffff' : '#cbb6ff';
    g.fillText(name, x0 + 170, h / 2 + 6);
  }
  g.shadowBlur = 0;
}

// the family calendar: one item moves to a free time
const DAY = [
  [['School', 0, '#8ec5ff'], ['Dentist', 1, LILAC], ['Soccer', 3, '#ffd08a']],
  [['Drop-off', 0, '#8ec5ff'], ['Recital', 2, '#ff9db0'], ['Dinner', 3, '#ffd08a']],
  [['Vet', 0, '#9fe3b4'], ['Pickup', 1, '#8ec5ff'], ['Game', 3, '#ffd08a']],
];
const MOVE = [[1, 2], [1, 2], [0, 2]];   // the item, and the row it moves to
export function drawCalendar(g, w, h, day, move) {
  g.fillStyle = '#fffaf1'; g.fillRect(0, 0, w, h);
  g.fillStyle = PURPLE; g.fillRect(0, 0, w, 64);
  g.fillStyle = '#fff'; g.font = `600 38px ${FONT}`; g.textBaseline = 'middle'; g.textAlign = 'left';
  g.fillText('Today', 24, 34);
  const rows = 4, top = 80, rh = (h - top - 14) / rows;
  g.strokeStyle = '#e6dccb'; g.lineWidth = 3;
  for (let i = 0; i < rows; i++) {
    const y = top + i * rh;
    g.beginPath(); g.moveTo(20, y + rh); g.lineTo(w - 20, y + rh); g.stroke();
    g.fillStyle = '#b5a995'; g.beginPath(); g.arc(40, y + rh / 2, 9, 0, 7); g.fill();
  }
  const items = DAY[day % DAY.length], [who, to] = MOVE[day % MOVE.length];
  items.forEach(([label, row, colour], i) => {
    let r = row, lit = false;
    if (i === who) { r = row + (to - row) * move; lit = move > 0; }
    const y = top + r * rh + 9;
    if (lit) { g.shadowColor = PURPLE; g.shadowBlur = 26; }
    g.fillStyle = colour; rr(g, 70, y, w - 100, rh - 18, 14); g.fill();
    g.shadowBlur = 0;
    if (lit) { g.strokeStyle = PURPLE; g.lineWidth = 6; rr(g, 70, y, w - 100, rh - 18, 14); g.stroke(); }
    g.fillStyle = INK; g.font = `600 34px ${FONT}`; g.fillText(label, 92, y + (rh - 18) / 2 + 2);
  });
}

// the chief of staff's wall: the whole picture. A big count of what needs the owner, and the rows.
export function drawBoard(g, w, h, need, handled, done, scan) {
  g.fillStyle = '#100d1c'; g.fillRect(0, 0, w, h);
  // left: the count
  g.textBaseline = 'alphabetic'; g.textAlign = 'left';
  g.fillStyle = need ? AMBER : GREEN; g.font = `600 250px ${FONT}`;
  g.fillText(String(need), 48, 290);
  g.fillStyle = '#fff'; g.font = `500 60px ${FONT}`;
  g.fillText(need === 1 ? 'needs you' : 'need you', 52, 372);
  g.fillStyle = LILAC; g.font = `500 44px ${FONT}`;
  g.fillText(`${handled} handled`, 52, 446);
  // right: rows; the three that need the owner come first
  const x = 420, rw = w - x - 44, rh = 62, gap = 14;
  const ids = ['s1', 's2', 's3'];
  for (let i = 0; i < 6; i++) {
    const y = 44 + i * (rh + gap);
    const st = i < 3 ? done[ids[i]] || 'wait' : 'ok';
    g.fillStyle = st === 'wait' ? 'rgba(255,181,71,0.16)' : 'rgba(255,255,255,0.07)';
    rr(g, x, y, rw, rh, 16); g.fill();
    g.fillStyle = st === 'wait' ? AMBER : st === 'held' ? GREY : GREEN;
    g.beginPath(); g.arc(x + 34, y + rh / 2, 13, 0, 7); g.fill();
    g.fillStyle = st === 'wait' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.32)';
    rr(g, x + 66, y + rh / 2 - 8, rw * [0.62, 0.48, 0.7, 0.4, 0.56, 0.44][i], 16, 8); g.fill();
  }
  if (scan >= 0) {
    const sy = 30 + scan * (h - 60);
    const grad = g.createLinearGradient(0, sy - 40, 0, sy + 40);
    grad.addColorStop(0, 'rgba(185,163,255,0)'); grad.addColorStop(0.5, 'rgba(185,163,255,0.55)'); grad.addColorStop(1, 'rgba(185,163,255,0)');
    g.fillStyle = grad; g.fillRect(x - 10, sy - 40, rw + 20, 80);
  }
}

// the customers' monitor: a short thread that grows by one answer
export function drawChat(g, w, h, n) {
  g.fillStyle = '#f4f6fb'; g.fillRect(0, 0, w, h);
  const rows = [[0, 0.56], [1, 0.66], [0, 0.42], [1, 0.5]];
  const show = 2 + (n % 3);
  rows.slice(0, Math.min(show, 4)).forEach(([mine, len], i) => {
    const bw = w * len, y = 18 + i * 56;
    g.fillStyle = mine ? PURPLE : '#d9deea';
    rr(g, mine ? w - bw - 18 : 18, y, bw, 42, 18); g.fill();
  });
}

// the card reader's display
export function drawPaid(g, w, h, on) {
  g.fillStyle = on ? '#0f3d27' : '#16141f'; g.fillRect(0, 0, w, h);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  if (on) { g.fillStyle = GREEN; g.font = `700 60px ${FONT}`; g.fillText('PAID', w / 2, h / 2 + 4); } else { g.fillStyle = '#3a3650'; rr(g, 30, h / 2 - 9, w - 60, 18, 9); g.fill(); }
}

// a printed quote
export function drawSheet(g, w, h) {
  g.fillStyle = '#fffdf8'; g.fillRect(0, 0, w, h);
  g.fillStyle = PURPLE; g.fillRect(14, 14, 54, 12);
  g.fillStyle = '#cfc8ba';
  [44, 66, 88, 110].forEach((y, i) => g.fillRect(14, y, [108, 92, 116, 80][i], 8));
  g.fillStyle = INK; g.fillRect(78, 150, 58, 12);
}

// the light: a soft round glow
export function drawGlow(g, s) {
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, 'rgba(255,255,255,1)'); grad.addColorStop(0.16, 'rgba(214,196,255,0.95)');
  grad.addColorStop(0.4, 'rgba(132,74,255,0.42)'); grad.addColorStop(1, 'rgba(118,43,238,0)');
  g.fillStyle = grad; g.fillRect(0, 0, s, s);
}

// a sent message
export function drawBubble(g, s) {
  g.shadowColor = 'rgba(118,43,238,0.9)'; g.shadowBlur = 14;
  g.fillStyle = '#ffffff';
  rr(g, 18, 22, s - 36, s - 58, 22); g.fill();
  g.beginPath(); g.moveTo(40, s - 40); g.lineTo(34, s - 14); g.lineTo(64, s - 38); g.closePath(); g.fill();
  g.shadowBlur = 0;
  g.fillStyle = PURPLE;
  g.fillRect(36, 44, s - 72, 9); g.fillRect(36, 62, s - 96, 9);
}

// the van's soft shadow on the road
export function drawShade(g, s) {
  const grad = g.createRadialGradient(s / 2, s / 2, s * 0.12, s / 2, s / 2, s / 2);
  grad.addColorStop(0, 'rgba(0,0,0,0.62)'); grad.addColorStop(0.6, 'rgba(0,0,0,0.3)'); grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad; g.fillRect(0, 0, s, s);
}
