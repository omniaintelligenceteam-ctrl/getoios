// The hero's live scene: a small business cut open, at dusk. One unlit mesh with two baked light
// textures (lamps off, lamps on), mixed per room. The screens, the roof sign and the light that is
// Jarvis are drawn here. Built with `npm run hero3d:build` to public/jarvis/hero3d/hero3d.js.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, BufferGeometry, BufferAttribute, ShaderMaterial,
  TextureLoader, SRGBColorSpace, LinearFilter, LinearMipmapLinearFilter, CanvasTexture, PlaneGeometry,
  MeshBasicMaterial, Sprite, SpriteMaterial, AdditiveBlending, Vector3, Sphere, DoubleSide, Color,
} from 'three';
import { drawSign, drawCalendar, drawBoard, drawChat, drawPaid, drawSheet, drawGlow, drawBubble, drawShade } from './screens.js';

const FRAME = 1.1;            // the picture's width over its height: the poster has the same
const FOV = 17;
const VIEW_H = 10.9;          // world units the picture's height shows at the model's centre
const CENTRE = new Vector3(-0.22, 3.0, 0.4);
const AZ = 0.4, EL = 0.26;   // the camera's rest angles (radians): to the right of the front, above it
const ROOMS = { s1: 2, s2: 3, s3: 4 };   // an item's hire to its room

