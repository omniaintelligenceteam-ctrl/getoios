import { NextResponse } from 'next/server'
import { sanitizeHtml } from '@/lib/sanitize'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = getClientIp(req)
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Validate required env var
    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    const data = await req.json()

    // Validate required fields
    const required = [
      'fullName',
      'businessName',
      'businessWebsite',
      'phoneNumber',
      'trade',
      'teamSize',
      'missedCalls',
      'phoneHandler',
      'currentSoftware',
      'extraHours',
    ]

    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Sanitize all user-supplied strings
    const s = {
      fullName: sanitizeHtml(data.fullName),
      businessName: sanitizeHtml(data.businessName),
      businessWebsite: sanitizeHtml(data.businessWebsite),
      phoneNumber: sanitizeHtml(data.phoneNumber),
      trade: sanitizeHtml(data.trade),
      teamSize: sanitizeHtml(data.teamSize),
      missedCalls: sanitizeHtml(data.missedCalls),
      phoneHandler: sanitizeHtml(data.phoneHandler),
      currentSoftware: sanitizeHtml(data.currentSoftware),
      extraHours: sanitizeHtml(data.extraHours),
      biggestFrustration: data.biggestFrustration ? sanitizeHtml(data.biggestFrustration) : '',
    }

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/Phoenix',
      dateStyle: 'full',
      timeStyle: 'short',
    })

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #fff; padding: 32px; border-radius: 12px;">
        <h1 style="color: #f97316; margin-bottom: 8px;">New Audit Request</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 32px;">Submitted ${timestamp}</p>

        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px; width: 40%;">Full Name</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${s.fullName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Business Name</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${s.businessName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Website</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;"><a href="${s.businessWebsite}" style="color: #f97316;">${s.businessWebsite}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Phone</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;"><a href="tel:${s.phoneNumber}" style="color: #f97316;">${s.phoneNumber}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Trade</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${s.trade}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Team Size</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${s.teamSize}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Missed Calls/Day</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${s.missedCalls}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Who Handles Phones</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${s.phoneHandler}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Current Software</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${s.currentSoftware}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Extra 10 Hours</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${s.extraHours}</td>
          </tr>
          ${s.biggestFrustration ? `
          <tr>
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Biggest Frustration</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${s.biggestFrustration}</td>
          </tr>
          ` : ''}
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
        from: 'OIOS <audit@getoios.com>',
        to: ['omniaintelligenceteam@gmail.com'],
        subject: `New Audit Request: ${s.businessName} (${s.trade})`,
        html: emailHtml,
      }),
    })

    if (!emailRes.ok) {
      const errBody = await emailRes.text()
      console.error('Resend API error:', errBody)
      return NextResponse.json(
        { error: 'Failed to send notification' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Audit submission error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
