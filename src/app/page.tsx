import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { PainPoints } from '@/components/sections/PainPoints'
import { ThreePillars } from '@/components/sections/ThreePillars'
import { HowItWorksNew } from '@/components/sections/HowItWorksNew'
import { DailySchedule } from '@/components/sections/DailySchedule'
import { NotGetting } from '@/components/sections/NotGetting'
import { ROINumbers } from '@/components/sections/ROINumbers'

import { VoiceDemo } from '@/components/sections/VoiceDemo'
import { AuditForm } from '@/components/sections/AuditForm'
import { DashboardPreview } from '@/components/sections/DashboardPreview'
import { FooterCTA } from '@/components/sections/FooterCTA'
import { Footer } from '@/components/sections/Footer'

export default function Home() {
  return (
    <div className="bg-bg-primary text-white min-h-screen">
      <Header />
      <Hero />
      <div className="section-divider" />
      <PainPoints />
      <div className="section-divider" />
      <ThreePillars />
      <div className="section-divider" />
      <HowItWorksNew />
      <div className="section-divider" />
      <DailySchedule />
      <div className="section-divider" />
      <NotGetting />
      <div className="section-divider" />
      <ROINumbers />
      <div className="section-divider" />
      <VoiceDemo />
      <div className="section-divider" />
      <AuditForm />
      <div className="section-divider" />
      <DashboardPreview />
      <div className="section-divider" />
      <FooterCTA />
      <Footer />
    </div>
  )
}
