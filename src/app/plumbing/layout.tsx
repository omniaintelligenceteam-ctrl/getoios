import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Operations for Plumbing Businesses',
  description:
    'OIOS answers every plumbing call 24/7, books emergency and routine appointments, automates follow-ups, and tracks your revenue in real time.',
  openGraph: {
    title: 'AI Operations for Plumbing Businesses',
    description:
      'OIOS answers every plumbing call 24/7, books emergency and routine appointments, automates follow-ups, and tracks your revenue in real time.',
    url: 'https://getoios.com/plumbing',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Operations for Plumbing Businesses — OIOS by Omnia Intelligence AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Operations for Plumbing Businesses',
    description:
      'OIOS answers every plumbing call 24/7, books emergency and routine appointments, automates follow-ups, and tracks your revenue in real time.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://getoios.com/plumbing',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
