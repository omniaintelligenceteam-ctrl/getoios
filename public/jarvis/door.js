/* getoios.com front door: page-local behaviour.
   Reads each act's --sc-p (written by the engine) and drives three things the
   kit does not: Jarvis's replies streaming at the speed of the wheel, the light
   that rises while he speaks, and the state word in the chrome. Plus the
   approval control, the pillar choice, the tab rail and the handoff form.
   The engine is untouched. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('jv-js');
  var reduce = !!(window.ScrollCraft && ScrollCraft.reduce) || matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var phone = innerWidth < 860;

  /* Two responsive decisions the engine reads once, at mount. On a phone the
     closing form is taller than the screen, so it flows instead of pinning.
     Under reduced motion nothing streams with the wheel, so the pinned acts
     hold for far less scroll. */
  var startEl = document.getElementById('start');
  if (phone && startEl) startEl.setAttribute('data-sc-act', 'flow');
  if (reduce) {
    var shortSpans = { today: '1.2', desks: '1.2', approve: '1.6' };
    Object.keys(shortSpans).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.setAttribute('data-sc-span', shortSpans[id]);
    });
  }
  if (window.ScrollCraft) ScrollCraft.mount(document.body);

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function actP(act) { return act ? (parseFloat(act.style.getPropertyValue('--sc-p')) || 0) : 0; }

  /* ---- the state word and its colour (the product's own moods) ---------- */
  var MOOD = { listening: '#5fd38a', thinking: '#8b7bf0', speaking: '#4fd6e0', acting: '#f5772b', confirm: '#e0b65f', ready: '#e8e8f0' };
  var ENERGY = { listening: 0.3, thinking: 0.45, speaking: 1, acting: 0.6, confirm: 0.55, ready: 0.16 };
  var stateEl = document.querySelector('[data-jv-state]');
  var clockEl = document.querySelector('[data-jv-clock]');
  var mood = '';
  function setMood(m) {
    if (m === mood) return;
    mood = m;
    if (stateEl) stateEl.textContent = 'Not listening';
    root.style.setProperty('--jv-mood', MOOD[m]);
    root.setAttribute('data-jv-mood', m);
  }
  function setClock(t) { if (clockEl && clockEl.textContent !== t) clockEl.textContent = t; }

  /* ---- speech: split each reply into words the wheel reveals ----------- */
  var says = [];
  Array.prototype.forEach.call(document.querySelectorAll('[data-jv-say]'), function (el) {
    var win = (el.getAttribute('data-jv-say') || '0 1').split(/\s+/).map(parseFloat);
    var text = el.textContent.replace(/\s+/g, ' ').trim();
    el.textContent = '';
    var words = text.split(' ').map(function (w, i) {
      var s = document.createElement('span');
      s.className = 'jv-w';
      s.textContent = (i ? ' ' : '') + w;
      el.appendChild(s);
      return s;
    });
    var caret = document.createElement('span');
    caret.className = 'jv-caret';
    caret.setAttribute('aria-hidden', 'true');
    el.appendChild(caret);
    says.push({ el: el, turn: el.closest('.jv-turn'), act: el.closest('[data-sc-act]'), from: win[0] || 0, to: isNaN(win[1]) ? 1 : win[1], words: words, shown: -1 });
  });

  /* ---- gated elements: on once the act's progress passes data-jv-at ----- */
  var gates = Array.prototype.map.call(document.querySelectorAll('[data-jv-at],[data-jv-tick]'), function (el) {
    return { el: el, act: el.closest('[data-sc-act]'), at: parseFloat(el.getAttribute('data-jv-at') || el.getAttribute('data-jv-tick')) || 0, on: null };
  });

  /* ---- the acts with bespoke state ------------------------------------- */
  var today = document.getElementById('today');
  var approve = document.getElementById('approve');
  var desks = document.getElementById('desks');
  var start = document.getElementById('start');
  var board = document.getElementById('board');
  var pillars = document.getElementById('pillars');
  var line = document.getElementById('line');
  var todayStage = today && today.querySelector('[data-sc-stage]');
  var approveStage = approve && approve.querySelector('[data-sc-stage]');
  var approval = document.querySelector('.jv-approval');
  var decided = '';
  /* Under reduced motion the first reply is shown whole, so its rows are too. */
  if (reduce) gates.forEach(function (g) { if (g.act === today) g.at = -1; });

  var current = null;
  var sections = [today, board, desks, line, approve, pillars, start].filter(Boolean);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) current = e.target; });
    }, { rootMargin: '-48% 0px -48% 0px', threshold: 0 });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---- tab rail: the current section -------------------------------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.jv-tab'));
  var tabFor = { today: 'today', board: 'today', desks: 'desks', line: 'approve', approve: 'approve', pillars: 'pillars', start: 'start' };
  var curTab = '';
  function setTab(id) {
    if (id === curTab) return;
    curTab = id;
    tabs.forEach(function (t) {
      if (t.getAttribute('href') === '#' + id) t.setAttribute('aria-current', 'true');
      else t.removeAttribute('aria-current');
    });
  }

  /* ---- the light ------------------------------------------------------- */
  var glow = document.querySelector('.jv-glow');
  var energy = 0.16, energyTarget = 0.16;
  var mx = 0, my = 0, tx = 0, ty = 0;
  if (fine && !reduce) {
    addEventListener('pointermove', function (e) {
      tx = (e.clientX / innerWidth - 0.5) * 28;
      ty = (e.clientY / innerHeight - 0.5) * 20;
    }, { passive: true });
  }
  var lastGlow = '';

  /* ---- per-frame ------------------------------------------------------- */
  var lastAdvance = 0;
  var todayState = { shown: 0, total: 0, done: false, live: false };
  var approveState = { shown: 0, total: 0, done: false, live: false };
  var lastVerify = { today: '', approve: '' };

  function frame(now) {
    var i, s, p, k, n, changed = false;
    var sumToday = 0, totToday = 0, sumApprove = 0, totApprove = 0;

    for (i = 0; i < says.length; i++) {
      s = says[i];
      p = actP(s.act);
      k = clamp01((p - s.from) / Math.max(s.to - s.from, 0.001));
      n = reduce ? (p >= s.from ? s.words.length : 0) : Math.round(k * s.words.length);
      if (n !== s.shown) {
        for (var w = 0; w < s.words.length; w++) s.words[w].classList.toggle('is-on', w < n);
        var wasLive = s.el.classList.contains('is-live');
        s.el.classList.toggle('is-live', n > 0 && n < s.words.length);
        if (s.turn) s.turn.classList.toggle('is-empty', n === 0);
        s.el.classList.toggle('is-done', n >= s.words.length);
        if (n > 0 && n < s.words.length && (n > s.shown || wasLive)) lastAdvance = now;
        s.shown = n;
        changed = true;
      }
      if (s.act === today) { sumToday += n; totToday += s.words.length; }
      if (s.act === approve) { sumApprove += n; totApprove += s.words.length; }
    }
    todayState.shown = sumToday; todayState.total = totToday; todayState.done = sumToday >= totToday && totToday > 0;
    approveState.shown = sumApprove; approveState.total = totApprove; approveState.done = sumApprove >= totApprove && totApprove > 0;

    var rowsOn = 0;
    for (i = 0; i < gates.length; i++) {
      var g = gates[i];
      var on = actP(g.act) >= g.at;
      if (on !== g.on) { g.el.classList.toggle('is-on', on); g.on = on; changed = true; }
      if (on && g.act === today) rowsOn++;
    }

    /* mood from where the reader is and what the voice is doing */
    var m = 'ready', clock = '';
    var speakingNow = (now - lastAdvance) < 650;
    if (current === today || !current) {
      clock = todayState.done ? '7:41 am' : '7:40 am';
      if (todayState.shown === 0) m = 'listening';
      else if (!todayState.done) m = speakingNow ? 'speaking' : 'listening';
      else m = 'ready';
    } else if (current === board) { m = 'ready'; }
    else if (current === desks) { m = 'acting'; }
    else if (current === line) { m = 'ready'; }
    else if (current === approve) {
      clock = decided === 'sent' ? '2:11 pm' : '2:10 pm';
      var cardOn = actP(approve) >= 0.57;
      if (decided) m = 'ready';
      else if (cardOn) m = 'confirm';
      else if (approveState.shown === 0) m = 'thinking';
      else if (!approveState.done) m = speakingNow ? 'speaking' : 'listening';
      else m = 'confirm';
    } else if (current === pillars) { m = 'ready'; }
    else if (current === start) { m = 'listening'; }
    setMood(m);
    setClock(clock);
    if (current) setTab(tabFor[current.id] || curTab);

    /* the light: rises while he speaks, settles when he stops */
    energyTarget = ENERGY[m] || 0.16;
    if (reduce) energy = energyTarget;
    else energy += (energyTarget - energy) * 0.07;
    mx += (tx - mx) * 0.06; my += (ty - my) * 0.06;
    if (glow) {
      var op = (0.16 + energy * 0.5).toFixed(3);
      var sc = (0.9 + energy * 0.22).toFixed(3);
      var tr = reduce ? 'none' : 'translate3d(' + mx.toFixed(1) + 'px,' + my.toFixed(1) + 'px,0) scale(' + sc + ')';
      var sig = op + tr;
      if (sig !== lastGlow) { glow.style.opacity = op; glow.style.transform = tr; lastGlow = sig; }
    }

    /* what actually paints, for the verification pass */
    if (todayStage) {
      var vt = 'w' + todayState.shown + '/' + todayState.total + '|r' + rowsOn + '|' + m;
      if (vt !== lastVerify.today) { todayStage.setAttribute('data-sc-verify-state', vt); lastVerify.today = vt; }
    }
    if (approveStage) {
      var va = 'w' + approveState.shown + '/' + approveState.total + '|card' + (actP(approve) >= 0.57 ? 1 : 0) + '|' + (decided || 'open') + '|' + m;
      if (va !== lastVerify.approve) { approveStage.setAttribute('data-sc-verify-state', va); lastVerify.approve = va; }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---- the approval: a real control, a sample message ------------------ */
  var afterTurn = document.querySelector('[data-jv-after]');
  var afterText = document.querySelector('[data-jv-after-text]');
  var result = document.querySelector('[data-jv-result]');
  function decide(kind) {
    if (!approval || decided) return;
    decided = kind;
    approval.setAttribute('data-state', kind);
    if (result) {
      result.hidden = false;
      result.textContent = kind === 'sent'
        ? 'Preview approval selected. No text was sent and no reminder was created.'
        : 'Preview declined. Nothing was sent or saved.';
      result.focus && result.setAttribute('tabindex', '-1');
      result.focus();
    }
    if (afterTurn && afterText) {
      afterText.textContent = kind === 'sent'
        ? 'That is where your approval would go. This is a sample; nothing was sent.'
        : 'This sample stays here. Nothing was sent or saved.';
      afterTurn.classList.add('is-on');
    }
  }
  var approveBtn = document.querySelector('[data-jv-approve]');
  var declineBtn = document.querySelector('[data-jv-decline]');
  if (approveBtn) approveBtn.addEventListener('click', function () { decide('sent'); });
  if (declineBtn) declineBtn.addEventListener('click', function () { decide('kept'); });

  /* A pinned act holds its stage in one place, so the browser's own
     scroll-into-view cannot open the approval card for a keyboard user. Park
     the act where the card is on screen when either button takes focus. */
  if (approve) {
    approve.addEventListener('focusin', function (e) {
      if (!e.target.closest('.jv-approval')) return;
      if (actP(approve) >= 0.6) return;
      var top = approve.getBoundingClientRect().top + scrollY;
      var travel = Math.max(approve.offsetHeight - innerHeight, 1);
      scrollTo({ top: Math.round(top + travel * 0.72), behavior: 'instant' });
    });
  }

  /* The same problem on the desks rail: a link inside a panning track sits
     wherever the wheel left it, so the browser's scroll-into-view cannot reach
     it. Park the act at the scroll position that centres the focused panel. */
  if (desks) {
    desks.addEventListener('focusin', function (e) {
      var rail = desks.querySelector('[data-sc-pan]');
      var panel = e.target.closest('.jv-desk');
      if (!rail || !panel) return;
      var over = rail.scrollWidth - innerWidth;
      if (over <= 0) return;
      var extra = over * (parseFloat(rail.getAttribute('data-sc-pan')) || 0);
      var want = (innerWidth - panel.offsetWidth) / 2 - panel.offsetLeft;
      var p = clamp01(-want / (over + extra));
      var top = desks.getBoundingClientRect().top + scrollY;
      var travel = Math.max(desks.offsetHeight - innerHeight, 1);
      var target = Math.round(top + travel * p);
      if (Math.abs(target - scrollY) < 4) return;
      scrollTo({ top: target, behavior: 'instant' });
    });
  }

  /* ---- the start: the pillar, the quick picks and the handoff form ------ */
  var form = document.querySelector('.jv-start');
  var area = form && form.querySelector('textarea[name="firstHandoff"]');
  var pillarSet = form && form.querySelector('[data-jv-pillars]');
  var radios = form ? Array.prototype.slice.call(form.querySelectorAll('input[name="pillar"]')) : [];
  var picks = Array.prototype.slice.call(document.querySelectorAll('[data-jv-pick]'));
  function pillarChosen() {
    for (var i = 0; i < radios.length; i++) if (radios[i].checked) return radios[i].value;
    return '';
  }
  /* The quick picks narrow to the chosen pillar. With none chosen, all show. */
  function filterPicks() {
    var v = pillarChosen();
    if (pillarSet && v) pillarSet.classList.remove('is-missing');
    picks.forEach(function (b) {
      var f = b.getAttribute('data-jv-for');
      b.hidden = !!(v && f && f !== v);
    });
  }
  function choosePillar(v) {
    radios.forEach(function (r) { r.checked = r.value === v; });
    filterPicks();
  }
  radios.forEach(function (r) { r.addEventListener('change', filterPicks); });
  /* Other pages link here with ?pillar=<value>#start, the pillar already chosen. */
  try {
    var fromUrl = new URLSearchParams(location.search).get('pillar');
    if (fromUrl && radios.some(function (r) { return r.value === fromUrl; })) choosePillar(fromUrl);
  } catch (e) {}
  filterPicks();
  /* A pillar card's link lands on the form with that pillar already set. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-jv-choose]'), function (a) {
    a.addEventListener('click', function () { choosePillar(a.getAttribute('data-jv-choose')); });
  });
  picks.forEach(function (b) {
    b.addEventListener('click', function () {
      if (!area) return;
      var f = b.getAttribute('data-jv-for');
      if (f && !pillarChosen()) choosePillar(f);
      var t = b.textContent.trim();
      area.value = area.value.trim() ? area.value.trim() + '. ' + t : t;
      area.focus();
    });
  });
  if (form) {
    var err = form.querySelector('[data-jv-err]');
    function previewRequest(e) {
      e.preventDefault();
      if (err) {
        err.hidden = false;
        err.textContent = 'Local preview only. No request was sent and your details were not saved.';
        err.setAttribute('role', 'status');
      }
    }
    form.addEventListener('submit', previewRequest);
    form.querySelector('[data-preview-request]').addEventListener('click', previewRequest);
  }
})();
