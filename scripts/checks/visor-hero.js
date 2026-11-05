/* Run with playwright-cli run-code --filename=scripts/checks/visor-hero.js.
   Start the review server separately. Uses only the current loopback page. */
/* eslint-disable @typescript-eslint/no-unused-expressions -- CLI evaluates this function expression. */
async page => {
  const base = 'http://127.0.0.1:3189/jarvis/';
  const proof = '/home/jarvis333/Plans/visor-jarvis-stills/astra/proof/branch-hero-keeper-v2/';
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
      return Promise.reject(new Error('Microphone forbidden in local review'));
    };
    window.WebSocket = class { constructor() { window.__socketCalls++; throw new Error('Live connection forbidden'); } };
  });
  await page.goto(base);
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
  await page.waitForFunction(() => document.querySelector('video').ended, {timeout:40000});
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
  await page.getByRole('button',{name:'Request a call',exact:true}).click();
  check((await page.locator('[data-jv-err]').textContent()).includes('No request was sent'),'Contact request gives preview-only feedback');
  await page.getByRole('link',{name:'Meet Jarvis',exact:true}).click();
  check(await page.locator('#preview-notice').isVisible(),'External links give preview-only feedback');
  const noConnection = await page.evaluate(() => ({mic:window.__micCalls,socket:window.__socketCalls}));
  check(noConnection.mic === 0 && noConnection.socket === 0,'No microphone or live connection attempts',noConnection);
  check(requests.every(r=>r.url.startsWith('http://127.0.0.1:3189/') && ['GET','HEAD'].includes(r.method) && !r.url.includes('/api/')),'Only local static GET/HEAD requests',requests);
  check(errors.length === 0,'No runtime page errors',errors);
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
