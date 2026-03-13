import type { Metadata } from 'next'
import { Header } from '@/components/sections/Header'
import { PageHero } from '@/components/sections/PageHero'
import { Pricing } from '@/components/sections/Pricing'
import { ROINumbers } from '@/components/sections/ROINumbers'
import { FAQ } from '@/components/sections/FAQ'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'
import { PageEntrance } from '@/components/ui/PageEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

export const metadata: Metadata = {
  title: 'Pricing — OIOS | AI Operations for Service Businesses',
  description:
    "Transparent pricing with a 60-day performance guarantee. Don't pay until OIOS pays for itself — see the ROI numbers and find the plan that fits your business.",
}

export default function PricingPage() {
  return (
    <PageEntrance>
      <div className="bg-bg-primary text-white min-h-screen">
        <Header />
        <PageHero
          title="Simple Pricing. Real ROI."
          subtitle="Don't pay until it pays for itself. 60-day performance guarantee."
          badge="Pricing"
        />
        <SectionTransition />
        <Pricing />
        <SectionTransition />
        <ROINumbers />
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
