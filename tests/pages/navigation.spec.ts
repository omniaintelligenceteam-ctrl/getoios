import { test, expect } from '@playwright/test'

const routes = [
  { path: '/', titlePattern: /OIOS/ },
  { path: '/features', titlePattern: /What Jarvis does/i },
  { path: '/how-it-works', titlePattern: /How a request moves/i },
  { path: '/pricing', titlePattern: /Month 1/i },
  { path: '/solutions', titlePattern: /say to Jarvis/i },
  { path: '/form', titlePattern: /OIOS|Form|See What/i },
  { path: '/about', titlePattern: /Why we built Jarvis/i },
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

test.describe('Navigation: Header links work', () => {
  const headerLinks = [
    { label: 'What you can say', href: '/features' },
    { label: 'How it works', href: '/how-it-works' },
    { label: 'Month 1', href: '/pricing' },
    { label: 'About', href: '/about' },
  ]

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
  })

  for (const link of headerLinks) {
    test(`clicking "${link.label}" navigates to ${link.href}`, async ({ page }) => {
      // Use the desktop nav (hidden on mobile)
      const navLink = page.locator(`header nav a[href="${link.href}"]`)
      await navLink.click()
      await page.waitForURL(`**${link.href}`)
      expect(page.url()).toContain(link.href)
    })
  }

  test('logo navigates to homepage', async ({ page }) => {
    await page.goto('/features')
    await page.waitForLoadState('domcontentloaded')
    const logo = page.locator('header a[href="/"]').first()
    await logo.click()
    await page.waitForURL((url) => url.pathname === '/')
    expect(page.url()).toMatch(/\/$/)
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
    await page.waitForURL((url) => url.pathname === '/')
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
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // On mobile, the nav should be hidden and a hamburger button visible
    const menuButton = page.locator('header button').first()
    await expect(menuButton).toBeVisible()
  })

  test('mobile menu opens and shows nav links', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const menuButton = page.locator('header button').first()
    await menuButton.click()

    // After clicking, nav links should become visible
    // Wait a moment for animation
    await page.waitForTimeout(500)

    const mobileNavLink = page.locator('header a[href="/features"]:visible').first()
    await expect(mobileNavLink).toBeVisible()
  })
})
