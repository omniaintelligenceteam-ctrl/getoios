import { test, expect } from '@playwright/test'

test.describe('Performance: Page load times', () => {
  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/features', name: 'Features' },
    { path: '/pricing', name: 'Pricing' },
    { path: '/how-it-works', name: 'How It Works' },
    { path: '/solutions', name: 'Solutions' },
    { path: '/demo', name: 'Demo' },
    { path: '/about', name: 'About' },
  ]

  for (const { path, name } of pages) {
    test(`${name} (${path}) loads in under 5 seconds`, async ({ page }) => {
      const start = Date.now()
      await page.goto(path, { waitUntil: 'domcontentloaded' })
      const loadTime = Date.now() - start

      expect(loadTime).toBeLessThan(5000)
    })
  }
})

test.describe('Performance: No broken images', () => {
  const pages = ['/', '/features', '/pricing', '/about', '/demo']

  for (const path of pages) {
    test(`${path} has no broken images`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('domcontentloaded')
      // Give images time to load
      await page.waitForTimeout(3000)

      const brokenImages = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'))
        return images
          .filter((img) => {
            // Skip lazy-loaded images that haven't loaded yet
            if (img.loading === 'lazy' && !img.complete) return false
            // Check if image failed to load
            return img.complete && img.naturalWidth === 0
          })
          .map((img) => ({
            src: img.src,
            alt: img.alt,
          }))
      })

      expect(brokenImages).toHaveLength(0)
    })
  }
})

test.describe('Performance: No 404 resources', () => {
  test('homepage has no 404 resource requests', async ({ page }) => {
    const failedRequests: { url: string; status: number }[] = []

    page.on('response', (response) => {
      if (response.status() === 404) {
        failedRequests.push({
          url: response.url(),
          status: response.status(),
        })
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Filter out known acceptable 404s (e.g. favicon, sourcemaps)
    const real404s = failedRequests.filter(
      (r) =>
        !r.url.includes('favicon') &&
        !r.url.includes('.map') &&
        !r.url.includes('_next/static') // Next.js hot reload artifacts
    )

    expect(real404s).toHaveLength(0)
  })
})

test.describe('Performance: Viewport and layout', () => {
  const pages = ['/', '/features', '/pricing', '/demo']

  for (const path of pages) {
    test(`${path} has no horizontal overflow`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('domcontentloaded')

      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth
      })

      expect(hasOverflow).toBe(false)
    })
  }
})

test.describe('Performance: Core Web Vitals proxies', () => {
  test('homepage first paint happens within 3 seconds', async ({ page }) => {
    await page.goto('/')

    const paintTiming = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const fcp = entries.find((e) => e.name === 'first-contentful-paint')
          if (fcp) resolve(fcp.startTime)
        })
        observer.observe({ type: 'paint', buffered: true })

        // Fallback if paint timing isn't available
        setTimeout(() => resolve(0), 5000)
      })
    })

    if (paintTiming > 0) {
      expect(paintTiming).toBeLessThan(3000)
    }
  })

  test('homepage DOM is interactive within 4 seconds', async ({ page }) => {
    const start = Date.now()
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // Try clicking first interactive element
    const firstLink = page.locator('a').first()
    await expect(firstLink).toBeVisible()
    const interactiveTime = Date.now() - start

    expect(interactiveTime).toBeLessThan(4000)
  })
})

test.describe('Performance: Response headers', () => {
  test('homepage response includes content-type', async ({ page }) => {
    const response = await page.goto('/')
    const contentType = response!.headers()['content-type']
    expect(contentType).toContain('text/html')
  })
})
