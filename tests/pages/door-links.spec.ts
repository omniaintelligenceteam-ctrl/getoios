import { test, expect } from '@playwright/test'

/**
 * `/` is the static scroll-craft door, served by a beforeFiles rewrite in
 * next.config.ts. It has no React Server Components payload, so a `next/link`
 * pointing at it makes the router ask for `/?_rsc=…` and log a 404: once on
 * prefetch when the link scrolls into view, again on click before the router
 * falls back to a full navigation. Links to the door must be plain anchors.
 * This spec watches the network and the console on every Next page, then
 * follows the header logo home.
 */
const NEXT_ROUTES = ['/features', '/how-it-works', '/solutions', '/pricing', '/about', '/privacy', '/terms']

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
    })
  }

  test('the header logo opens the door as a full document', async ({ page }) => {
    await page.goto('/features')
    await page.locator('header a[href="/"]').first().click()
    await expect(page.locator('html')).toHaveClass(/sc-ready/, { timeout: 15_000 })
    expect(new URL(page.url()).pathname).toBe('/')
  })
})
