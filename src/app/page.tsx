import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { SpineBeats } from '@/components/sections/SpineBeats'
import { SayItToJarvis } from '@/components/sections/SayItToJarvis'
import { HowARequestMoves } from '@/components/sections/HowARequestMoves'
import { AsksFirst } from '@/components/sections/AsksFirst'
import { KnowsYourBusiness } from '@/components/sections/KnowsYourBusiness'
import { WhileYouSleep } from '@/components/sections/WhileYouSleep'
import { MonthOne } from '@/components/sections/MonthOne'
import { Proof } from '@/components/sections/Proof'
import { FAQ } from '@/components/sections/FAQ'
import { DiscoveryForm } from '@/components/sections/DiscoveryForm'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'
import { DepartmentTicker } from '@/components/ui/DepartmentTicker'
import { CinematicEntrance } from '@/components/ui/CinematicEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

export default function Home() {
  return (
    <CinematicEntrance>
      <div className="bg-bg-primary text-white min-h-screen">
        <Header />
        <Hero />
        <DepartmentTicker />
        <SectionTransition />
        <SpineBeats />
        <SectionTransition />
        <SayItToJarvis />
        <SectionTransition />
        <HowARequestMoves />
        <SectionTransition />
        <AsksFirst />
        <SectionTransition />
        <KnowsYourBusiness />
        <SectionTransition />
        <WhileYouSleep />
        <SectionTransition />
        <MonthOne />
        <SectionTransition />
        <Proof />
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
