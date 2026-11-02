import { test, expect } from '@playwright/test'

/**
 * The front door. `/` is the static scroll-craft page in public/jarvis, served
 * by the rewrite in next.config.ts. It carries its own chrome: a status bar
 * (header), a tab rail (nav) and the handoff form that posts to /api/handoff.
 * The engine marks <html class="sc-ready"> once the page has booted.
 */
test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
  })

  // ─── Page load ───────────────────────────────────────────────────────
  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Jarvis.*OIOS/)
  })

  test('returns 200 status', async ({ page }) => {
    const response = await page.goto('/')
    expect(response!.status()).toBe(200)
  })

  test('the scroll engine boots', async ({ page }) => {
    await expect(page.locator('html')).toHaveClass(/sc-ready/, { timeout: 15_000 })
  })

  // ─── Hero / status bar ───────────────────────────────────────────────
  test('hero carries the one h1', async ({ page }) => {
    const h1 = page.locator('h1#site-title')
    await expect(h1).toBeVisible({ timeout: 15_000 })
    expect((await h1.textContent())!.trim().length).toBeGreaterThan(0)
    await expect(page.locator('h1')).toHaveCount(1)
  })

  test('status bar shows the brand link and a state word', async ({ page }) => {
    await expect(page.locator('header.jv-bar')).toBeVisible()
    await expect(page.locator('header a[href="/"]')).toBeVisible()
    await expect(page.locator('[data-jv-state]')).not.toBeEmpty()
  })

  test('tab rail links to every act', async ({ page }) => {
    const rail = page.locator('nav[aria-label="Sections"]')
    await expect(rail).toBeVisible()
    for (const id of ['today', 'desks', 'approve', 'pillars']) {
      await expect(rail.locator(`a[href="#${id}"]`)).toBeVisible()
      await expect(page.locator(`section#${id}`)).toHaveCount(1)
    }
  })

  // ─── Pillars act ─────────────────────────────────────────────────────
  test('pillars act shows the three pillars with a picture each', async ({ page }) => {
    await expect(page.locator('#pillars h3.jv-pillar__t')).toHaveText(['Assistant', 'Back Office', 'Workflows'])
    const pictures = page.locator('#pillars .jv-pillar img')
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

  test('each pillar card links to the form with its pillar chosen', async ({ page }) => {
    await expect(page.locator('#pillars a[data-jv-choose]')).toHaveCount(3)
    await page.locator('[data-jv-choose="back-office"]').click()
    await expect(page).toHaveURL(/#start$/)
    await expect(page.locator('input[name="pillar"][value="back-office"]')).toBeChecked()
    // quick picks that belong to another pillar step aside
    await expect(page.locator('[data-jv-pick][data-jv-for="workflows"]').first()).toBeHidden()
    await expect(page.locator('[data-jv-pick][data-jv-for="back-office"]').first()).toBeVisible()
  })

  // ─── Handoff form ────────────────────────────────────────────────────
  test('handoff form asks which pillar first', async ({ page }) => {
    const form = page.locator('form.jv-start')
    await expect(form).toHaveAttribute('action', '/api/handoff')
    await expect(form.locator('[data-jv-pillars] legend')).toHaveText(/Which pillar are you most interested in/)
    const radios = form.locator('input[name="pillar"]')
    await expect(radios).toHaveCount(3)
    expect(await radios.evaluateAll((els) => els.map((el) => (el as HTMLInputElement).value))).toEqual([
      'assistant',
      'back-office',
      'workflows',
    ])
    for (const name of ['firstHandoff', 'fullName', 'phoneNumber']) {
      await expect(form.locator(`[name="${name}"]`)).toHaveCount(1)
    }
    await expect(form.locator('[type="submit"]')).toBeEnabled()
  })

  test('submitting without a pillar marks the question and says so', async ({ page }) => {
    await page.goto('/?fresh=1#start')
    await expect(page.locator('html')).toHaveClass(/sc-ready/, { timeout: 15_000 })
    await page.locator('form.jv-start [type="submit"]').click()
    await expect(page.locator('[data-jv-pillars]')).toHaveClass(/is-missing/)
    await expect(page.locator('[data-jv-err]')).toHaveText(/Pick a pillar/)
    expect(await page.evaluate(() => (document.activeElement as HTMLInputElement | null)?.name)).toBe('pillar')
  })

  test('a filled form posts the pillar to /api/handoff and shows the sent state', async ({ page }) => {
    let posted: Record<string, string> | null = null
    await page.route('**/api/handoff', async (route) => {
      posted = route.request().postDataJSON()
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' })
    })
    await page.goto('/?fresh=1#start')
    await expect(page.locator('html')).toHaveClass(/sc-ready/, { timeout: 15_000 })
    await page.locator('input[name="pillar"][value="workflows"]').check()
    await page.locator('[data-jv-pick][data-jv-for="workflows"]').first().click()
    await page.fill('input[name="fullName"]', 'Test User')
    await page.fill('input[name="phoneNumber"]', '(512) 555-0100')
    await page.locator('form.jv-start [type="submit"]').click()
    await expect(page.locator('form.jv-start')).toHaveClass(/is-sent/)
    expect(posted).toMatchObject({ pillar: 'workflows', fullName: 'Test User', phoneNumber: '(512) 555-0100' })
    expect(posted!.firstHandoff.trim().length).toBeGreaterThan(0)
  })

  test('a ?pillar= link from another page preselects the pillar', async ({ page }) => {
    await page.goto('/?pillar=assistant#start')
    await expect(page.locator('html')).toHaveClass(/sc-ready/, { timeout: 15_000 })
    await expect(page.locator('input[name="pillar"][value="assistant"]')).toBeChecked()
    await expect(page.locator('[data-jv-pick][data-jv-for="workflows"]').first()).toBeHidden()
  })

  // ─── Audience ────────────────────────────────────────────────────────
  // Wes, 2 Nov 2026: OIOS is for all small businesses, not just the trades.
  // The sample day, the desks, the pillars and the form must not read as
  // trades-only. The words below are the ones the first draft leaned on.
  const TRADE_WORDS = /\b(truck|roof|crews?|price book|walkthrough|lumber|decks?|fence|hvac|contractors?)\b/i

  test('the door speaks to every small business, not just the trades', async ({ page }) => {
    await expect(page.locator('html')).toHaveClass(/sc-ready/, { timeout: 15_000 })
    const text = await page.evaluate(() => document.body.innerText)
    expect(text).not.toMatch(TRADE_WORDS)
    const alts = await page.locator('img[alt]').evaluateAll((els) => els.map((el) => el.getAttribute('alt') || ''))
    expect(alts.length).toBeGreaterThanOrEqual(3)
    for (const alt of alts) expect(alt).not.toMatch(TRADE_WORDS)
    const placeholder = await page.locator('textarea[name="firstHandoff"]').getAttribute('placeholder')
    expect(placeholder).not.toMatch(TRADE_WORDS)
  })

  // ─── Footer ──────────────────────────────────────────────────────────
  test('footer is visible with correct links', async ({ page }) => {
    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer).toBeVisible()

    // Check key footer links
    await expect(footer.locator('a[href="/features"]')).toBeVisible()
    await expect(footer.locator('a[href="/how-it-works"]')).toBeVisible()
    await expect(footer.locator('a[href="/privacy"]')).toBeVisible()
    await expect(footer.locator('a[href="/terms"]')).toBeVisible()
  })

  test('footer contains contact email', async ({ page }) => {
    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    const email = footer.locator('a[href="mailto:team@getoios.com"]')
    await expect(email).toBeVisible()
  })

  // ─── Console errors ──────────────────────────────────────────────────
  test('no console errors on load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Filter out known benign errors (e.g. third-party scripts, favicon)
    const realErrors = errors.filter(
      (e) =>
        !e.includes('favicon') &&
        !e.includes('ERR_BLOCKED_BY_CLIENT') &&
        !e.includes('third-party')
    )

    expect(realErrors).toHaveLength(0)
  })
})
