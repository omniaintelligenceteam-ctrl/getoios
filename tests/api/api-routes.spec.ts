import { test, expect } from '@playwright/test'

/**
 * API route integration tests.
 *
 * Note: Some routes depend on an external service (Resend).
 * When API keys aren't configured, valid requests return 500 instead of 200.
 * We test both validation (400) and accept 200 or 500 for happy-path scenarios.
 */

test.describe('Removed routes: the receptionist demo is gone', () => {
  // Wes, 2 Nov 2026: the voice service that answers a business's phone comes off the product.
  // /api/chat (Gemini, "Sarah") and /api/retell (Retell web call) were deleted with the dead homepage.
  for (const route of ['/api/chat', '/api/retell']) {
    test(`GET ${route} is 404`, async ({ request }) => {
      const response = await request.get(route)
      expect(response.status()).toBe(404)
    })

    test(`POST ${route} is 404`, async ({ request }) => {
      const response = await request.post(route, {
        data: { message: 'Hi, I need to schedule an appointment', history: [] },
        headers: { 'x-forwarded-for': `10.7.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` },
      })
      expect(response.status()).toBe(404)
    })
  }
})

test.describe('Removed routes: the old site forms are gone', () => {
  // 10 Nov 2026: the pages that posted to these routes were deleted (PR #16).
  // A route with no page is only a door for spam, so the routes went too.
  for (const route of ['/api/form', '/api/audit', '/api/demo-request']) {
    test(`GET ${route} is 404`, async ({ request }) => {
      const response = await request.get(route)
      expect(response.status()).toBe(404)
    })

    test(`POST ${route} is 404`, async ({ request }) => {
      const response = await request.post(route, {
        data: {},
        headers: { 'x-forwarded-for': `10.8.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` },
      })
      expect(response.status()).toBe(404)
    })
  }
})

test.describe('POST /api/handoff — Front door handoff', () => {
  const validPayload = {
    pillar: 'back-office',
    firstHandoff: 'The quote I owe since Tuesday.',
    fullName: 'Test User',
    phoneNumber: '(512) 555-0100',
  }

  // The route allows 5 posts per minute per client IP, and every request in
  // this file leaves the same test client. Each call below carries its own
  // TEST-NET-3 address so these tests exercise validation, not the limiter.
  let nextHost = Math.floor(Math.random() * 200)
  const freshIp = () => `203.0.113.${(nextHost++ % 250) + 1}`
  const headers = () => ({ 'x-forwarded-for': freshIp() })

  test('valid data returns 200 or 500 (env-dependent)', async ({ request }) => {
    const response = await request.post('/api/handoff', { data: validPayload, headers: headers() })
    expect([200, 500]).toContain(response.status())
  })

  test('each pillar value is accepted', async ({ request }) => {
    for (const pillar of ['assistant', 'back-office', 'workflows']) {
      const response = await request.post('/api/handoff', { data: { ...validPayload, pillar }, headers: headers() })
      expect([200, 500]).toContain(response.status())
    }
  })

  test('missing pillar returns 400', async ({ request }) => {
    const { pillar, ...partial } = validPayload
    const response = await request.post('/api/handoff', { data: partial, headers: headers() })
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toContain('pillar')
  })

  test('unknown pillar returns 400', async ({ request }) => {
    const response = await request.post('/api/handoff', { data: { ...validPayload, pillar: 'everything' }, headers: headers() })
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toContain('pillar')
  })

  test('missing firstHandoff returns 400', async ({ request }) => {
    const { firstHandoff, ...partial } = validPayload
    const response = await request.post('/api/handoff', { data: partial, headers: headers() })
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toContain('firstHandoff')
  })

  test('form-encoded post without a pillar redirects back to the form', async ({ request }) => {
    const response = await request.post('/api/handoff', {
      form: { firstHandoff: 'The phone, when I am on a roof.', fullName: 'Test User', phoneNumber: '(512) 555-0100' },
      headers: headers(),
      maxRedirects: 0,
    })
    expect(response.status()).toBe(303)
    expect(response.headers()['location']).toMatch(/\/#start$/)
  })

  test('honeypot filled pretends to succeed', async ({ request }) => {
    const response = await request.post('/api/handoff', { data: { ...validPayload, company: 'Spam Co' }, headers: headers() })
    expect(response.status()).toBe(200)
  })

  test('sixth post from one client within a minute is rate limited', async ({ request }) => {
    const ip = freshIp()
    for (let i = 0; i < 5; i++) {
      const response = await request.post('/api/handoff', { data: { ...validPayload, pillar: 'nope' }, headers: { 'x-forwarded-for': ip } })
      expect(response.status()).toBe(400)
    }
    const sixth = await request.post('/api/handoff', { data: validPayload, headers: { 'x-forwarded-for': ip } })
    expect(sixth.status()).toBe(429)
  })
})

test.describe('GET on POST-only routes', () => {
  const postOnlyRoutes = [
    '/api/handoff',
  ]

  for (const route of postOnlyRoutes) {
    test(`GET ${route} returns 405 or error`, async ({ request }) => {
      const response = await request.get(route)
      // Next.js API routes that only export POST typically return 405
      const status = response.status()
      expect([404, 405]).toContain(status)
    })
  }
})
