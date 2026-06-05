import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// ─── Types ───────────────────────────────────────────────────────────────────

interface CalWebhookPayload {
  triggerEvent: string
  createdAt: string
  payload: {
    title?: string
    startTime?: string
    endTime?: string
    attendees?: Array<{
      email: string
      name: string
      timeZone: string
    }>
    organizer?: {
      email: string
      name: string
    }
    uid?: string
    rescheduleUid?: string
    cancellationReason?: string
    [key: string]: unknown
  }
}

// ─── Signature Verification ──────────────────────────────────────────────────

function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false

  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload, 'utf8')
  const expected = hmac.digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  )
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const secret = process.env.CALCOM_WEBHOOK_SECRET

  // Read raw body for signature verification
  const rawBody = await req.text()

  // Verify signature if secret is configured
  if (secret) {
    const signature = req.headers.get('x-cal-signature-256')
    const isValid = verifyWebhookSignature(rawBody, signature, secret)

    if (!isValid) {
      console.warn('[Cal.com Webhook] Invalid signature — rejecting request')
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }
  }

  // Parse the payload
  let data: CalWebhookPayload
  try {
    data = JSON.parse(rawBody)
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    )
  }

  // Validate required fields
  if (!data.triggerEvent || !data.payload) {
    return NextResponse.json(
      { error: 'Missing required fields: triggerEvent, payload' },
      { status: 400 }
    )
  }

  const { triggerEvent, payload } = data
  const attendee = payload.attendees?.[0]

  // ─── Event Handlers ──────────────────────────────────────────────────────

  switch (triggerEvent) {
    case 'BOOKING_CREATED': {
      console.log(
        `[Cal.com] BOOKING_CREATED — ${payload.title || 'Discovery Call'}`,
        {
          uid: payload.uid,
          start: payload.startTime,
          attendee: attendee
            ? `${attendee.name} <${attendee.email}>`
            : 'unknown',
        }
      )
      // Future: write to Supabase pipeline_snapshot or shared_tasks
      break
    }

    case 'BOOKING_CANCELLED': {
      console.log(
        `[Cal.com] BOOKING_CANCELLED — ${payload.title || 'Booking'}`,
        {
          uid: payload.uid,
          reason: payload.cancellationReason || 'No reason provided',
          attendee: attendee
            ? `${attendee.name} <${attendee.email}>`
            : 'unknown',
        }
      )
      break
    }

    case 'BOOKING_RESCHEDULED': {
      console.log(
        `[Cal.com] BOOKING_RESCHEDULED — ${payload.title || 'Booking'}`,
        {
          uid: payload.uid,
          newTime: payload.startTime,
          previousUid: payload.rescheduleUid,
          attendee: attendee
            ? `${attendee.name} <${attendee.email}>`
            : 'unknown',
        }
      )
      break
    }

    default: {
      console.log(`[Cal.com] Unhandled event: ${triggerEvent}`, {
        uid: payload.uid,
      })
    }
  }

  return NextResponse.json({ received: true, event: triggerEvent })
}
