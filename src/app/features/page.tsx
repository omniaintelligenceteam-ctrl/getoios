import type { Metadata } from 'next'
import { Header } from '@/components/sections/Header'
import { PageHero } from '@/components/sections/PageHero'
import { ThreePillars } from '@/components/sections/ThreePillars'
import { DailySchedule } from '@/components/sections/DailySchedule'
import { NotGetting } from '@/components/sections/NotGetting'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'
import { PageEntrance } from '@/components/ui/PageEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

export const metadata: Metadata = {
  title: 'What OIOS Does — AI Operations for Service Businesses',
  description:
    'Discover the three pillars of OIOS: AI-powered voice, scheduling, and follow-up systems that keep your service business running around the clock.',
}

export default function FeaturesPage() {
  return (
    <PageEntrance>
      <div className="bg-bg-primary text-white min-h-screen">
        <Header />
        <PageHero
          title="What OIOS Does"
          subtitle="Three systems. One platform. Zero missed calls."
          badge="Features"
        />
        <SectionTransition />
        <ThreePillars />
        <SectionTransition />
        <DailySchedule />
        <SectionTransition />
        <NotGetting />
        <SectionTransition />
        <FinalCTA />
        <SectionTransition />
        <Footer />
      </div>
    </PageEntrance>
  )
}
