import { test, expect, type Page } from '@playwright/test'

/**
 * The front door. `/` is the static sample-day page in public/jarvis, served by
 * the rewrite in next.config.ts. The visitor plays the owner: three approval
 * taps, a receipt of what they decided, then the call form that posts to
 * /api/handoff. day.js marks <html data-ready> once the page has booted.
 *
 * No test here lets a form post reach the server: each one answers
 * /api/handoff itself, because a real post emails the team inbox.
 */
const ready = (page: Page) => expect(page.locator('html[data-ready]')).toHaveCount(1, { timeout: 15_000 })
const card = (page: Page, scene: 's1' | 's2' | 's3') => page.locator(`[data-scene="${scene}"]`)
const receipt = (page: Page, scene: 's1' | 's2' | 's3') => page.locator(`[data-row="${scene}"] [data-state]`)

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
  })

  // ─── Page load ───────────────────────────────────────────────────────
  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Jarvis, a chief of staff.*Omnia AI Intelligence/)
  })

  test('returns 200 status', async ({ page }) => {
    const response = await page.goto('/')
    expect(response!.status()).toBe(200)
  })

  test('the page boots and is open to search engines', async ({ page }) => {
    await ready(page)
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://getoios.com/')
  })

  // ─── First screen ────────────────────────────────────────────────────
  test('carries the one h1', async ({ page }) => {
    const h1 = page.locator('h1#page-title')
    await expect(h1).toBeVisible()
    await expect(h1).toContainText('chief of staff for small-business owners')
    await expect(page.locator('h1')).toHaveCount(1)
  })

  test('header names Jarvis, the installer and the one action', async ({ page }) => {
    const header = page.locator('header.top')
    await expect(header.locator('a.brand')).toBeVisible()
    await expect(header.locator('.top__by')).toHaveText('installed by Omnia AI Intelligence')
    await expect(header.locator('a[href="#start"]')).toHaveText('Request a call')
  })

  test('section links reach every section', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Sections"]')
    await expect(nav).toBeVisible()
    for (const id of ['work', 'install', 'behind']) {
      await expect(nav.locator(`a[href="#${id}"]`)).toBeVisible()
      await expect(page.locator(`section#${id}`)).toHaveCount(1)
    }
    for (const id of ['day', 'pm', 'night', 'rule', 'start']) await expect(page.locator(`section#${id}`)).toHaveCount(1)
  })

  // ─── The three taps ──────────────────────────────────────────────────
  test('the first approval is on the first screen and stamps the card', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await ready(page)
    const approve = card(page, 's1').locator('[data-approve]')
    await expect(approve).toBeInViewport()
    await expect(card(page, 's1').locator('[data-flag]')).toHaveText('Needs your tap')
    await approve.click()
    await expect(card(page, 's1').locator('[data-flag]')).toHaveText('Sent on your tap')
    await expect(card(page, 's1').locator('[data-stamp]')).toHaveText('Sent 7:42 am, on your tap')
    await expect(receipt(page, 's1')).toHaveText('Sent 7:42 am, on your tap')
    await card(page, 's1').locator('[data-undo]').click()
    await expect(card(page, 's1').locator('[data-flag]')).toHaveText('Needs your tap')
    await expect(receipt(page, 's1')).toHaveText('Waiting on you')
  })

  test('a decline sends nothing and the receipt says so', async ({ page }) => {
    await ready(page)
    await card(page, 's3').locator('[data-decline]').click()
    await expect(card(page, 's3').locator('[data-flag]')).toHaveText('Declined')
    await expect(card(page, 's3').locator('[data-stamp]')).toHaveText('Declined 9:01 pm, nothing sent')
    await expect(receipt(page, 's3')).toHaveText('Declined, nothing sent')
  })

  test('three taps close the day and no tap talks to a server', async ({ page }) => {
    await ready(page)
    const writes: string[] = []
    page.on('request', (request) => {
      if (request.method() !== 'GET') writes.push(`${request.method()} ${request.url()}`)
    })
    await expect(page.locator('[data-receipt-next]')).toBeHidden()
    await card(page, 's1').locator('[data-approve]').click()
    await page.locator('[data-gap-input]').fill('45')
    await expect(page.locator('[data-total]')).toHaveText('$1,970')
    await card(page, 's2').locator('[data-approve]').click()
    await card(page, 's3').locator('[data-approve]').click()
    await expect(page.locator('[data-receipt-next] a')).toHaveAttribute('href', '#start')
    await expect(page.locator('[data-receipt-next]')).toBeVisible()
    await expect(page.locator('[data-tally-text]')).toHaveText('Nothing waiting on you')
    expect(writes).toEqual([])
  })

  test('the business switch rewrites the day', async ({ page }) => {
    await ready(page)
    await expect(page.locator('[data-k="name"]')).toHaveText('Fig Street Café & Catering')
    const before = await card(page, 's1').locator('.tapcard__title').textContent()
    await page.locator('input[name="biz"][value="dental"]').check()
    await expect(page.locator('[data-k="name"]')).toHaveText('Larkin Family Dental')
    await expect(card(page, 's1').locator('.tapcard__title')).not.toHaveText(before!)
  })

  // ─── Pillars ─────────────────────────────────────────────────────────
  test('work section shows the three pillars with a picture each', async ({ page }) => {
    await expect(page.locator('#work .pillar h3')).toHaveText(['Right hand', 'Back office', 'Follow-through'])
    const pictures = page.locator('#work .pillar img')
    await expect(pictures).toHaveCount(3)
    for (let i = 0; i < 3; i++) {
      const img = pictures.nth(i)
      await img.scrollIntoViewIfNeeded()
      expect((await img.getAttribute('alt'))!.trim().length).toBeGreaterThan(0)
      await expect
        .poll(() => img.evaluate((el) => (el as HTMLImageElement).naturalWidth), { timeout: 10_000 })
        .toBeGreaterThan(0)
    }
  })

  test('each pillar links to the form and its name goes along unseen', async ({ page }) => {
    await ready(page)
    await expect(page.locator('#work a[data-pillar]')).toHaveCount(3)
    await page.locator('#work a[data-pillar="back-office"]').click()
    await expect(page).toHaveURL(/#start$/)
    await expect(page.locator('form#handoff input[name="interest"]')).toHaveValue('Back office')
  })

  // ─── Handoff form ────────────────────────────────────────────────────
  test('handoff form keeps the /api/handoff contract', async ({ page }) => {
    const form = page.locator('form#handoff')
    await expect(form).toHaveAttribute('action', '/api/handoff')
    await expect(form).toHaveAttribute('method', 'post')
    // Wes, 10 Nov 2026: a name, an industry, an email and a cell. Nothing else shows.
    const shown = await form
      .locator('input, textarea, select')
      .evaluateAll((els) => els.filter((el) => (el as HTMLElement).offsetParent && (el as HTMLInputElement).name !== 'company').map((el) => (el as HTMLInputElement).name))
    expect(shown).toEqual(['fullName', 'industry', 'email', 'phoneNumber'])
    for (const name of ['interest', 'company']) {
      await expect(form.locator(`[name="${name}"]`)).toHaveCount(1)
    }
    await expect(form.locator('input[name="interest"]')).toHaveAttribute('type', 'hidden')
    await expect(form.locator('[type="submit"]')).toBeEnabled()
    await expect(form.locator('#sent')).toBeHidden()
  })

  test('an empty form names what is missing and posts nothing', async ({ page }) => {
    let posts = 0
    await page.route('**/api/handoff', async (route) => {
      posts++
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' })
    })
    await page.goto('/?fresh=1#start')
    await ready(page)
    await page.locator('form#handoff [type="submit"]').click()
    for (const field of ['fullName', 'industry', 'email', 'phoneNumber']) {
      await expect(page.locator(`[data-field="${field}"] [data-err]`)).toBeVisible()
    }
    expect(await page.evaluate(() => (document.activeElement as HTMLInputElement | null)?.name)).toBe('fullName')
    expect(posts).toBe(0)
  })

  test('an email address without its @ is named and posts nothing', async ({ page }) => {
    let posts = 0
    await page.route('**/api/handoff', async (route) => {
      posts++
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' })
    })
    await page.goto('/?fresh=1#start')
    await ready(page)
    await page.fill('input[name="fullName"]', 'Test User')
    await page.fill('input[name="industry"]', 'Bakery')
    await page.fill('input[name="email"]', 'test.example.com')
    await page.fill('input[name="phoneNumber"]', '(512) 555-0100')
    await page.locator('form#handoff [type="submit"]').click()
    await expect(page.locator('[data-field="email"] [data-err]')).toBeVisible()
    await expect(page.locator('[data-field="fullName"] [data-err]')).toBeHidden()
    expect(posts).toBe(0)
  })

  test('a filled form posts its four answers to /api/handoff and shows the sent state', async ({ page }) => {
    let posted: Record<string, string> | null = null
    await page.route('**/api/handoff', async (route) => {
      posted = route.request().postDataJSON()
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' })
    })
    await page.goto('/?fresh=1#start')
    await ready(page)
    await page.fill('input[name="fullName"]', 'Test User')
    await page.fill('input[name="industry"]', 'Bakery')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="phoneNumber"]', '(512) 555-0100')
    await page.locator('form#handoff [type="submit"]').click()
    await expect(page.locator('form#handoff')).toHaveClass(/is-sent/)
    await expect(page.locator('#sent')).toHaveText('Got it, Test. Omnia will call you.')
    await expect(page.locator('form#handoff [type="submit"]')).toBeDisabled()
    expect(posted).toEqual({
      fullName: 'Test User',
      industry: 'Bakery',
      email: 'test@example.com',
      phoneNumber: '(512) 555-0100',
      interest: '',
      company: '',
    })
  })

  test('a refused post says so and lets the visitor try again', async ({ page }) => {
    await page.route('**/api/handoff', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"Failed to send notification"}' })
    )
    await page.goto('/?pillar=assistant#start')
    await ready(page)
    await page.fill('input[name="fullName"]', 'Test User')
    await page.fill('input[name="industry"]', 'Bakery')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="phoneNumber"]', '512 555 0100')
    await page.locator('form#handoff [type="submit"]').click()
    await expect(page.locator('[data-form-err]')).toContainText('Your request did not send')
    await expect(page.locator('[data-form-err] a')).toHaveAttribute('href', 'mailto:team@getoios.com')
    await expect(page.locator('form#handoff [type="submit"]')).toBeEnabled()
    await expect(page.locator('form#handoff')).not.toHaveClass(/is-sent/)
  })

  test('a ?pillar= link from another page sends its pillar along unseen', async ({ page }) => {
    await page.goto('/?pillar=assistant#start')
    await ready(page)
    await expect(page.locator('form#handoff input[name="interest"]')).toHaveValue('Right hand')
    await page.goto('/?pillar=everything#start')
    await ready(page)
    await expect(page.locator('form#handoff input[name="interest"]')).toHaveValue('')
  })

  test('/#sent, where the no-script post lands, shows the confirmation', async ({ page }) => {
    await page.goto('/?fresh=1#sent')
    await expect(page.locator('#sent')).toBeVisible()
    await expect(page.locator('#sent')).toHaveText('Got it. Omnia will call you.')
  })

  // ─── Audience ────────────────────────────────────────────────────────
  // Wes, 2 Nov 2026: OIOS is for all small businesses, not just the trades.
  // The business switch offers one trade (the plumber) among four. The page as
  // it loads, and the other two businesses, must not read as trades-only.
  const TRADE_WORDS = /\b(truck|roof|crews?|price book|walkthrough|lumber|decks?|fence|hvac|contractors?)\b/i

  for (const biz of ['cafe', 'dental', 'shop']) {
    test(`the ${biz} day speaks to every small business, not just the trades`, async ({ page }) => {
      await ready(page)
      await page.locator(`input[name="biz"][value="${biz}"]`).check()
      await page.waitForTimeout(400)
      const text = await page.evaluate(() => document.body.innerText)
      expect(text).not.toMatch(TRADE_WORDS)
      const alts = await page.locator('img[alt]').evaluateAll((els) => els.map((el) => el.getAttribute('alt') || ''))
      expect(alts.length).toBeGreaterThanOrEqual(3)
      for (const alt of alts) expect(alt).not.toMatch(TRADE_WORDS)
      const placeholder = await page.locator('input[name="industry"]').getAttribute('placeholder')
      expect(placeholder).not.toMatch(TRADE_WORDS)
    })
  }

  // ─── The owner's name ────────────────────────────────────────────────
  // Wes, 12 Nov 2026: "remove my name". The page tells the story and does not name him.
  test('the page does not name the owner', async ({ page }) => {
    await ready(page)
    await expect(page.locator('#behind')).toContainText('eight cities for ten years')
    const html = await page.content()
    expect(html).not.toMatch(/Overstreet/i)
    expect(html).not.toMatch(/\bWes\b/)
  })

  // ─── Footer ──────────────────────────────────────────────────────────
  // Wes, 10 Nov 2026: the same voice sample as meetjarvis. One morning brief, two voices to choose.
  test('the voice sample plays one morning brief in two voices', async ({ page }) => {
    await ready(page)
    const voice = page.locator('[data-voice-sample]')
    const audio = voice.locator('audio')
    await voice.scrollIntoViewIfNeeded()
    await expect(voice.getByRole('button', { name: 'Ava' })).toHaveAttribute('aria-pressed', 'true')
    await expect(voice.locator('[data-voice-label]')).toHaveText(/Ava’s voice · 20 seconds/)
    await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentSrc)).toMatch(/\/jarvis\/assets\/voice\/ava-heart\.mp3$/)
    await audio.evaluate(async (a: HTMLAudioElement) => { a.muted = true; await a.play() })
    await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentTime > 0 && a.duration > 19.5 && a.duration < 21)).toBe(true)

    await voice.getByRole('button', { name: 'Jarvis' }).click()
    await expect(voice.getByRole('button', { name: 'Jarvis' })).toHaveAttribute('aria-pressed', 'true')
    await expect(voice.getByRole('button', { name: 'Ava' })).toHaveAttribute('aria-pressed', 'false')
    await expect(voice.locator('[data-voice-label]')).toHaveText(/Jarvis’s voice · 16 seconds/)
    await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentSrc)).toMatch(/jarvis-liam\.mp3$/)
    await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.paused)).toBe(true)
    await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.duration > 16 && a.duration < 18)).toBe(true)

    await voice.locator('summary').click()
    await expect(voice.locator('details')).toContainText('Good morning. Three things need you today.')
    await expect(voice.locator('[data-voice-alt]')).toBeHidden()
  })

  test('a voice clip that cannot load says so', async ({ page }) => {
    await page.route('**/ava-heart.mp3', (route) => route.abort())
    await page.goto('/')
    await ready(page)
    await expect(page.locator('[data-voice-error]')).toBeVisible()
  })

  test('footer is visible with correct links', async ({ page }) => {
    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer).toBeVisible()
    for (const href of ['/privacy', '/terms', '/sms']) await expect(footer.locator(`a[href="${href}"]`)).toBeVisible()
  })

  test('footer contains contact email', async ({ page }) => {
    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer.locator('a[href="mailto:team@getoios.com"]')).toBeVisible()
  })

  // ─── Phone ───────────────────────────────────────────────────────────
  test('fits a 390 px phone with no sideways scroll', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await ready(page)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391)
    await expect(page.locator('.top__by')).toBeVisible()
    await expect(card(page, 's1').locator('[data-approve]')).toBeVisible()
  })

  // ─── Console errors ──────────────────────────────────────────────────
  test('no console errors on load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (error) => errors.push(error.message))

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Filter out known benign errors (e.g. third-party scripts, favicon)
    const realErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('ERR_BLOCKED_BY_CLIENT') && !e.includes('third-party')
    )

    expect(realErrors).toHaveLength(0)
  })
})

