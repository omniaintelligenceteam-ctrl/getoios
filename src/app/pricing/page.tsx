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
  title: 'Pricing — OIOS | AI Operations for Service Businesses',
  description:
    'Simple, transparent pricing for AI-powered operations. Less than a part-time hire. More than an entire operations team.',
  openGraph: {
    title: 'Pricing — OIOS | AI Operations for Service Businesses',
    description:
      'Simple, transparent pricing for AI-powered operations. Less than a part-time hire. More than an entire operations team.',
    url: 'https://getoios.com/pricing',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pricing — OIOS | AI Operations for Service Businesses — OIOS by Omnia Intelligence AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing — OIOS | AI Operations for Service Businesses',
    description:
      'Simple, transparent pricing for AI-powered operations. Less than a part-time hire. More than an entire operations team.',
    images: ['/og-image.png'],
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
          title="Simple, Transparent Pricing"
          subtitle="Less than a part-time hire. More than an entire operations team."
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
