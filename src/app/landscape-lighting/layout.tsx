import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Operations for Landscape Lighting Businesses',
  description:
    'OIOS answers every landscape lighting inquiry 24/7, books consultations, automates follow-ups, and tracks your revenue.',
  openGraph: {
    title: 'AI Operations for Landscape Lighting Businesses',
    description:
      'OIOS answers every landscape lighting inquiry 24/7, books consultations, automates follow-ups, and tracks your revenue.',
    url: 'https://getoios.com/landscape-lighting',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Operations for Landscape Lighting Businesses — OIOS by Omnia Intelligence AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Operations for Landscape Lighting Businesses',
    description:
      'OIOS answers every landscape lighting inquiry 24/7, books consultations, automates follow-ups, and tracks your revenue.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://getoios.com/landscape-lighting',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
