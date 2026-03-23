import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { PainPoints } from '@/components/sections/PainPoints'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { WhoItsFor } from '@/components/sections/WhoItsFor'
import { ComparisonTable } from '@/components/sections/ComparisonTable'
import { FAQ } from '@/components/sections/FAQ'
import { AuditForm } from '@/components/sections/AuditForm'
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
        <HowItWorks />
        <SectionTransition />
        <WhoItsFor />
        <SectionTransition />
        <ComparisonTable />
        <SectionTransition />
        <FAQ />
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
