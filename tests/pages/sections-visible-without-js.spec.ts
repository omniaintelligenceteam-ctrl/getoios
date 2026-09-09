import { test, expect } from '@playwright/test'

/**
 * The regression this pins:
 *
 * Every section below the hero used motion/react's `whileInView` with
 * `initial={{ opacity: 0 }}`, which writes opacity:0 into the SSR HTML. With
 * Lenis holding the scroll and the observers never firing, a headless browser
 * — and some real ones — rendered a hero and then nothing.
 *
 * The fix is the `.reveal` layer in globals.css: the hidden state only exists
 * under `html.js`, stamped by an inline script in layout.tsx. So with JS off,
 * everything is simply visible. These tests fail if anyone reintroduces an
 * SSR-time opacity:0.
 */

const ROUTES = ['/', '/features', '/how-it-works', '/solutions', '/pricing', '/about']

test.describe('Sections render without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  for (const route of ROUTES) {
    test(`${route} renders its headings and body copy with JS disabled`, async ({ page }) => {
      await page.goto(route)

      const headings = page.locator('h1, h2, h3')
      const count = await headings.count()
      expect(count).toBeGreaterThan(0)

      for (let i = 0; i < count; i++) {
        await expect(headings.nth(i)).toBeVisible()
      }

      // A page that renders its shell but none of its sections still passes a
      // heading count, so pin the amount of copy actually on screen.
      const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim()
      expect(text.length, `${route} rendered almost no text`).toBeGreaterThan(1500)
    })
  }

  test('homepage ships every named section with JS disabled', async ({ page }) => {
    await page.goto('/')

    const sectionIds = [
      'a-day-with-jarvis',
      'what-you-can-say',
      'how-a-request-moves',
      'he-asks-first',
      'he-knows-your-business',
      'while-you-sleep',
      'month-one',
      'proof',
      'faq',
    ]

    for (const id of sectionIds) {
      await expect(page.locator(`#${id}`)).toBeVisible()
    }
  })

  test('no element is hidden by an inline opacity:0 in the served HTML', async ({ page }) => {
    for (const route of ROUTES) {
      const response = await page.goto(route)
      const html = await response!.text()
      const hidden = html.match(/style="[^"]*opacity:\s*0(?![.\d])[^"]*"/g) ?? []

      // The only allowed one is the page-entrance overlay's own logo, which
      // sits inside a full-screen black cover and is not page content.
      const contentHidden = hidden.filter((s) => !s.includes('translate(-50%, -50%)'))
      expect(contentHidden, `${route} hides content in the SSR HTML`).toEqual([])
    }
  })
})
