import { test, expect } from '@playwright/test'

/**
 * `/` is the static sample-day door, served by a beforeFiles rewrite in
 * next.config.ts. It has no React Server Components payload, so a `next/link`
 * pointing at it makes the router ask for `/?_rsc=…` and log a 404: once on
 * prefetch when the link scrolls into view, again on click before the router
 * falls back to a full navigation. Links to the door must be plain anchors.
 * This spec watches the network and the console on every Next page, then
 * follows the header logo home. /features, /how-it-works, /pricing and /about
 * redirect to sections of the door, so the shared header and footer reach them
 * with plain `/#…` anchors too.
 */
const NEXT_ROUTES = ['/solutions', '/privacy', '/terms', '/sms']

const KNOWN_NOISE = (message: string) => message.includes('favicon') || message.includes('ERR_BLOCKED_BY_CLIENT')

test.describe('Links to the front door', () => {
  for (const route of NEXT_ROUTES) {
    test(`${route} never asks Next for a payload of /`, async ({ page }) => {
      const rscRequests: string[] = []
      const consoleErrors: string[] = []
      page.on('request', (request) => {
        const url = new URL(request.url())
        if (url.pathname === '/' && url.searchParams.has('_rsc')) rscRequests.push(request.url())
      })
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text())
      })

      await page.goto(route)
      await page.waitForLoadState('networkidle')
      // the footer logo links home too: bring it into view so a prefetch would fire
      await page.locator('footer').scrollIntoViewIfNeeded()
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(750)

      expect(rscRequests).toEqual([])
      expect(consoleErrors.filter((message) => !KNOWN_NOISE(message))).toEqual([])
      await expect(page.locator('header a[href="/"]').first()).toBeVisible()
      // every link to the door or to one of its sections is a plain anchor to /#…
      const doorLinks = await page.locator('a[href^="/#"]').evaluateAll((els) => els.map((el) => el.getAttribute('href')))
      expect(doorLinks).toEqual(expect.arrayContaining(['/#work', '/#install']))
      for (const old of ['/features', '/how-it-works', '/pricing', '/about']) {
        await expect(page.locator(`a[href="${old}"]`)).toHaveCount(0)
      }
    })
  }

  test('the header logo opens the door as a full document', async ({ page }) => {
    await page.goto('/privacy')
    await page.locator('header a[href="/"]').first().click()
    await expect(page.locator('html[data-ready]')).toHaveCount(1, { timeout: 15_000 })
    expect(new URL(page.url()).pathname).toBe('/')
  })

  test('a header section link opens that section of the door', async ({ page }) => {
    await page.goto('/privacy')
    await page.locator('header nav a[href="/#work"]').click()
    await expect(page.locator('html[data-ready]')).toHaveCount(1, { timeout: 15_000 })
    expect(new URL(page.url()).hash).toBe('#work')
    await expect(page.locator('section#work')).toBeInViewport()
  })
})
