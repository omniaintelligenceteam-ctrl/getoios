import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Jarvis: three hires in one for small-business owners'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), 'public', 'omnia-mark-dark.png'))
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`

  const interBold = await fetch(
    'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf'
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#000000',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={200} height={200} alt="" />
        <span style={{ fontSize: 72, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.03em' }}>
          Jarvis is three hires in one
        </span>
        <span style={{ fontSize: 30, fontWeight: 700, color: '#b494ff' }}>
          Your assistant, your chief of staff and your management team
        </span>
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
