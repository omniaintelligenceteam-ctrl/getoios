import type { Metadata } from 'next'
import { Header } from '@/components/sections/Header'
import { PageHero } from '@/components/sections/PageHero'
import { WhatToExpect } from '@/components/sections/WhatToExpect'
import { FAQ } from '@/components/sections/FAQ'
import { BookDiscoveryCall } from '@/components/sections/BookDiscoveryCall'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'
import { PageEntrance } from '@/components/ui/PageEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

const title = 'Month 1 — what you get and what it’s scoped against'
const description =
  'Installed in the first few days, first build live by Day 7, then one meeting a month. Month-to-month, and you own every tool, integration and note we build.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://getoios.com/pricing',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Month 1 with Jarvis — OIOS by Omnia Intelligence AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: 'https://getoios.com/pricing',
  },
}

export default function PricingPage() {
  return (
    <PageEntrance>
      <div className="bg-bg-primary text-white min-h-screen">
        <Header />
        <PageHero
          title="Installed, and your first build live by Day 7."
          subtitle="Every engagement is scoped and quoted on its own. Here's what's in Month 1, and what moves the number."
          badge="Month 1"
        />
        <WhatToExpect />
        <SectionTransition />
        <FAQ />
        <SectionTransition />
        <BookDiscoveryCall />
        <SectionTransition />
        <FinalCTA />
        <SectionTransition />
        <Footer />
      </div>
    </PageEntrance>
  )
}
