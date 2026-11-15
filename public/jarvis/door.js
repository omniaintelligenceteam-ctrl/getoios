/* getoios.com front door: the page's own script. Plain script, no request of its own.
   It runs four things the kit does not: the live list in #today (open an item, approve or decline it,
   switch the sample business), the 30-second film, the two voice clips, and the unseen `interest`
   field of the call form. The kit's system.js sends the form. Sample names throughout. */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---- The four sample businesses. Each has three items that need the owner, one per hire, and
  // the work Jarvis already did. Nothing in "handled" was spent, sent or deleted.
  const HIRES = { s1: 'Assistant', s2: 'Chief of staff', s3: 'Management team' };
  const STAMP = { s1: '7:42 am', s2: '7:43 am', s3: '7:44 am' };
  const DAYS = {
    cafe: {
      name: 'Fig Street Café',
      s1: {
        who: 'Sam Ortiz', ini: 'SO', sub: 'Move Saturday pickup to 4:00', time: '7:36', kind: 'Text message',
        title: 'Send this text to Sam Ortiz?',
        why: 'Sam asked to move Saturday’s pickup to 4:00. Your calendar is free then, and your dentist moved to 12:15.',
        draft: 'Hey Sam, yes, 4:00 on Saturday works and forty is fine. I need the final headcount by Wednesday.\nMike, Fig Street Café',
        does: 'Sends from your business number and goes in Sam’s file.',
        sent: 'It went from your business number and it is in Sam’s file.',
        held: 'Nothing went to Sam. Jarvis keeps the draft until you say.',
      },
      s2: {
        who: 'Ridge Farms', ini: 'RF', sub: 'Thursday delivery not confirmed', time: '7:22', kind: 'Text message',
        title: 'Send this text to Ridge Farms?',
        why: 'Ridge Farms has not confirmed Thursday’s delivery. Saturday’s dinner for forty needs it.',
        draft: 'Hey Carla, can you confirm Thursday’s delivery by noon today? We need the short rib for a dinner on Saturday.\nMike, Fig Street Café',
        does: 'Sends from your business number and goes in the Ridge Farms file.',
        sent: 'It went from your business number. Jarvis watches for the answer.',
        held: 'Nothing went to Ridge Farms. Jarvis keeps the draft until you say.',
      },
      s3: {
        who: 'Delgado dinner', ini: 'DD', sub: 'Quote 119, one price missing', time: '7:10', kind: 'Quote',
        title: 'Approve Quote 119 for the Delgados?',
        why: 'Drafted from your price list. The cake stand is not on it, so that line is blank instead of a guess.',
        approve: 'Approve the quote',
        lines: [['Short rib dinner', '40 plates at $38', 1520], ['Servers', '2 for 4 hours', 320], ['Delivery and setup', '', 85]],
        gap: 'Cake stand rental',
        does: 'Emails the quote to the Delgados. A yes becomes an invoice with a pay link.',
        sent: 'Quote 119 went to the Delgados. A yes becomes an invoice with a pay link.',
        held: 'Nothing went to the Delgados. Jarvis keeps the draft until you say.',
      },
      handled: [
        ['Calendar', 'Dentist moved to 12:15', '7:31'], ['Paperwork', 'Food permit renewal filed', '7:20'],
        ['Money', 'Delgado deposit logged, $400', '7:12'], ['Sales', 'Round Rock reminder set, Thursday', '7:05'],
        ['Customers', '3 replies drafted overnight', '6:58'], ['Team', 'Saturday rota filled, Jo covers', '6:40'],
        ['Brief', 'Morning brief ready for 7:40', '6:30'],
      ],
    },
    dental: {
      name: 'Larkin Family Dental',
      s1: {
        who: 'Carla Reyes', ini: 'CR', sub: 'Before-school visit Thursday', time: '7:34', kind: 'Text message',
        title: 'Send this text to Carla Reyes?',
        why: 'Carla asked if you can see her son before school on Thursday. The 7:30 chair is open.',
        draft: 'Hey Carla, yes, we can see Eli at 7:30 on Thursday, before school. Reply here and we will hold the chair.\nLarkin Family Dental',
        does: 'Sends from your office number and goes in the Reyes file.',
        sent: 'It went from your office number and it is in the Reyes file.',
        held: 'Nothing went to Carla. Jarvis keeps the draft until you say.',
      },
      s2: {
        who: 'Northside Lab', ini: 'NL', sub: 'Friday crown not confirmed', time: '7:18', kind: 'Email',
        title: 'Send this email to Northside Lab?',
        why: 'The lab has not confirmed Friday’s crown delivery. The fitting is on Monday morning.',
        draft: 'Hey Ruth, can you confirm Friday’s crown delivery by noon today? The fitting is on Monday morning.\nLarkin Family Dental',
        does: 'Sends from your office email and goes in the lab file.',
        sent: 'It went from your office email. Jarvis watches for the answer.',
        held: 'Nothing went to the lab. Jarvis keeps the draft until you say.',
      },
      s3: {
        who: 'Reyes estimate', ini: 'RE', sub: 'Estimate 212, one fee missing', time: '7:08', kind: 'Estimate',
        title: 'Approve Estimate 212 for Carla Reyes?',
        why: 'Drafted from your fee list. Whitening trays are not on it, so that line is blank instead of a guess.',
        approve: 'Approve the estimate',
        lines: [['Exam and X-rays', '', 210], ['Cleaning', '', 140]],
        gap: 'Whitening trays',
        does: 'Emails the estimate to Carla. A yes becomes an invoice with a pay link.',
        sent: 'Estimate 212 went to Carla. A yes becomes an invoice with a pay link.',
        held: 'Nothing went to Carla. Jarvis keeps the draft until you say.',
      },
      handled: [
        ['Calendar', 'School pickup held at 3:00', '7:30'], ['Paperwork', 'Insurance claim 5 prepared', '7:19'],
        ['Money', 'October balance logged, $180', '7:11'], ['Sales', 'Two recall reminders set', '7:02'],
        ['Customers', '4 confirmations drafted for 8:00', '6:55'], ['Team', 'Hygienist interview at 9:00', '6:41'],
        ['Brief', 'Morning brief ready for 7:40', '6:30'],
      ],
    },
    shop: {
      name: 'Juniper & Clay',
      s1: {
        who: 'Marlow Hotel', ini: 'MH', sub: '24 candles by the 20th', time: '7:35', kind: 'Email',
        title: 'Send this email to the Marlow Hotel?',
        why: 'The Marlow Hotel asked for 24 candles by the 20th. Your pour schedule has room, and Friday is your day off.',
        draft: 'Hey Renée, yes, we can have 24 candles ready by the 20th. Tell me the scent and I will send a quote today.\nAna, Juniper & Clay',
        does: 'Sends from your shop email and goes in the Marlow file.',
        sent: 'It went from your shop email and it is in the Marlow file.',
        held: 'Nothing went to the Marlow Hotel. Jarvis keeps the draft until you say.',
      },
      s2: {
        who: 'Hollis Wax', ini: 'HW', sub: 'Shipment not confirmed', time: '7:20', kind: 'Email',
        title: 'Send this email to Hollis Wax?',
        why: 'Your wax supplier has not confirmed this week’s shipment. The Marlow order pours on Monday.',
        draft: 'Hey Gil, can you confirm this week’s wax shipment by noon today? We pour a hotel order on Monday.\nAna, Juniper & Clay',
        does: 'Sends from your shop email and goes in the Hollis Wax file.',
        sent: 'It went from your shop email. Jarvis watches for the answer.',
        held: 'Nothing went to Hollis Wax. Jarvis keeps the draft until you say.',
      },
      s3: {
        who: 'Marlow order', ini: 'MO', sub: 'Quote 87, one price missing', time: '7:09', kind: 'Quote',
        title: 'Approve Quote 87 for the Marlow Hotel?',
        why: 'Drafted from your prices. A logo on the lid is not on your price list, so that line is blank instead of a guess.',
        approve: 'Approve the quote',
        lines: [['Hand-poured candles', '24 at $14', 336], ['Gift boxes', '24 at $2.50', 60], ['Local delivery', '', 20]],
        gap: 'Logo on the lid',
        does: 'Emails the quote to the Marlow Hotel. A yes becomes an invoice with a pay link.',
        sent: 'Quote 87 went to the Marlow Hotel. A yes becomes an invoice with a pay link.',
        held: 'Nothing went to the Marlow Hotel. Jarvis keeps the draft until you say.',
      },
      handled: [
        ['Calendar', 'Vet moved to Friday at 5:30', '7:29'], ['Paperwork', 'Sales tax return prepared', '7:18'],
        ['Money', 'Invoice 318 logged as open', '7:10'], ['Sales', 'Café on Third reminder set, Friday', '7:03'],
        ['Customers', '2 replies drafted overnight', '6:56'], ['Team', 'Saturday shift filled, Jo covers', '6:42'],
        ['Brief', 'Morning brief ready for 7:40', '6:30'],
      ],
    },
    plumbing: {
      name: 'Brightwater Plumbing',
      s1: {
        who: 'Claire Whitfield', ini: 'CW', sub: 'Water heater, Thursday at 8:00', time: '7:33', kind: 'Text message',
        title: 'Send this text to Claire Whitfield?',
        why: 'Claire asked if Thursday at 8:00 works for the water heater. Your morning is open, and the school run is covered.',
        draft: 'Hey Claire, yes, Thursday at 8:00 works for the water heater. We will text you when we are on the way.\nBrightwater Plumbing',
        does: 'Sends from your business number and goes in the Whitfield file.',
        sent: 'It went from your business number and it is in the Whitfield file.',
        held: 'Nothing went to Claire. Jarvis keeps the draft until you say.',
      },
      s2: {
        who: 'Ferris Supply', ini: 'FS', sub: '50-gallon tank not confirmed', time: '7:21', kind: 'Text message',
        title: 'Send this text to Ferris Supply?',
        why: 'The supply house has not confirmed the 50-gallon tank. Thursday’s install needs it at 8:00.',
        draft: 'Hey Dale, can you confirm the 50-gallon tank for Thursday morning? The install starts at 8:00.\nBrightwater Plumbing',
        does: 'Sends from your business number and goes in the Ferris Supply file.',
        sent: 'It went from your business number. Jarvis watches for the answer.',
        held: 'Nothing went to Ferris Supply. Jarvis keeps the draft until you say.',
      },
      s3: {
        who: 'Whitfield job', ini: 'WJ', sub: 'Estimate 431, one price missing', time: '7:07', kind: 'Estimate',
        title: 'Approve Estimate 431 for Claire Whitfield?',
        why: 'Drafted from your prices. An expansion tank is not on your price list, so that line is blank instead of a guess.',
        approve: 'Approve the estimate',
        lines: [['50-gallon water heater', '', 1240], ['Install and haul-away', '', 480], ['Permit', '', 95]],
        gap: 'Expansion tank',
        does: 'Emails the estimate to Claire. A yes becomes an invoice with a pay link.',
        sent: 'Estimate 431 went to Claire. A yes becomes an invoice with a pay link.',
        held: 'Nothing went to Claire. Jarvis keeps the draft until you say.',
      },
      handled: [
        ['Calendar', 'School run covered Thursday', '7:28'], ['Paperwork', 'Permit application prepared', '7:17'],
        ['Money', 'Invoice 902 logged as paid, $310', '7:09'], ['Sales', 'Oak Lane reminder set, Friday', '7:01'],
        ['Customers', '3 replies drafted overnight', '6:54'], ['Team', 'Friday on-site hours filled', '6:43'],
        ['Brief', 'Morning brief ready for 7:40', '6:30'],
      ],
    },
  };
  const SCENES = ['s1', 's2', 's3'];

  // ---- #today: the list beside the open item ----
  function today() {
    const root = $('[data-today]');
    if (!root) return;
    const rows = $('[data-rows]', root);
    const open = $('[data-open]', root);
    const count = $('[data-need-count]', root);
    const num = $('[data-need-num]', root);
    const name = $('[data-k="name"]', root);
    const tabs = $$('[data-tab]', root);
    let biz = 'cafe';
    let picked = 's1';
    let state = { s1: 'wait', s2: 'wait', s3: 'wait' };
    let gap = '';

    const total = (item) => item.lines.reduce((sum, line) => sum + line[2], 0) + (parseFloat(gap) > 0 ? parseFloat(gap) : 0);
    const flag = (s) => (s === 'sent' ? 'Sent on your tap' : s === 'held' ? 'Declined' : 'Needs your tap');
    const chip = (s) => (s === 'sent' ? 'Sent' : s === 'held' ? 'Declined' : 'Needs you');
    const chipClass = (s) => (s === 'sent' ? 'is-sent' : s === 'held' ? 'is-done' : 'is-you');

    function body(id, item) {
      if (!item.lines) return `<blockquote class="tap__draft">${esc(item.draft)}</blockquote>`;
      const lines = item.lines.map(([what, detail, price]) =>
        `<div class="tap__line"><span>${esc(what)}${detail ? `<small>${esc(detail)}</small>` : ''}</span><span>${money(price)}</span></div>`).join('');
      return `<div class="tap__doc">${lines}
        <div class="tap__line tap__line--gap"><label for="gap-${id}">${esc(item.gap)}<small>Not on your price list</small></label><span class="tap__gap">$<input id="gap-${id}" data-gap-input type="text" inputmode="decimal" autocomplete="off" maxlength="7" placeholder="Price" value="${esc(gap)}"></span></div>
        <div class="tap__line tap__line--sum"><span>Total</span><span data-total>${money(total(item))}</span></div>
      </div>`;
    }

    function card(id) {
      const item = DAYS[biz][id];
      const s = state[id];
      const stamp = s === 'sent' ? `<b>Sent ${STAMP[id]}, on your tap.</b> ${esc(item.sent)}` : s === 'held' ? `<b>Declined, nothing sent.</b> ${esc(item.held)}` : '';
      return `<article class="tap" data-item="${id}" data-state="${s}"${id === picked ? '' : ' hidden'}>
        <div class="tap__head"><span class="tap__hire">${HIRES[id]}</span><span class="tap__kind">${esc(item.kind)}</span><span class="ui-win__st ${chipClass(s)} tap__flag" data-flag>${flag(s)}</span></div>
        <p class="tap__title">${esc(item.title)}</p>
        <p class="tap__why">${esc(item.why)}</p>
        ${body(id, item)}
        <p class="tap__does"${s === 'wait' ? '' : ' hidden'}>${esc(item.does)}</p>
        <div class="tap__acts">
          <button type="button" class="tap__btn tap__btn--yes" data-approve${s === 'wait' ? '' : ' hidden'}>${esc(item.approve || 'Approve and send')}</button>
          <button type="button" class="tap__btn" data-decline${s === 'wait' ? '' : ' hidden'}>Decline</button>
          <p class="tap__stamp" data-stamp${s === 'wait' ? ' hidden' : ''}>${stamp}</p>
          <button type="button" class="tap__btn" data-undo${s === 'wait' ? ' hidden' : ''}>Undo</button>
        </div>
      </article>`;
    }

    function row(id) {
      const item = DAYS[biz][id];
      const s = state[id];
      return `<li class="ui-win__row${id === picked ? ' is-sel' : ''}" data-row="${id}"><span class="ui-avatar" data-tone="${SCENES.indexOf(id) + 1}">${esc(item.ini)}</span><span class="ui-win__who"><button type="button" class="today__pick" data-pick="${id}" aria-pressed="${id === picked}" aria-label="${esc(item.who)}: ${esc(item.sub)}. ${chip(s)}.">${esc(item.who)}</button></span><span class="ui-win__sub">${esc(item.sub)}</span><span class="ui-win__st ${chipClass(s)}" data-st>${chip(s)}</span><span class="ui-win__age">${item.time}</span></li>`;
    }

    function draw(focus) {
      const day = DAYS[biz];
      name.textContent = day.name;
      rows.innerHTML = SCENES.map(row).join('') + day.handled.map(([who, sub, time], i) =>
        `<li class="ui-win__row"><span class="ui-avatar" data-tone="${(i % 5) + 1}">${esc(who.slice(0, 2))}</span><span class="ui-win__who">${esc(who)}</span><span class="ui-win__sub">${esc(sub)}</span><span class="ui-win__st is-done">Handled</span><span class="ui-win__age">${time}</span></li>`).join('');
      open.innerHTML = SCENES.map(card).join('');
      const left = SCENES.filter((id) => state[id] === 'wait').length;
      count.textContent = left === 0 ? 'Nothing needs you. The rest is handled.' : left === 1 ? '1 needs you' : `${left} need you`;
      num.textContent = String(left);
      tabs.forEach((tab) => {
        const on = tab.dataset.tab === picked;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
      });
      if (focus) { const el = $(focus, root); if (el) el.focus({ preventScroll: true }); }
    }

    function decide(id, next) {
      state[id] = next;
      draw(next === 'wait' ? `[data-item="${id}"] [data-approve]` : `[data-item="${id}"] [data-undo]`);
    }

    root.addEventListener('click', (e) => {
      const pick = e.target.closest('[data-pick], [data-tab]');
      if (pick) { picked = pick.dataset.pick || pick.dataset.tab; draw(pick.dataset.pick ? `[data-pick="${picked}"]` : `[data-tab="${picked}"]`); return; }
      const item = e.target.closest('[data-item]');
      if (!item) return;
      const id = item.dataset.item;
      if (e.target.closest('[data-approve]')) decide(id, 'sent');
      else if (e.target.closest('[data-decline]')) decide(id, 'held');
      else if (e.target.closest('[data-undo]')) decide(id, 'wait');
    });
    // the tabs (a phone's way to the three items) take the arrow keys
    root.addEventListener('keydown', (e) => {
      const tab = e.target.closest('[data-tab]');
      if (!tab || !/^Arrow(Left|Right)$/.test(e.key)) return;
      const i = SCENES.indexOf(tab.dataset.tab) + (e.key === 'ArrowRight' ? 1 : -1);
      picked = SCENES[(i + SCENES.length) % SCENES.length];
      draw(`[data-tab="${picked}"]`);
    });
    // the blank price: the total follows as it is typed
    root.addEventListener('input', (e) => {
      if (!e.target.matches('[data-gap-input]')) return;
      gap = e.target.value.replace(/[^0-9.]/g, '').slice(0, 7);
      if (gap !== e.target.value) e.target.value = gap;
      const out = $('[data-total]', e.target.closest('[data-item]'));
      if (out) out.textContent = money(total(DAYS[biz].s3));
    });
    $$('input[name="biz"]', root).forEach((input) => input.addEventListener('change', () => {
      if (!input.checked || !DAYS[input.value]) return;
      biz = input.value; picked = 's1'; state = { s1: 'wait', s2: 'wait', s3: 'wait' }; gap = '';
      draw();
    }));
    const checked = $('input[name="biz"]:checked', root);
    if (checked && DAYS[checked.value]) biz = checked.value;
    draw();
  }

  // ---- The 30-second film: the poster becomes the player on a tap ----
  function film() {
    const frame = $('[data-film]');
    const play = frame && $('[data-play]', frame);
    if (!play) return;
    play.addEventListener('click', () => {
      const video = document.createElement('video');
      video.className = 'frame__img';
      video.controls = true; video.playsInline = true; video.preload = 'auto';
      video.poster = '/jarvis/visor/keeper-v2-poster.png';
      video.src = '/jarvis/visor/keeper-final-owner-approved-v2.mp4';
      video.setAttribute('aria-label', 'The 30-second introduction to Jarvis');
      const poster = $('img', frame);
      if (poster) poster.remove();
      play.remove();
      frame.append(video);
      video.focus({ preventScroll: true });
      const started = video.play();
      if (started && started.catch) started.catch(() => {});
    });
  }

  // ---- The two voices: one clip plays at a time; a second tap stops it ----
  function voices() {
    const root = $('[data-voices]');
    if (!root) return;
    const status = $('[data-voice-status]', root);
    const buttons = $$('[data-voice]', root);
    const audio = new Audio();
    audio.preload = 'none';
    let current = '';
    const text = (btn) => $('[data-voice-label]', btn) || btn;
    const label = (btn, playing) => { btn.setAttribute('aria-pressed', String(playing)); text(btn).textContent = playing ? btn.dataset.stop : btn.dataset.play; };
    const reset = () => { buttons.forEach((btn) => label(btn, false)); current = ''; };
    buttons.forEach((btn) => {
      btn.dataset.play = text(btn).textContent.trim();
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (status) status.textContent = '';
        if (current === btn.dataset.voice) { audio.pause(); reset(); return; }
        reset();
        current = btn.dataset.voice;
        audio.src = btn.getAttribute('href');
        label(btn, true);
        const started = audio.play();
        if (started && started.catch) started.catch(() => { if (current === btn.dataset.voice) fail(); });
      });
      btn.addEventListener('keydown', (e) => { if (e.key === ' ') { e.preventDefault(); btn.click(); } });
    });
    const fail = () => { reset(); if (status) status.textContent = 'That clip did not load. Try it again in a minute.'; };
    audio.addEventListener('ended', reset);
    audio.addEventListener('error', () => { if (current) fail(); });
  }

  // ---- The form's unseen field: which hire the visitor was reading ----
  function interest() {
    const field = $('form#handoff input[name="interest"]');
    if (!field) return;
    const LABEL = { assistant: 'Assistant', chief: 'Chief of staff', team: 'Management team' };
    const OLD = { assistant: 'assistant', 'back-office': 'team', workflows: 'chief' };
    const query = new URLSearchParams(location.search);
    const asked = LABEL[query.get('hire')] || LABEL[OLD[query.get('pillar')]];
    if (asked) { field.value = asked; return; }
    if (!('IntersectionObserver' in window)) return;
    const seen = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) field.value = LABEL[entry.target.id]; });
    }, { threshold: 0.5 });
    Object.keys(LABEL).forEach((id) => { const el = document.getElementById(id); if (el) seen.observe(el); });
  }

  // ---- The form's choice: a call or an email. A call needs the cell number; an email does not. ----
  // The kit's sender (system.js) reads `required` when the form is sent, then resets the form and
  // reads data-sent in the same step: so the sent line is set at the choice, and the reset is read a step later.
  function reply() {
    const form = $('form#handoff');
    const cell = form && form.elements.phoneNumber;
    if (!form || !cell || !form.elements.reply) return;
    const sync = () => {
      const email = form.elements.reply.value === 'email';
      cell.required = !email;
      if (email) { cell.value = ''; cell.removeAttribute('aria-invalid'); const err = document.getElementById('f-phone-err'); if (err) err.hidden = true; }
      form.dataset.sent = (email ? form.dataset.sentEmail : form.dataset.sentCall) || form.dataset.sent;
    };
    form.addEventListener('change', (e) => { if (e.target.name === 'reply') sync(); });
    form.addEventListener('reset', () => setTimeout(sync, 0));
    sync();
  }

  // ---- The form's sent line: where the no-script post lands (/#sent) ----
  function sent() {
    if (location.hash !== '#sent') return;
    const line = document.getElementById('sent');
    if (line) line.focus({ preventScroll: true });
  }

  // The page before this one had other section ids. A link to one of them (in an email, on
  // meetjarvis.getoios.com) opens the section that took its place.
  const MOVED = { day: 'today', pm: 'today', night: 'chief', work: 'assistant', install: 'setup' };
  function moved() {
    const go = () => {
      const to = MOVED[location.hash.slice(1)];
      const el = to && document.getElementById(to);
      if (!el) return;
      history.replaceState(null, '', `${location.pathname}${location.search}#${to}`);
      el.scrollIntoView();
    };
    go();
    addEventListener('hashchange', go);
  }

  // The bar marks the section on screen. A section with no link of its own marks the link it belongs under.
  const UNDER = { today: 'today', assistant: 'today', chief: 'today', team: 'today', tools: 'tools', rule: 'tools', setup: 'setup', behind: 'behind', questions: 'questions' };
  function spy() {
    const links = $$('header .nav__link[href^="#"]');
    const sections = $$('main > section[id], footer.closing');
    if (!links.length || !sections.length) return;
    const mark = (id) => links.forEach((a) => {
      if (a.getAttribute('href') === `#${UNDER[id]}`) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
    // one line across the screen, 40% down: the section that holds it is the one on screen
    let queued = false;
    const read = () => {
      queued = false;
      const line = innerHeight * 0.4;
      const on = sections.find((section) => { const box = section.getBoundingClientRect(); return box.top <= line && box.bottom > line; });
      if (on) mark(on.id);
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(read); } };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    read();
  }

  const boot = () => {
    [today, film, voices, interest, reply, sent, moved, spy].forEach((part) => { try { part(); } catch (err) { console.error(err); } });
    document.documentElement.setAttribute('data-ready', '');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
