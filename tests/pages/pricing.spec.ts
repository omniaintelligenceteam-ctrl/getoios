import { test, expect } from '@playwright/test'

test.describe('Pricing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing')
    await page.waitForLoadState('domcontentloaded')
  })

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Pricing|What to Expect/i)
  })

  test('returns 200 status', async ({ page }) => {
    const response = await page.goto('/pricing')
    expect(response!.status()).toBe(200)
  })

  test('header is visible', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible()
  })

  test('page hero renders with heading', async ({ page }) => {
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible({ timeout: 10_000 })
  })

  test('what to expect section renders', async ({ page }) => {
    // WhatToExpect component
    const content = page.getByText(/expect|custom|built/i).first()
    await content.scrollIntoViewIfNeeded()
    await expect(content).toBeVisible()
  })

  test('onboarding timeline renders', async ({ page }) => {
    const timeline = page.getByText(/onboard|timeline|step|week/i).first()
    await timeline.scrollIntoViewIfNeeded()
    await expect(timeline).toBeVisible()
  })

  test('FAQ section renders on pricing page', async ({ page }) => {
    const faq = page.getByText(/frequently asked|FAQ|question/i).first()
    await faq.scrollIntoViewIfNeeded()
    await expect(faq).toBeVisible()
  })

  test('CTA buttons are present', async ({ page }) => {
    const ctas = page.locator('a[href="/form"], a[href="/demo"], a[href="/audit"]')
    const count = await ctas.count()
    expect(count).toBeGreaterThan(0)
  })

  test('footer renders', async ({ page }) => {
    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer).toBeVisible()
  })

  test('no console errors on pricing page', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.goto('/pricing')
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
