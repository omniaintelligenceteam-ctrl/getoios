/* getoios.com front door: the sample day. Plain script. Its one request is the call form's POST to /api/handoff. */
(() => {
  'use strict';

  // ---- The four sample days. Sample names throughout. ----
  const DAYS = {
    cafe: {
      name: 'Fig Street Café & Catering',
      s1: {
        lead: 'Three things need you before nine.',
        items: [
          { t: '8:30', what: 'Sam Ortiz wants a yes on Saturday’s catering order.', status: 'Reply drafted. Your tap.', needs: true },
          { t: '9:00', what: 'The Delgado tasting is in the back room, and Luis is plating it.', status: 'On your calendar.' },
          { t: '11:00', what: 'Ridge Farms has not confirmed Thursday’s delivery.', status: 'Call them. The number is ready.' },
        ],
        kind: 'Text message',
        title: 'Send this text to Sam Ortiz?',
        draft: 'Hi Sam, yes, Saturday works and forty is fine. I need the final headcount by Wednesday.\nMike, Fig Street Café',
        does: 'Sends from your business number and goes in Sam’s file.',
        sent: 'It went from your business number and it is in Sam’s file.',
        held: 'Nothing went to Sam. Jarvis keeps the draft until you say.',
        receipt: 'Reply to Sam Ortiz',
      },
      s2: {
        say: '“Quote the Delgado dinner. Forty plates, the short rib menu, two servers, and they asked about a cake stand.”',
        lead: 'Quote 119 is drafted from your prices. The cake stand is not on your price list, so I left that line blank instead of guessing.',
        docNo: 'Quote 119', docName: 'Delgado anniversary dinner', approve: 'Approve the quote',
        lines: [['Short rib dinner', '40 plates at $38', 1520], ['Servers', '2 for 4 hours', 320], ['Delivery and setup', '', 85]],
        flag: 'Cake stand rental',
        sent: 'Quote 119 went to the Delgados. When they say yes, it becomes an invoice with a pay-by-card link.',
        held: 'Nothing went to the Delgados. Jarvis keeps the draft until you say.',
        receipt: 'Quote 119, Delgado dinner',
      },
      s3: {
        items: [
          { t: 'Unpaid', what: 'Invoice 2041 for the Harper rehearsal dinner was opened yesterday and is not paid.', status: 'Reminder drafted. Your tap.', needs: true },
          { t: 'Quiet', what: 'The Round Rock birthday quote has been quiet for four days.', status: 'Reminder drafted for Thursday, the day you set.' },
          { t: 'Tomorrow', what: 'Your brief is ready for 7:40.', status: 'Delgado pricing and the Ridge Farms delivery are on it.' },
        ],
        kind: 'Text message',
        title: 'Send this reminder to Joan Harper?',
        draft: 'Hi Joan, a quick note that invoice 2041 for the rehearsal dinner is still open. The pay link is below. Thank you again for having us.\nMike, Fig Street Café',
        does: 'Sends from your business number with the pay link and goes in the Harper file.',
        sent: 'The reminder went to Joan with the pay link.',
        held: 'Nothing went to Joan. Jarvis keeps the draft until you say.',
        receipt: 'Reminder to Joan Harper',
      },
    },

    dental: {
      name: 'Larkin Family Dental',
      s1: {
        lead: 'Three things need you before nine.',
        items: [
          { t: '8:15', what: 'Carla Reyes asked if you can see her son before school on Thursday.', status: 'Reply drafted. Your tap.', needs: true },
          { t: '9:00', what: 'Marcus Bell interviews for the hygienist job, and his résumé is on your screen.', status: 'On your calendar.' },
          { t: '10:30', what: 'The lab has not confirmed Friday’s crown delivery.', status: 'Call them. The number is ready.' },
        ],
        kind: 'Text message',
        title: 'Send this text to Carla Reyes?',
        draft: 'Hi Carla, yes, we can see Eli at 7:30 on Thursday, before school. Reply here if that works and we will hold the chair.\nLarkin Family Dental',
        does: 'Sends from your office number and goes in the Reyes file.',
        sent: 'It went from your office number and it is in the Reyes file.',
        held: 'Nothing went to Carla. Jarvis keeps the draft until you say.',
        receipt: 'Reply to Carla Reyes',
      },
      s2: {
        say: '“Estimate for Carla Reyes. Exam and X-rays, a cleaning, and she asked about whitening trays.”',
        lead: 'Estimate 212 is drafted from your fee list. Whitening trays are not on it, so I left that line blank instead of guessing.',
        docNo: 'Estimate 212', docName: 'Carla Reyes', approve: 'Approve the estimate',
        lines: [['Exam and X-rays', '', 210], ['Cleaning', '', 140]],
        flag: 'Whitening trays',
        sent: 'Estimate 212 went to Carla. When she says yes, it becomes an invoice with a pay-by-card link.',
        held: 'Nothing went to Carla. Jarvis keeps the draft until you say.',
        receipt: 'Estimate 212, Carla Reyes',
      },
      s3: {
        items: [
          { t: 'Unpaid', what: 'Mr. Brandt’s balance of $180 from October is still open.', status: 'Reminder drafted. Your tap.', needs: true },
          { t: 'Quiet', what: 'Two patients have not confirmed for tomorrow.', status: 'Confirmation texts drafted for 8:00, the time you set.' },
          { t: 'Tomorrow', what: 'Your brief is ready for 7:40.', status: 'The hygienist offer and the lab delivery are on it.' },
        ],
        kind: 'Text message',
        title: 'Send this reminder to Mr. Brandt?',
        draft: 'Hello Mr. Brandt, a reminder that $180 from your October visit is still open. You can pay by card at the link below. Thank you.\nLarkin Family Dental',
        does: 'Sends from your office number with the pay link and goes in the Brandt file.',
        sent: 'The reminder went to Mr. Brandt with the pay link.',
        held: 'Nothing went to Mr. Brandt. Jarvis keeps the draft until you say.',
        receipt: 'Reminder to Mr. Brandt',
      },
    },

    shop: {
      name: 'Juniper & Clay',
      s1: {
        lead: 'Three things need you before nine.',
        items: [
          { t: '8:45', what: 'The Marlow Hotel asked if you can make 24 candles by the 20th.', status: 'Reply drafted. Your tap.', needs: true },
          { t: '9:30', what: 'Saturday’s shift is one person short, and Jo offered to cover.', status: 'On the board.' },
          { t: '11:00', what: 'Your wax supplier has not confirmed this week’s shipment.', status: 'Call them. The number is ready.' },
        ],
        kind: 'Email',
        title: 'Send this email to the Marlow Hotel?',
        draft: 'Hi Renée, yes, we can have 24 candles ready by the 20th. Tell me the scent and I will send a quote today.\nAna, Juniper & Clay',
        does: 'Sends from your shop email and goes in the Marlow file.',
        sent: 'It went from your shop email and it is in the Marlow file.',
        held: 'Nothing went to the Marlow Hotel. Jarvis keeps the draft until you say.',
        receipt: 'Reply to the Marlow Hotel',
      },
      s2: {
        say: '“Quote the Marlow order. Twenty-four candles at wholesale, gift boxes, and they want their logo on the lid.”',
        lead: 'Quote 87 is drafted from your prices. A logo on the lid is not on your price list, so I left that line blank instead of guessing.',
        docNo: 'Quote 87', docName: 'The Marlow Hotel', approve: 'Approve the quote',
        lines: [['Hand-poured candles', '24 at $14', 336], ['Gift boxes', '24 at $2.50', 60], ['Local delivery', '', 20]],
        flag: 'Logo on the lid',
        sent: 'Quote 87 went to the Marlow Hotel. When they say yes, it becomes an invoice with a pay-by-card link.',
        held: 'Nothing went to the Marlow Hotel. Jarvis keeps the draft until you say.',
        receipt: 'Quote 87, the Marlow Hotel',
      },
      s3: {
        items: [
          { t: 'Unpaid', what: 'Invoice 318 for the Whitfield registry order was opened Tuesday and is not paid.', status: 'Reminder drafted. Your tap.', needs: true },
          { t: 'Quiet', what: 'The café on Third has not answered the wholesale quote in five days.', status: 'Reminder drafted for Friday, the day you set.' },
          { t: 'Tomorrow', what: 'Your brief is ready for 7:40.', status: 'The Marlow quote and the wax shipment are on it.' },
        ],
        kind: 'Email',
        title: 'Send this reminder to Claire Whitfield?',
        draft: 'Hi Claire, a quick note that invoice 318 for the registry order is still open. The pay link is below. Thank you.\nAna, Juniper & Clay',
        does: 'Sends from your shop email with the pay link and goes in the Whitfield file.',
        sent: 'The reminder went to Claire with the pay link.',
        held: 'Nothing went to Claire. Jarvis keeps the draft until you say.',
        receipt: 'Reminder to Claire Whitfield',
      },
    },

    plumbing: {
      name: 'Brightwater Plumbing',
      s1: {
        lead: 'Three things need you before nine.',
        items: [
          { t: '8:00', what: 'Mrs. Alvarez asked if someone can look at her water heater this week.', status: 'Reply drafted. Your tap.', needs: true },
          { t: '9:00', what: 'You meet Tony at the Chen remodel to walk the rough-in.', status: 'On your calendar.' },
          { t: '11:00', what: 'The supply house has not confirmed the tankless unit.', status: 'Call them. The number is ready.' },
        ],
        kind: 'Text message',
        title: 'Send this text to Mrs. Alvarez?',
        draft: 'Hi Mrs. Alvarez, yes, we can come Thursday between 8 and 10. Reply here and I will hold the spot.\nRay, Brightwater Plumbing',
        does: 'Sends from your business number and goes in the Alvarez file.',
        sent: 'It went from your business number and it is in the Alvarez file.',
        held: 'Nothing went to Mrs. Alvarez. Jarvis keeps the draft until you say.',
        receipt: 'Reply to Mrs. Alvarez',
      },
      s2: {
        say: '“Quote the Alvarez water heater. Fifty-gallon gas, haul away the old one, and she asked about an expansion tank.”',
        lead: 'Quote 441 is drafted from your prices. An expansion tank is not on your price list, so I left that line blank instead of guessing.',
        docNo: 'Quote 441', docName: 'Alvarez water heater', approve: 'Approve the quote',
        lines: [['50-gallon gas water heater', 'Installed', 1850], ['Haul away the old unit', '', 75], ['Permit', '', 120]],
        flag: 'Expansion tank',
        sent: 'Quote 441 went to Mrs. Alvarez. When she says yes, it becomes an invoice with a pay-by-card link.',
        held: 'Nothing went to Mrs. Alvarez. Jarvis keeps the draft until you say.',
        receipt: 'Quote 441, Alvarez water heater',
      },
      s3: {
        items: [
          { t: 'Unpaid', what: 'Invoice 1207 for the Chen rough-in was opened Monday and is not paid.', status: 'Reminder drafted. Your tap.', needs: true },
          { t: 'Quiet', what: 'The Brandt repipe quote has been quiet for six days.', status: 'Reminder drafted for Friday, the day you set.' },
          { t: 'Tomorrow', what: 'Your brief is ready for 7:40.', status: 'The Alvarez visit and the tankless unit are on it.' },
        ],
        kind: 'Text message',
        title: 'Send this reminder to Mr. Chen?',
        draft: 'Hi Mr. Chen, a reminder that invoice 1207 for the rough-in is still open. The pay link is below. Thank you.\nRay, Brightwater Plumbing',
        does: 'Sends from your business number with the pay link and goes in the Chen file.',
        sent: 'The reminder went to Mr. Chen with the pay link.',
        held: 'Nothing went to Mr. Chen. Jarvis keeps the draft until you say.',
        receipt: 'Reminder to Mr. Chen',
      },
    },
  };

  const SCENES = {
    s1: { label: '7:40 am', at: '7:42 am' },
    s2: { label: '2:10 pm', at: '2:12 pm' },
    s3: { label: '9:00 pm', at: '9:01 pm' },
  };
  const ORDER = ['s1', 's2', 's3'];

  const state = { biz: 'cafe', taps: { s1: null, s2: null, s3: null }, gap: '' };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const live = (msg) => { const n = $('[data-live]'); n.textContent = ''; requestAnimationFrame(() => { n.textContent = msg; }); };
  const day = () => DAYS[state.biz];

  // ---- Render the chosen business into every data-k slot and list ----
  function path(obj, key) { return key.split('.').reduce((o, k) => (o == null ? o : o[k]), obj); }

  function statusText(scene, item) {
    const tap = state.taps[scene];
    if (!item.needs || !tap) return null;
    return tap === 'sent' ? `Sent ${SCENES[scene].at}, on your tap.` : 'Declined. Nothing sent.';
  }

  function renderList(scene) {
    const list = $(`[data-list="${scene}"]`);
    list.replaceChildren(...day()[scene].items.map((item) => {
      const li = el('li', item.needs ? 'is-needs' : '');
      li.append(el('span', 'needs__t', item.t), el('span', 'needs__what', item.what));
      const status = el('span', 'needs__status');
      const decided = statusText(scene, item);
      if (decided) status.append(el('span', 'is-sent', decided));
      else if (item.needs) status.append(el('mark', '', item.status));
      else status.textContent = item.status;
      li.append(status);
      return li;
    }));
  }

  function renderLines() {
    const d = day().s2;
    $('[data-lines]').replaceChildren(...d.lines.map(([label, detail, amount]) => {
      const li = el('li');
      const name = el('span', 'lines__label', label);
      if (detail) name.append(el('small', '', detail));
      li.append(name, el('span', 'lines__amt', money(amount)));
      return li;
    }));
    renderTotal();
  }

  function gapValue() {
    const n = Number(String(state.gap).replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0;
  }

  function renderTotal() {
    const sum = day().s2.lines.reduce((a, l) => a + l[2], 0) + gapValue();
    $('[data-total]').textContent = money(sum);
  }

  function renderCard(scene, fresh) {
    const card = $(`[data-scene="${scene}"]`);
    const tap = state.taps[scene];
    const d = day()[scene];
    const flag = $('[data-flag]', card);
    $('[data-act]', card).hidden = !!tap;
    $('[data-done]', card).hidden = !tap;
    flag.classList.toggle('is-sent', tap === 'sent');
    flag.classList.toggle('is-held', tap === 'held');
    flag.textContent = tap === 'sent' ? 'Sent on your tap' : tap === 'held' ? 'Declined' : 'Needs your tap';
    if (tap) {
      const stamp = $('[data-stamp]', card);
      stamp.textContent = tap === 'sent' ? `Sent ${SCENES[scene].at}, on your tap` : `Declined ${SCENES[scene].at}, nothing sent`;
      stamp.classList.toggle('is-held', tap === 'held');
      stamp.classList.toggle('is-new', !!fresh);
      $('[data-after]', card).textContent = d[tap];
    }
    if (scene === 's2') {
      const input = $('[data-gap-input]');
      const gap = $('[data-gap]');
      const note = $('[data-gap-note]');
      input.disabled = !!tap;
      const off = !!tap && !gapValue();
      gap.classList.toggle('is-off', off);
      note.textContent = off ? 'Left off, with no price guessed.' : gapValue() && tap ? 'Priced by you.' : 'Not on your price list. Add a price or leave it off.';
    }
  }

  function renderReceipt() {
    ORDER.forEach((scene) => {
      const slot = $(`[data-row="${scene}"] [data-state]`);
      const tap = state.taps[scene];
      if (tap === 'sent') slot.replaceChildren(el('span', 'is-sent', `Sent ${SCENES[scene].at}, on your tap`));
      else if (tap === 'held') slot.replaceChildren(el('span', 'is-held', 'Declined, nothing sent'));
      else slot.replaceChildren(el('mark', '', 'Waiting on you'));
    });
    $('[data-receipt-next]').hidden = ORDER.some((scene) => !state.taps[scene]);
  }

  function renderTally() {
    const waiting = ORDER.filter((s) => !state.taps[s]).length;
    ORDER.forEach((scene) => {
      const dot = $(`[data-dot="${scene}"]`);
      const tap = state.taps[scene];
      dot.classList.toggle('is-sent', tap === 'sent');
      dot.classList.toggle('is-held', tap === 'held');
      dot.setAttribute('aria-label', `${SCENES[scene].label}, ${tap === 'sent' ? 'sent on your tap' : tap === 'held' ? 'declined' : 'waiting on you'}`);
    });
    $('[data-tally-text]').textContent = waiting ? `${waiting} waiting on you` : 'Nothing waiting on you';
  }

  function render() {
    const d = day();
    $$('[data-k]').forEach((node) => { const v = path(d, node.dataset.k); if (v != null) node.textContent = v; });
    renderList('s1');
    renderList('s3');
    renderLines();
    ORDER.forEach((s) => renderCard(s, false));
    renderReceipt();
    renderTally();
  }

  // ---- The taps ----
  function decide(scene, tap) {
    state.taps[scene] = tap;
    if (scene === 's1' || scene === 's3') renderList(scene);
    renderCard(scene, true);
    renderReceipt();
    renderTally();
    const what = day()[scene].receipt;
    live(tap === 'sent' ? `${what}: sent ${SCENES[scene].at}, on your tap.` : tap === 'held' ? `${what}: declined. Nothing sent.` : `${what}: back to waiting on you.`);
    // Focus lands on the result itself, never on a link or button: the same Enter press that
    // approved would otherwise activate whatever control took focus.
    const card = $(`[data-scene="${scene}"]`);
    const focusTo = $(tap ? '[data-done]' : '[data-act]', card);
    focusTo.setAttribute('tabindex', '-1');
    focusTo.focus({ preventScroll: true });
  }

  $$('[data-scene]').forEach((card) => {
    const scene = card.dataset.scene;
    $('[data-approve]', card).addEventListener('click', () => decide(scene, 'sent'));
    $('[data-decline]', card).addEventListener('click', () => decide(scene, 'held'));
    $('[data-undo]', card).addEventListener('click', () => decide(scene, null));
  });

  const gapInput = $('[data-gap-input]');
  gapInput.addEventListener('input', () => {
    gapInput.value = gapInput.value.replace(/[^0-9.]/g, '');
    state.gap = gapInput.value;
    renderTotal();
  });

  // ---- The business switch ----
  $$('input[name="biz"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      if (!radio.checked || !DAYS[radio.value]) return;
      state.biz = radio.value;
      state.gap = '';
      gapInput.value = '';
      document.body.classList.add('is-swapping');
      window.setTimeout(() => {
        render();
        document.body.classList.remove('is-swapping');
        live(`Showing the sample day at ${day().name}.`);
      }, 140);
    });
  });

  // ---- The 30-second recording ----
  const film = $('[data-film]');
  if (film) {
    $('[data-play]', film).addEventListener('click', () => {
      const video = document.createElement('video');
      video.src = '/jarvis/visor/keeper-final-owner-approved-v2.mp4';
      video.poster = '/jarvis/visor/keeper-v2-poster.png';
      video.controls = true;
      video.playsInline = true;
      video.setAttribute('aria-label', 'Jarvis, a prerecorded 30-second introduction');
      $('picture', film).replaceWith(video);
      $('[data-play]', film).remove();
      video.play().catch(() => {});
      video.focus();
    });
  }

  // ---- The call form. It posts to /api/handoff, which emails the team inbox. ----
  const form = $('#handoff');
  const interest = $('[name="interest"]', form);
  const INTERESTS = { assistant: 'Right hand', 'back-office': 'Back office', workflows: 'Follow-through' };

  // The pillar a visitor came from goes along unseen, so the call starts in the right place.
  function setInterest(value) {
    if (Object.hasOwn(INTERESTS, value)) interest.value = INTERESTS[value];
  }
  function clearError(field) {
    const group = $(`[data-field="${field}"]`);
    $('[data-err]', group).hidden = true;
    $$('input', group).forEach((n) => n.removeAttribute('aria-invalid'));
  }
  function showError(field) {
    const group = $(`[data-field="${field}"]`);
    $('[data-err]', group).hidden = false;
    $$('input', group).forEach((n) => n.setAttribute('aria-invalid', 'true'));
    return $('input', group);
  }

  // Without script the browser checks the required fields and posts the form itself; the route
  // then redirects to /#sent. With script the page checks, posts JSON and stays where it is.
  form.noValidate = true;
  const FIELDS = ['fullName', 'industry', 'email', 'phoneNumber'];
  FIELDS.forEach((f) => $(`[name="${f}"]`, form).addEventListener('input', () => clearError(f)));
  $$('[data-pillar]').forEach((link) => link.addEventListener('click', () => setInterest(link.dataset.pillar)));
  setInterest(new URLSearchParams(location.search).get('pillar') || '');
  const submit = $('[data-submit]', form);
  const formErr = $('[data-form-err]', form);
  const sent = $('[data-sent]', form);

  function showSent(firstName) {
    if (firstName) sent.textContent = `Got it, ${firstName}. Omnia will call you.`;
    form.classList.add('is-sent');
    submit.disabled = true;
    submit.textContent = 'Call requested';
    sent.focus();
  }
  if (location.hash === '#sent') showSent('');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    const data = new FormData(form);
    const value = (key) => String(data.get(key) || '').trim();
    const missing = [];
    if (!value('fullName')) missing.push('fullName');
    if (!value('industry')) missing.push('industry');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email'))) missing.push('email');
    if (value('phoneNumber').replace(/\D/g, '').length < 7) missing.push('phoneNumber');
    FIELDS.forEach((f) => (missing.includes(f) ? null : clearError(f)));
    formErr.hidden = true;
    if (missing.length) {
      const first = missing.map(showError)[0];
      if (first) first.focus();
      return;
    }
    const body = { company: value('company'), interest: value('interest') };
    FIELDS.forEach((f) => { body[f] = value(f); });
    submit.disabled = true;
    submit.textContent = 'Sending';
    fetch(form.getAttribute('action'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    }).then((res) => {
      if (!res.ok) throw new Error(`handoff answered ${res.status}`);
      showSent(body.fullName.split(/\s+/)[0]);
    }).catch(() => {
      submit.disabled = false;
      submit.textContent = 'Request a call';
      formErr.hidden = false;
      formErr.focus();
    });
  });

  // ---- The tally waits until the first scene has scrolled by, and steps aside for the form ----
  const tally = $('[data-tally]');
  const hero = $('#day');
  const startSection = $('#start');
  let ticking = false;
  function placeTally() {
    ticking = false;
    const pastHero = hero.getBoundingClientRect().bottom < window.innerHeight * 0.55;
    const atForm = startSection.getBoundingClientRect().top < window.innerHeight * 0.65;
    tally.classList.toggle('is-away', !pastHero || atForm);
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(placeTally); } }, { passive: true });
  window.addEventListener('resize', placeTally);
  placeTally();

  // ---- The voice sample: one brief, two voices. With no script the page keeps Ava's clip and a plain link ----
  const voice = $('[data-voice-sample]');
  if (voice) {
    const audio = $('audio', voice);
    const source = $('source', audio);
    const pick = $('[data-voice-pick]', voice);
    const voiceErr = $('[data-voice-error]', voice);
    const showVoiceErr = () => { voiceErr.hidden = false; };
    audio.addEventListener('error', showVoiceErr);
    source.addEventListener('error', showVoiceErr);
    // The load can fail before this script runs, and the error event does not fire again.
    if (audio.error || audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) showVoiceErr();
    pick.hidden = false;
    $('[data-voice-alt]', voice).hidden = true;
    pick.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-src]');
      if (!button || button.getAttribute('aria-pressed') === 'true') return;
      pick.querySelectorAll('button').forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
      voiceErr.hidden = true;
      audio.pause();
      source.src = button.dataset.src;
      audio.load();
      $('[data-voice-label]', voice).textContent = button.dataset.label;
    });
  }

  render();
  // Checks wait for this mark before they act on the page.
  document.documentElement.setAttribute('data-ready', '');
})();