const VERT = `
attribute float room;
varying vec2 vUv;
varying float vRoom;
void main() {
  vUv = uv;
  vRoom = room;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
const FRAG = `
uniform sampler2D tOff;
uniform sampler2D tOn;
uniform float uOn[5];
uniform float uGlow[5];
uniform float uAlpha;
varying vec2 vUv;
varying float vRoom;
void main() {
  int r = int(vRoom + 0.5);
  float k = uOn[r];
  vec3 a = texture2D(tOff, vUv).rgb;
  vec3 b = texture2D(tOn, vUv).rgb;
  vec3 c = mix(a, b, k);
  c += b * vec3(0.5, 0.36, 0.9) * uGlow[r];
  gl_FragColor = vec4(c, uAlpha);
  #include <colorspace_fragment>
}`;

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const out = (t) => 1 - Math.pow(1 - t, 3);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

async function loadMesh(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('mesh ' + res.status);
  const buf = await res.arrayBuffer();
  const n = new DataView(buf).getUint32(0, true);
  const head = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, n)));
  const base = 4 + n;
  const parts = {};
  for (const p of head.parts) {
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Uint16Array(buf, base + p.pos[0], p.verts * 3), 3, true));
    g.setAttribute('uv', new BufferAttribute(new Uint16Array(buf, base + p.uv[0], p.verts * 2), 2, true));
    g.setAttribute('room', new BufferAttribute(new Uint8Array(buf, base + p.room[0], p.verts), 1, false));
    g.setIndex(new BufferAttribute(p.wide ? new Uint32Array(buf, base + p.idx[0], p.tris * 3) : new Uint16Array(buf, base + p.idx[0], p.tris * 3), 1));
    g.boundingSphere = new Sphere(new Vector3(0.5, 0.5, 0.5), 1);
    parts[p.name] = { g, lo: p.lo, hi: p.hi };
  }
  return { parts, anchors: head.anchors };
}

function loadTexture(url) {
  return new Promise((resolve, reject) => new TextureLoader().load(url, (t) => {
    t.colorSpace = SRGBColorSpace;
    t.minFilter = LinearMipmapLinearFilter;
    t.magFilter = LinearFilter;
    t.anisotropy = 4;
    resolve(t);
  }, undefined, () => reject(new Error('texture ' + url))));
}

export function supported() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    if (!gl) return false;
    const lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    return true;
  } catch (e) { return false; }
}

/**
 * mount(host, opts): host is the stage box. opts: base (the folder's URL), small (a phone: the small textures),
 * biz ({ key, name }), need (how many items wait), labels ({ 2: el, 3: el, 4: el }), still (draw one finished frame, no loop),
 * onState(name) and onSlow().
 */
export async function mount(host, opts = {}) {
  const base = opts.base || '/jarvis/hero3d/';
  const size = opts.small ? 2048 : 4096;
  const [mesh, tOff, tOn] = await Promise.all([
    loadMesh(base + 'shop.bin'), loadTexture(`${base}atlas-off-${size}.webp`), loadTexture(`${base}atlas-on-${size}.webp`),
    document.fonts && document.fonts.load ? document.fonts.load('500 40px "Host Grotesk"').catch(() => {}) : null,
  ]);
  const A = mesh.anchors;

  const canvas = document.createElement('canvas');
  canvas.className = 'h3d__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!opts.still });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 1, 200);
  const turn = new Group();          // the pointer turns this
  const world = new Group();         // the model, its centre at the origin
  world.position.copy(CENTRE).multiplyScalar(-1);
  turn.add(world);
  scene.add(turn);

  // ---- the baked model
  const U = { tOff: { value: tOff }, tOn: { value: tOn }, uOn: { value: [1, 1, 1, 1, 1] }, uGlow: { value: [0, 0, 0, 0, 0] }, uAlpha: { value: 1 } };
  const baked = (alpha) => new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: alpha ? { ...U, uAlpha: { value: 1 } } : U, transparent: !!alpha });
  const part = (name, material) => {
    const p = mesh.parts[name];
    const m = new Mesh(p.g, material);
    m.position.set(p.lo[0], p.lo[1], p.lo[2]);
    m.scale.set(p.hi[0] - p.lo[0], p.hi[1] - p.lo[1], p.hi[2] - p.lo[2]);
    m.frustumCulled = false;
    const g = new Group();
    g.add(m);
    world.add(g);
    return g;
  };
  part('shop', baked(false));
  const vanMat = baked(true);
  const van = part('van', vanMat);
  const drawer = part('drawer', baked(false));
  // the van's shadow goes with it (the bake holds none)
  const shadeC = document.createElement('canvas'); shadeC.width = shadeC.height = 64;
  drawShade(shadeC.getContext('2d'), 64);
  const shade = new Mesh(new PlaneGeometry(3.3, 1.7), new MeshBasicMaterial({ map: new CanvasTexture(shadeC), transparent: true, depthWrite: false, toneMapped: false }));
  shade.rotation.x = -Math.PI / 2;
  shade.position.set(A.van.p[0] + 0.05, 0.047, A.van.p[2]);
  van.add(shade);

  // ---- the screens: each one a 2D drawing on a plane
  const screens = {};
  const screen = (name, px, py, draw, w = A[name].w, h = A[name].h) => {
    const c = document.createElement('canvas');
    c.width = px; c.height = py;
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 4;
    const mat = new MeshBasicMaterial({ map: t, toneMapped: false });
    const m = new Mesh(new PlaneGeometry(w, h), mat);
    m.position.set(A[name].p[0], A[name].p[1], A[name].p[2] + 0.004);
    world.add(m);
    const s = { c, t, m, mat, room: A[name].room || 0, paint: (...a) => { draw(c.getContext('2d'), c.width, c.height, ...a); t.needsUpdate = true; } };
    screens[name] = s;
    return s;
  };
  const S = {
    biz: opts.biz || { key: 'cafe', name: 'Fig Street Café' },
    need: opts.need == null ? 3 : opts.need, handled: 14, done: {},
    cal: 0, calMove: 0, scan: -1, paid: 0, chat: 0,
  };
  const sign = screen('sign', 1024, 310, drawSign);
  const calendar = screen('calendar', 512, 368, drawCalendar);
  const board = screen('board', 1024, 512, drawBoard);
  const chat = screen('chat', 384, 244, drawChat);
  const paid = screen('paid', 160, 112, drawPaid);
  const repaint = () => {
    sign.paint(S.biz);
    calendar.paint(S.cal, S.calMove);
    board.paint(S.need, S.handled, S.done, S.scan);
    chat.paint(S.chat);
    paid.paint(S.paid);
  };

  // the printer's sheet
  const sheetC = document.createElement('canvas'); sheetC.width = 150; sheetC.height = 200;
  drawSheet(sheetC.getContext('2d'), 150, 200);
  const sheetT = new CanvasTexture(sheetC); sheetT.colorSpace = SRGBColorSpace;
  const sheet = new Mesh(new PlaneGeometry(0.3, 0.4), new MeshBasicMaterial({ map: sheetT, transparent: true, side: DoubleSide, toneMapped: false }));
  sheet.rotation.x = -Math.PI / 2;
  sheet.visible = false;
  world.add(sheet);
  const sheetHome = new Vector3(A.paper.p[0], A.paper.p[1], A.paper.p[2]);

  // ---- the light that is Jarvis, and what he sends
  const glowC = document.createElement('canvas'); glowC.width = glowC.height = 128;
  drawGlow(glowC.getContext('2d'), 128);
  const glowT = new CanvasTexture(glowC); glowT.colorSpace = SRGBColorSpace;
  const orb = new Sprite(new SpriteMaterial({ map: glowT, blending: AdditiveBlending, depthWrite: false, depthTest: false, transparent: true }));
  orb.scale.setScalar(1.5);
  orb.renderOrder = 10;
  world.add(orb);
  const halo = new Sprite(new SpriteMaterial({ map: glowT, blending: AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.35, color: new Color(0x8a5cff) }));
  halo.scale.set(6.5, 2.6, 1);
  halo.position.set(A.sign.p[0], A.sign.p[1], A.sign.p[2] + 0.3);
  world.add(halo);
  const bubC = document.createElement('canvas'); bubC.width = bubC.height = 128;
  drawBubble(bubC.getContext('2d'), 128);
  const bubT = new CanvasTexture(bubC); bubT.colorSpace = SRGBColorSpace;
  const bubble = new Sprite(new SpriteMaterial({ map: bubT, depthTest: false, transparent: true, opacity: 0 }));
  bubble.scale.setScalar(0.62);
  bubble.renderOrder = 11;
  world.add(bubble);
  const P = (name) => new Vector3(A[name].p[0], A[name].p[1], A[name].p[2]);
  const ORB = { 0: P('orb_home'), 1: P('orb1'), 2: P('orb2'), 3: P('orb3'), 4: P('orb4') };
  orb.position.copy(ORB[0]);

  // ---- a small clock with tweens, so a pause stops everything
  let now = 0, running = false, raf = 0, last = 0, dead = false, drawn = 0;
  const tweens = new Set();
  const tween = (dur, step, e = ease) => new Promise((resolve) => {
    if (opts.still || dur <= 0) { step(1); resolve(); return; }
    const t0 = now;
    const tw = () => { const k = clamp((now - t0) / dur, 0, 1); step(e(k)); if (k >= 1) { tweens.delete(tw); resolve(); } };
    tweens.add(tw);
  });
  const wait = (dur) => tween(dur, () => {});
  const on = U.uOn.value, glow = U.uGlow.value;
  const light = (room, to, dur = 0.5) => { const from = on[room]; return tween(dur, (k) => { on[room] = from + (to - from) * k; }); };
  const pulse = (room, amount = 0.5, dur = 1.1) => tween(dur, (k) => { glow[room] = Math.sin(k * Math.PI) * amount; }, (t) => t);
  const fly = (to, dur = 0.9) => {
    const from = orb.position.clone();
    const lift = Math.max(0.5, from.distanceTo(to) * 0.16);
    return tween(dur, (k) => { orb.position.lerpVectors(from, to, k); orb.position.z += Math.sin(k * Math.PI) * lift; });
  };

  // ---- what each hire does
  const sendBubble = async (room) => {
    const from = ORB[room].clone();
    const to = from.clone().add(new Vector3(room === 2 ? -2.2 : 2.6, 3.4, 2.5));
    bubble.position.copy(from);
    await tween(1.25, (k) => {
      bubble.position.lerpVectors(from, to, k);
      bubble.position.y += Math.sin(k * Math.PI) * 0.6;
      bubble.material.opacity = k < 0.15 ? k / 0.15 : k > 0.7 ? (1 - k) / 0.3 : 1;
      bubble.scale.setScalar(0.5 + 0.3 * k);
    }, out);
    bubble.material.opacity = 0;
  };
  const printSheet = async (leave) => {
    sheet.visible = true;
    sheet.material.opacity = 1;
    sheet.rotation.set(-Math.PI / 2, 0, 0);
    sheet.position.copy(sheetHome).add(new Vector3(0, 0, -0.34));
    await tween(0.9, (k) => { sheet.position.z = sheetHome.z - 0.34 + 0.38 * k; }, out);
    if (leave) {
      const from = sheet.position.clone(), to = from.clone().add(new Vector3(2.4, 4.6, 3.2));
      await tween(1.3, (k) => {
        sheet.position.lerpVectors(from, to, k);
        sheet.rotation.x = -Math.PI / 2 + k * 1.5;
        sheet.rotation.z = k * 0.6;
        sheet.material.opacity = k > 0.7 ? (1 - k) / 0.3 : 1;
      }, out);
    } else {
      await wait(0.7);
      await tween(0.4, (k) => { sheet.material.opacity = 1 - k; });
    }
    sheet.visible = false;
  };
  const fileIt = async () => {
    await tween(0.45, (k) => { drawer.position.z = 0.3 * k; }, out);
    await wait(0.5);
    await tween(0.45, (k) => { drawer.position.z = 0.3 * (1 - k); });
  };
  const jobs = {
    2: async () => { S.calMove = 0; await tween(1.2, (k) => { S.calMove = k; calendar.paint(S.cal, S.calMove); }); await wait(0.6); S.cal = (S.cal + 1) % 3; S.calMove = 0; calendar.paint(S.cal, 0); },
    3: async () => { await tween(1.5, (k) => { S.scan = k; board.paint(S.need, S.handled, S.done, S.scan); }, (t) => t); S.scan = -1; S.handled += 1; board.paint(S.need, S.handled, S.done, -1); },
    4: async () => {
      const k = S.chat % 3;
      if (k === 0) { await printSheet(false); } else if (k === 1) { S.paid = 1; paid.paint(1); await wait(1.4); S.paid = 0; paid.paint(0); } else { await fileIt(); }
      S.chat += 1; chat.paint(S.chat);
    },
  };

  // ---- the loop of work: one room at a time, with a rest between
  let busy = Promise.resolve(), queue = 0, idleOn = false, labelOn = 0;
  const setLabel = (room) => {
    labelOn = room;
    if (opts.labels) for (const k of Object.keys(opts.labels)) opts.labels[k].classList.toggle('is-on', +k === room);
  };
  const visit = async (room, work) => {
    await fly(ORB[room], 0.8);
    setLabel(room);
    await Promise.all([pulse(room, 0.42, 1.3), work ? work() : wait(0.4)]);
  };
  const idle = async () => {
    if (idleOn || opts.still) return;
    idleOn = true;
    let i = 0;
    const order = [2, 3, 4];
    while (!dead) {
      await wait(2.6);
      if (queue) { await wait(0.3); continue; }
      const room = order[i++ % 3];
      const mine = busy = busy.then(() => visit(room, jobs[room]));
      await mine;
      if (!queue) { setLabel(0); busy = busy.then(() => fly(ORB[0], 0.9)); await busy; }
    }
  };
  const act = (id, approve) => {
    const room = ROOMS[id];
    if (!room) return Promise.resolve();
    queue += 1;
    busy = busy.then(async () => {
      if (approve) {
        await visit(room, async () => {
          if (room === 4) await Promise.all([printSheet(true), fileIt()]);
          else await sendBubble(room);
        });
      } else {
        await fly(ORB[room], 0.8);
        setLabel(room);
        await light(room, 0.45, 0.35);
        await wait(0.35);
        await light(room, 1, 0.5);
      }
      S.done[id] = approve ? 'sent' : 'held';
      S.need = Math.max(0, S.need - 1);
      board.paint(S.need, S.handled, S.done, -1);
      queue -= 1;
      if (!queue) { await wait(0.5); setLabel(0); await fly(ORB[0], 0.9); }
    });
    return busy;
  };

  // ---- the entrance: the place is dark, then he lights it room by room; the van comes home
  const enter = async () => {
    if (opts.still) return;
    const vanAt = 6.5;
    van.position.x = -vanAt - 6;
    vanMat.uniforms.uAlpha.value = 0;
    shade.material.opacity = 0;
    await Promise.all([light(1, 0.08, 0.5), light(2, 0.08, 0.5), light(3, 0.08, 0.5), light(4, 0.08, 0.5), light(0, 0.3, 0.5)]);
    const drive = tween(2.6, (k) => { van.position.x = (-vanAt - 6) * (1 - k); vanMat.uniforms.uAlpha.value = clamp(k * 3.2 - 0.6, 0, 1); shade.material.opacity = vanMat.uniforms.uAlpha.value; }, out);
    for (const room of [1, 2, 3, 4]) {
      await fly(ORB[room], 0.42);
      light(room, 1, 0.5);
      pulse(room, 0.3, 0.7);
      await wait(0.16);
    }
    light(0, 1, 0.8);
    await fly(ORB[0], 0.7);
    await drive;
  };

  // ---- the camera and the pointer
  const view = { yaw: 0, pitch: 0, toYaw: 0, toPitch: 0, w: 0, h: 0 };
  const place = () => {
    const d = (VIEW_H * view.fit) / (2 * Math.tan((FOV * Math.PI) / 360));
    camera.position.set(Math.sin(AZ) * Math.cos(EL) * d, Math.sin(EL) * d, Math.cos(AZ) * Math.cos(EL) * d);
    camera.lookAt(0, 0, 0);
  };
  const resize = (force) => {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h || (!force && w === view.w && h === view.h)) return;
    view.w = w; view.h = h;
    const ratio = Math.min(opts.dpr || 1.5, window.devicePixelRatio || 1, Math.sqrt(1.6e6 / (w * h)));
    renderer.setPixelRatio(Math.max(0.75, ratio));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // the picture (FRAME wide over 1 high) is held whole inside the box
    const picH = Math.min(h, w / FRAME);
    view.fit = h / picH / (typeof opts.zoom === 'function' ? opts.zoom() : opts.zoom || 1);
    camera.updateProjectionMatrix();
    place();
  };
  const v3 = new Vector3();
  // a room's label stands on the front edge of its ceiling, at the room's left
  const point = (k) => {
    const a = A['room' + k];
    v3.set(a.p[0] - 1.6, a.p[1] + 1.47, 0.24).sub(CENTRE).applyEuler(turn.rotation).project(camera);
    return [v3.x * 0.5 + 0.5, -v3.y * 0.5 + 0.5];
  };
  const labels = () => {
    if (!opts.labels) return;
    for (const k of Object.keys(opts.labels)) {
      const [x, y] = point(k);
      opts.labels[k].style.transform = `translate3d(${(x * view.w).toFixed(1)}px, ${(y * view.h).toFixed(1)}px, 0) translateY(-50%)`;
    }
  };
  let sway = 0;
  const frame = (t) => {
    raf = 0;
    if (!running || dead) return;
    const dt = Math.min(0.25, (t - last) / 1000 || 0.016);
    last = t;
    now += dt;
    for (const tw of [...tweens]) tw();
    sway += dt;
    view.yaw += (view.toYaw + Math.sin(sway * 0.42) * 0.035 - view.yaw) * Math.min(1, dt * 4.5);
    view.pitch += (view.toPitch - view.pitch) * Math.min(1, dt * 4.5);
    draw();
    watch(dt);
    raf = requestAnimationFrame(frame);
  };
  const draw = () => {
    turn.rotation.set(view.pitch, view.yaw, 0);
    const b = 0.55 + 0.45 * Math.max(on[2], 0.2);
    calendar.mat.color.setScalar(0.5 + 0.5 * on[2]);
    board.mat.color.setScalar(0.5 + 0.5 * on[3]);
    chat.mat.color.setScalar(0.5 + 0.5 * on[4]);
    paid.mat.color.setScalar(0.5 + 0.5 * on[4]);
    halo.material.opacity = 0.2 + 0.18 * on[0] * b;
    orb.scale.setScalar(1.35 + Math.sin(now * 2.2) * 0.12);
    renderer.render(scene, camera);
    labels();
    drawn += 1;
  };
  // a slow machine: after two seconds of slow frames the page takes the still back
  let slowFor = 0, fastSeen = 0;
  const watch = (dt) => {
    if (opts.force || drawn < 20) return;
    if (dt > 0.045) slowFor += dt; else { slowFor = Math.max(0, slowFor - dt * 2); fastSeen += dt; }
    if (slowFor > 2.2 && fastSeen < 1.5 && opts.onSlow) { opts.onSlow(); }
  };

  const move = (e) => {
    const r = host.getBoundingClientRect();
    const x = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1.6, 1.6), y = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1.2, 1.2);
    view.toYaw = x * 0.15;
    view.toPitch = y * 0.045;
  };
  const leave = () => { view.toYaw = 0; view.toPitch = 0; };
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hero = host.closest('section') || host;
  if (fine && !opts.still) { hero.addEventListener('pointermove', move, { passive: true }); hero.addEventListener('pointerleave', leave, { passive: true }); }
  const ro = new ResizeObserver(() => { resize(); if (!running) draw(); });

  const api = {
    canvas,
    play() { if (running || dead || opts.still) return; running = true; last = performance.now(); if (!raf) raf = requestAnimationFrame(frame); if (opts.onState) opts.onState('play'); },
    pause() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; if (opts.onState) opts.onState('pause'); },
    get running() { return running; },
    setBiz(biz) { S.biz = biz; S.need = 3; S.done = {}; sign.paint(S.biz); board.paint(S.need, S.handled, S.done, -1); if (!running) draw(); },
    approve(id) { return act(id, true); },
    decline(id) { return act(id, false); },
    reset() { S.need = 3; S.done = {}; board.paint(S.need, S.handled, S.done, -1); },
    state() { return { need: S.need, done: { ...S.done }, on: [...on], label: labelOn, frames: drawn, running }; },
    still(w, h) {            // one finished frame as a picture (the poster is made with this)
      renderer.setPixelRatio(1); renderer.setSize(w, h, false); camera.aspect = w / h; view.fit = h / Math.min(h, w / FRAME); camera.updateProjectionMatrix(); place();
      view.w = w; view.h = h; turn.rotation.set(0, 0, 0); draw();
      return canvas.toDataURL('image/png');
    },
    points() { return { 2: point(2), 3: point(3), 4: point(4) }; },
    destroy() {
      dead = true; running = false; if (raf) cancelAnimationFrame(raf);
      ro.disconnect(); hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', leave);
      tweens.clear();
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } });
      tOff.dispose(); tOn.dispose(); renderer.dispose();
      const lose = renderer.getContext().getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
      canvas.remove();
    },
  };

  repaint();
  host.prepend(canvas);
  resize(true);
  ro.observe(host);
  draw();
  if (!opts.still) {
    api.play();
    busy = enter().then(() => { idle(); });
  }
  return api;
}
