import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { PainPoints } from '@/components/sections/PainPoints'
import { ThreePillars } from '@/components/sections/ThreePillars'
import { HowItWorksNew } from '@/components/sections/HowItWorksNew'
import { DailySchedule } from '@/components/sections/DailySchedule'
import { NotGetting } from '@/components/sections/NotGetting'
import { ROINumbers } from '@/components/sections/ROINumbers'

import { VoiceDemo } from '@/components/sections/VoiceDemo'
import { Pricing } from '@/components/sections/Pricing'
import { AuditForm } from '@/components/sections/AuditForm'
import { Footer } from '@/components/sections/Footer'
import { PageEntrance } from '@/components/ui/PageEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

export default function Home() {
  return (
    <PageEntrance>
    <div className="bg-bg-primary text-white min-h-screen">
      <Header />
      <Hero />
      <SectionTransition />
      <PainPoints />
      <SectionTransition />
      <ThreePillars />
      <SectionTransition />
      <HowItWorksNew />
      <SectionTransition />
      <DailySchedule />
      <SectionTransition />
      <NotGetting />
      <SectionTransition />
      <ROINumbers />
      <SectionTransition />
      <VoiceDemo />
      <SectionTransition />
      <Pricing />
      <SectionTransition />
      <AuditForm />
      <SectionTransition />
      <Footer />
    </div>
    </PageEntrance>
  )
}
