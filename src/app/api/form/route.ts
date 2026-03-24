import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const data = await req.json()

    // Validate required fields
    const required = [
      'fullName',
      'businessName',
      'businessDescription',
      'teamSize',
      'callsPerWeek',
      'callHandler',
      'phoneNumber',
      'bestTime',
    ]

    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/Chicago',
      dateStyle: 'full',
      timeStyle: 'short',
    })

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #fff; padding: 32px; border-radius: 12px;">
        <h1 style="color: #2DD4BF; margin-bottom: 8px;">New Warm Lead</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 32px;">Submitted ${timestamp} (Central)</p>

        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px; width: 40%;">Name</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${data.fullName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Business</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${data.businessName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">What They Do</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${data.businessDescription}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Team Size</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${data.teamSize}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Calls/Week</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${data.callsPerWeek}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Who Handles Calls</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${data.callHandler}</td>
          </tr>
          ${data.biggestPainPoint ? `
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Biggest Pain Point</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${data.biggestPainPoint}</td>
          </tr>
          ` : ''}
          ${data.currentSoftware ? `
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Current Software</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${data.currentSoftware}</td>
          </tr>
          ` : ''}
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Phone</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;"><a href="tel:${data.phoneNumber}" style="color: #2DD4BF;">${data.phoneNumber}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Best Time to Talk</td>
            <td style="padding: 12px 0; color: #fff; font-size: 14px;">${data.bestTime}</td>
          </tr>
        </table>
      </div>
    `

    // Send via Resend
    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'OIOS <form@getoios.com>',
        to: ['team@getoios.com'],
        subject: `New Warm Lead: ${data.businessName} — ${data.businessDescription}`,
        html: emailHtml,
      }),
    })

    if (!emailRes.ok) {
      const errBody = await emailRes.text()
      console.error('Resend error:', errBody)
      return NextResponse.json(
        { error: 'Failed to send notification' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Form submission error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
