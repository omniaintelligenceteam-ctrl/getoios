import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Operations for HVAC Contractors',
  description:
    'OIOS answers every HVAC service call 24/7, books appointments, automates follow-ups, and tracks revenue — so you never miss a job.',
  openGraph: {
    title: 'AI Operations for HVAC Contractors',
    description:
      'OIOS answers every HVAC service call 24/7, books appointments, automates follow-ups, and tracks revenue — so you never miss a job.',
    url: 'https://getoios.com/hvac',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'AI Operations for HVAC Contractors — OIOS by Omnia Intelligence AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Operations for HVAC Contractors',
    description:
      'OIOS answers every HVAC service call 24/7, books appointments, automates follow-ups, and tracks revenue — so you never miss a job.',
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: 'https://getoios.com/hvac',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
