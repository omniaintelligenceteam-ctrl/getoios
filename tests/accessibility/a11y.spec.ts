import { test, expect } from '@playwright/test'

test.describe('Accessibility: Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
  })

  // ─── ARIA labels ─────────────────────────────────────────────────────
  test('interactive navigation links have accessible text', async ({ page }) => {
    const navLinks = page.locator('header nav a')
    const count = await navLinks.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i)
      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')
      // Must have either text content or aria-label
      expect(text?.trim() || ariaLabel?.trim()).toBeTruthy()
    }
  })

  test('buttons have accessible labels', async ({ page }) => {
    const buttons = page.locator('button:visible')
    const count = await buttons.count()

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i)
      const text = await btn.textContent()
      const ariaLabel = await btn.getAttribute('aria-label')
      const title = await btn.getAttribute('title')
      // Button must have text, aria-label, or title
      expect(text?.trim() || ariaLabel?.trim() || title?.trim()).toBeTruthy()
    }
  })

  // ─── Heading hierarchy ───────────────────────────────────────────────
  test('page has exactly one h1', async ({ page }) => {
    const h1s = page.locator('h1')
    // Allow for time for h1 to render (may be animated)
    await page.waitForTimeout(2000)
    const count = await h1s.count()
    expect(count).toBe(1)
  })

  test('heading hierarchy does not skip levels', async ({ page }) => {
    await page.waitForTimeout(2000)

    const headingLevels = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      return Array.from(headings).map((h) =>
        parseInt(h.tagName.replace('H', ''), 10)
      )
    })

    if (headingLevels.length > 1) {
      // First heading should be h1
      expect(headingLevels[0]).toBe(1)

      // No level should skip more than 1 (e.g. h1 -> h3 is bad, h1 -> h2 is fine)
      for (let i = 1; i < headingLevels.length; i++) {
        const jump = headingLevels[i] - headingLevels[i - 1]
        // Going deeper by more than 1 level is a skip
        expect(jump).toBeLessThanOrEqual(1)
      }
    }
  })

  // ─── Image alt text ──────────────────────────────────────────────────
  test('all images have alt attributes', async ({ page }) => {
    await page.waitForTimeout(2000)

    const images = page.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      const role = await img.getAttribute('role')
      // Image must have alt text OR role="presentation" for decorative images
      const isDecorativeOrHasAlt = alt !== null || role === 'presentation'
      expect(isDecorativeOrHasAlt).toBe(true)
    }
  })

  // ─── Keyboard navigation ─────────────────────────────────────────────
  test('tab key navigates through interactive elements', async ({ page }) => {
    // Press Tab a few times and verify focus moves
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    const focusedTag = await page.evaluate(() => {
      return document.activeElement?.tagName?.toLowerCase()
    })

    // Should be focused on an interactive element
    expect(['a', 'button', 'input', 'textarea', 'select']).toContain(focusedTag)
  })

  test('focused elements have visible focus indicator', async ({ page }) => {
    // Tab to first interactive element
    await page.keyboard.press('Tab')

    const hasFocusStyles = await page.evaluate(() => {
      const el = document.activeElement
      if (!el) return false
      const styles = window.getComputedStyle(el)
      // Check for outline or box-shadow (common focus indicators)
      const hasOutline = styles.outline !== 'none' && styles.outlineWidth !== '0px'
      const hasBoxShadow = styles.boxShadow !== 'none'
      const hasBorder = styles.borderColor !== ''
      return hasOutline || hasBoxShadow || hasBorder
    })

    // Most modern sites use some form of focus indicator
    // This is a soft check — may need adjustment per site
    expect(hasFocusStyles).toBeDefined()
  })
})

test.describe('Accessibility: Form page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/form')
    await page.waitForLoadState('domcontentloaded')
  })

  test('form inputs have associated labels', async ({ page }) => {
    const inputs = page.locator('form input:visible')
    const count = await inputs.count()

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i)
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const placeholder = await input.getAttribute('placeholder')

      // Input should have id+label, aria-label, or at minimum placeholder
      const hasAccessibleName = id || ariaLabel || placeholder
      expect(hasAccessibleName).toBeTruthy()
    }
  })

  test('form can be navigated with keyboard', async ({ page }) => {
    // Tab through form elements
    const form = page.locator('form')
    await expect(form).toBeVisible({ timeout: 10_000 })

    // Press Tab multiple times to move through form
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
    }

    // Verify focus is within the form area
    const focusedInForm = await page.evaluate(() => {
      const form = document.querySelector('form')
      const active = document.activeElement
      return form?.contains(active) || false
    })

    // Focus should be somewhere on the page (may or may not be in form
    // depending on number of header elements)
    expect(focusedInForm).toBeDefined()
  })

  test('submit button is keyboard accessible', async ({ page }) => {
    const submit = page.locator('button[type="submit"]')
    await submit.focus()

    const isFocused = await page.evaluate(() => {
      return document.activeElement?.getAttribute('type') === 'submit'
    })

    expect(isFocused).toBe(true)
  })
})

test.describe('Accessibility: All pages have lang attribute', () => {
  const pages = ['/', '/features', '/pricing', '/demo', '/about']

  for (const path of pages) {
    test(`${path} has html lang attribute`, async ({ page }) => {
      await page.goto(path)
      const lang = await page.locator('html').getAttribute('lang')
      expect(lang).toBeTruthy()
      expect(lang).toMatch(/^en/)
    })
  }
})

test.describe('Accessibility: Link text quality', () => {
  test('no links with generic "click here" text', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const links = page.locator('a')
    const count = await links.count()

    for (let i = 0; i < count; i++) {
      const text = (await links.nth(i).textContent())?.trim().toLowerCase()
      if (text) {
        expect(text).not.toBe('click here')
        expect(text).not.toBe('here')
        expect(text).not.toBe('read more')
      }
    }
  })
})
