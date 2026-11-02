import { test, expect } from '@playwright/test'

test.describe('Features page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/features')
    await page.waitForLoadState('domcontentloaded')
  })

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/What OIOS Does/i)
  })

  test('returns 200 status', async ({ page }) => {
    const response = await page.goto('/features')
    expect(response!.status()).toBe(200)
  })

  test('header is visible', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible()
  })

  test('page hero renders', async ({ page }) => {
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible({ timeout: 10_000 })
  })

  test('three pillars section renders', async ({ page }) => {
    // ThreePillars component should render content about AI capabilities
    const content = page.getByText(/voice|scheduling|follow.?up|pillar/i).first()
    await content.scrollIntoViewIfNeeded()
    await expect(content).toBeVisible()
  })

  // Wes, 2 Nov 2026: OIOS is for all small businesses, not just the trades.
  test('the pillars speak to every small business, not just the trades', async ({ page }) => {
    const tradeWords = /\b(truck|roof|crews?|price book|walkthrough|lumber|decks?|fence|hvac|contractors?)\b/i
    const pillars = page.locator('section#pillars')
    await pillars.scrollIntoViewIfNeeded()
    const text = await pillars.evaluate((el) => (el as HTMLElement).innerText)
    expect(text).not.toMatch(tradeWords)
    const alts = await pillars.locator('img[alt]').evaluateAll((els) => els.map((el) => el.getAttribute('alt') || ''))
    expect(alts).toHaveLength(3)
    for (const alt of alts) {
      expect(alt.trim().length).toBeGreaterThan(0)
      expect(alt).not.toMatch(tradeWords)
    }
  })

  test('daily schedule section renders', async ({ page }) => {
    const schedule = page.getByText(/schedule|day|morning|evening/i).first()
    await schedule.scrollIntoViewIfNeeded()
    await expect(schedule).toBeVisible()
  })

  test('footer renders', async ({ page }) => {
    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer).toBeVisible()
  })

  test('page content does not overflow horizontally', async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1)
  })

  test('no console errors on features page', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.goto('/features')
    await page.waitForLoadState('networkidle')

    const realErrors = errors.filter(
      (e) =>
        !e.includes('favicon') &&
        !e.includes('404') &&
        !e.includes('ERR_BLOCKED_BY_CLIENT')
    )
    expect(realErrors).toHaveLength(0)
  })
})
