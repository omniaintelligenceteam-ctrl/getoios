import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Operations for Pest Control Services',
  description:
    'OIOS answers every pest control call 24/7, books appointments, automates follow-ups, and tracks your revenue — so no lead slips through.',
  openGraph: {
    title: 'AI Operations for Pest Control Services',
    description:
      'OIOS answers every pest control call 24/7, books appointments, automates follow-ups, and tracks your revenue — so no lead slips through.',
    url: 'https://getoios.com/pest-control',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'AI Operations for Pest Control Services — OIOS by Omnia Intelligence AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Operations for Pest Control Services',
    description:
      'OIOS answers every pest control call 24/7, books appointments, automates follow-ups, and tracks your revenue — so no lead slips through.',
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: 'https://getoios.com/pest-control',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
