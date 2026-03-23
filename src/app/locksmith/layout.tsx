import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Operations for Locksmith Services',
  description:
    'OIOS answers every locksmith call 24/7, dispatches jobs, automates follow-ups, and tracks revenue in real time.',
  openGraph: {
    title: 'AI Operations for Locksmith Services',
    description:
      'OIOS answers every locksmith call 24/7, dispatches jobs, automates follow-ups, and tracks revenue in real time.',
    url: 'https://getoios.com/locksmith',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Operations for Locksmith Services — OIOS by Omnia Intelligence AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Operations for Locksmith Services',
    description:
      'OIOS answers every locksmith call 24/7, dispatches jobs, automates follow-ups, and tracks revenue in real time.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://getoios.com/locksmith',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
