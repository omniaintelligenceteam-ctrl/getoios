import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { PainPoints } from '@/components/sections/PainPoints'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { WhoItsFor } from '@/components/sections/WhoItsFor'
import { ComparisonTable } from '@/components/sections/ComparisonTable'
import { FAQ } from '@/components/sections/FAQ'
import { DiscoveryForm } from '@/components/sections/DiscoveryForm'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'
import { CinematicEntrance } from '@/components/ui/CinematicEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

export default function Home() {
  return (
    <CinematicEntrance>
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
        <DiscoveryForm />
        <SectionTransition />
        <FinalCTA />
        <SectionTransition />
        <Footer />
      </div>
    </CinematicEntrance>
  )
}
