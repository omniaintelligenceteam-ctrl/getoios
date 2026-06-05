import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
  })

  // ─── Page load ───────────────────────────────────────────────────────
  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/OIOS/)
  })

  test('returns 200 status', async ({ page }) => {
    const response = await page.goto('/')
    expect(response!.status()).toBe(200)
  })

  // ─── Hero section ────────────────────────────────────────────────────
  test('hero section is visible', async ({ page }) => {
    // The Hero section is typically the first major content area
    const hero = page.locator('section').first()
    await expect(hero).toBeVisible({ timeout: 15_000 })
  })

  test('hero contains a heading', async ({ page }) => {
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible({ timeout: 15_000 })
    const text = await h1.textContent()
    expect(text!.length).toBeGreaterThan(0)
  })

  // ─── Header / Navigation ─────────────────────────────────────────────
  test('header is visible', async ({ page }) => {
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('OIOS logo is present', async ({ page }) => {
    const logo = page.locator('header a[href="/"]')
    await expect(logo).toBeVisible()
  })

  test('navigation links are present', async ({ page }) => {
    const nav = page.locator('header nav')
    await expect(nav).toBeVisible()

    const expectedLinks = [
      { label: 'What It Does', href: '/features' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'What to Expect', href: '/pricing' },
      { label: 'Live Demo', href: '/demo' },
      { label: 'About', href: '/about' },
    ]

    for (const link of expectedLinks) {
      const el = nav.locator(`a[href="${link.href}"]`)
      await expect(el).toBeVisible()
    }
  })

  // ─── CTA buttons ─────────────────────────────────────────────────────
  test('CTA buttons are present and clickable', async ({ page }) => {
    // Look for primary CTA links that go to /form, /demo, or /audit
    const ctas = page.locator('a[href="/form"], a[href="/demo"], a[href="/audit"]')
    const count = await ctas.count()
    expect(count).toBeGreaterThan(0)

    // Verify first CTA is clickable (enabled, visible)
    const firstCta = ctas.first()
    await expect(firstCta).toBeVisible()
    await expect(firstCta).toBeEnabled()
  })

  // ─── Key sections render ─────────────────────────────────────────────
  test('WhoItsFor section renders', async ({ page }) => {
    // Scroll down to find the section — look for trade-related keywords
    const section = page.getByText(/who.*for|small business|trade/i).first()
    await section.scrollIntoViewIfNeeded()
    await expect(section).toBeVisible()
  })

  test('FAQ section renders', async ({ page }) => {
    const faq = page.getByText(/frequently asked|FAQ/i).first()
    await faq.scrollIntoViewIfNeeded()
    await expect(faq).toBeVisible()
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
        !e.includes('404') &&
        !e.includes('ERR_BLOCKED_BY_CLIENT') &&
        !e.includes('third-party')
    )

    expect(realErrors).toHaveLength(0)
  })
})
