/* getoios.com front door: the 3D opener (#core). One dark room: the owner at a
   counter, Jarvis at his right shoulder, Sunny, Penny and Dash at three desks in
   an arc behind them. Five camera stops, one gesture each, then the page hands
   off to #today. Plan: ~/Plans/2026-11-02-getoios-3d-owner-jarvis-three-desks.md.
   three.js is vendored at /jarvis/vendor/three (pinned, MIT). No CDN, no sound.
   State is published on #core as data-core-* attributes; window.__core3d is the
   small API the stills script and tests/pages/core-3d.spec.ts read. */

const section = document.getElementById('core');
if (section) start(section);

function start(section) {
  const BG = 0x090909;
  const MOVE_MS = 2400;     // one gesture = one curved move of this length
  const QUIET_MS = 250;     // trackpad momentum: wheel is ignored until this much quiet after a move
  const SWIPE_PX = 40;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const phone = innerWidth < 860;
  const stops = Array.prototype.slice.call(section.querySelectorAll('.c3-stop'));
  const dots = Array.prototype.slice.call(section.querySelectorAll('.c3-dots button'));
  const skip = section.querySelector('.c3-skip');
  const today = document.getElementById('today');

  const state = { stop: 1, moving: false, locked: false, models: 0 };
  function put(k, v) { section.setAttribute('data-core-' + k, String(v)); }
  function publish() { put('stop', state.stop); put('moving', state.moving); put('locked', state.locked); put('models', state.models); }
  function showCopy(n) {
    stops.forEach(function (el) { el.classList.toggle('is-on', +el.getAttribute('data-stop') === n); });
    dots.forEach(function (b) {
      if (+b.getAttribute('data-go') === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
  }

  /* ---- reduced motion or no WebGL: a poster and the five lines as text ---- */
  function goStatic() {
    section.classList.add('is-static');
    stops.forEach(function (el) { el.classList.add('is-on'); });
    if (!section.querySelector('.c3-poster')) {
      var pic = document.createElement('picture');
      pic.className = 'c3-poster';
      pic.innerHTML = '<source media="(max-width: 859px)" srcset="/jarvis/core3d/core-poster-390.webp">' +
        '<img src="/jarvis/core3d/core-poster-1440.webp" alt="" width="1440" height="900" decoding="async">';
      section.insertBefore(pic, section.firstChild);
    }
    state.locked = false; publish(); put('state', 'static');
  }
  function hasWebGL() {
    try { var c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (_) { return false; }
  }
  if (reduce || !hasWebGL()) { goStatic(); return; }

  import('/jarvis/vendor/three/three.module.js').then(build).catch(function (err) {
    console.error('core3d: three.js failed to load', err);
    goStatic();
  });

  function build(T) {
    var v = function (x, y, z) { return new T.Vector3(x, y, z); };

    /* ---- the cast: files, real heights (README scales), seats, tints ------- */
    var CAST = {
      owner:  { file: 'owner',  scale: 1.87, clip: 'idle',           pos: [0, 0, 0.18],      rot: 0.1 },
      jarvis: { file: 'jarvis', scale: 1.966, clip: 'standing_relax', pos: [-0.8, 0, -0.22], rot: 0.55 },
      sunny:  { file: 'sunny',  scale: 1.82, clip: 'typing', seat: 0.01, tint: [1.0, 0.72, 0.25], desk: [-4.2, 0, -3.0] },
      penny:  { file: 'penny',  scale: 1.72, clip: 'typing', seat: 0,    tint: [0.2, 1.0, 0.55],  desk: [0.6, 0, -5.2] },
      dash:   { file: 'dash',   scale: 1.92, clip: 'typing', seat: 0.01, tint: [0.35, 0.72, 1.0], desk: [4.4, 0, -2.8] }
    };
    var AGENTS = ['sunny', 'penny', 'dash'];
    var COUNTER = v(0.1, 0.87, 0.72);   // where the threads land: on the owner's counter top
    function modelUrl(file) { return '/jarvis/core3d/models/' + file + '/' + file + '.gltf'; }
    function variant(file) { return phone ? file + '-m' : file; }

    /* ---- renderer, scene, camera ------------------------------------------ */
    var canvas = document.createElement('canvas');
    canvas.className = 'c3-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    section.insertBefore(canvas, section.firstChild);
    var renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 1.75));
    renderer.setClearColor(BG, 1);
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;

    var scene = new T.Scene();
    scene.fog = new T.FogExp2(BG, 0.052);
    var pmrem = new T.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new T.RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.32;
    pmrem.dispose();

    var camera = new T.PerspectiveCamera(32, 1, 0.1, 80);
    var target = v(0, 1.2, 0);
    var portrait = false;
    function sizeRenderer() {
      var w = section.clientWidth, h = section.clientHeight;
      portrait = w < h;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = portrait ? 44 : 32;
      camera.updateProjectionMatrix();
    }
    sizeRenderer();

    /* ---- light: a dawn key on the people, a cool rim, a low sky ------------ */
    var key = new T.DirectionalLight(0xffd3a6, 2.6);
    key.position.set(-3.2, 2.7, 4.6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5; key.shadow.camera.far = 18;
    key.shadow.camera.left = -4; key.shadow.camera.right = 4; key.shadow.camera.top = 4; key.shadow.camera.bottom = -4;
    key.shadow.bias = -0.0005;
    scene.add(key, key.target);
    var rim = new T.DirectionalLight(0x9db6ff, 1.6);
    rim.position.set(-3, 3.2, -4.5);
    scene.add(rim);
    scene.add(new T.HemisphereLight(0x2a2440, 0x050505, 0.55));
    var counterLamp = new T.PointLight(0xffc48a, 2.2, 5, 2);
    counterLamp.position.set(0.3, 1.25, 0.9);
    scene.add(counterLamp);

    /* ---- the room: floor, a grid that fades, dust in the light ------------- */
    var floor = new T.Mesh(new T.PlaneGeometry(80, 80), new T.MeshStandardMaterial({ color: 0x0c0c0f, roughness: 0.93, metalness: 0.04 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    (function grid() {
      var pts = [], half = 24, y = 0.003;
      for (var i = -half; i <= half; i++) { pts.push(i, y, -half, i, y, half, -half, y, i, half, y, i); }
      var g = new T.BufferGeometry();
      g.setAttribute('position', new T.Float32BufferAttribute(pts, 3));
      scene.add(new T.LineSegments(g, new T.LineBasicMaterial({ color: 0x24242e, transparent: true, opacity: 0.5 })));
    })();
    var disc = (function () {
      var c = document.createElement('canvas'); c.width = c.height = 64;
      var x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.45, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
      var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t;
    })();
    var DUST = phone ? 360 : 700;
    var dustPos = new Float32Array(DUST * 3), dustVel = new Float32Array(DUST * 3);
    for (var d = 0; d < DUST; d++) {
      dustPos[d * 3] = (Math.random() - 0.5) * 18; dustPos[d * 3 + 1] = Math.random() * 4; dustPos[d * 3 + 2] = -7 + Math.random() * 13;
      dustVel[d * 3] = (Math.random() - 0.5) * 0.05; dustVel[d * 3 + 1] = -0.01 - Math.random() * 0.025; dustVel[d * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }
    var dustGeo = new T.BufferGeometry();
    dustGeo.setAttribute('position', new T.BufferAttribute(dustPos, 3));
    var dust = new T.Points(dustGeo, new T.PointsMaterial({ size: 0.035, map: disc, color: 0xffe3bf, transparent: true, opacity: 0.55, depthWrite: false, blending: T.AdditiveBlending, sizeAttenuation: true }));
    scene.add(dust);

    /* ---- the desks: one workstation set each, in its own colour pool ------- */
    var deskGroups = {}, pools = [], glows = [];
    AGENTS.forEach(function (k) {
      var c = CAST[k], g = new T.Group();
      g.position.set(c.desk[0], c.desk[1], c.desk[2]);
      g.rotation.y = Math.atan2(0 - c.desk[0], 0.3 - c.desk[2]);   // the sitter faces the counter
      var tint = new T.Color().setRGB(c.tint[0], c.tint[1], c.tint[2]);
      var pool = new T.Mesh(new T.CircleGeometry(1.7, 48), new T.MeshBasicMaterial({ color: tint, map: disc, transparent: true, opacity: 0.42, depthWrite: false, blending: T.AdditiveBlending }));
      pool.rotation.x = -Math.PI / 2; pool.position.set(0, 0.006, 0.45);
      g.add(pool); pools.push(pool);
      var glow = new T.Mesh(new T.PlaneGeometry(0.56, 0.42), new T.MeshBasicMaterial({ color: tint.clone().multiplyScalar(0.5), transparent: true, opacity: 0.95 }));
      glow.position.set(0, 0.96, 0.962); glow.rotation.y = Math.PI;   // the screen faces the sitter
      g.add(glow); glows.push(glow);
      var lamp = new T.PointLight(tint, 7.5, 6.5, 2);
      lamp.position.set(0, 1.35, 0.75);
      g.add(lamp);
      scene.add(g);
      deskGroups[k] = g;
    });
    var counter = new T.Group();   // the owner's counter: the same desk, lifted to counter height
    scene.add(counter);
    scene.updateMatrixWorld(true);

    /* ---- light threads from each desk to the counter --------------------- */
    var threads = AGENTS.map(function (k, i) {
      var g = deskGroups[k], c = CAST[k];
      var a = g.localToWorld(v(0, 0.98, 1.0));           // from behind the monitor
      var mid = a.clone().lerp(COUNTER, 0.5); mid.y = 0.5;   // a gentle sag, never above head height
      var curve = new T.CatmullRomCurve3([a, mid, COUNTER.clone()], false, 'centripetal');
      var N = 96, pts = curve.getPoints(N - 1), pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
      for (var j = 0; j < N; j++) { pos[j * 3] = pts[j].x; pos[j * 3 + 1] = pts[j].y; pos[j * 3 + 2] = pts[j].z; }
      var geo = new T.BufferGeometry();
      geo.setAttribute('position', new T.BufferAttribute(pos, 3));
      geo.setAttribute('color', new T.BufferAttribute(col, 3));
      var line = new T.Line(geo, new T.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 1, depthWrite: false, blending: T.AdditiveBlending, fog: false }));
      scene.add(line);
      return { line: line, col: col, n: N, tint: c.tint, lit: 0, want: 0, phase: i * 0.33 };
    });
    function lightThreads(n) {
      threads.forEach(function (t, i) { t.want = n === 5 ? 1 : (n === i + 2 ? 1 : 0); });
    }
    function tickThreads(dt, time) {
      threads.forEach(function (t) {
        t.lit += (t.want - t.lit) * Math.min(1, dt * 2.2);
        var base = t.lit * 0.26, head = (time * 0.42 + t.phase) % 1;   // unlit threads stay dark
        for (var j = 0; j < t.n; j++) {
          var s = j / (t.n - 1), dist = s - head; dist -= Math.round(dist);
          var pulse = Math.max(0, 1 - Math.abs(dist) * 9);
          var b = base + t.lit * pulse * pulse * 1.6;
          t.col[j * 3] = t.tint[0] * b; t.col[j * 3 + 1] = t.tint[1] * b; t.col[j * 3 + 2] = t.tint[2] * b;
        }
        t.line.geometry.attributes.color.needsUpdate = true;
      });
    }

    /* ---- models ------------------------------------------------------------ */
    var loader = new T.GLTFLoader();
    loader.setMeshoptDecoder(T.MeshoptDecoder);
    var figures = {}, mixers = [], holoBodies = [], pieces = {};
    function loadPiece(name) {
      return loader.loadAsync(modelUrl(name === 'chair' ? variant(name) : name)).then(function (gltf) {
        var meshes = [];
        gltf.scene.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; meshes.push(o); } });
        if (name === 'desk') meshes.forEach(function (o) {
          // a flat black box reads as nothing: a little sheen and a faint line round the top edge give it a shape
          if (o.material) { o.material.roughness = 0.45; o.material.metalness = 0.3; o.material.envMapIntensity = 1.1; }
          o.geometry.computeBoundingBox();
          var b = o.geometry.boundingBox, y = b.max.y + (b.max.y - b.min.y) * 0.003;
          var rim = new T.BufferGeometry().setFromPoints([v(b.min.x, y, b.min.z), v(b.max.x, y, b.min.z), v(b.max.x, y, b.max.z), v(b.min.x, y, b.max.z)]);
          o.add(new T.LineLoop(rim, new T.LineBasicMaterial({ color: 0x9aa0b8, transparent: true, opacity: 0.45, depthWrite: false })));
        });
        pieces[name] = gltf.scene;
        return gltf.scene;
      });
    }
    function placeSets() {
      AGENTS.forEach(function (k) {
        var g = deskGroups[k], seat = CAST[k].seat || 0;
        ['desk', 'monitor', 'keyboard', 'chair'].forEach(function (p) {
          var m = pieces[p].clone();
          if (p === 'chair' && seat) { var top = m.getObjectByName('chair_top'); if (top) top.position.y += seat; }
          g.add(m);
        });
      });
      var c = pieces.desk.clone();
      c.scale.y = 1.18;   // counter height: the desk top at 0.72 m becomes 0.85 m
      counter.add(c);
    }
    function tintHolo(o, tint) {
      if (['holo_base', 'holo_lens', 'holo_column', 'holo_ring'].indexOf(o.name) >= 0) { o.visible = false; return; }
      var m = o.material; if (!m) return;
      var n = m.name || '';
      if (n.indexOf('holo_body') === 0) {
        m.color.setRGB(tint[0], tint[1], tint[2]); m.transparent = true;
        holoBodies.push({ mat: m, base: m.opacity, seed: Math.random() * 10 });
      } else if (n === 'holo_shell') {
        m.color.setRGB(tint[0], tint[1], tint[2]).lerp(new T.Color(1, 1, 1), 0.45); m.transparent = true;
      } else if (n === 'holo_column' || n === 'holo_ring') { m.depthWrite = false; }
    }
    function addFigure(k) {
      var c = CAST[k];
      return loader.loadAsync(modelUrl(variant(c.file))).then(function (gltf) {
        var root = gltf.scene;
        root.scale.setScalar(c.scale);
        root.traverse(function (o) {
          if (!o.isMesh) return;
          o.frustumCulled = false;
          if (c.tint) tintHolo(o, c.tint);
          else { o.castShadow = true; if (o.material) o.material.envMapIntensity = 0.55; }
        });
        if (c.desk) { root.position.y = c.seat || 0; deskGroups[k].add(root); }
        else { root.position.set(c.pos[0], c.pos[1], c.pos[2]); root.rotation.y = c.rot; scene.add(root); }
        var mixer = new T.AnimationMixer(root);
        mixers.push(mixer);
        var clips = gltf.animations || [];
        function clip(name) { for (var i = 0; i < clips.length; i++) if (clips[i].name === name) return clips[i]; return null; }
        var fig = { root: root, scale: c.scale, mixer: mixer, clips: clips };
        var main = clip(c.clip);
        if (main) { fig.main = mixer.clipAction(main); fig.main.play(); if (c.clip === 'typing') fig.main.time = Math.random() * main.duration; }
        if (k === 'jarvis') {
          var agree = clip('agree');
          if (agree && fig.main) {
            fig.agree = mixer.clipAction(agree);
            fig.agree.setLoop(T.LoopOnce, 1); fig.agree.clampWhenFinished = true;
            mixer.addEventListener('finished', function (e) {
              if (e.action !== fig.agree) return;
              fig.main.enabled = true; fig.main.reset().crossFadeFrom(fig.agree, 0.5, true).play();
              fig.nodding = false;
            });
          }
        }
        figures[k] = fig;
        state.models++; publish();
        return fig;
      });
    }
    function nod() {
      var j = figures.jarvis; if (!j || !j.agree || j.nodding) return;
      j.nodding = true;
      j.agree.reset().play();
      j.agree.crossFadeFrom(j.main, 0.35, true);
    }

    /* ---- the five stops and the rail between them -------------------------- */
    function pose(n) {
      var p, t;
      if (n === 1) { if (portrait) return { p: v(2.4, 1.75, 4.6), t: v(-0.45, 0.75, 0.1) }; p = v(2.6, 1.6, 4.0); t = v(-1.3, 1.15, 0.0); }
      else if (n === 5) { p = v(0.9, 2.8, 8.6); t = v(0, 1.0, -2.0); }
      else {
        var g = deskGroups[AGENTS[n - 2]], side = n === 3 ? 1 : -1;
        p = g.localToWorld(v(side * 2.3, 1.42, 3.0)); t = g.localToWorld(v(side * -0.35, 1.02, 0.25));
      }
      if (portrait) {
        var f = n === 5 ? 1.08 : (n === 1 ? 1.2 : 1.28);
        p = t.clone().add(p.clone().sub(t).multiplyScalar(f)); t = t.clone(); t.y -= (n === 5 ? 0.1 : 0.22);
      }
      return { p: p, t: t };
    }
    function ease(k) { return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; }
    var move = null;
    function land(n) { if (n === 1) nod(); }
    function goTo(n, instant) {
      n = Math.max(1, Math.min(5, n | 0));
      var q = pose(n);
      if (instant) {
        move = null; camera.position.copy(q.p); target.copy(q.t); camera.lookAt(target);
        state.stop = n; state.moving = false; showCopy(n); lightThreads(n); publish(); land(n);
        return;
      }
      if (state.moving) return;
      var from = camera.position.clone(), dvec = q.p.clone().sub(from), dist = dvec.length();
      var up = v(0, 1, 0), side = dvec.clone().normalize().cross(up);
      if (side.lengthSq() < 1e-6) side.set(1, 0, 0); else side.normalize();
      // A crane move that swings round the room's centre (the counter), never across it: of the two
      // sideways bulges, take the one whose midpoint is farther from the origin, and lift the middle.
      var centre = from.clone().add(q.p).multiplyScalar(0.5);
      var plus = centre.clone().addScaledVector(side, dist * 0.2), minus = centre.clone().addScaledVector(side, -dist * 0.2);
      var bulge = (plus.x * plus.x + plus.z * plus.z) >= (minus.x * minus.x + minus.z * minus.z) ? 1 : -1;
      var mid = centre.addScaledVector(side, dist * 0.2 * bulge).addScaledVector(up, dist * 0.14);
      move = { curve: new T.CatmullRomCurve3([from, mid, q.p], false, 'centripetal'), fromT: target.clone(), toT: q.t, t0: performance.now(), n: n, swapped: false };
      state.moving = true; state.stop = n; publish();
      stops.forEach(function (el) { el.classList.remove('is-on'); });
      showDots(n); lightThreads(n);
    }
    function showDots(n) {
      dots.forEach(function (b) { if (+b.getAttribute('data-go') === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    }
    function tickMove(now) {
      if (!move) return;
      var k = Math.min(1, (now - move.t0) / MOVE_MS), e = ease(k);
      camera.position.copy(move.curve.getPoint(e));
      target.copy(move.fromT).lerp(move.toT, e);
      camera.lookAt(target);
      if (!move.swapped && k >= 0.55) { move.swapped = true; showCopy(move.n); }
      if (k >= 1) {
        var n = move.n; move = null;
        state.moving = false; wheelLast = now; armed = false; publish(); land(n);
      }
    }

    /* ---- gestures: one gesture, one move; never trap ----------------------- */
    var armed = true, wheelLast = 0, left = false, releasedAt = -1e9, touchY = null;
    function gesture(dir) {
      if (state.moving) return;
      if (dir > 0) { if (state.stop >= 5) release(); else goTo(state.stop + 1); }
      else if (state.stop > 1) goTo(state.stop - 1);
    }
    function release() {
      state.locked = false; left = true; releasedAt = performance.now(); publish();
      if (today) scrollTo({ top: Math.round(today.getBoundingClientRect().top + scrollY), behavior: 'smooth' });
    }
    addEventListener('wheel', function (e) {
      if (!state.locked) return;
      e.preventDefault();
      // The event's own time, not its delivery time: on a slow frame a queued
      // momentum tick arrives late and would otherwise read as a fresh gesture.
      var t = e.timeStamp || performance.now();
      if (state.moving) { wheelLast = Math.max(wheelLast, t); return; }
      if (!armed) { if (t - wheelLast > QUIET_MS) armed = true; else { wheelLast = Math.max(wheelLast, t); return; } }
      wheelLast = Math.max(wheelLast, t);
      if (Math.abs(e.deltaY) < 1) return;
      gesture(e.deltaY > 0 ? 1 : -1);
    }, { passive: false });
    addEventListener('keydown', function (e) {
      if (!state.locked || e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target;
      if (t && t.closest && t.closest('input,textarea,select,button,a,[contenteditable]')) return;
      var dir = 0;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') dir = 1;
      else if (e.key === ' ') dir = e.shiftKey ? -1 : 1;
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') dir = -1;
      if (!dir) return;
      e.preventDefault();
      gesture(dir);
    });
    section.addEventListener('touchstart', function (e) {
      if (!state.locked) return;
      touchY = e.touches && e.touches[0] ? e.touches[0].clientY : null;
    }, { passive: true });
    section.addEventListener('touchmove', function (e) {
      if (state.locked && e.cancelable) e.preventDefault();
    }, { passive: false });
    section.addEventListener('touchend', function (e) {
      if (!state.locked || touchY == null) return;
      var t = e.changedTouches && e.changedTouches[0]; if (!t) return;
      var dy = touchY - t.clientY; touchY = null;
      if (Math.abs(dy) < SWIPE_PX) return;
      gesture(dy > 0 ? 1 : -1);
    }, { passive: true });
    addEventListener('scroll', function () {
      if (scrollY > 2) {
        if (state.locked) { state.locked = false; publish(); }
        left = true;
      } else if (left && !state.locked && performance.now() - releasedAt > 600) {
        // back at the top from below: re-enter at the wide shot, wheel disarmed
        left = false; state.locked = true; armed = false; wheelLast = performance.now();
        goTo(5, true);
      }
    }, { passive: true });
    dots.forEach(function (b) { b.addEventListener('click', function () { goTo(+b.getAttribute('data-go')); }); });
    if (skip) skip.addEventListener('click', function () { state.locked = false; left = true; releasedAt = performance.now(); publish(); });

    /* ---- the loop: only while #core is on screen and the tab is visible ---- */
    var clock = new T.Clock(false), raf = 0, visible = true, time = 0;
    function tick() {
      raf = 0;
      if (!visible || document.hidden) return;
      var dt = Math.min(0.1, clock.getDelta()), now = performance.now();
      time += dt;
      tickMove(now);
      for (var i = 0; i < mixers.length; i++) mixers[i].update(dt);
      for (var h = 0; h < holoBodies.length; h++) {
        var hb = holoBodies[h], tt = time * 6.3 + hb.seed;
        hb.mat.opacity = Math.max(0.05, Math.min(1, hb.base + 0.08 * Math.sin(tt) * Math.sin(tt * 1.73 + 1.1)));
      }
      var pa = dust.geometry.attributes.position.array;
      for (var p = 0; p < DUST; p++) {
        var ix = p * 3;
        pa[ix] += dustVel[ix] * dt; pa[ix + 1] += dustVel[ix + 1] * dt; pa[ix + 2] += dustVel[ix + 2] * dt;
        if (pa[ix + 1] < 0) pa[ix + 1] = 4;
        if (pa[ix] < -9) pa[ix] = 9; else if (pa[ix] > 9) pa[ix] = -9;
      }
      dust.geometry.attributes.position.needsUpdate = true;
      tickThreads(dt, time);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }
    function run() { if (!raf && visible && !document.hidden) { clock.start(); clock.getDelta(); raf = requestAnimationFrame(tick); } }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting; if (visible) run();
      }, { threshold: 0 }).observe(section);
    }
    document.addEventListener('visibilitychange', run);
    addEventListener('resize', function () {
      sizeRenderer();
      if (!move) { var q = pose(state.stop); camera.position.copy(q.p); target.copy(q.t); camera.lookAt(target); }
    });

    /* ---- load: owner, Jarvis and the sets first; the agents stream in ------ */
    goTo(1, true);
    state.locked = scrollY <= 2 && !reduce;
    publish();
    run();
    Promise.all([loadPiece('desk'), loadPiece('monitor'), loadPiece('keyboard'), loadPiece('chair'), addFigure('owner'), addFigure('jarvis')])
      .then(function () {
        placeSets();
        scene.updateMatrixWorld(true);
        renderer.render(scene, camera);
        put('state', 'rendered');
        if (state.stop === 1 && !state.moving) nod();
        return addFigure('sunny');
      })
      .then(function () { return addFigure('penny'); })
      .then(function () { return addFigure('dash'); })
      .catch(function (err) { console.error('core3d: a model failed to load', err); });

    /* ---- the API the stills script and the frozen spec read ---------------- */
    function sample() {
      renderer.render(scene, camera);
      var gl = renderer.getContext(), w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
      var px = new Uint8Array(w * h * 4);
      gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
      var differ = 0, n = 0;
      for (var i = 0; i < px.length; i += 4 * 37) {
        n++;
        if (Math.abs(px[i] - 9) + Math.abs(px[i + 1] - 9) + Math.abs(px[i + 2] - 9) > 24) differ++;
      }
      return n ? differ / n : 0;
    }
    function bytes() {
      return performance.getEntriesByType('resource').filter(function (e) { return e.name.indexOf('/jarvis/core3d/models/') >= 0; })
        .reduce(function (s, e) { return s + (e.transferSize || e.encodedBodySize || 0); }, 0);
    }
    function measure() {
      scene.updateMatrixWorld(true);
      var out = { portrait: portrait, stop: state.stop };
      ['owner', 'jarvis'].forEach(function (k) {
        var f = figures[k]; if (!f) return;
        var box = new T.Box3().setFromObject(f.root, true);
        out[k] = { posedHeightM: +(box.max.y - box.min.y).toFixed(3), feetY: +box.min.y.toFixed(3), topY: +box.max.y.toFixed(3) };
      });
      AGENTS.forEach(function (k) {
        var f = figures[k]; if (!f) return;
        var g = deskGroups[k];
        function localY(name) { var o = f.root.getObjectByName(name) || f.root.getObjectByName(name.replace(':', '')); if (!o) return null; return +g.worldToLocal(o.getWorldPosition(new T.Vector3())).y.toFixed(3); }
        var box = new T.Box3().setFromObject(f.root, true);
        out[k] = { leftForeArmY: localY('mixamorig:LeftForeArm'), leftHandY: localY('mixamorig:LeftHand'), rightHandY: localY('mixamorig:RightHand'), headY: localY('mixamorig:Head'), seatedTopY: +(box.max.y - g.position.y).toFixed(3), deskTopY: 0.72, keysY: 0.735, seatY: 0.465 + (CAST[k].seat || 0) };
      });
      return out;
    }
    window.__core3d = { goTo: goTo, sample: sample, bytes: bytes, measure: measure, get stop() { return state.stop; }, get moving() { return state.moving; }, get locked() { return state.locked; } };
  }
}
