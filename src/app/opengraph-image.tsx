import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'OIOS — AI Operations for Service Businesses | Omnia Intelligence AI'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), 'public', 'logo-oios.jpg'))
  const logoSrc = `data:image/jpeg;base64,${logoData.toString('base64')}`

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
          padding: '80px',
          alignItems: 'center',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={280} height={280} alt="" />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '60px',
            gap: '20px',
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: 'white',
              letterSpacing: '0.2em',
            }}
          >
            OIOS
          </span>
          <span
            style={{
              fontSize: 28,
              color: '#2DD4BF',
              letterSpacing: '0.1em',
            }}
          >
            OMNIA INTELLIGENCE AI
          </span>
          <span
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: '#F59E0B',
              lineHeight: 1.3,
            }}
          >
            We Install AI Into Your Business.
          </span>
          <span
            style={{
              fontSize: 28,
              color: '#94A3B8',
            }}
          >
            It Handles the Rest.
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
