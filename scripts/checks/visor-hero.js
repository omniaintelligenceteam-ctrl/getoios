/* Run with playwright-cli run-code --filename=scripts/checks/visor-hero.js.
   Start the production server separately. Uses only the current loopback origin. */
/* eslint-disable @typescript-eslint/no-unused-expressions -- CLI evaluates this function expression. */
async page => {
  const base = new URL('/', page.url()).href;
  const origin = new URL(base).origin;
  if (!['127.0.0.1', 'localhost'].includes(new URL(base).hostname)) throw new Error('Use a loopback test server');
  const proof = 'test-results/visor-hero/';
  const results = [];
  const requests = [];
  const errors = [];
  const check = (ok, label, detail = null) => {
    results.push({label, pass: !!ok, detail});
    if (!ok) throw new Error(label + ': ' + JSON.stringify(detail));
  };
  page.on('request', request => requests.push({url: request.url(), method: request.method()}));
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    window.__micCalls = 0;
    window.__socketCalls = 0;
    if (navigator.mediaDevices) navigator.mediaDevices.getUserMedia = () => {
      window.__micCalls++;
      return Promise.reject(new Error('Microphone must stay off for the recorded introduction'));
    };
    window.WebSocket = class { constructor() { window.__socketCalls++; throw new Error('Live connection forbidden'); } };
  });
  const response = await page.goto(base);
  const html = await response.text();
  check(!/noindex|data-local-preview|local\s+preview/i.test(html) && !/noindex/i.test(response.headers()['x-robots-tag'] || ''), 'Served public index has no review or indexing blockers');
  check(!/(?:connect-src|form-action)\s+'none'/i.test(html + (response.headers()['content-security-policy'] || '')), 'Served CSP permits the existing request path');
  check(await page.locator('#hero-video').count() === 1, 'Visor video replaces obsolete hero');
  check(await page.locator('#hero-video').getAttribute('src') === '/jarvis/visor/keeper-final-owner-approved-v2.mp4', 'Exact owner-selected keeper v2 is the hero source');
  check(await page.locator('script[src*="core3d"], link[href*="core3d"]').count() === 0, 'Old core3d initialization absent');
  await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
  const initial = await page.locator('video').evaluate(v => ({paused:v.paused,time:v.currentTime,autoplay:v.autoplay,controls:v.controls,preload:v.preload,fit:getComputedStyle(v).objectFit}));
  check(initial.paused && initial.time === 0 && !initial.autoplay && initial.controls && initial.fit === 'contain', 'Silent poster and native controls before activation', initial);
  check(JSON.stringify(await page.locator('.jv-pillar__t').allTextContents()) === JSON.stringify(['Right Hand','Back Office','Follow-through']), 'Approved pillar labels');
  for (const [width,height] of [[1440,900],[3440,1440],[1920,1080],[390,844]]) {
    await page.setViewportSize({width,height});
    await page.locator('#core').ariaSnapshot();
    const geometry = await page.evaluate(() => {
      const button = document.getElementById('hero-start').getBoundingClientRect();
      return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,buttonBottom:button.bottom,buttonHeight:button.height,height:innerHeight};
    });
    check(geometry.scrollWidth <= width && geometry.buttonBottom < height && geometry.buttonHeight >= 44, 'Viewport ' + width + ': no overflow and start visible', geometry);
    await page.screenshot({path: proof + 'poster-' + width + '.png'});
  }
  await page.setViewportSize({width:1440,height:900});
  await page.getByRole('button', {name:'Tap to talk', exact:true}).focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.querySelector('video').currentTime > 1);
  const playback = await page.locator('video').evaluate(v => ({time:v.currentTime,duration:v.duration,muted:v.muted,width:v.videoWidth,height:v.videoHeight,frames:v.getVideoPlaybackQuality().totalVideoFrames,rate:v.playbackRate}));
  check(playback.frames > 0 && playback.width === 854 && playback.height === 480 && Math.abs(playback.duration - 30.08) < .01 && !playback.muted && playback.rate === 1, 'Keyboard activation decodes actual keeper v2 with audio enabled', playback);
  await page.waitForFunction(() => document.querySelector('video').currentTime >= 10);
  await page.locator('#core').ariaSnapshot();
  await page.screenshot({path:proof+'desktop-playing.png'});
  await page.setViewportSize({width:390,height:844});
  await page.waitForFunction(() => document.querySelector('video').currentTime >= 26);
  await page.locator('#core').ariaSnapshot();
  await page.screenshot({path:proof+'phone-playing.png'});
  await page.waitForFunction(() => document.querySelector('video').ended, null, {timeout:40000});
  await page.getByRole('button', {name:'Replay intro',exact:true}).waitFor();
  const end = await page.locator('video').evaluate(v => ({time:v.currentTime,duration:v.duration,frames:v.getVideoPlaybackQuality().totalVideoFrames,ready:v.readyState,ended:v.ended}));
  check(end.ended && end.time === end.duration && end.frames > 700 && end.ready >= 2, 'Natural end retains final decoded frame', end);
  await page.locator('#core').ariaSnapshot();
  await page.screenshot({path:proof+'phone-ended.png'});
  await page.setViewportSize({width:1440,height:900});
  await page.locator('#core').ariaSnapshot();
  await page.screenshot({path:proof+'desktop-ended.png'});
  await page.getByRole('button',{name:'Replay intro',exact:true}).click();
  await page.waitForFunction(() => {const v=document.querySelector('video');return !v.paused && v.currentTime > .2 && v.currentTime < 3;});
  check(true,'Replay restarts playback from beginning');
  await page.getByRole('link',{name:'Continue to sample day',exact:true}).click();
  check(await page.locator('video').evaluate(v=>v.paused),'Continue pauses the recording');
  check(await page.locator('[data-jv-state]').textContent() === 'Not listening','Header stays truthful after scrolling');
  // Intercept only the existing request endpoint: real UI/validation, no email sent.
  const submissions = [];
  let failRequest = true;
  await page.route(origin + '/api/handoff', async route => {
    submissions.push({method:route.request().method(), body:route.request().postDataJSON()});
    await route.fulfill({status:failRequest ? 500 : 200, contentType:'application/json', body:JSON.stringify(failRequest ? {error:'Email service unavailable'} : {success:true})});
  });
  const requestCall = page.getByRole('button',{name:'Request a call',exact:true});
  await requestCall.click();
  check(await page.locator('[data-jv-err]').isVisible() && (await page.locator('[data-jv-err]').textContent()).includes('Pick a pillar') && submissions.length === 0, 'Empty contact form gives validation without submitting');
  await page.locator('input[name="pillar"][value="assistant"]').check();
  await page.getByLabel('First handoff', {exact:true}).fill('Test only — do not send');
  await page.getByLabel('Your name', {exact:true}).fill('Test Visitor');
  await page.getByLabel('Phone', {exact:true}).fill('5550100');
  await requestCall.click();
  await page.waitForFunction(() => document.querySelector('[data-jv-err]').textContent.includes('Email service unavailable'));
  check(await requestCall.isEnabled() && !(await page.locator('.jv-start').getAttribute('class')).includes('is-sent'), 'Failed request shows server error and permits retry');
  await page.locator('.jv-start').ariaSnapshot();
  await page.screenshot({path:proof+'request-error.png'});
  failRequest = false;
  await requestCall.click();
  await page.locator('.jv-start.is-sent').waitFor();
  check(submissions.length === 2 && submissions.every(r => r.method === 'POST' && r.body.pillar === 'assistant' && r.body.firstHandoff === 'Test only — do not send' && r.body.fullName === 'Test Visitor' && r.body.phoneNumber === '5550100' && r.body.company === ''), 'Real form submits expected JSON to the original handoff endpoint', submissions);
  check(await page.locator('#sent').isVisible() && await page.locator('#sent').evaluate(el => el === document.activeElement), 'Successful request shows and focuses confirmation');
  await page.setViewportSize({width:390,height:844});
  await page.locator('#sent').scrollIntoViewIfNeeded();
  await page.locator('.jv-start').ariaSnapshot();
  await page.screenshot({path:proof+'phone-request-success.png'});
  const destinations = {
    'What it does':'/features', 'How it works':'/how-it-works', 'What to expect':'/pricing', 'About':'/about',
    'Meet Jarvis':'https://meetjarvis.getoios.com', 'Privacy':'/privacy', 'Terms':'/terms', 'Texting':'/sms', 'team@getoios.com':'mailto:team@getoios.com',
    'Meet Jarvis, the long version.':'https://meetjarvis.getoios.com', 'How it works, step by step.':'/how-it-works', 'What it does, the full list.':'/features'
  };
  for (const [name,href] of Object.entries(destinations)) {
    if (await page.getByRole('link',{name,exact:true}).getAttribute('href') !== href) throw new Error('Wrong public destination: ' + name);
  }
  check(true,'All twelve footer and information links retain their pre-merge destinations',destinations);
  const noConnection = await page.evaluate(() => ({mic:window.__micCalls,socket:window.__socketCalls}));
  check(noConnection.mic === 0 && noConnection.socket === 0,'No microphone or live connection attempts',noConnection);
  check(requests.every(r => r.url.startsWith(origin + '/') && (['GET','HEAD'].includes(r.method) || (r.method === 'POST' && r.url === origin + '/api/handoff'))) && requests.filter(r => r.method === 'POST').length === submissions.length, 'Only local assets and intercepted handoff submissions; no external operation', {requests:requests.length,interceptedPosts:submissions.length});
  check(errors.length === 0,'No runtime page errors',errors);
  await page.getByRole('link',{name:'What it does',exact:true}).click();
  await page.waitForURL(origin + '/features');
  check(true,'Footer link navigates to the actual features page');
  await page.unroute(origin + '/api/handoff');
  // The native form must still submit when JavaScript is unavailable.
  const nativeContext = await page.context().browser().newContext({javaScriptEnabled:false});
  try {
    const nativePage = await nativeContext.newPage();
    let nativeSubmission = null;
    await nativePage.route(origin + '/api/handoff', async route => {
      nativeSubmission = {method:route.request().method(), body:route.request().postData(), contentType:route.request().headers()['content-type']};
      await route.fulfill({status:200,contentType:'text/html',body:'<p>Test endpoint received the form.</p>'});
    });
    await nativePage.goto(base);
    await nativePage.locator('input[name="pillar"][value="assistant"]').check();
    await nativePage.getByLabel('First handoff',{exact:true}).fill('Test only — do not send');
    await nativePage.getByLabel('Your name',{exact:true}).fill('Test Visitor');
    await nativePage.getByLabel('Phone',{exact:true}).fill('5550100');
    await nativePage.getByRole('button',{name:'Request a call',exact:true}).click();
    await nativePage.waitForURL(origin + '/api/handoff');
    const fields = new URLSearchParams(nativeSubmission.body);
    check(nativeSubmission.method === 'POST' && nativeSubmission.contentType.includes('application/x-www-form-urlencoded') && fields.get('pillar') === 'assistant' && fields.get('firstHandoff') === 'Test only — do not send' && fields.get('fullName') === 'Test Visitor' && fields.get('phoneNumber') === '5550100', 'Without JavaScript, native form posts to the original endpoint (intercepted)', nativeSubmission);
  } finally {
    await nativeContext.close();
  }
  await page.route('**/visor/keeper-final-owner-approved-v2.mp4', route => route.fulfill({status:404,body:'Missing review media'}));
  await page.goto(base);
  await page.getByRole('button',{name:'Retry intro',exact:true}).waitFor();
  check((await page.locator('#hero-status').textContent()).includes('could not play'),'Load failure exposes recovery');
  await page.locator('#core').ariaSnapshot();
  await page.screenshot({path:proof+'load-error.png'});
  await page.unroute('**/visor/keeper-final-owner-approved-v2.mp4');
  await page.getByRole('button',{name:'Retry intro',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('video').currentTime > .2);
  check(true,'Retry recovers when media is restored');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(base);
  check(await page.locator('video').evaluate(v=>v.paused && v.currentTime===0),'Reduced motion opens on silent poster');
  await page.locator('video').evaluate(v=>{v.play=()=>Promise.reject(new DOMException('Playback blocked','NotAllowedError'));});
  await page.getByRole('button',{name:'Tap to talk',exact:true}).click();
  await page.getByRole('button',{name:'Retry intro',exact:true}).waitFor();
  check(true,'Rejected play promise exposes recovery');
  return {passed:results.length,results};
}
