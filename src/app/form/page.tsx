import type { Metadata } from 'next'
import { DiscoveryForm } from '@/components/sections/DiscoveryForm'

export const metadata: Metadata = {
  title: "Let's See What We Can Do For You — OIOS",
  description:
    "Takes about 3 minutes. We'll use this to prep something specific for your business.",
  openGraph: {
    title: "Let's See What We Can Do For You — OIOS",
    description:
      "Takes about 3 minutes. We'll use this to prep something specific for your business.",
    url: 'https://getoios.com/form',
    images: [
      {
        url: '/opengraph-image',
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
