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
  // /api/chat (Gemini, "Sarah"), /api/retell (Retell web call) and /api/elevenlabs ("Sarah's voice") were deleted
  // with the dead homepage and /demo-saas.
  for (const route of ['/api/chat', '/api/retell', '/api/elevenlabs']) {
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

test.describe('POST /api/handoff — Call request', () => {
  // Wes, 10 Nov 2026: a name, an industry, an email and a cell.
  const validPayload = {
    fullName: 'Test User',
    industry: 'Bakery',
    email: 'test@example.com',
    phoneNumber: '(512) 555-0100',
  }
  const MEETJARVIS = 'https://meetjarvis.getoios.com'

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

  test('the old pillar and first-handoff answers are not needed', async ({ request }) => {
    const response = await request.post('/api/handoff', { data: { ...validPayload, interest: 'Full management team' }, headers: headers() })
    expect([200, 500]).toContain(response.status())
  })

  for (const field of ['fullName', 'industry', 'email', 'phoneNumber'] as const) {
    test(`missing ${field} returns 400`, async ({ request }) => {
      const { [field]: _omitted, ...partial } = validPayload
      const response = await request.post('/api/handoff', { data: partial, headers: headers() })
      expect(response.status()).toBe(400)
      const body = await response.json()
      expect(body.error).toContain(field)
    })
  }

  test('an email address without its @ returns 400', async ({ request }) => {
    const response = await request.post('/api/handoff', { data: { ...validPayload, email: 'test.example.com' }, headers: headers() })
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toContain('email')
  })

  test('form-encoded post without an email redirects back to the form', async ({ request }) => {
    const response = await request.post('/api/handoff', {
      form: { fullName: 'Test User', industry: 'Bakery', phoneNumber: '(512) 555-0100' },
      headers: headers(),
      maxRedirects: 0,
    })
    expect(response.status()).toBe(303)
    expect(response.headers()['location']).toMatch(/\/#start$/)
    expect(response.headers()['location']).not.toContain('meetjarvis')
  })

  // meetjarvis.getoios.com is a static site, so its form posts here from another origin.
  test('a refused no-script post from meetjarvis goes back to the meetjarvis form', async ({ request }) => {
    const response = await request.post('/api/handoff', {
      form: { source: 'meetjarvis', fullName: 'Test User', industry: 'Bakery', phoneNumber: '(512) 555-0100' },
      headers: headers(),
      maxRedirects: 0,
    })
    expect(response.status()).toBe(303)
    expect(response.headers()['location']).toBe(`${MEETJARVIS}/#conversation`)
  })

  test('a no-script post never redirects to an address taken from the post', async ({ request }) => {
    const response = await request.post('/api/handoff', {
      form: { source: 'https://evil.example', company: 'Spam Co' },
      headers: headers(),
      maxRedirects: 0,
    })
    expect(response.status()).toBe(303)
    expect(response.headers()['location']).not.toContain('evil.example')
    expect(response.headers()['location']).toMatch(/\/#sent$/)
  })

  test('the preflight answers meetjarvis and no other origin', async ({ request }) => {
    const preflight = (origin: string) =>
      request.fetch('/api/handoff', {
        method: 'OPTIONS',
        headers: { origin, 'access-control-request-method': 'POST', 'access-control-request-headers': 'content-type' },
      })
    const allowed = await preflight(MEETJARVIS)
    expect(allowed.status()).toBe(204)
    expect(allowed.headers()['access-control-allow-origin']).toBe(MEETJARVIS)
    expect(allowed.headers()['access-control-allow-headers']).toMatch(/content-type/i)
    const other = await preflight('https://evil.example')
    expect(other.headers()['access-control-allow-origin']).toBeUndefined()
  })

  test('a post from meetjarvis can read its answer, a post from elsewhere cannot', async ({ request }) => {
    const { email, ...partial } = validPayload
    const fromSite = await request.post('/api/handoff', { data: partial, headers: { ...headers(), origin: MEETJARVIS } })
    expect(fromSite.status()).toBe(400)
    expect(fromSite.headers()['access-control-allow-origin']).toBe(MEETJARVIS)
    const fromElsewhere = await request.post('/api/handoff', { data: partial, headers: { ...headers(), origin: 'https://evil.example' } })
    expect(fromElsewhere.headers()['access-control-allow-origin']).toBeUndefined()
  })

  test('honeypot filled pretends to succeed', async ({ request }) => {
    const response = await request.post('/api/handoff', { data: { ...validPayload, company: 'Spam Co' }, headers: headers() })
    expect(response.status()).toBe(200)
  })

  test('sixth post from one client within a minute is rate limited', async ({ request }) => {
    const ip = freshIp()
    for (let i = 0; i < 5; i++) {
      const response = await request.post('/api/handoff', { data: { ...validPayload, email: 'nope' }, headers: { 'x-forwarded-for': ip } })
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
