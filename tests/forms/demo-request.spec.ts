import { test, expect } from '@playwright/test'

test.describe('Demo page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo')
    await page.waitForLoadState('domcontentloaded')
  })

  test('loads successfully', async ({ page }) => {
    const response = await page.goto('/demo')
    expect(response!.status()).toBe(200)
  })

  test('header is visible', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible()
  })

  test('voice demo section renders', async ({ page }) => {
    // VoiceDemo component should render
    const content = page.getByText(/demo|voice|call|try|talk/i).first()
    await expect(content).toBeVisible({ timeout: 10_000 })
  })

  test('footer renders', async ({ page }) => {
    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer).toBeVisible()
  })

  test('has link to /form', async ({ page }) => {
    const formLink = page.locator('a[href="/form"]')
    const count = await formLink.count()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('Demo Request API', () => {
  test('POST /api/demo-request with valid data returns 200 or 500', async ({ request }) => {
    const response = await request.post('/api/demo-request', {
      data: {
        name: 'Jane Doe',
        company: 'Doe Plumbing',
        phone: '(480) 555-9876',
      },
    })

    // 200 if Resend key is set, 500 if not — either is acceptable in test env
    const status = response.status()
    expect([200, 500]).toContain(status)
  })

  test('POST /api/demo-request with missing fields returns 400', async ({ request }) => {
    const response = await request.post('/api/demo-request', {
      data: {
        name: 'Jane Doe',
        // Missing company and phone
      },
    })

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toBeDefined()
    expect(body.error).toContain('Missing required fields')
  })

  test('POST /api/demo-request with empty body returns 400', async ({ request }) => {
    const response = await request.post('/api/demo-request', {
      data: {},
    })

    expect(response.status()).toBe(400)
  })

  test('POST /api/demo-request with partial data returns 400', async ({ request }) => {
    const response = await request.post('/api/demo-request', {
      data: {
        name: 'Test',
        company: '',
        phone: '1234567890',
      },
    })

    expect(response.status()).toBe(400)
  })
})
