import { NextResponse } from 'next/server'
import { sanitizeHtml } from '@/lib/sanitize'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

/**
 * The "request a call" form on getoios.com (public/jarvis/index.html) and on
 * meetjarvis.getoios.com (a static site with no server of its own).
 *
 * Accepts JSON (the page script) and form-encoded posts (the no-script path).
 * The visitor gives a name, an industry, an email address and a cell number.
 * Two fields are optional and never shown: `interest` (the pillar or sample
 * task the visitor was reading) and `source` (which site sent the post).
 * Sends one email to the team inbox through Resend, then answers JSON or
 * redirects back to the sending page's #sent so it can confirm without script.
 */

const MAX = { fullName: 120, industry: 120, email: 200, phoneNumber: 40 } as const
type Field = keyof typeof MAX

const LABEL: Record<Field, string> = {
  fullName: 'Name',
  industry: 'Industry',
  email: 'Email',
  phoneNumber: 'Cell',
}

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * The sites allowed to post here from another origin. A no-script post names
 * its site in `source`; the redirect goes to the address listed here, never to
 * an address taken from the post.
 */
const SITES: Record<string, { origin: string; label: string; form: string }> = {
  meetjarvis: { origin: 'https://meetjarvis.getoios.com', label: 'meetjarvis.getoios.com', form: 'conversation' },
}
const ALLOWED_ORIGINS = new Set(Object.values(SITES).map((site) => site.origin))

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || ''
  if (!ALLOWED_ORIGINS.has(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function json(req: Request, body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders(req) })
}

async function readBody(req: Request): Promise<{ data: Record<string, string>; isForm: boolean }> {
  const type = req.headers.get('content-type') || ''
  if (type.includes('application/json')) {
    const parsed = (await req.json()) as Record<string, unknown>
    const data: Record<string, string> = {}
    for (const [k, v] of Object.entries(parsed || {})) if (typeof v === 'string') data[k] = v
    return { data, isForm: false }
  }
  const form = await req.formData()
  const data: Record<string, string> = {}
  form.forEach((v, k) => { if (typeof v === 'string') data[k] = v })
  return { data, isForm: true }
}

/** Where a no-script post goes back to: the sending site's form, or its confirmation. */
function back(req: Request, source: string, sent: boolean) {
  const site = SITES[source]
  const url = new URL('/', site ? site.origin : req.url)
  url.hash = sent ? 'sent' : site ? site.form : 'start'
  return NextResponse.redirect(url, 303)
}

export function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) })
}

export async function POST(req: Request) {
  let isForm = false
  let source = ''
  const fail = (status: number, error: string) => (isForm ? back(req, source, false) : json(req, { error }, status))
  try {
    const ip = getClientIp(req)
    if (!checkRateLimit(ip, { limit: 5 })) {
      return json(req, { error: 'Too many requests' }, 429)
    }

    const body = await readBody(req)
    isForm = body.isForm
    const data = body.data
    source = Object.hasOwn(SITES, data.source || '') ? data.source : ''

    // Honeypot: real visitors never see this field. Pretend it worked.
    if (data.company) {
      return isForm ? back(req, source, true) : json(req, { success: true })
    }

    const fields = {} as Record<Field, string>
    for (const key of Object.keys(MAX) as Field[]) {
      const value = (data[key] || '').trim()
      if (!value) return fail(400, `Missing required field: ${key}`)
      if (key === 'email' && !EMAIL_SHAPE.test(value)) return fail(400, 'Invalid email address')
      fields[key] = sanitizeHtml(value.slice(0, MAX[key]))
    }
    const interest = sanitizeHtml((data.interest || '').trim().slice(0, 120))
    const fromSite = source ? SITES[source].label : 'getoios.com'

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      console.error('RESEND_API_KEY not configured')
      return fail(500, 'Email service not configured')
    }

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/Chicago',
      dateStyle: 'full',
      timeStyle: 'short',
    })

    const link: Partial<Record<Field, string>> = { phoneNumber: 'tel', email: 'mailto' }
    const shown: [string, string][] = (Object.keys(MAX) as Field[]).map((key) => [
      LABEL[key],
      link[key] ? `<a href="${link[key]}:${fields[key]}" style="color: #b494ff;">${fields[key]}</a>` : fields[key],
    ])
    if (interest) shown.push(['Was reading', interest])
    shown.push(['Sent from', fromSite])
    const rows = shown.map(([label, value]) => `
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px; width: 32%; vertical-align: top;">${label}</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${value}</td>
          </tr>`).join('')

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #111116; color: #fff; padding: 32px; border-radius: 12px;">
        <h1 style="color: #b494ff; margin-bottom: 8px; font-size: 22px;">Call request</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 32px;">Submitted ${timestamp} (Central) on ${fromSite}. The visitor asked for a call.</p>
        <table style="width: 100%; border-collapse: collapse;">${rows}
        </table>
      </div>
    `

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'OIOS <form@getoios.com>',
        // Wes, 10 Nov 2026: call requests go to the team address the pages show. That address
        // is a forward, so the Gmail inbox gets its own copy: one broken forward loses no lead.
        to: ['team@getoios.com', 'omniaintelligenceteam@gmail.com'],
        reply_to: (data.email || '').trim().slice(0, MAX.email),
        subject: `Call request: ${fields.fullName} (${fields.industry})`,
        html: emailHtml,
      }),
    })

    if (!emailRes.ok) {
      console.error('Resend API error:', await emailRes.text())
      return fail(500, 'Failed to send notification')
    }

    return isForm ? back(req, source, true) : json(req, { success: true })
  } catch (err) {
    console.error('Handoff submission error:', err)
    return fail(500, 'Internal server error')
  }
}
