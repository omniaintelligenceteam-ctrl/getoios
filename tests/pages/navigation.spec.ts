import { test, expect } from '@playwright/test'

const routes = [
  { path: '/', titlePattern: /Jarvis, three hires in one/ },
  { path: '/sms', titlePattern: /Text Alerts/i },
  { path: '/privacy', titlePattern: /Privacy/i },
  { path: '/terms', titlePattern: /Terms/i },
]

test.describe('Navigation: All pages load', () => {
  for (const route of routes) {
    test(`${route.path} loads without errors`, async ({ page }) => {
      const response = await page.goto(route.path)
      expect(response).not.toBeNull()
      expect(response!.status()).toBeLessThan(400)
      await expect(page).toHaveTitle(route.titlePattern)
    })
  }
})

// The sample-day front door replaced the old site. Each old address
// answers with a temporary redirect to the matching section (next.config.ts).
test.describe('Navigation: old page addresses open the front door', () => {
  const moved = [
    { from: '/features', hash: '#work' },
    { from: '/how-it-works', hash: '#install' },
    { from: '/pricing', hash: '#install' },
    { from: '/about', hash: '#behind' },
    { from: '/solutions', hash: '#work' },
    { from: '/form', hash: '#start' },
    { from: '/audit', hash: '#start' },
    { from: '/demo', hash: '#start' },
  ]

  for (const { from, hash } of moved) {
    test(`${from} redirects to /${hash}`, async ({ page, request }) => {
      const answer = await request.get(from, { maxRedirects: 0 })
      expect(answer.status()).toBe(307)
      expect(answer.headers()['location']).toBe(`/${hash}`)
      await page.goto(from)
      await expect(page.locator('html[data-ready]')).toHaveCount(1, { timeout: 15_000 })
      expect(new URL(page.url()).pathname).toBe('/')
      expect(new URL(page.url()).hash).toBe(hash)
      await expect(page.locator(`section${hash}`)).toBeInViewport()
    })
  }

  test('a redirect keeps the query string of the old address', async ({ request }) => {
    const answer = await request.get('/pricing?utm_source=test', { maxRedirects: 0 })
    expect(answer.headers()['location']).toBe('/?utm_source=test#install')
  })
})

// The front door at / is the static page in public/jarvis with its own chrome
// (see homepage.spec.ts). The shared header with the site navigation lives on
// the Next pages, so the header tests start from one of those.
test.describe('Navigation: Header links work', () => {
  const headerLinks = [
    { label: 'What It Does', href: '/#work' },
    { label: 'How It Works', href: '/#install' },
    { label: 'About', href: '/#behind' },
  ]

  for (const link of headerLinks) {
    test(`clicking "${link.label}" opens ${link.href}`, async ({ page }) => {
      await page.goto('/privacy')
      await page.waitForLoadState('domcontentloaded')
      // Use the desktop nav (hidden on mobile)
      const navLink = page.locator(`header nav a[href="${link.href}"]`)
      await expect(navLink).toHaveText(link.label)
      await navLink.click()
      await expect(page).toHaveURL(new RegExp(`/${link.href.slice(1)}$`))
    })
  }

  test('logo navigates to homepage', async ({ page }) => {
    await page.goto('/privacy')
    await page.waitForLoadState('domcontentloaded')
    const logo = page.locator('header a[href="/"]').first()
    await logo.click()
    // / is a rewrite to the static front door, so the router falls back to a
    // full navigation; wait for the URL rather than a load event
    await expect(page).toHaveURL(/\/$/)
  })
})

test.describe('Navigation: Browser history', () => {
  test('back button returns to previous page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    await page.goto('/privacy')
    await page.waitForLoadState('domcontentloaded')
    expect(page.url()).toContain('/privacy')

    await page.goBack()
    await page.waitForLoadState('domcontentloaded')
    expect(page.url()).toMatch(/\/$/)
  })

  test('forward button works after going back', async ({ page }) => {
    await page.goto('/')
    await page.goto('/terms')
    await page.waitForLoadState('domcontentloaded')

    await page.goBack()
    await page.waitForLoadState('domcontentloaded')

    await page.goForward()
    await page.waitForLoadState('domcontentloaded')
    expect(page.url()).toContain('/terms')
  })
})

test.describe('Navigation: Mobile menu', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('mobile menu toggle exists', async ({ page }) => {
    await page.goto('/privacy')
    await page.waitForLoadState('domcontentloaded')

    // On mobile, the nav and the desktop CTA are hidden; the hamburger is the
    // only visible header button
    const menuButton = page.locator('header button:visible').first()
    await expect(menuButton).toBeVisible()
  })

  test('mobile menu opens and shows nav links', async ({ page }) => {
    await page.goto('/privacy')
    await page.waitForLoadState('domcontentloaded')

    const menuButton = page.locator('header button:visible').first()
    await menuButton.click()

    // After clicking, nav links should become visible
    // Wait a moment for animation
    await page.waitForTimeout(500)

    // the desktop nav keeps its own (hidden) copy of each link; take the visible one
    const mobileNavLink = page.locator('header a[href="/#work"]:visible').first()
    await expect(mobileNavLink).toBeVisible()
  })
})
