import { test, expect } from '@playwright/test'

/**
 * Seed spec — verifies the dev server is running and the homepage loads.
 * Run this first to confirm the test environment is healthy.
 */
test.describe('Seed: Environment health check', () => {
  test('dev server responds on baseURL', async ({ page }) => {
    const response = await page.goto('/')
    expect(response).not.toBeNull()
    expect(response!.status()).toBeLessThan(400)
  })

  test('homepage DOM is interactive', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })
})
