import { test, expect } from '@playwright/test'

/**
 * Wes, 2 Nov 2026: the receptionist product is off. /demo-saas was an unlinked
 * template demo page that still sold it ("missed calls", "Every contractor").
 * It is deleted on purpose; nothing links to it and the sitemap never listed it.
 */
test.describe('Removed pages', () => {
  test('/demo-saas is gone', async ({ request }) => {
    const response = await request.get('/demo-saas')
    expect(response.status()).toBe(404)
  })
})
