import type { Metadata } from 'next'
import { Header } from '@/components/sections/Header'
import { PageHero } from '@/components/sections/PageHero'
import { WhatToExpect } from '@/components/sections/WhatToExpect'
import { FAQ } from '@/components/sections/FAQ'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'
import { PageEntrance } from '@/components/ui/PageEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

export const metadata: Metadata = {
  title: 'What to Expect — OIOS | AI Operations for Service Businesses',
  description:
    'See how OIOS works for your business. A 60-day performance guarantee and a team built around what you actually need.',
}

export default function WhatToExpectPage() {
  return (
    <PageEntrance>
      <div className="bg-bg-primary text-white min-h-screen">
        <Header />
        <PageHero
          title="What to Expect"
          subtitle="We build a custom plan around your audit. One guarantee — if it doesn't pay for itself, you don't pay."
          badge="Your Journey"
        />
        <WhatToExpect />
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
