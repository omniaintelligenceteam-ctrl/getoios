import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Live Demo — See OIOS in Action',
  description:
    'Try OIOS live. Talk to our AI receptionist, see the command center, and experience how AI runs operations for service businesses.',
  openGraph: {
    title: 'Live Demo — See OIOS in Action',
    description:
      'Try OIOS live. Talk to our AI receptionist, see the command center, and experience how AI runs operations for service businesses.',
    url: 'https://getoios.com/demo',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Live Demo — See OIOS in Action — OIOS by Omnia Intelligence AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Demo — See OIOS in Action',
    description:
      'Try OIOS live. Talk to our AI receptionist, see the command center, and experience how AI runs operations for service businesses.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://getoios.com/demo',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
