import { test, expect } from '@playwright/test'

/**
 * agentos.getoios.com no longer resolves in DNS, and the (866) demo line was
 * retired. Both were still linked from the live site. This spec fails the build
 * rather than letting either come back.
 */

const ROUTES = ['/', '/features', '/how-it-works', '/solutions', '/pricing', '/about', '/form']

const RETIRED = [
  'agentos.getoios.com',
  '(866) 782-1303',
  '8667821303',
  '+18667821303',
]

test.describe('No dead links or retired contact details', () => {
  for (const route of ROUTES) {
    test(`${route} references nothing retired`, async ({ page }) => {
      const response = await page.goto(route)
      const html = await response!.text()

      for (const needle of RETIRED) {
        expect(html, `${route} still references ${needle}`).not.toContain(needle)
      }
    })
  }

  test('every internal link on the homepage resolves', async ({ page, request }) => {
    await page.goto('/')

    const hrefs = await page.locator('a[href^="/"]').evaluateAll((els) =>
      els.map((el) => (el as HTMLAnchorElement).getAttribute('href')!)
    )

    const paths = [...new Set(hrefs.map((h) => h.split('#')[0]).filter(Boolean))]
    expect(paths.length).toBeGreaterThan(0)

    for (const path of paths) {
      const res = await request.get(path)
      expect(res.status(), `${path} returned ${res.status()}`).toBeLessThan(400)
    }
  })

  test('retired routes redirect instead of 404ing', async ({ page }) => {
    for (const [from, to] of [
      ['/audit', '/form'],
      ['/demo', '/form'],
      ['/demo-saas', '/form'],
    ]) {
      await page.goto(from)
      await expect(page).toHaveURL(new RegExp(`${to}$`))
    }
  })
})
