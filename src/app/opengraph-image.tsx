import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Jarvis handles the day. Big decisions stay yours. | OIOS'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Satori can't decode WebP, so the card reads the JPEG copy of the portrait
 * (public/jarvis/portrait-og.jpg) rather than the .webp the site itself serves.
 */
export default async function Image() {
  const portraitData = await readFile(join(process.cwd(), 'public', 'jarvis', 'portrait-og.jpg'))
  const portraitSrc = `data:image/jpeg;base64,${portraitData.toString('base64')}`

  const interBold = await fetch(
    'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf'
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#0B1120',
          alignItems: 'center',
          padding: '0 72px',
          gap: '64px',
        }}
      >
        {/* Jarvis */}
        <div
          style={{
            display: 'flex',
            width: 340,
            height: 340,
            borderRadius: 999,
            border: '3px solid rgba(45,212,191,0.55)',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={portraitSrc}
            width={340}
            height={424}
            alt=""
            style={{ objectFit: 'cover', marginTop: -42 }}
          />
        </div>

        {/* Words */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#2DD4BF',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Briefed. Handled. Your call.
          </span>
          <span
            style={{
              fontSize: 58,
              fontWeight: 700,
              color: '#F8FAFC',
              lineHeight: 1.08,
              marginTop: 24,
            }}
          >
            Jarvis handles the day.
          </span>
          <span
            style={{
              fontSize: 58,
              fontWeight: 700,
              color: '#6FA5D2',
              lineHeight: 1.08,
            }}
          >
            Big decisions stay yours.
          </span>
          <span style={{ fontSize: 24, color: '#94A3B8', marginTop: 30 }}>
            OIOS by Omnia Intelligence AI
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: interBold,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  )
}
