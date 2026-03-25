import type { Metadata } from 'next'
import { Header } from '@/components/sections/Header'
import { PageHero } from '@/components/sections/PageHero'
import { WhatToExpect } from '@/components/sections/WhatToExpect'
import { OnboardingTimeline } from '@/components/sections/OnboardingTimeline'
import { FAQ } from '@/components/sections/FAQ'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'
import { PageEntrance } from '@/components/ui/PageEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

export const metadata: Metadata = {
  title: 'Pricing — OIOS | AI Operations for Small Businesses',
  description:
    'Custom-built AI operations for your business. No fixed tiers — we build exactly what you need.',
  openGraph: {
    title: 'Pricing — OIOS | AI Operations for Small Businesses',
    description:
      'Simple, transparent pricing for AI-powered operations. Less than a part-time hire. More than an entire operations team.',
    url: 'https://getoios.com/pricing',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Pricing — OIOS | AI Operations for Small Businesses — OIOS by Omnia Intelligence AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing — OIOS | AI Operations for Small Businesses',
    description:
      'Simple, transparent pricing for AI-powered operations. Less than a part-time hire. More than an entire operations team.',
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
          title="Custom-Built for Your Business"
          subtitle="No fixed tiers. We build exactly what you need — nothing more, nothing less."
          badge="Pricing"
        />
        <WhatToExpect />
        <SectionTransition />
        <OnboardingTimeline />
        <SectionTransition />
        <FAQ />
        <SectionTransition />
        <FinalCTA />
        <SectionTransition />
        <Footer />
      </div>
    </PageEntrance>
  )
}
