import { test, expect } from '@playwright/test'

const routes = [
  { path: '/', titlePattern: /Jarvis, a chief of staff/ },
  { path: '/features', titlePattern: /What OIOS Does|Features/i },
  { path: '/how-it-works', titlePattern: /How.*Works/i },
  { path: '/pricing', titlePattern: /Pricing|What to Expect/i },
  { path: '/solutions', titlePattern: /Solutions/i },
  { path: '/form', titlePattern: /OIOS|Form|See What/i },
  { path: '/about', titlePattern: /About/i },
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

// The front door at / is the static page in public/jarvis with its own chrome
// (see homepage.spec.ts). The shared header with the site navigation lives on
// the Next pages, so the header tests start from one of those.
test.describe('Navigation: Header links work', () => {
  const headerLinks = [
    { label: 'What It Does', href: '/features', from: '/pricing' },
    { label: 'How It Works', href: '/how-it-works', from: '/pricing' },
    { label: 'What to Expect', href: '/pricing', from: '/about' },
    { label: 'About', href: '/about', from: '/pricing' },
  ]

  for (const link of headerLinks) {
    test(`clicking "${link.label}" navigates to ${link.href}`, async ({ page }) => {
      await page.goto(link.from)
      await page.waitForLoadState('domcontentloaded')
      // Use the desktop nav (hidden on mobile)
      const navLink = page.locator(`header nav a[href="${link.href}"]`)
      await navLink.click()
      // Next's Link navigates client-side; wait for the URL rather than a load event
      await expect(page).toHaveURL(new RegExp(`${link.href}(?:[/?#]|$)`))
    })
  }

  test('logo navigates to homepage', async ({ page }) => {
    await page.goto('/features')
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

    await page.goto('/features')
    await page.waitForLoadState('domcontentloaded')
    expect(page.url()).toContain('/features')

    await page.goBack()
    await page.waitForLoadState('domcontentloaded')
    expect(page.url()).toMatch(/\/$/)
  })

  test('forward button works after going back', async ({ page }) => {
    await page.goto('/')
    await page.goto('/pricing')
    await page.waitForLoadState('domcontentloaded')

    await page.goBack()
    await page.waitForLoadState('domcontentloaded')

    await page.goForward()
    await page.waitForLoadState('domcontentloaded')
    expect(page.url()).toContain('/pricing')
  })
})

test.describe('Navigation: /audit redirects to /form', () => {
  test('visiting /audit redirects to /form', async ({ page }) => {
    await page.goto('/audit')
    await page.waitForLoadState('domcontentloaded')
    expect(page.url()).toContain('/form')
  })
})

test.describe('Navigation: /demo redirects to /form', () => {
  test('visiting /demo redirects to /form (live demo offline)', async ({ page }) => {
    await page.goto('/demo')
    await page.waitForLoadState('domcontentloaded')
    expect(page.url()).toContain('/form')
  })
})

test.describe('Navigation: Mobile menu', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('mobile menu toggle exists', async ({ page }) => {
    await page.goto('/features')
    await page.waitForLoadState('domcontentloaded')

    // On mobile, the nav and the desktop CTA are hidden; the hamburger is the
    // only visible header button
    const menuButton = page.locator('header button:visible').first()
    await expect(menuButton).toBeVisible()
  })

  test('mobile menu opens and shows nav links', async ({ page }) => {
    await page.goto('/features')
    await page.waitForLoadState('domcontentloaded')

    const menuButton = page.locator('header button:visible').first()
    await menuButton.click()

    // After clicking, nav links should become visible
    // Wait a moment for animation
    await page.waitForTimeout(500)

    // the desktop nav keeps its own (hidden) copy of each link; take the visible one
    const mobileNavLink = page.locator('header a[href="/features"]:visible').first()
    await expect(mobileNavLink).toBeVisible()
  })
})
