import { NextResponse } from 'next/server'
import { sanitizeHtml } from '@/lib/sanitize'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

/**
 * The front door's "first handoff" form (public/jarvis/index.html).
 *
 * Accepts JSON (door.js) and form-encoded posts (the no-JS path). Sends one
 * email to the team inbox through Resend, the same way /api/form does, then
 * answers JSON or redirects back to /#sent so the page can show its own
 * confirmation without script.
 */

const MAX = { firstHandoff: 500, fullName: 120, phoneNumber: 40 } as const
type Field = keyof typeof MAX

const LABEL: Record<Field, string> = {
  firstHandoff: 'First handoff',
  fullName: 'Name',
  phoneNumber: 'Phone',
}

async function readBody(req: Request): Promise<{ data: Record<string, string>; isForm: boolean }> {
  const type = req.headers.get('content-type') || ''
  if (type.includes('application/json')) {
    const json = (await req.json()) as Record<string, unknown>
    const data: Record<string, string> = {}
    for (const [k, v] of Object.entries(json || {})) if (typeof v === 'string') data[k] = v
    return { data, isForm: false }
  }
  const form = await req.formData()
  const data: Record<string, string> = {}
  form.forEach((v, k) => { if (typeof v === 'string') data[k] = v })
  return { data, isForm: true }
}

function fail(isForm: boolean, req: Request, status: number, error: string) {
  if (isForm) {
    const url = new URL('/', req.url)
    url.hash = 'start'
    return NextResponse.redirect(url, 303)
  }
  return NextResponse.json({ error }, { status })
}

export async function POST(req: Request) {
  let isForm = false
  try {
    const ip = getClientIp(req)
    if (!checkRateLimit(ip, { limit: 5 })) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await readBody(req)
    isForm = body.isForm
    const data = body.data

    // Honeypot: real visitors never see this field. Pretend it worked.
    if (data.company) {
      return isForm
        ? NextResponse.redirect(new URL('/#sent', req.url), 303)
        : NextResponse.json({ success: true })
    }

    const fields = {} as Record<Field, string>
    for (const key of Object.keys(MAX) as Field[]) {
      const value = (data[key] || '').trim()
      if (!value) return fail(isForm, req, 400, `Missing required field: ${key}`)
      fields[key] = sanitizeHtml(value.slice(0, MAX[key]))
    }

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      console.error('RESEND_API_KEY not configured')
      return fail(isForm, req, 500, 'Email service not configured')
    }

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/Chicago',
      dateStyle: 'full',
      timeStyle: 'short',
    })

    const rows = (Object.keys(MAX) as Field[]).map((key) => `
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px; width: 32%; vertical-align: top;">${LABEL[key]}</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${key === 'phoneNumber' ? `<a href="tel:${fields[key]}" style="color: #b494ff;">${fields[key]}</a>` : fields[key]}</td>
          </tr>`).join('')

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #111116; color: #fff; padding: 32px; border-radius: 12px;">
        <h1 style="color: #b494ff; margin-bottom: 8px; font-size: 22px;">First handoff from the front door</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 32px;">Submitted ${timestamp} (Central). The visitor asked for a call back to set up week one.</p>
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
        to: ['omniaintelligenceteam@gmail.com'],
        subject: `Front door handoff: ${fields.fullName}`,
        html: emailHtml,
      }),
    })

    if (!emailRes.ok) {
      console.error('Resend API error:', await emailRes.text())
      return fail(isForm, req, 500, 'Failed to send notification')
    }

    if (isForm) return NextResponse.redirect(new URL('/#sent', req.url), 303)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Handoff submission error:', err)
    return fail(isForm, req, 500, 'Internal server error')
  }
}
