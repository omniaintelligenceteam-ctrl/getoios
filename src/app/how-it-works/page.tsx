import type { Metadata } from 'next'
import { Header } from '@/components/sections/Header'
import { PageHero } from '@/components/sections/PageHero'
import { HowARequestMoves } from '@/components/sections/HowARequestMoves'
import { AsksFirst } from '@/components/sections/AsksFirst'
import { MonthOne } from '@/components/sections/MonthOne'
import { TrustSignals } from '@/components/sections/TrustSignals'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'
import { PageEntrance } from '@/components/ui/PageEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

const title = 'How a request moves'
const description =
  'Say it, he works, and if it can’t be undone he reads it back before it fires. The road every request takes through Jarvis, and the floor underneath it.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://getoios.com/how-it-works',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'How a request moves through Jarvis — OIOS by Omnia Intelligence AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: 'https://getoios.com/how-it-works',
  },
}

export default function HowItWorksPage() {
  return (
    <PageEntrance>
      <div className="bg-bg-primary text-white min-h-screen">
        <Header />
        <PageHero
          title="How a request moves"
          subtitle="Say it. He works. You get the receipt. The only fork is whether it can be undone."
          badge="How it works"
        />
        <SectionTransition />
        <HowARequestMoves />
        <SectionTransition />
        <AsksFirst />
        <SectionTransition />
        <MonthOne />
        <SectionTransition />
        <TrustSignals />
        <SectionTransition />
        <FinalCTA />
        <SectionTransition />
        <Footer />
      </div>
    </PageEntrance>
  )
}
