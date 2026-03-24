import type { Metadata } from 'next'
import { DiscoveryForm } from '@/components/sections/DiscoveryForm'

export const metadata: Metadata = {
  title: "Let's See What We Can Do For You — OIOS",
  description:
    'Quick questions so we can prep something specific for your business. No commitment, no pressure.',
  openGraph: {
    title: "Let's See What We Can Do For You — OIOS",
    description:
      'Quick questions so we can prep something specific for your business. No commitment, no pressure.',
    url: 'https://getoios.com/form',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OIOS by Omnia Intelligence AI',
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function FormPage() {
  return (
    <div className="bg-[#0B1120] text-white min-h-screen">
      <DiscoveryForm />
    </div>
  )
}
