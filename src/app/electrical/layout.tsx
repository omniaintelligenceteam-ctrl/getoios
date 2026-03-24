import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Operations for Electrical Contractors',
  description:
    'OIOS answers every electrical service call 24/7, books appointments, automates follow-ups, and gives you full visibility into leads and revenue.',
  openGraph: {
    title: 'AI Operations for Electrical Contractors',
    description:
      'OIOS answers every electrical service call 24/7, books appointments, automates follow-ups, and gives you full visibility into leads and revenue.',
    url: 'https://getoios.com/electrical',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'AI Operations for Electrical Contractors — OIOS by Omnia Intelligence AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Operations for Electrical Contractors',
    description:
      'OIOS answers every electrical service call 24/7, books appointments, automates follow-ups, and gives you full visibility into leads and revenue.',
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: 'https://getoios.com/electrical',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
