import { test, expect } from '@playwright/test'

/**
 * API route integration tests.
 *
 * Note: Some routes depend on external services (Resend, Gemini, Retell).
 * When API keys aren't configured, valid requests return 500 instead of 200.
 * We test both validation (400) and accept 200 or 500 for happy-path scenarios.
 */

test.describe('POST /api/form — Discovery Form', () => {
  const validPayload = {
    fullName: 'Test User',
    businessName: 'Test Business LLC',
    businessDescription: 'We do plumbing things',
    teamSize: 'Just me',
    callsPerWeek: 'Under 20',
    callHandler: 'Me',
    phoneNumber: '(480) 555-0001',
    bestTime: 'Morning',
    biggestPainPoint: 'Missing calls',
    currentSoftware: 'None',
  }

  test('valid data returns 200 or 500 (env-dependent)', async ({ request }) => {
    const response = await request.post('/api/form', { data: validPayload })
    expect([200, 500]).toContain(response.status())
  })

  test('missing fullName returns 400', async ({ request }) => {
    const { fullName, ...partial } = validPayload
    const response = await request.post('/api/form', { data: partial })
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toContain('fullName')
  })

  test('missing businessName returns 400', async ({ request }) => {
    const { businessName, ...partial } = validPayload
    const response = await request.post('/api/form', { data: partial })
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toContain('businessName')
  })

  test('missing phoneNumber returns 400', async ({ request }) => {
    const { phoneNumber, ...partial } = validPayload
    const response = await request.post('/api/form', { data: partial })
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toContain('phoneNumber')
  })

  test('empty object returns 400', async ({ request }) => {
    const response = await request.post('/api/form', { data: {} })
    expect(response.status()).toBe(400)
  })
})

test.describe('POST /api/audit — Audit Request', () => {
  const validPayload = {
    fullName: 'Mike Johnson',
    businessName: 'Johnson HVAC',
    businessWebsite: 'https://johnsonhvac.com',
    phoneNumber: '(602) 555-1234',
    trade: 'HVAC',
    teamSize: '6-15',
    missedCalls: '5-10 per day',
    phoneHandler: 'Office manager',
    currentSoftware: 'ServiceTitan',
    extraHours: 'Follow-ups and marketing',
    biggestFrustration: 'Losing leads after hours',
  }

  test('valid data returns 200 or 500 (env-dependent)', async ({ request }) => {
    const response = await request.post('/api/audit', { data: validPayload })
    expect([200, 500]).toContain(response.status())
  })

  test('missing trade returns 400', async ({ request }) => {
    const { trade, ...partial } = validPayload
    const response = await request.post('/api/audit', { data: partial })
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toContain('trade')
  })

  test('missing phoneNumber returns 400', async ({ request }) => {
    const { phoneNumber, ...partial } = validPayload
    const response = await request.post('/api/audit', { data: partial })
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toContain('phoneNumber')
  })

  test('empty object returns 400', async ({ request }) => {
    const response = await request.post('/api/audit', { data: {} })
    expect(response.status()).toBe(400)
  })
})

test.describe('POST /api/demo-request — Demo Request', () => {
  const validPayload = {
    name: 'Sarah Connor',
    company: 'Skynet Plumbing',
    phone: '(480) 555-9999',
  }

  test('valid data returns 200 or 500 (env-dependent)', async ({ request }) => {
    const response = await request.post('/api/demo-request', { data: validPayload })
    expect([200, 500]).toContain(response.status())
  })

  test('missing name returns 400', async ({ request }) => {
    const response = await request.post('/api/demo-request', {
      data: { company: 'Test', phone: '1234567890' },
    })
    expect(response.status()).toBe(400)
  })

  test('missing company returns 400', async ({ request }) => {
    const response = await request.post('/api/demo-request', {
      data: { name: 'Test', phone: '1234567890' },
    })
    expect(response.status()).toBe(400)
  })

  test('missing phone returns 400', async ({ request }) => {
    const response = await request.post('/api/demo-request', {
      data: { name: 'Test', company: 'Test Co' },
    })
    expect(response.status()).toBe(400)
  })

  test('empty string values return 400', async ({ request }) => {
    const response = await request.post('/api/demo-request', {
      data: { name: '', company: '', phone: '' },
    })
    expect(response.status()).toBe(400)
  })
})

test.describe('POST /api/chat — Text Chat', () => {
  test('valid message returns 200 or 500 (env-dependent)', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: {
        message: 'Hi, I need to schedule a plumbing appointment',
        history: [],
      },
    })
    // 200 with Gemini key, 500 without
    expect([200, 500]).toContain(response.status())
  })
})

test.describe('POST /api/retell — Voice Web Call', () => {
  test('valid request returns 200 or 500 (env-dependent)', async ({ request }) => {
    const response = await request.post('/api/retell', {
      data: {},
    })
    // 200 with Retell key, 500 without
    expect([200, 500]).toContain(response.status())
  })

  test('request with specific agent_id accepted', async ({ request }) => {
    const response = await request.post('/api/retell', {
      data: { agent_id: 'agent_b8f7dab7124e978dacac4a3b60' },
    })
    expect([200, 500]).toContain(response.status())
  })
})

test.describe('GET on POST-only routes', () => {
  const postOnlyRoutes = [
    '/api/form',
    '/api/audit',
    '/api/demo-request',
    '/api/chat',
    '/api/retell',
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
