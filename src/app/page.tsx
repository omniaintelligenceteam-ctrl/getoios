import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { PainPoints } from '@/components/sections/PainPoints'
import { WhoItsFor } from '@/components/sections/WhoItsFor'
import { ThreePillars } from '@/components/sections/ThreePillars'
import { HowItWorksNew } from '@/components/sections/HowItWorksNew'
import { VoiceDemo } from '@/components/sections/VoiceDemo'
import { DailySchedule } from '@/components/sections/DailySchedule'
import { TrustSignals } from '@/components/sections/TrustSignals'
import { NotGetting } from '@/components/sections/NotGetting'
import { ROINumbers } from '@/components/sections/ROINumbers'
import { FAQ } from '@/components/sections/FAQ'
import { Pricing } from '@/components/sections/Pricing'
import { AuditForm } from '@/components/sections/AuditForm'
import { Testimonials } from '@/components/sections/Testimonials'
import { FinalCTA } from '@/components/sections/FinalCTA'
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
      <WhoItsFor />
      <SectionTransition />
      <ThreePillars />
      <SectionTransition />
      <HowItWorksNew />
      <SectionTransition />
      <VoiceDemo />
      <SectionTransition />
      <DailySchedule />
      <SectionTransition />
      <TrustSignals />
      <SectionTransition />
      <Testimonials />
      <SectionTransition />
      <NotGetting />
      <SectionTransition />
      <ROINumbers />
      <SectionTransition />
      <FAQ />
      <SectionTransition />
      <Pricing />
      <SectionTransition />
      <AuditForm />
      <SectionTransition />
      <FinalCTA />
      <SectionTransition />
      <Footer />
    </div>
    </PageEntrance>
  )
}