// ─── Without script ────────────────────────────────────────────────────
test.describe('Homepage without script', () => {
  test.use({ javaScriptEnabled: false })

  test('the voice sample keeps one clip and a link to the other voice', async ({ page }) => {
    await page.goto('/')
    const voice = page.locator('[data-voice-sample]')
    await expect(voice.locator('audio')).toHaveCount(1)
    await expect(voice.locator('[data-voice-pick]')).toBeHidden()
    await expect(voice.locator('[data-voice-alt] a')).toHaveAttribute('href', '/jarvis/assets/voice/jarvis-liam.mp3')
  })

  test('the form posts its four fields form-encoded to /api/handoff', async ({ page }) => {
    let contentType = ''
    let body = ''
    await page.route('**/api/handoff', async (route) => {
      contentType = route.request().headers()['content-type'] || ''
      body = route.request().postData() || ''
      await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>answered</title>' })
    })
    await page.goto('/')
    await page.fill('input[name="fullName"]', 'Test User')
    await page.fill('input[name="industry"]', 'Bakery')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="phoneNumber"]', '512 555 0100')
    // Enter in a field submits through the button. A click waits on animation
    // frames, and a page without script gives Playwright none.
    await page.locator('input[name="phoneNumber"]').press('Enter')
    await expect(page).toHaveTitle('answered')
    expect(contentType).toContain('application/x-www-form-urlencoded')
    const sent = new URLSearchParams(body)
    expect(Object.fromEntries(sent)).toEqual({
      fullName: 'Test User',
      industry: 'Bakery',
      email: 'test@example.com',
      phoneNumber: '512 555 0100',
      interest: '',
      company: '',
    })
  })
})
